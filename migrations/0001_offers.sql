CREATE TABLE IF NOT EXISTS offers (
  id TEXT PRIMARY KEY,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  target_title TEXT NOT NULL,
  from_user_id TEXT NOT NULL REFERENCES users(id),
  from_user_name TEXT NOT NULL,
  to_user_id TEXT NOT NULL REFERENCES users(id),
  price DOUBLE PRECISION,
  qty TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS offers_to_user_idx ON offers(to_user_id);
CREATE INDEX IF NOT EXISTS offers_created_at_idx ON offers(created_at DESC);
