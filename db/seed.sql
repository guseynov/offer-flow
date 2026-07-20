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

