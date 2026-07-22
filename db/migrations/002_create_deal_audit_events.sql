BEGIN;

CREATE TABLE IF NOT EXISTS deal_audit_events (
  id TEXT PRIMARY KEY,
  deal_id TEXT NOT NULL REFERENCES deals(id) ON DELETE RESTRICT,
  previous_status TEXT NOT NULL CHECK (
    previous_status IN ('draft', 'pending', 'approved', 'rejected')
  ),
  next_status TEXT NOT NULL CHECK (next_status IN ('approved', 'rejected')),
  actor_id TEXT NOT NULL,
  actor_name TEXT NOT NULL,
  reason TEXT,
  request_id UUID NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS deal_audit_events_deal_created_idx
  ON deal_audit_events (deal_id, created_at DESC, id DESC);

INSERT INTO schema_migrations (version) VALUES (2)
ON CONFLICT (version) DO NOTHING;

COMMIT;
