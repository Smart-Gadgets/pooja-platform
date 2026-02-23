CREATE SCHEMA IF NOT EXISTS orders;

CREATE TABLE orders.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    product_id UUID NOT NULL,
    product_name VARCHAR(500),
    unit_price NUMERIC(10,2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

CREATE TABLE orders.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    subtotal NUMERIC(10,2) NOT NULL,
    shipping_cost NUMERIC(10,2) DEFAULT 0,
    discount NUMERIC(10,2) DEFAULT 0,
    total NUMERIC(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    payment_id VARCHAR(255),
    payment_status VARCHAR(50) DEFAULT 'PENDING',
    shipping_name VARCHAR(255),
    shipping_address TEXT,
    shipping_city VARCHAR(100),
    shipping_state VARCHAR(100),
    shipping_pincode VARCHAR(10),
    shipping_phone VARCHAR(20),
    tracking_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE orders.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL,
    product_name VARCHAR(500),
    seller_id UUID,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL,
    total_price NUMERIC(10,2) NOT NULL
);

CREATE TABLE orders.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    pandit_id UUID NOT NULL,
    pandit_name VARCHAR(255),
    booking_number VARCHAR(50) NOT NULL UNIQUE,
    pooja_type VARCHAR(255) NOT NULL,
    description TEXT,
    booking_date DATE NOT NULL,
    booking_time TIME,
    duration_minutes INTEGER,
    mode VARCHAR(50) NOT NULL DEFAULT 'VIRTUAL',
    address TEXT,
    city VARCHAR(100),
    pincode VARCHAR(10),
    amount NUMERIC(10,2),
    payment_id VARCHAR(255),
    payment_status VARCHAR(50) DEFAULT 'PENDING',
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    meeting_link TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cart_user ON orders.cart_items(user_id);
CREATE INDEX idx_orders_user ON orders.orders(user_id);
CREATE INDEX idx_orders_number ON orders.orders(order_number);
CREATE INDEX idx_bookings_user ON orders.bookings(user_id);
CREATE INDEX idx_bookings_pandit ON orders.bookings(pandit_id);
CREATE INDEX idx_bookings_date ON orders.bookings(booking_date);
