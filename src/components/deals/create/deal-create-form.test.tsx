import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DealCreateForm } from "./deal-create-form";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

function renderForm() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <DealCreateForm />
    </QueryClientProvider>,
  );
}

describe("DealCreateForm accessibility", () => {
  it("names controls without nesting labels", () => {
    const { container } = renderForm();

    expect(screen.getByRole("textbox", { name: "Offer title" })).toBeTruthy();
    expect(
      screen.getByRole("textbox", { name: "Offer description" }),
    ).toBeTruthy();
    expect(screen.getByRole("textbox", { name: "Offer value (USD)" })).toBeTruthy();
    expect(screen.getByRole("combobox", { name: "Category" })).toBeTruthy();
    expect(
      screen.getByRole("combobox", { name: "Workflow status" }),
    ).toBeTruthy();
    expect(screen.getByRole("combobox", { name: "Partner" })).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Offer window (UTC)" }),
    ).toBeTruthy();
    expect(screen.getByLabelText("Start time (UTC)")).toBeTruthy();
    expect(screen.getByLabelText("End time (UTC)")).toBeTruthy();
    expect(container.querySelector("label label")).toBeNull();
  });

  it("associates validation errors with their controls", async () => {
    renderForm();

    fireEvent.click(screen.getByRole("button", { name: "Create offer" }));

    const title = screen.getByRole("textbox", { name: "Offer title" });
    const error = await screen.findByText("Title must be at least 3 characters.");

    await waitFor(() => {
      expect(title.getAttribute("aria-invalid")).toBe("true");
      expect(title.getAttribute("aria-describedby")).toBe(error.id);
    });
  });
});
