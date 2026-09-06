import os
from flask import Flask, jsonify, request, render_template
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv('.env')

app = Flask(__name__, static_folder='.', static_url_path='')

# Configuração do cliente Supabase via Variáveis de Ambiente
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URL e SUPABASE_KEY devem estar configurados no arquivo .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


# ─── ROTAS DE PÁGINAS ───────────────────────────────────────

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/cart')
def cart():
    return app.send_static_file('cart.html')

@app.route('/orders')
def orders():
    return app.send_static_file('orders.html')


# ─── ROTAS DE API (ENDPOINTS) ────────────────────────────────

@app.route('/api/products', methods=['GET'])
def get_products():
    """Retorna os produtos ativos do cardápio."""
    try:
        response = supabase.table('products') \
            .select('*') \
            .eq('active', True) \
            .order('created_at', desc=False) \
            .execute()
        
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/orders', methods=['GET'])
def get_orders():
    """Retorna os últimos 20 pedidos registrados."""
    try:
        response = supabase.table('orders') \
            .select('*') \
            .order('created_at', desc=True) \
            .limit(20) \
            .execute()
        
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/orders', methods=['POST'])
def create_order():
    """Cria um novo pedido."""
    try:
        data = request.get_json()
        if not data or 'items' not in data:
            return jsonify({"error": "Dados de pedido inválidos"}), 400

        items = data.get('items', [])
        total = data.get('total')

        # Se o total não for enviado, calcula no backend
        if total is None:
            total = sum(item.get('price', 0) * item.get('qty', 1) for item in items)

        new_order = {
            "items": items,
            "total": float(total),
            "status": "pending"
        }

        response = supabase.table('orders').insert(new_order).execute()
        return jsonify(response.data), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)