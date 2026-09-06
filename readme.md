# 🍔 Donalds Fast Food — PWA & Full-Stack Web App

![License](https://img.shields.io/badge/license-MIT-red.svg)
![PWA](https://img.shields.io/badge/PWA-Ready-ffd60a.svg)
![Supabase](https://img.shields.io/badge/Supabase-Database-2ec27e.svg)
![Flask](https://img.shields.io/badge/Backend-Flask-000000.svg)

Aplicação Web e Progressive Web App (PWA) de alto desempenho para pedido online de refeições fast food. Desenvolvido com foco em **experiência mobile-first**, **suporte offline** com sincronização automática e **segurança nativa via RLS**.

---

## 🚀 Funcionalidades

- **📱 Progressive Web App (PWA):** Instalável em dispositivos móveis e desktops, com Service Worker e Web App Manifest configurados.
- **📡 Suporte Offline-First:** Navegação do histórico e criação de pedidos mesmo sem conexão com a internet (sincronização automática via `localStorage` ao reconectar).
- **🍔 Cardápio Dinâmico:** Interface fluida com animações, feedback visual em tempo real (toasts) e carregamento otimizado (*Skeleton Screens*).
- **🛒 Carrinho de Compras:** Gestão completa de quantidade, cálculo em tempo real e prevenção contra falhas de rede.
- **⚡ Backend Híbrido:** Integração direta do Frontend com Supabase via cliente JavaScript e/ou via API Restful utilizando Python + Flask.
- **🛡️ Segurança & Sanitização:** Proteção nativa contra Cross-Site Scripting (XSS) e Row Level Security (RLS) configurado no PostgreSQL.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5 & CSS3 Vanilla:** Design system customizado (*Dark Diner theme*), responsivo e acessível (Diretrizes WCAG / WAI-ARIA).
- **JavaScript (ES6+):** Lógica desacoplada em módulos (`app.js`, `cart.js`, `utils.js`, `offline.js`).
- **PWA Tooling:** Service Worker com suporte a *Cache Storage* e `manifest.json`.

### Backend & Banco de Dados
- **Python / Flask:** API REST opcional para consumo seguro do banco e orquestração.
- **Supabase (PostgreSQL):** Banco de dados relacional com extensão UUID, triggers automatizadas para `updated_at` e Row Level Security (RLS).
- **Prisma ORM (Opcional):** Mapeamento objeto-relacional para Node.js / TypeScript.

---

## 📁 Estrutura do Projeto

```text
.
├── index.html              # Página principal (Cardápio)
├── cart.html               # Tela do Carrinho de Compras
├── orders.html             # Histórico de Pedidos
├── service-worker.js       # Gerenciamento de cache PWA
├── app.py                  # API REST em Flask
├── schema.sql              # Script SQL de criação e limpeza do Supabase
├── css/
│   └── style.css           # Estilos globais e variáveis de tema
├── js/
│   ├── supabase.js         # Inicialização do cliente Supabase
│   ├── utils.js            # Utilitários (Sanitização XSS, Toast, Formatação)
│   ├── app.js              # Lógica da vitrine e busca de produtos
│   ├── cart.js             # Gerenciamento do carrinho e checkout
│   └── offline.js          # Sincronização offline-first
├── assets/
│   └── images/             # Ícones do PWA e imagens locais
└── pwa/
    └── manifest.json       # Configuração do PWA

⚙️ Como Executar o Projeto
Pré-requisitos
 * Navegador moderno com suporte a PWA.
 * Python 3.10+ (caso queira rodar o servidor backend Flask).
 * Conta no Supabase.
1. Configuração do Banco de Dados (Supabase)
 * Acesse o SQL Editor no painel do Supabase.
 * Execute o script contido no arquivo schema.sql do repositório para criar as tabelas products e orders, configurar as triggers e habilitar a segurança RLS.
2. Configuração do Frontend Estático
 * Clone o repositório:
   git clone [https://github.com/seu-usuario/donalds-fast-food.git](https://github.com/seu-usuario/donalds-fast-food.git)
cd donalds-fast-food

 * Edite o arquivo js/supabase.js adicionando suas credenciais do Supabase:
   const SUPABASE_URL = "[https://SEU-PROJETO.supabase.co](https://SEU-PROJETO.supabase.co)";
const SUPABASE_KEY = "SUA_PUBLISHABLE_KEY";

 * Abra o arquivo index.html em qualquer servidor estático ou extensões como Live Server do VS Code.
3. Executando o Backend Flask (Opcional)
 * Crie um ambiente virtual e instale as dependências:
   python -m venv venv
source venv/bin/activate  # Linux/macOS
# venv\Scripts\activate   # Windows

pip install flask supabase python-dotenv

 * Crie um arquivo .env na raiz com as chaves:
   SUPABASE_URL="[https://SEU-PROJETO.supabase.co](https://SEU-PROJETO.supabase.co)"
SUPABASE_KEY="SUA_PUBLISHABLE_KEY"

 * Inicie o servidor:
   python app.py

   A aplicação estará acessível em http://localhost:5000.
🔒 Segurança
 * Row Level Security (RLS): As políticas aplicadas garantem que usuários anônimos consigam ler produtos e criar pedidos, protegendo alterações não autorizadas.
 * Sanitização de Entradas: Todas as renderizações no DOM passam por escape manual de caracteres especiais para evitar ataques do tipo XSS (Cross-Site Scripting).
📄 Licença
Este projeto está sob a licença MIT.
<p center>
Desenvolvido por <strong>InNovaIdeia</strong>
</p>

