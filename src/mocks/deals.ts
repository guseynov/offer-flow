import type { DealDto } from "@/types/deal";

export const mockDeals: DealDto[] = [
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
  }
];
