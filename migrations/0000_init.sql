CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  phone TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  roles JSONB NOT NULL,
  email TEXT,
  email_pending TEXT,
  email_verified BOOLEAN NOT NULL DEFAULT false,
  photo_url TEXT,
  village TEXT,
  business_name TEXT,
  aadhaar_last4 TEXT,
  upi_id TEXT,
  gstin TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS listings (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  farmer_id TEXT NOT NULL REFERENCES users(id),
  farmer_name TEXT NOT NULL,
  village TEXT NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  unit TEXT NOT NULL,
  qty TEXT NOT NULL,
  grade TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT true,
  harvested TEXT NOT NULL,
  tags JSONB NOT NULL,
  photo_url TEXT,
  photos JSONB NOT NULL,
  video_url TEXT,
  "desc" TEXT,
  offers INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS listings_category_idx ON listings(category);
CREATE INDEX IF NOT EXISTS listings_created_at_idx ON listings(created_at DESC);

CREATE TABLE IF NOT EXISTS requirements (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  product TEXT NOT NULL,
  buyer_id TEXT NOT NULL REFERENCES users(id),
  buyer_name TEXT NOT NULL,
  loc TEXT NOT NULL,
  qty INTEGER NOT NULL,
  unit TEXT NOT NULL,
  quality TEXT NOT NULL,
  max_price DOUBLE PRECISION NOT NULL,
  need_by TEXT,
  urgency TEXT NOT NULL,
  "desc" TEXT,
  tags JSONB NOT NULL,
  offers INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS requirements_category_idx ON requirements(category);
CREATE INDEX IF NOT EXISTS requirements_created_at_idx ON requirements(created_at DESC);

CREATE TABLE IF NOT EXISTS otp_codes (
  phone TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified_at TIMESTAMPTZ
);
