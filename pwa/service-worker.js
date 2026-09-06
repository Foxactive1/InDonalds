/**
 * pwa/service-worker.js
 * InNovaIdeia © 2026
 * Registrado com scope "/" — todos os caminhos são absolutos.
 */

const CACHE_NAME = "donalds-v4";

const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/cart.html",
  "/orders.html",
  "/css/style.css",
  "/js/supabase.js",
  "/js/utils.js",
  "/js/app.js",
  "/js/cart.js",
  "/js/offline.js",
  "/js/orders.js",
  "/pwa/manifest.json"
];

/* ─── Install: pré-cache dos assets estáticos ─────────────── */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const asset of PRECACHE_ASSETS) {
        try {
          await cache.add(asset);
        } catch (err) {
          console.warn(`[SW] Falha ao pré-carregar: ${asset}`, err);
        }
      }
    })
  );
  self.skipWaiting();
});

/* ─── Activate: remove caches antigos ─────────────────────── */
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

/* ─── Fetch: estratégia híbrida ────────────────────────────── */
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignora requisições não-GET
  if (request.method !== "GET") return;

  // Deixa o Supabase e a API Flask passarem direto (sempre rede)
  if (
    url.hostname.includes("supabase.co") ||
    url.pathname.startsWith("/api/")
  ) {
    return;
  }

  // Navegação entre páginas: tenta rede primeiro, fallback para cache
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  // Assets estáticos (CSS, JS, fontes): cache primeiro, rede como fallback
  event.respondWith(cacheFirst(request));
});

/* ─── Estratégias de cache ─────────────────────────────────── */

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
    return new Response("Offline", { status: 503 });
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
    // Fallback final: retorna a página principal
    return caches.match("/index.html");
  }
}
