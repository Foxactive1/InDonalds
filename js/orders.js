/**
 * js/orders.js — Carregamento e renderização dos pedidos
 * InNovaIdeia © 2026
 */

async function loadOrders() {
  const list = document.getElementById("ordersList");
  if (!list) return;

  // Pedidos offline pendentes (salvo localmente quando sem conexão)
  const offlineOrders = JSON.parse(localStorage.getItem("offline_orders")) || [];

  try {
    const { data, error } = await supabaseClient
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;

    const allOrders = [
      ...offlineOrders.map((o) => ({ ...o, _offline: true })),
      ...(data || []),
    ];

    if (allOrders.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <div class="icon">📋</div>
          <h3>Nenhum pedido ainda</h3>
          <p>Seus pedidos aparecerão aqui após a finalização.</p>
        </div>`;
      return;
    }

    list.innerHTML = allOrders
      .map((order, i) => {
        const items = order.items || [];
        const total = getOrderTotal(order);
        const isOffline = order._offline;
        const status = isOffline ? "pending" : (order.status || "pending");
        const statusLabel = isOffline
          ? "⏳ Aguardando sync"
          : status === "completed"
          ? "✅ Concluído"
          : status === "in_preparation"
          ? "🔥 Em preparo"
          : status === "cancelled"
          ? "❌ Cancelado"
          : "🕐 Pendente";

        const rawDate = order.created_at || order.createdAt || null;
        const date = rawDate
          ? new Date(rawDate).toLocaleString("pt-BR")
          : "Agora";

        // Sanitiza nomes dos itens contra XSS
        const itemsText = items
          .map((it) => `${escapeHtml(it.name)} × ${it.qty || 1}`)
          .join(" · ");

        return `
          <div class="order-card">
            <div class="order-card-header">
              <span class="order-id">#${String(i + 1).padStart(4, "0")}</span>
              <span class="order-status ${status === "pending" || isOffline ? "pending" : ""}">${statusLabel}</span>
            </div>
            <div class="order-items">${itemsText}</div>
            <div class="order-total">${formatCurrency(total)}</div>
            <div style="font-size:.75rem;color:var(--text-muted);margin-top:.3rem">${date}</div>
          </div>`;
      })
      .join("");
  } catch (err) {
    console.error("[orders.js]", err);

    if (offlineOrders.length > 0) {
      list.innerHTML = offlineOrders
        .map((order, i) => {
          const items = order.items || [];
          const total = getOrderTotal(order);
          const itemsText = items
            .map((it) => `${escapeHtml(it.name)} × ${it.qty || 1}`)
            .join(" · ");

          return `
            <div class="order-card">
              <div class="order-card-header">
                <span class="order-id">#${String(i + 1).padStart(4, "0")}</span>
                <span class="order-status pending">⏳ Offline</span>
              </div>
              <div class="order-items">${itemsText}</div>
              <div class="order-total">${formatCurrency(total)}</div>
            </div>`;
        })
        .join("");
    } else {
      list.innerHTML = `
        <div class="empty-state">
          <div class="icon">⚠️</div>
          <h3>Erro ao carregar pedidos</h3>
          <p>Verifique sua conexão ou tente novamente mais tarde.</p>
        </div>`;
    }
  }
}

document.addEventListener("DOMContentLoaded", loadOrders);
