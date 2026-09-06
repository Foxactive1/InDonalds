# 🍔 InDonalds — Fast Food PWA

PWA de fast food com cardápio digital, carrinho, pedidos e suporte offline.  
Stack: HTML/CSS/JS puro · Supabase (PostgreSQL) · Flask (API serverless) · Vercel

---

## 🗂️ Estrutura do Projeto

```
InDonalds/
├── index.html          # Cardápio
├── cart.html           # Carrinho
├── orders.html         # Histórico de pedidos
├── app.py              # Servidor local de desenvolvimento
├── schema.sql          # Schema do banco Supabase
├── requirements.txt    # Dependências Python
├── vercel.json         # Configuração de deploy
├── api/
│   └── index.py        # Entrypoint serverless Flask (Vercel)
├── css/
│   └── style.css
├── js/
│   ├── supabase.js     # Inicialização do cliente Supabase
│   ├── utils.js        # Toast, badge, formatação, XSS
│   ├── app.js          # Carregamento do cardápio
│   ├── cart.js         # Gerenciamento do carrinho + checkout
│   ├── orders.js       # Carregamento dos pedidos
│   └── offline.js      # Sincronização offline → online
└── pwa/
    ├── manifest.json
    ├── service-worker.js
    └── icons/
        ├── icon-192.png   ← Você precisa criar estes ícones
        └── icon-512.png   ← Você precisa criar estes ícones
```

---

## ⚙️ Configuração do Banco (Supabase)

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Acesse **SQL Editor** e execute o conteúdo de `schema.sql`
3. Anote a **Project URL** e a **anon key** do painel **Settings > API**

---

## 🔐 Variáveis de Ambiente

> **NUNCA** comite chaves reais no repositório.

### Vercel (produção)

No painel do Vercel:  
**Seu Projeto → Settings → Environment Variables**

| Nome           | Valor                            |
|----------------|----------------------------------|
| `SUPABASE_URL` | `https://xxxx.supabase.co`       |
| `SUPABASE_KEY` | `sua-chave-anon-publica`         |

### Local (desenvolvimento)

Crie um arquivo `.env` na raiz (já está no `.gitignore`):

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_KEY=sua-chave-anon-publica
```

---

## 🚀 Deploy no Vercel

```bash
# 1. Instale a CLI do Vercel
npm i -g vercel

# 2. Faça login
vercel login

# 3. Deploy
vercel --prod
```

Ou conecte o repositório GitHub diretamente pelo painel do Vercel.

---

## 💻 Desenvolvimento Local

```bash
# Instale as dependências Python
pip install -r requirements.txt

# Configure o .env (veja acima)

# Inicie o servidor
python app.py
# → http://localhost:5000
```

---

## 🖼️ Ícones PWA (obrigatório para instalação)

Crie os ícones e coloque em `pwa/icons/`:

- `icon-192.png` — 192×192 px
- `icon-512.png` — 512×512 px

Ferramentas gratuitas: [favicon.io](https://favicon.io) · [realfavicongenerator.net](https://realfavicongenerator.net)

---

## 📱 Funcionalidades

- ✅ Cardápio dinâmico via Supabase
- ✅ Carrinho persistido em `localStorage`
- ✅ Checkout com inserção direta no Supabase
- ✅ Suporte offline com fila de pedidos e sync automático
- ✅ PWA instalável (Android/iOS)
- ✅ Proteção XSS em todos os pontos de renderização
- ✅ Skeleton loading no cardápio
- ✅ Toast de feedback para o usuário
- ✅ Badge animado no carrinho

---

InNovaIdeia Assessoria em Tecnologia © 2026
