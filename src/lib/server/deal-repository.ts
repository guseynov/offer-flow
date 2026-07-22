import type {
  CreateDealPayload,
  DealDecisionPayload,
  UpdateDealPayload,
} from "@/types/deal";
import type {
  DealRepository,
  DealsPageInput,
  MutationRateLimitInput,
} from "@/lib/server/deal-repository-types";

let repositoryPromise: Promise<DealRepository> | undefined;

async function createRepository(): Promise<DealRepository> {
  const useMemoryRepository =
    process.env.NODE_ENV === "test" ||
    (process.env.NODE_ENV === "development" &&
      (process.env.DEAL_REPOSITORY === "memory" ||
        !process.env.DATABASE_URL));

  if (useMemoryRepository) {
    const { memoryDealRepository } = await import("@/mocks/deal-repository");
    return memoryDealRepository;
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is required outside development and test.",
    );
  }

  const { createPostgresDealRepository } = await import(
    "@/lib/server/postgres-deal-repository"
  );

  return createPostgresDealRepository(databaseUrl);
}

export function getDealRepository(): Promise<DealRepository> {
  repositoryPromise ??= createRepository();
  return repositoryPromise;
}

export async function getDealsPage(input: DealsPageInput) {
  return (await getDealRepository()).getDealsPage(input);
}

export async function getDealById(dealId: string) {
  return (await getDealRepository()).getDealById(dealId);
}

export async function getDealHistory(dealId: string) {
  return (await getDealRepository()).getDealHistory(dealId);
}

export async function updateDeal(
  dealId: string,
  payload: UpdateDealPayload,
) {
  return (await getDealRepository()).updateDeal(dealId, payload);
}

export async function createDeal(payload: CreateDealPayload) {
  return (await getDealRepository()).createDeal(payload);
}

export async function setDealStatus(
  dealId: string,
  decision: "approved" | "rejected",
  payload: DealDecisionPayload,
  actor: { id: string; name: string },
) {
  return (await getDealRepository()).setDealStatus(dealId, {
    ...payload,
    decision,
    actorId: actor.id,
    actorName: actor.name,
  });
}

export async function getDashboardData() {
  return (await getDealRepository()).getDashboardData();
}

export async function consumeMutationRateLimit(
  input: MutationRateLimitInput,
) {
  return (await getDealRepository()).consumeMutationRateLimit(input);
}

export async function checkRepositoryReadiness() {
  return (await getDealRepository()).checkReadiness();
}
