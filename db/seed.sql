INSERT INTO deals (
  id, title, description, category, price_cents, status,
  partner_id, partner_name, starts_at, ends_at, created_at, updated_at
) VALUES
  (
    'deal-001', 'Weekend Coffee Bundle',
    'Two bags of single-origin coffee with a ceramic pour-over dripper.',
    'food-drink', 4200, 'approved', 'partner-001', 'Northstar Roasters',
    '2026-06-18T08:00:00.000Z', '2026-06-22T22:00:00.000Z',
    '2026-06-08T09:15:00.000Z', '2026-06-15T08:20:00.000Z'
  ),
  (
    'deal-002', 'Summer Studio Pass',
    'Five drop-in movement classes redeemable during the summer season.',
    'wellness', 6500, 'pending', 'partner-002', 'Form & Flow',
    '2026-06-20T06:00:00.000Z', '2026-08-31T20:00:00.000Z',
    '2026-06-12T11:40:00.000Z', '2026-06-15T07:58:00.000Z'
  ),
  (
    'deal-003', 'Neighborhood Dinner for Two',
    'A seasonal three-course dinner for two guests on selected weeknights.',
    'food-drink', 8900, 'rejected', 'partner-003', 'Table Eleven',
    '2026-06-24T17:00:00.000Z', '2026-07-24T21:00:00.000Z',
    '2026-06-10T14:05:00.000Z', '2026-06-15T07:12:00.000Z'
  ),
  (
    'deal-004', 'Home Office Refresh',
    'A desk organizer, task lamp, and cable management kit.',
    'home', 11900, 'draft', 'partner-004', 'Common Goods',
    '2026-07-01T08:00:00.000Z', '2026-07-15T22:00:00.000Z',
    '2026-06-13T10:20:00.000Z', '2026-06-14T16:45:00.000Z'
  ),
  (
    'deal-005', 'Family Museum Day',
    'Admission for two adults and two children, plus an activity guide.',
    'experiences', 5400, 'approved', 'partner-005', 'City Discovery Museum',
    '2026-06-21T09:00:00.000Z', '2026-09-06T17:00:00.000Z',
    '2026-06-09T12:30:00.000Z', '2026-06-14T13:10:00.000Z'
  ),
  (
    'deal-006', 'Bike Tune-Up Package',
    'Safety inspection, brake adjustment, and drivetrain cleaning.',
    'services', 7500, 'pending', 'partner-006', 'Harbor Cycle Works',
    '2026-06-19T08:00:00.000Z', '2026-07-31T18:00:00.000Z',
    '2026-06-14T08:50:00.000Z', '2026-06-14T08:50:00.000Z'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO deals (
  id, title, description, category, price_cents, status,
  partner_id, partner_name, starts_at, ends_at, created_at, updated_at
)
SELECT
  'deal-' || LPAD(sequence::TEXT, 3, '0'),
  CASE (sequence - 7) % 11
    WHEN 0 THEN 'Market Morning Bundle'
    WHEN 1 THEN 'Restorative Class Pack'
    WHEN 2 THEN 'Chef''s Weeknight Special'
    WHEN 3 THEN 'Small Space Upgrade'
    WHEN 4 THEN 'Family Discovery Pass'
    WHEN 5 THEN 'Seasonal Service Package'
    WHEN 6 THEN 'Weekend Workshop'
    WHEN 7 THEN 'Local Favorites Box'
    WHEN 8 THEN 'Wellness Starter Session'
    WHEN 9 THEN 'Home Essentials Edit'
    ELSE 'Neighborhood Experience'
  END || ' ' || LPAD(sequence::TEXT, 3, '0'),
  'A limited community offer for local members, with simple booking and clear redemption details.',
  CASE (sequence - 7) % 6
    WHEN 0 THEN 'food-drink'
    WHEN 1 THEN 'wellness'
    WHEN 2 THEN 'food-drink'
    WHEN 3 THEN 'home'
    WHEN 4 THEN 'experiences'
    ELSE 'services'
  END,
  2500 + (sequence - 7) * 175,
  CASE (sequence - 7) % 4
    WHEN 0 THEN 'draft'
    WHEN 1 THEN 'pending'
    WHEN 2 THEN 'approved'
    ELSE 'rejected'
  END,
  'partner-' || LPAD((((sequence - 7) % 6) + 1)::TEXT, 3, '0'),
  CASE (sequence - 7) % 6
    WHEN 0 THEN 'Northstar Roasters'
    WHEN 1 THEN 'Form & Flow'
    WHEN 2 THEN 'Table Eleven'
    WHEN 3 THEN 'Common Goods'
    WHEN 4 THEN 'City Discovery Museum'
    ELSE 'Harbor Cycle Works'
  END,
  TIMESTAMPTZ '2026-07-01T09:00:00.000Z' + (sequence - 7) * INTERVAL '1 day',
  TIMESTAMPTZ '2026-07-08T09:00:00.000Z' + (sequence - 7) * INTERVAL '1 day',
  TIMESTAMPTZ '2026-06-16T00:00:00.000Z' + (sequence - 7) * INTERVAL '1 hour',
  TIMESTAMPTZ '2026-06-18T00:00:00.000Z' + (sequence - 7) * INTERVAL '1 hour'
FROM GENERATE_SERIES(7, 50) AS generated(sequence)
ON CONFLICT (id) DO NOTHING;
