CREATE SCHEMA IF NOT EXISTS auth;

CREATE TABLE auth.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'CUSTOMER',
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    avatar_url TEXT,
    preferred_language VARCHAR(10) NOT NULL DEFAULT 'en',
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON auth.users(email);
CREATE INDEX idx_users_phone ON auth.users(phone);
CREATE INDEX idx_users_role ON auth.users(role);
CREATE INDEX idx_users_status ON auth.users(status);

-- Seed admin user (password: admin123)
INSERT INTO auth.users (email, password_hash, full_name, role, status, email_verified)
VALUES ('admin@pooja.com', '$2a$10$EqKcp1WFKyb3VA8RBbTl5u7nGDQHW4x8dTMmHOzJ7sBO/T1pXdJrW', 'Platform Admin', 'ADMIN', 'ACTIVE', true);
