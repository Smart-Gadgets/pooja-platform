CREATE SCHEMA IF NOT EXISTS product;

CREATE TABLE product.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(500) NOT NULL,
    description TEXT,
    seller_id UUID NOT NULL,
    seller_name VARCHAR(255),
    price NUMERIC(10,2) NOT NULL,
    compare_at_price NUMERIC(10,2),
    stock INTEGER NOT NULL DEFAULT 0,
    sku VARCHAR(100),
    category VARCHAR(100) NOT NULL,
    thumbnail_url TEXT,
    usage_instructions TEXT,
    weight VARCHAR(50),
    dimensions VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING_APPROVAL',
    average_rating DOUBLE PRECISION DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE product.product_tags (
    product_id UUID NOT NULL REFERENCES product.products(id) ON DELETE CASCADE,
    tag VARCHAR(100) NOT NULL,
    PRIMARY KEY (product_id, tag)
);

CREATE TABLE product.product_images (
    product_id UUID NOT NULL REFERENCES product.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL
);

CREATE TABLE product.product_languages (
    product_id UUID NOT NULL REFERENCES product.products(id) ON DELETE CASCADE,
    lang VARCHAR(10) NOT NULL,
    translated_name VARCHAR(500) NOT NULL,
    PRIMARY KEY (product_id, lang)
);

CREATE INDEX idx_products_seller ON product.products(seller_id);
CREATE INDEX idx_products_category ON product.products(category);
CREATE INDEX idx_products_status ON product.products(status);
CREATE INDEX idx_products_price ON product.products(price);
CREATE INDEX idx_products_name_search ON product.products USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Seed sample products
INSERT INTO product.products (name, description, seller_id, price, stock, category, status, featured) VALUES
('Complete Ganesh Pooja Kit', 'All items needed for Ganesh Chaturthi pooja including modak mold, durva grass, and red flowers', '00000000-0000-0000-0000-000000000001', 599.00, 100, 'POOJA_SAMAGRI', 'ACTIVE', true),
('Brass Diya Set (5 pieces)', 'Traditional brass diyas for daily aarti and festival celebrations', '00000000-0000-0000-0000-000000000001', 449.00, 200, 'DIYA_LAMPS', 'ACTIVE', true),
('Premium Agarbatti Collection', 'Hand-rolled incense sticks - Sandalwood, Rose, Jasmine (3 packs)', '00000000-0000-0000-0000-000000000001', 199.00, 500, 'INCENSE_DHOOP', 'ACTIVE', false),
('Navratri Special Pooja Thali', 'Decorated thali with kalash, coconut, red cloth, and accessories', '00000000-0000-0000-0000-000000000001', 899.00, 50, 'POOJA_THALI', 'ACTIVE', true),
('Rudraksha Mala (108 beads)', 'Certified 5-mukhi Rudraksha mala for japa meditation', '00000000-0000-0000-0000-000000000001', 1299.00, 30, 'GEMSTONES_RUDRAKSHA', 'ACTIVE', false);
