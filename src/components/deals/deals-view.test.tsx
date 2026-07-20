import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockDeals } from "@/mocks/deals";
import { DealsView } from "./deals-view";

const navigation = vi.hoisted(() => ({
  pathname: "/dashboard/deals",
  push: vi.fn(),
  replace: vi.fn(),
  searchParams: new URLSearchParams(),
}));

const queryState = vi.hoisted(() => ({
  data: {
    pages: [
      {
        data: [] as typeof mockDeals,
        pageInfo: { total: 0, hasNextPage: false, nextCursor: null },
      },
    ],
    pageParams: [undefined],
  },
  isPending: false,
  isError: false,
  hasNextPage: false,
  isFetchingNextPage: false,
  fetchNextPage: vi.fn(),
  refetch: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
  useRouter: () => ({
    push: navigation.push,
    replace: navigation.replace,
  }),
  useSearchParams: () => navigation.searchParams,
}));

vi.mock("@tanstack/react-query", () => ({
  useInfiniteQuery: () => queryState,
}));

describe("DealsView navigation", () => {
  beforeEach(() => {
    navigation.push.mockReset();
    navigation.replace.mockReset();
    navigation.searchParams = new URLSearchParams();
    queryState.data.pages[0] = {
      data: mockDeals,
      pageInfo: {
        total: mockDeals.length,
        hasNextPage: false,
        nextCursor: null,
      },
    };
  });

  it("replaces the current history entry while typing a search", () => {
    render(<DealsView />);

    fireEvent.change(screen.getByPlaceholderText("search title or partner"), {
      target: { value: "Northstar" },
    });

    expect(navigation.replace).toHaveBeenCalledWith(
      "/dashboard/deals?q=Northstar",
      { scroll: false },
    );
    expect(navigation.push).not.toHaveBeenCalled();
  });

  it("provides accessible names for every filter control", () => {
    render(<DealsView />);

    expect(screen.getByRole("searchbox", { name: "search" })).toBeTruthy();
    expect(screen.getByRole("combobox", { name: "status" })).toBeTruthy();
    expect(screen.getByRole("combobox", { name: "category" })).toBeTruthy();
  });
});
