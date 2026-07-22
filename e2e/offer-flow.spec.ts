import { expect, test, type Page } from "@playwright/test";

test.describe.configure({ mode: "serial" });

async function createOfferThroughApi(page: Page) {
  return page.evaluate(async () => {
    const response = await fetch("/api/deals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `Browser workflow ${crypto.randomUUID()}`,
        description: "A browser-created offer used for the production workflow test.",
        category: "services",
        priceCents: 12500,
        status: "pending",
        partnerId: "partner-006",
        startsAt: "2026-09-01T09:00:00.000Z",
        endsAt: "2026-09-03T18:00:00.000Z",
      }),
    });
    const body = (await response.json()) as { data: { id: string; title: string } };
    return { httpStatus: response.status, ...body.data };
  });
}

async function ensurePaginatedOffers(page: Page) {
  await page.evaluate(async () => {
    const listResponse = await fetch("/api/deals?page=1&limit=1");
    const list = (await listResponse.json()) as {
      pageInfo: { total: number };
    };
    const requiredOffers = Math.max(0, 21 - list.pageInfo.total);

    for (let index = 0; index < requiredOffers; index += 1) {
      const response = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Pagination workflow ${crypto.randomUUID()}`,
          description: "A browser-created offer used to verify numbered pages.",
          category: "services",
          priceCents: 2500 + index,
          status: "draft",
          partnerId: "partner-006",
          startsAt: "2026-10-01T09:00:00.000Z",
          endsAt: "2026-10-03T18:00:00.000Z",
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create pagination fixture: ${response.status}`);
      }
    }
  });
}

test("serves the public console with a strict nonce CSP", async ({ page }) => {
  const response = await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/dashboard$/u);
  const csp = response?.headers()["content-security-policy"] ?? "";
  expect(csp).toContain("script-src 'self' 'nonce-");
  expect(csp).not.toMatch(/script-src[^;]*'unsafe-inline'/u);

  await expect(page.getByRole("heading", { name: "dashboard" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  await expect(page.getByText("Changes are shared with everyone.")).toBeVisible();
});

test("moves between numbered offer pages", async ({ page }) => {
  await page.goto("/dashboard");
  await ensurePaginatedOffers(page);
  await page.goto("/dashboard/deals");

  const pagination = page.getByRole("navigation", {
    name: "Offers pagination",
  });
  await expect(pagination.getByText(/Page 1 of \d+/u)).toBeVisible();
  await pagination.getByRole("button", { name: "Next" }).click();
  await expect(page).toHaveURL(/\/dashboard\/deals\?page=2$/u);
  await expect(pagination.getByText(/Page 2 of \d+/u)).toBeVisible();

  await pagination.getByRole("button", { name: "Previous" }).click();
  await expect(page).toHaveURL(/\/dashboard\/deals$/u);
});

test("keeps search focus during a slow filter request", async ({ page }) => {
  await page.goto("/dashboard/deals");
  const search = page.getByRole("searchbox", { name: "search" });
  await search.focus();
  await search.fill("Northstar");
  await expect(search).toBeFocused();
  await expect(page).toHaveURL(/q=Northstar/u);
  await expect(search).toBeFocused();
  await expect(page.getByText("Northstar Roasters").first()).toBeVisible();
});

test("edits, decides, and renders append-only history", async ({ page }) => {
  await page.goto("/dashboard");
  const created = await createOfferThroughApi(page);
  expect(created.httpStatus).toBe(201);

  await page.goto(`/dashboard/deals/${created.id}`);
  await page.getByRole("link", { name: "Edit offer" }).click();
  const title = page.getByRole("textbox", { name: "Offer title" });
  await title.fill(`${created.title} edited`);
  await page.getByRole("button", { name: /save changes/i }).click();
  await expect(page).toHaveURL(new RegExp(`/dashboard/deals/${created.id}$`, "u"));
  await expect(page.getByRole("heading", { name: `${created.title} edited` })).toBeVisible();

  await page.getByRole("button", { name: "Approve" }).click();
  await expect(page.getByText("pending → approved")).toBeVisible();
  await expect(page.getByText(/Public demo user ·/u)).toBeVisible();
});

test("handles missing records, theme, keyboard focus, and mobile overflow", async ({ page }) => {
  await page.goto("/dashboard/deals/does-not-exist");
  await expect(page.getByText(/not found/i).first()).toBeVisible();

  await page.goto("/dashboard");
  const themeToggle = page.getByRole("button", { name: "switch to dark mode" });
  await themeToggle.click();
  await expect(page.locator("html")).toHaveClass(/dark/u);
  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/dashboard/deals");
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasOverflow).toBe(false);

  const accessibilityProblems = await page.evaluate(() => {
    const duplicateIds = [...document.querySelectorAll<HTMLElement>("[id]")]
      .map((element) => element.id)
      .filter((id, index, ids) => ids.indexOf(id) !== index);
    const unnamedControls = [...document.querySelectorAll<HTMLElement>("button,input,select,textarea,a[href]")]
      .filter((element) => {
        if (
          element.hidden ||
          element.getAttribute("aria-hidden") === "true" ||
          (element.offsetWidth === 0 && element.offsetHeight === 0)
        ) {
          return false;
        }

        const name = element.getAttribute("aria-label") ?? element.textContent ?? "";
        const labelledBy = element.getAttribute("aria-labelledby");
        const label = element.id
          ? document.querySelector(`label[for="${CSS.escape(element.id)}"]`)
          : null;
        return !name.trim() && !labelledBy && !label;
      }).length;
    return { duplicateIds, unnamedControls };
  });
  expect(accessibilityProblems).toEqual({ duplicateIds: [], unnamedControls: 0 });
});
