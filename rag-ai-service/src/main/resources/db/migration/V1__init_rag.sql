CREATE EXTENSION IF NOT EXISTS vector;
CREATE SCHEMA IF NOT EXISTS rag;

-- Spring AI PGVector will auto-create the vector_store table
-- This migration ensures the schema and extension exist

-- Seed some ritual knowledge for the RAG system
CREATE TABLE IF NOT EXISTS rag.knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100) NOT NULL,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO rag.knowledge_base (category, title, content) VALUES
('ritual', 'Ganesh Chaturthi Pooja', 'Ganesh Chaturthi is celebrated on the fourth day of Bhadrapada month. Essential items include: Ganesh murti, modak, durva grass, red flowers, sindoor, coconut, incense, diya, and a pooja thali. The pooja involves Ganesh invocation (avahan), shodashopachar pooja, and aarti. It is auspicious to begin new ventures after this pooja.'),
('ritual', 'Navratri Pooja Guide', 'Navratri spans nine nights dedicated to Goddess Durga. Each day corresponds to a different form of the Devi. Essential items: Kalash with water, mango leaves, coconut, red cloth, akshata (rice), kumkum, turmeric, flowers, incense, ghee lamp, and fruits. Daily aarti and chanting of Durga Saptashati is recommended.'),
('ritual', 'Satyanarayan Katha', 'Satyanarayan Pooja is performed on Purnima (full moon) day. Required items: Banana leaves, panchamrit (milk, curd, honey, sugar, ghee), tulsi, fruits, dry fruits, singhada flour for prasad, and a pooja thali. The katha consists of five chapters narrating the glory of Lord Vishnu.'),
('ritual', 'Griha Pravesh Ceremony', 'Griha Pravesh (housewarming) involves Ganesh pooja, Navagraha pooja, Vastu pooja, and Havan. Essential items: Havan samagri, ghee, mango wood sticks, coconut, kalash, new clothes, flowers, and sweets. A Pandit performs the rituals and suggests an auspicious muhurat.'),
('muhurat', 'Muhurat Guidance', 'Muhurat (auspicious timing) is determined by the Panchang (Hindu calendar) considering Tithi, Nakshatra, Yoga, and Karana. Important muhurats include: Griha Pravesh, Vivah (marriage), Upanayana (thread ceremony), and Annaprashan (first solid food). Rahu Kaal, Yamaghanda, and Gulika should be avoided for auspicious activities.');
