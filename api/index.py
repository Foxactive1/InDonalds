"""
api/index.py — Entrypoint Flask para o Vercel (Serverless Functions)
InNovaIdeia © 2026

Variáveis de ambiente obrigatórias (configurar no painel Vercel):
  SUPABASE_URL  — URL do projeto Supabase
  SUPABASE_KEY  — Chave anon/service do Supabase
"""

import os
from flask import Flask, jsonify, request
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

supabase: Client | None = None
if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def _supabase_required():
    """Retorna erro 503 se o cliente Supabase não estiver inicializado."""
    if supabase is None:
        return jsonify({"error": "Credenciais Supabase não configuradas."}), 503
    return None


# ─── /api/products ───────────────────────────────────────────

@app.route("/api/products", methods=["GET"])
def get_products():
    """Retorna os produtos ativos do cardápio, ordenados por data de criação."""
    err = _supabase_required()
    if err:
        return err
    try:
        response = (
            supabase.table("products")
            .select("*")
            .eq("active", True)
            .order("created_at", desc=False)
            .execute()
        )
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ─── /api/orders ─────────────────────────────────────────────

@app.route("/api/orders", methods=["GET"])
def get_orders():
    """Retorna os últimos 20 pedidos registrados."""
    err = _supabase_required()
    if err:
        return err
    try:
        response = (
            supabase.table("orders")
            .select("*")
            .order("created_at", desc=True)
            .limit(20)
            .execute()
        )
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/orders", methods=["POST"])
def create_order():
    """Cria um novo pedido. Espera JSON com 'items' (lista) e 'total' (opcional)."""
    err = _supabase_required()
    if err:
        return err
    try:
        data = request.get_json(silent=True)
        if not data or "items" not in data:
            return jsonify({"error": "Payload inválido: 'items' é obrigatório."}), 400

        items = data["items"]
        total = data.get("total")

        # Calcula o total no backend se não for enviado (segurança extra)
        if total is None:
            total = sum(
                float(item.get("price", 0)) * int(item.get("qty", 1))
                for item in items
            )

        new_order = {
            "items": items,
            "total": float(total),
            "status": "pending",
        }

        response = supabase.table("orders").insert(new_order).execute()
        return jsonify(response.data), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ─── Handler exigido pela Vercel ─────────────────────────────
handler = app
