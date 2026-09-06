
import os
from flask import Flask, jsonify, request
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if SUPABASE_URL and SUPABASE_KEY:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        response = supabase.table('products').select('*').eq('active', True).execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/orders', methods=['GET', 'POST'])
def handle_orders():
    try:
        if request.method == 'POST':
            data = request.get_json()
            response = supabase.table('orders').insert(data).execute()
            return jsonify(response.data), 201
        
        response = supabase.table('orders').select('*').order('created_at', desc=True).limit(20).execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Handler exigido pela Vercel
handler = app
