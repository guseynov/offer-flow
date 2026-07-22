// @vitest-environment node

import { readFile } from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createPostgresDealRepository } from "@/lib/server/postgres-deal-repository";
import type { CreateDealPayload } from "@/types/deal";

const databaseUrl = process.env.TEST_DATABASE_URL;
const describeWithDatabase = databaseUrl ? describe : describe.skip;

describeWithDatabase("PostgreSQL deal repository", () => {
  const repositoryOne = createPostgresDealRepository(databaseUrl ?? "");
  const repositoryTwo = createPostgresDealRepository(databaseUrl ?? "");
  const adminSql = postgres(databaseUrl ?? "", { max: 1, prepare: false });
  const createdIds: string[] = [];

  beforeAll(async () => {
    const migration = await readFile(
      path.resolve(process.cwd(), "db/migrations/001_create_deals.sql"),
      "utf8",
    );
    const auditMigration = await readFile(
      path.resolve(process.cwd(), "db/migrations/002_create_deal_audit_events.sql"),
      "utf8",
    );
    const seed = await readFile(
      path.resolve(process.cwd(), "db/seed.sql"),
      "utf8",
    );

    await adminSql.unsafe(migration);
    await adminSql.unsafe(auditMigration);
    await adminSql.unsafe(seed);
  });

  afterAll(async () => {
    if (createdIds.length > 0) {
      await adminSql`DELETE FROM deal_audit_events WHERE deal_id IN ${adminSql(createdIds)}`;
      await adminSql`DELETE FROM deals WHERE id IN ${adminSql(createdIds)}`;
    }

    await Promise.all([
      repositoryOne.close?.(),
      repositoryTwo.close?.(),
      adminSql.end(),
    ]);
  });

  function createPayload(title: string): CreateDealPayload {
    return {
      title,
      description: "A durable integration-test offer shared across instances.",
      category: "services",
      priceCents: 5000,
      status: "pending",
      partnerId: "partner-006",
      startsAt: "2026-10-01T09:00:00.000Z",
      endsAt: "2026-10-02T18:00:00.000Z",
    };
  }

  it("shares durable records across independent repository instances", async () => {
    const created = await repositoryOne.createDeal(
      createPayload("Cross-instance persistence test"),
    );
    expect(created).toBeDefined();

    createdIds.push(created!.id);
    const readFromSecondInstance = await repositoryTwo.getDealById(created!.id);

    expect(readFromSecondInstance).toEqual(created);
  });

  it("preserves a newer decision when another instance submits a stale edit", async () => {
    const staleDeal = await repositoryOne.createDeal(
      createPayload("Cross-instance conflict test"),
    );
    expect(staleDeal).toBeDefined();
    createdIds.push(staleDeal!.id);

    const approved = await repositoryOne.setDealStatus(
      staleDeal!.id,
      {
        decision: "approved",
        expectedUpdatedAt: staleDeal!.updatedAt,
        requestId: crypto.randomUUID(),
        actorId: "integration-operator",
        actorName: "Integration Operator",
      },
    );
    expect(approved.status).toBe("updated");
    expect(approved.status === "updated" && approved.deal.status).toBe("approved");
    const history = await repositoryTwo.getDealHistory(staleDeal!.id);
    expect(history).toHaveLength(1);
    expect(history[0]?.actorId).toBe("integration-operator");

    const updateResult = await repositoryTwo.updateDeal(staleDeal!.id, {
      title: "Stale title",
      description: staleDeal!.description,
      category: staleDeal!.category,
      priceCents: staleDeal!.priceCents,
      partnerId: staleDeal!.partnerId,
      startsAt: staleDeal!.startsAt,
      endsAt: staleDeal!.endsAt,
      expectedUpdatedAt: staleDeal!.updatedAt,
    });

    expect(updateResult.status).toBe("conflict");
    expect(
      updateResult.status === "conflict" && updateResult.deal.status,
    ).toBe("approved");
  });

  it("paginates and filters in the database", async () => {
    const page = await repositoryTwo.getDealsPage({
      filters: { query: "Northstar" },
      page: 1,
      limit: 1,
    });

    expect(page.total).toBe(1);
    expect(page.deals[0]?.partnerName).toBe("Northstar Roasters");
  });

  it("applies page offsets to a deterministic ordering", async () => {
    const prefix = `Page offset ${crypto.randomUUID()}`;
    const created = await Promise.all([
      repositoryOne.createDeal(createPayload(`${prefix} A`)),
      repositoryOne.createDeal(createPayload(`${prefix} B`)),
      repositoryOne.createDeal(createPayload(`${prefix} C`)),
    ]);
    const createdDeals = created.filter((deal) => deal !== undefined);
    createdIds.push(...createdDeals.map((deal) => deal.id));

    const firstPage = await repositoryOne.getDealsPage({
      filters: { query: prefix },
      page: 1,
      limit: 2,
    });

    const secondPage = await repositoryOne.getDealsPage({
      filters: { query: prefix },
      page: 2,
      limit: 2,
    });
    const firstIds = new Set(firstPage.deals.map((deal) => deal.id));
    expect(firstPage.deals).toHaveLength(2);
    expect(secondPage.deals).toHaveLength(1);
    expect(secondPage.deals.every((deal) => !firstIds.has(deal.id))).toBe(true);
  });

  it("allows only one concurrent review decision and appends one event", async () => {
    const deal = await repositoryOne.createDeal(
      createPayload("Concurrent review decision test"),
    );
    expect(deal).toBeDefined();
    createdIds.push(deal!.id);

    const [approveResult, rejectResult] = await Promise.all([
      repositoryOne.setDealStatus(deal!.id, {
        decision: "approved",
        expectedUpdatedAt: deal!.updatedAt,
        requestId: crypto.randomUUID(),
        actorId: "operator-one",
        actorName: "Operator One",
      }),
      repositoryTwo.setDealStatus(deal!.id, {
        decision: "rejected",
        expectedUpdatedAt: deal!.updatedAt,
        requestId: crypto.randomUUID(),
        actorId: "operator-two",
        actorName: "Operator Two",
      }),
    ]);

    expect([approveResult.status, rejectResult.status].sort()).toEqual([
      "conflict",
      "updated",
    ]);
    expect(await repositoryOne.getDealHistory(deal!.id)).toHaveLength(1);
  });

  it("reads dashboard aggregates and queues from one database snapshot", async () => {
    const dashboard = await repositoryOne.getDashboardData();
    const statusTotal = dashboard.statusSeries.reduce(
      (total, point) => total + point.count,
      0,
    );

    expect(statusTotal).toBe(dashboard.summary.total);
    expect(dashboard.pendingDeals.every((deal) => deal.status === "pending")).toBe(
      true,
    );
  });

  it("shares mutation limits across repository instances", async () => {
    const input = {
      scopePrefix: "integration",
      clientKey: `integration-${crypto.randomUUID()}`,
      clientLimit: 2,
      globalLimit: 1000,
      windowSeconds: 60,
    };

    expect((await repositoryOne.consumeMutationRateLimit(input)).allowed).toBe(
      true,
    );
    expect((await repositoryTwo.consumeMutationRateLimit(input)).allowed).toBe(
      true,
    );

    const blocked = await repositoryOne.consumeMutationRateLimit(input);

    expect(blocked.allowed).toBe(false);
    expect(blocked.limit).toBe(2);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });
});
