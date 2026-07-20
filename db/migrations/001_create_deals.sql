CREATE TABLE IF NOT EXISTS deals (
  id TEXT PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  description VARCHAR(5000) NOT NULL,
  category TEXT NOT NULL CHECK (
    category IN ('food-drink', 'wellness', 'home', 'experiences', 'services')
  ),
  price_cents INTEGER NOT NULL CHECK (
    price_cents > 0 AND price_cents <= 100000000
  ),
  status TEXT NOT NULL CHECK (
    status IN ('draft', 'pending', 'approved', 'rejected')
  ),
  partner_id VARCHAR(100) NOT NULL,
  partner_name VARCHAR(120) NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT deals_valid_window CHECK (ends_at > starts_at)
);

CREATE INDEX IF NOT EXISTS deals_updated_cursor_idx
  ON deals (updated_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS deals_status_updated_idx
  ON deals (status, updated_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS deals_category_updated_idx
  ON deals (category, updated_at DESC, id DESC);

CREATE TABLE IF NOT EXISTS mutation_rate_limits (
  scope TEXT PRIMARY KEY,
  window_started_at TIMESTAMPTZ NOT NULL,
  request_count INTEGER NOT NULL CHECK (request_count > 0)
);

CREATE INDEX IF NOT EXISTS mutation_rate_limits_window_idx
  ON mutation_rate_limits (window_started_at);
