import type { DealDto } from "@/types/deal";

const generatedOfferTitles = [
  "Market Morning Bundle",
  "Restorative Class Pack",
  "Chef's Weeknight Special",
  "Small Space Upgrade",
  "Family Discovery Pass",
  "Seasonal Service Package",
  "Weekend Workshop",
  "Local Favorites Box",
  "Wellness Starter Session",
  "Home Essentials Edit",
  "Neighborhood Experience",
] as const;

const generatedOfferPartners = [
  {
    id: "partner-001",
    name: "Northstar Roasters",
    category: "food-drink",
  },
  { id: "partner-002", name: "Form & Flow", category: "wellness" },
  { id: "partner-003", name: "Table Eleven", category: "food-drink" },
  { id: "partner-004", name: "Common Goods", category: "home" },
  {
    id: "partner-005",
    name: "City Discovery Museum",
    category: "experiences",
  },
  { id: "partner-006", name: "Harbor Cycle Works", category: "services" },
] as const;

const generatedOfferStatuses: DealDto["status"][] = [
  "draft",
  "pending",
  "approved",
  "rejected",
];

const featuredDeals: DealDto[] = [
  {
    id: "deal-001",
    title: "Weekend Coffee Bundle",
    description: "Two bags of single-origin coffee with a ceramic pour-over dripper.",
    category: "food-drink",
    priceCents: 4200,
    status: "approved",
    partnerId: "partner-001",
    partnerName: "Northstar Roasters",
    startsAt: "2026-06-18T08:00:00.000Z",
    endsAt: "2026-06-22T22:00:00.000Z",
    createdAt: "2026-06-08T09:15:00.000Z",
    updatedAt: "2026-06-15T08:20:00.000Z"
  },
  {
    id: "deal-002",
    title: "Summer Studio Pass",
    description: "Five drop-in movement classes redeemable during the summer season.",
    category: "wellness",
    priceCents: 6500,
    status: "pending",
    partnerId: "partner-002",
    partnerName: "Form & Flow",
    startsAt: "2026-06-20T06:00:00.000Z",
    endsAt: "2026-08-31T20:00:00.000Z",
    createdAt: "2026-06-12T11:40:00.000Z",
    updatedAt: "2026-06-15T07:58:00.000Z"
  },
  {
    id: "deal-003",
    title: "Neighborhood Dinner for Two",
    description: "A seasonal three-course dinner for two guests on selected weeknights.",
    category: "food-drink",
    priceCents: 8900,
    status: "rejected",
    partnerId: "partner-003",
    partnerName: "Table Eleven",
    startsAt: "2026-06-24T17:00:00.000Z",
    endsAt: "2026-07-24T21:00:00.000Z",
    createdAt: "2026-06-10T14:05:00.000Z",
    updatedAt: "2026-06-15T07:12:00.000Z"
  },
  {
    id: "deal-004",
    title: "Home Office Refresh",
    description: "A desk organizer, task lamp, and cable management kit.",
    category: "home",
    priceCents: 11900,
    status: "draft",
    partnerId: "partner-004",
    partnerName: "Common Goods",
    startsAt: "2026-07-01T08:00:00.000Z",
    endsAt: "2026-07-15T22:00:00.000Z",
    createdAt: "2026-06-13T10:20:00.000Z",
    updatedAt: "2026-06-14T16:45:00.000Z"
  },
  {
    id: "deal-005",
    title: "Family Museum Day",
    description: "Admission for two adults and two children, plus an activity guide.",
    category: "experiences",
    priceCents: 5400,
    status: "approved",
    partnerId: "partner-005",
    partnerName: "City Discovery Museum",
    startsAt: "2026-06-21T09:00:00.000Z",
    endsAt: "2026-09-06T17:00:00.000Z",
    createdAt: "2026-06-09T12:30:00.000Z",
    updatedAt: "2026-06-14T13:10:00.000Z"
  },
  {
    id: "deal-006",
    title: "Bike Tune-Up Package",
    description: "Safety inspection, brake adjustment, and drivetrain cleaning.",
    category: "services",
    priceCents: 7500,
    status: "pending",
    partnerId: "partner-006",
    partnerName: "Harbor Cycle Works",
    startsAt: "2026-06-19T08:00:00.000Z",
    endsAt: "2026-07-31T18:00:00.000Z",
    createdAt: "2026-06-14T08:50:00.000Z",
    updatedAt: "2026-06-14T08:50:00.000Z"
  },
];

const generatedDeals: DealDto[] = Array.from({ length: 44 }, (_, index) => {
  const sequence = index + 7;
  const partner = generatedOfferPartners[index % generatedOfferPartners.length];
  const title = generatedOfferTitles[index % generatedOfferTitles.length];
  const startsAt = new Date(Date.UTC(2026, 6, 1 + index, 9));
  const endsAt = new Date(startsAt.getTime() + 7 * 24 * 60 * 60 * 1000);
  const createdAt = new Date(Date.UTC(2026, 5, 16, index));
  const updatedAt = new Date(createdAt.getTime() + 2 * 24 * 60 * 60 * 1000);

  return {
    id: `deal-${String(sequence).padStart(3, "0")}`,
    title: `${title} ${String(sequence).padStart(3, "0")}`,
    description:
      "A limited community offer for local members, with simple booking and clear redemption details.",
    category: partner.category,
    priceCents: 2500 + index * 175,
    status: generatedOfferStatuses[index % generatedOfferStatuses.length],
    partnerId: partner.id,
    partnerName: partner.name,
    startsAt: startsAt.toISOString(),
    endsAt: endsAt.toISOString(),
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  };
});

export const mockDeals: DealDto[] = [...featuredDeals, ...generatedDeals];
