"""
app.py — Servidor de desenvolvimento local
InNovaIdeia © 2026

Use apenas para rodar o projeto localmente.
Em produção, o Vercel usa api/index.py como entrypoint serverless.

Configuração:
  Crie um arquivo .env na raiz com:
    SUPABASE_URL=https://seu-projeto.supabase.co
    SUPABASE_KEY=sua-chave-anon

Execução:
  python app.py
"""

import os
from flask import Flask
from dotenv import load_dotenv

load_dotenv(".env")

# Importa o handler do entrypoint Vercel para evitar duplicação de código
from api.index import app   # noqa: E402

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "true").lower() == "true"
    print(f"[InDonalds] Rodando em http://localhost:{port}")
    app.run(debug=debug, host="0.0.0.0", port=port)
