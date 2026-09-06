/**
 * js/cart.js — Gerenciamento do Carrinho e Checkout
 * InNovaIdeia © 2026
 */

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  if (typeof updateCartBadge === "function") updateCartBadge();
}

function addToCart(id, name, price) {
  const cart = getCart();
  const existingIndex = cart.findIndex((item) => item.id === id);

  if (existingIndex > -1) {
    cart[existingIndex].qty = (cart[existingIndex].qty || 1) + 1;
  } else {
    cart.push({ id, name, price: Number(price), qty: 1 });
  }

  saveCart(cart);
  if (typeof showToast === "function") {
    showToast(`"${name}" adicionado ao carrinho!`, "success");
  }
}

function updateQty(id, delta) {
  let cart = getCart();
  const index = cart.findIndex((item) => item.id === id);

  if (index > -1) {
    cart[index].qty = (cart[index].qty || 1) + delta;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
    saveCart(cart);
    renderCart();
  }
}

function removeItem(id) {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== id);
  saveCart(cart);
  renderCart();
}

function renderCart() {
  const cartList = document.getElementById("cartList");
  const cartSummary = document.getElementById("cartSummary");
  const btnCheckout = document.getElementById("btnCheckout");

  if (!cartList) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartList.innerHTML = `
      <div class="empty-state">
        <div class="icon">🛒</div>
        <h3>Seu carrinho está vazio</h3>
        <p>Adicione alguns lanches gostosos para começar!</p>
      </div>`;
    if (cartSummary) cartSummary.style.display = "none";
    if (btnCheckout) btnCheckout.disabled = true;
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);

  cartList.innerHTML = cart.map((item) => `
    <div class="cart-item" id="item-${item.id}">
      <div class="cart-item-name">
        ${escapeHtml(item.name)}
        <div class="cart-item-unit">${formatCurrency(item.price)} cada</div>
      </div>
      <div class="qty-controls">
        <button class="qty-btn" onclick="updateQty('${item.id}', -1)" aria-label="Diminuir quantidade">-</button>
        <span class="qty-value">${item.qty || 1}</span>
        <button class="qty-btn" onclick="updateQty('${item.id}', 1)" aria-label="Aumentar quantidade">+</button>
      </div>
      <div class="cart-item-price">${formatCurrency(item.price * (item.qty || 1))}</div>
      <button class="btn-remove" onclick="removeItem('${item.id}')" aria-label="Remover item">
        🗑️
      </button>
    </div>
  `).join("");

  if (cartSummary) {
    cartSummary.style.display = "block";
    cartSummary.innerHTML = `
      <div class="cart-summary-row">
        <span>Itens (${cart.reduce((a, b) => a + (b.qty || 1), 0)})</span>
        <span>${formatCurrency(subtotal)}</span>
      </div>
      <div class="cart-summary-row total">
        <span>Total</span>
        <span class="val">${formatCurrency(subtotal)}</span>
      </div>`;
  }

  if (btnCheckout) btnCheckout.disabled = false;
}

async function checkout() {
  const cart = getCart();
  if (cart.length === 0) return;

  const btnCheckout = document.getElementById("btnCheckout");
  if (btnCheckout) btnCheckout.disabled = true;

  const total = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
  const orderData = {
    items: cart,
    total: total,
    status: "pending",
    created_at: new Date().toISOString()
  };

  // Se o usuário estiver offline, salva na fila local
  if (!navigator.onLine) {
    const offlineOrders = JSON.parse(localStorage.getItem("offline_orders")) || [];
    offlineOrders.push(orderData);
    localStorage.setItem("offline_orders", JSON.stringify(offlineOrders));

    saveCart([]);
    showToast("Pedido salvo offline! Ele será sincronizado quando houver conexão.", "warning");
    setTimeout(() => { window.location.href = "orders.html"; }, 1500);
    return;
  }

  try {
    const { error } = await supabaseClient.from("orders").insert([
      { items: cart, total: total, status: "pending" }
    ]);

    if (error) throw error;

    saveCart([]);
    showToast("Pedido enviado com sucesso!", "success");
    setTimeout(() => { window.location.href = "orders.html"; }, 1200);

  } catch (err) {
    console.error("[cart.js] Erro no checkout:", err);
    showToast("Erro ao enviar pedido. Tente novamente.", "error");
    if (btnCheckout) btnCheckout.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", renderCart);
