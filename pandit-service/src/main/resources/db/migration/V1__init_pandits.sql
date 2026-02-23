CREATE SCHEMA IF NOT EXISTS pandit;

CREATE TABLE pandit.pandits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    profile_image_url TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    experience_years INTEGER NOT NULL DEFAULT 0,
    base_rate NUMERIC(10,2),
    virtual_available BOOLEAN NOT NULL DEFAULT TRUE,
    in_person_available BOOLEAN NOT NULL DEFAULT TRUE,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING_VERIFICATION',
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    average_rating DOUBLE PRECISION DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    total_bookings INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE pandit.pandit_specializations (
    pandit_id UUID NOT NULL REFERENCES pandit.pandits(id) ON DELETE CASCADE,
    specialization VARCHAR(100) NOT NULL,
    PRIMARY KEY (pandit_id, specialization)
);

CREATE TABLE pandit.pandit_languages (
    pandit_id UUID NOT NULL REFERENCES pandit.pandits(id) ON DELETE CASCADE,
    language VARCHAR(50) NOT NULL,
    PRIMARY KEY (pandit_id, language)
);

CREATE TABLE pandit.pandit_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pandit_id UUID NOT NULL REFERENCES pandit.pandits(id) ON DELETE CASCADE,
    content_type VARCHAR(50) NOT NULL,
    title VARCHAR(500) NOT NULL,
    body TEXT,
    media_url TEXT,
    thumbnail_url TEXT,
    published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE pandit.content_tags (
    content_id UUID NOT NULL REFERENCES pandit.pandit_content(id) ON DELETE CASCADE,
    tag VARCHAR(100) NOT NULL,
    PRIMARY KEY (content_id, tag)
);

CREATE INDEX idx_pandits_user ON pandit.pandits(user_id);
CREATE INDEX idx_pandits_status ON pandit.pandits(status);
CREATE INDEX idx_pandits_city ON pandit.pandits(city);
CREATE INDEX idx_pandit_content_pandit ON pandit.pandit_content(pandit_id);
