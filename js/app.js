/**
 * js/app.js — Carregamento do Cardápio / Produtos
 * InNovaIdeia © 2026
 */

async function loadProducts() {
  const container = document.getElementById("products");
  if (!container) return;

  try {
    const { data: products, error } = await supabaseClient
      .from("products")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: true });

    if (error) throw error;

    if (!products || products.length === 0) {
      container.className = "";
      container.innerHTML = `
        <div class="empty-state">
          <div class="icon">🍔</div>
          <h3>Nenhum produto disponível</h3>
          <p>Volte mais tarde para conferir nosso cardápio.</p>
        </div>`;
      return;
    }

    container.className = "products-grid";
    container.innerHTML = products.map((product) => {
      const name = escapeHtml(product.name);
      const desc = escapeHtml(product.description || "");
      const price = formatCurrency(product.price);
      const img = product.image_url || "https://via.placeholder.com/400x250?text=Donalds";

      return `
        <div class="product-card" onclick="addToCart('${product.id}', '${name.replace(/'/g, "\\'")}', ${product.price})">
          <div class="product-card-img-wrap">
            <img src="${img}" alt="${name}" loading="lazy" />
          </div>
          <div class="product-card-body">
            <div class="product-card-name">${name}</div>
            <div class="product-card-desc">${desc}</div>
            <div class="product-card-footer">
              <span class="product-card-price">${price}</span>
              <button type="button" class="btn-add" onclick="event.stopPropagation(); addToCart('${product.id}', '${name.replace(/'/g, "\\'")}', ${product.price})">
                <span>+</span> Adicionar
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");

  } catch (err) {
    console.error("[app.js] Erro ao carregar produtos:", err);
    container.className = "";
    container.innerHTML = `
      <div class="empty-state">
        <div class="icon">⚠️</div>
        <h3>Erro ao carregar o cardápio</h3>
        <p>Verifique sua conexão ou tente novamente mais tarde.</p>
      </div>`;
  }
}

document.addEventListener("DOMContentLoaded", loadProducts);
