/**
 * js/offline.js — Sincronização e detecção Offline/Online
 * InNovaIdeia © 2026
 */

async function syncOfflineOrders() {
  if (!navigator.onLine) return;

  const offlineOrders = JSON.parse(localStorage.getItem("offline_orders")) || [];
  if (offlineOrders.length === 0) return;

  console.log(`[offline.js] Sincronizando ${offlineOrders.length} pedido(s) pendente(s)...`);

  const remainingOrders = [];

  for (const order of offlineOrders) {
    try {
      const { error } = await supabaseClient.from("orders").insert([
        {
          items: order.items,
          total: order.total,
          status: "pending"
        }
      ]);

      if (error) throw error;
    } catch (err) {
      console.error("[offline.js] Erro ao sincronizar pedido:", err);
      remainingOrders.push(order);
    }
  }

  localStorage.setItem("offline_orders", JSON.stringify(remainingOrders));

  if (remainingOrders.length < offlineOrders.length) {
    if (typeof showToast === "function") {
      showToast("Pedidos offline sincronizados com sucesso!", "success");
    }
    if (typeof loadOrders === "function") {
      loadOrders();
    }
  }
}

window.addEventListener("online", syncOfflineOrders);
document.addEventListener("DOMContentLoaded", syncOfflineOrders);
