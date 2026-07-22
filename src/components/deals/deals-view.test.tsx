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
    data: [] as typeof mockDeals,
    pageInfo: {
      total: 0,
      page: 1,
      pageSize: 20,
      totalPages: 1,
      hasPreviousPage: false,
      hasNextPage: false,
    },
  },
  isPending: false,
  isError: false,
  isFetching: false,
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
  keepPreviousData: (data: unknown) => data,
  useQuery: () => queryState,
}));

describe("DealsView navigation", () => {
  beforeEach(() => {
    navigation.push.mockReset();
    navigation.replace.mockReset();
    navigation.searchParams = new URLSearchParams();
    queryState.isPending = false;
    queryState.isError = false;
    queryState.isFetching = false;
    queryState.data = {
      data: [...mockDeals],
      pageInfo: {
        total: mockDeals.length,
        page: 1,
        pageSize: 20,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
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

  it("keeps the focused search control mounted while results are loading", () => {
    const view = render(<DealsView />);
    const search = screen.getByRole("searchbox", { name: "search" });
    search.focus();
    expect(document.activeElement).toBe(search);

    queryState.isPending = true;
    view.rerender(<DealsView />);

    expect(screen.getByRole("searchbox", { name: "search" })).toBe(search);
    expect(document.activeElement).toBe(search);
    expect(screen.getByLabelText("Loading offers")).toBeTruthy();
  });

  it("stores the selected page in the URL", () => {
    queryState.data = {
      data: mockDeals.slice(0, 2),
      pageInfo: {
        total: 6,
        page: 1,
        pageSize: 2,
        totalPages: 3,
        hasPreviousPage: false,
        hasNextPage: true,
      },
    };
    render(<DealsView />);

    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(navigation.push).toHaveBeenCalledWith(
      "/dashboard/deals?page=2",
      { scroll: false },
    );
  });

  it("returns to page one when a filter changes", () => {
    navigation.searchParams = new URLSearchParams("page=3");
    render(<DealsView />);

    fireEvent.change(screen.getByPlaceholderText("search title or partner"), {
      target: { value: "Northstar" },
    });

    expect(navigation.replace).toHaveBeenCalledWith(
      "/dashboard/deals?q=Northstar",
      { scroll: false },
    );
  });
});
