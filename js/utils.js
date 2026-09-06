/**
 * utils.js — Utilitários globais (Toast, Badge, Formatação, Sanitização)
 * InNovaIdeia © 2025
 */

/* ─── Sanitização & Segurança ───────────────────────────── */

/**
 * Escapa caracteres HTML especiais para prevenir XSS.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Calcula o total do pedido de forma consistente com fallback offline.
 * @param {Object} order
 * @returns {number}
 */
function getOrderTotal(order) {
  if (typeof order.total === "number" && !isNaN(order.total) && order.total > 0) {
    return order.total;
  }
  const items = order.items || [];
  return items.reduce((sum, item) => sum + ((item.price || 0) * (item.qty || 1)), 0);
}

/* ─── Toast ─────────────────────────────────────────────── */

/**
 * Exibe uma notificação toast com suporte a acessibilidade.
 * @param {string} message  Texto exibido
 * @param {'success'|'error'|'warning'} type  Tipo visual
 * @param {number} duration Duração em ms (padrão 3000)
 */
function showToast(message, type = "success", duration = 3000) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const icons = {
    success: "✅",
    error:   "❌",
    warning: "⚠️",
  };

  const toast = document.createElement("div");
  toast.className = `toast${type !== "success" ? ` ${type}` : ""}`;
  toast.setAttribute("role", "alert");
  toast.innerHTML = `<span>${icons[type] || "ℹ️"}</span><span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("exit");
    toast.addEventListener("animationend", () => toast.remove(), { once: true });
  }, duration);
}

/* ─── Formatação de moeda ────────────────────────────────── */

/**
 * Formata valor numérico em BRL.
 * @param {number} value
 * @returns {string} ex: "R$ 12,90"
 */
function formatCurrency(value) {
  return (value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/* ─── Badge do carrinho ──────────────────────────────────── */

/**
 * Atualiza o badge de contagem no botão do carrinho.
 */
function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (!badge) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const total = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

  if (total > 0) {
    badge.textContent = total > 99 ? "99+" : total;
    badge.style.display = "flex";
    badge.classList.remove("pop-anim");
    void badge.offsetWidth; // Force reflow
    badge.classList.add("pop-anim");
  } else {
    badge.style.display = "none";
  }
}

/* ─── Status offline ─────────────────────────────────────── */
function setupOfflineBanner() {
  const banner = document.getElementById("offline-banner");
  if (!banner) return;

  function update() {
    if (!navigator.onLine) {
      banner.classList.add("visible");
    } else {
      banner.classList.remove("visible");
    }
  }

  update();
  window.addEventListener("online",  update);
  window.addEventListener("offline", update);
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  setupOfflineBanner();
});
