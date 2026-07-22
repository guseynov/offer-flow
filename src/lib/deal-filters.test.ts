import { describe, expect, it } from "vitest";
import { filterDeals, parseDealFilters } from "@/lib/deal-filters";
import { mapDealDtosToDeals } from "@/lib/mappers/deal";
import { mockDeals } from "@/mocks/deals";

const deals = mapDealDtosToDeals(mockDeals);

describe("deal filters", () => {
  it("matches offer titles without regard to case", () => {
    const result = filterDeals(deals, {
      query: "coffee bundle",
    });

    expect(result.map((deal) => deal.id)).toEqual(["deal-001"]);
  });

  it("matches partner names promised by the search field", () => {
    const result = filterDeals(deals, {
      query: "northstar",
    });

    expect(result.some((deal) => deal.id === "deal-001")).toBe(true);
    expect(result.every((deal) => deal.partnerName === "Northstar Roasters")).toBe(
      true,
    );
  });

  it("combines text, status, and category filters", () => {
    const result = filterDeals(deals, {
      query: "flow",
      status: "pending",
      category: "wellness",
    });

    expect(result.some((deal) => deal.id === "deal-002")).toBe(true);
    expect(
      result.every(
        (deal) =>
          deal.partnerName === "Form & Flow" &&
          deal.status === "pending" &&
          deal.category === "wellness",
      ),
    ).toBe(true);
  });

  it("ignores invalid status and category URL values", () => {
    const filters = parseDealFilters(
      new URLSearchParams("q=coffee&status=unknown&category=invalid"),
    );

    expect(filters).toEqual({
      query: "coffee",
      status: undefined,
      category: undefined,
    });
  });
});
