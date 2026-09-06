-- ============================================================
-- Donalds Fast Food — Schema Banco de Dados Supabase / PostgreSQL
-- InNovaIdeia ©  2026
-- ============================================================

-- Habilita extensão para geração de UUID (caso não esteja ativa)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------
-- 1. TABELA DE PRODUTOS (products)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(250) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    image_url TEXT,
    category VARCHAR(100) DEFAULT 'geral',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 2. TABELA DE PEDIDOS (orders)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_preparation', 'completed', 'cancelled')),
    total NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (total >= 0),
    items JSONB NOT NULL DEFAULT '[]'::jsonb, -- Estrutura local com [{id, name, price, qty}]
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 3. TRIGGER PARA ATUALIZAÇÃO AUTOMÁTICA DE updated_at
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ------------------------------------------------------------
-- 4. POLÍTICAS DE SEGURANÇA (RLS - Row Level Security)
-- ------------------------------------------------------------

-- Habilita RLS nas tabelas
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Permite leitura pública dos produtos ativos
CREATE POLICY "Leitura pública de produtos" 
ON public.products 
FOR SELECT 
USING (active = TRUE);

-- Permite leitura de pedidos (necessário para listar os pedidos do cliente)
CREATE POLICY "Leitura pública de pedidos" 
ON public.orders 
FOR SELECT 
USING (TRUE);

-- Permite criação de pedidos por qualquer usuário (Anônimo ou Autenticado)
CREATE POLICY "Criação pública de pedidos" 
ON public.orders 
FOR INSERT 
WITH CHECK (TRUE);

-- ------------------------------------------------------------
-- 5. DADOS INICIAIS DE TESTE (SEEMENTES / SEED)
-- ------------------------------------------------------------
INSERT INTO public.products (name, description, price, image_url, category) 
VALUES 
  ('Donalds Double Cheese', 'Dois hambúrgueres bovinos, queijo cheddar fatiado e molho especial.', 28.90, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500', 'hamburgueres'),
  ('Chicken Crispy Burger', 'Hambúrguer de frango empanado super crocante com alface e maionese.', 24.50, 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500', 'hamburgueres'),
  ('Batata Frita Suprema', 'Porção generosa de batatas rústicas crocantes temperadas com páprica.', 14.00, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500', 'acompanhamentos'),
  ('Milkshake Crocante 500ml', 'Milkshake cremoso de chocolate com pedaços crocantes de biscoito.', 18.00, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500', 'sobremesas'),
  ('Refrigerante Lata 350ml', 'Escolha entre Coca-Cola, Guaraná Antarctica ou Sprite bem gelado.', 7.00, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500', 'bebidas')
ON CONFLICT DO NOTHING;
