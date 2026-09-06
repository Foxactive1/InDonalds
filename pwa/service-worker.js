/**
 * service-worker.js — PWA Service Worker
 * InNovaIdeia © 2025 (Refatorado)
 *
 * Estratégia:
 *   - Shell da app (HTML/CSS/JS): Network-First para navegação, Cache-First para estáticos.
 *   - API Supabase: Somente Network para mutações/GETs seguros.
 */

const CACHE_NAME = "donalds-v2";

// Caminhos relativos flexíveis para qualquer subdiretório de hospedagem
const PRECACHE_ASSETS = [
  "./",
  "./index.html",
  "./cart.html",
  "./orders.html",
  "./css/style.css",
  "./js/supabase.js",
  "./js/utils.js",
  "./js/app.js",
  "./js/cart.js",
  "./js/offline.js",
  "./pwa/manifest.json"
];

/* ─── Install: pré-carrega shell com resiliência ───────────── */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Adiciona individualmente para evitar que uma falha cancele a instalação inteira
      for (const asset of PRECACHE_ASSETS) {
        try {
          await cache.add(asset);
        } catch (err) {
          console.warn(`[SW] Falha ao pre-cachear: ${asset}`, err);
        }
      }
    })
  );
  self.skipWaiting();
});

/* ─── Activate: remove caches antigos ───────────────────────  */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

/* ─── Fetch: estratégias por tipo de recurso ─────────────── */
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Apenas requisições GET podem ser manipuladas pelo Cache Storage
  if (request.method !== "GET") return;

  // Supabase API → Somente Rede (Bypass no Cache Storage para evitar erros POST/Auth)
  if (url.hostname.includes("supabase.co")) {
    return;
  }

  // Navegação (HTML) → Network-First com Fallback no Cache
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  // Assets estáticos (CSS, JS, Imagens) → Cache-First
  event.respondWith(cacheFirst(request));
});

/* ─── Helpers ────────────────────────────────────────────── */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok && response.type === "basic") {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Recurso indisponível offline", { 
      status: 503, 
      headers: { "Content-Type": "text/plain; charset=utf-8" } 
    });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    
    // Fallback padrão de rede
    return caches.match("./index.html");
  }
}
