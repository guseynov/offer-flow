import type { Metadata } from "next";
import Link from "next/link";
import { DealsView } from "@/components/deals/deals-view";
import { Button } from "@/components/ui/button";
import { dealsQuerySchema } from "@/lib/schemas/deal";
import { getDealsPage } from "@/lib/server/deal-repository";
import type { DealsResponseDto } from "@/types/deal";

export const metadata: Metadata = { title: "Offers" };

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const rawSearchParams = await searchParams;
  const normalizedSearchParams = Object.fromEntries(
    Object.entries(rawSearchParams).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : value,
    ]),
  );
  const parsedQuery = dealsQuerySchema.safeParse(normalizedSearchParams);
  const query = parsedQuery.success
    ? parsedQuery.data
    : { q: "", page: 1 as const, limit: 20 as const };
  const pageResult = await getDealsPage({
    filters: {
      query: query.q,
      status: "status" in query ? query.status : undefined,
      category: "category" in query ? query.category : undefined,
    },
    page: query.page,
    limit: query.limit,
  });
  const initialPage: DealsResponseDto = {
    data: pageResult.deals,
    pageInfo: {
      total: pageResult.total,
      page: pageResult.page,
      pageSize: pageResult.pageSize,
      totalPages: pageResult.totalPages,
      hasPreviousPage: pageResult.hasPreviousPage,
      hasNextPage: pageResult.hasNextPage,
    },
  };

  return (
    <div className="mx-auto max-w-380">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-(--text-strong) sm:text-4xl">
            Offers
          </h1>
        </div>
        <Button asChild className="self-start sm:self-auto">
          <Link href="/dashboard/deals/new">Create offer</Link>
        </Button>
      </div>
      <div className="mt-8">
        <DealsView
          initialPage={initialPage}
          initialFilters={{
            query: query.q,
            status: "status" in query ? query.status : undefined,
            category: "category" in query ? query.category : undefined,
          }}
        />
      </div>
    </div>
  );
}
