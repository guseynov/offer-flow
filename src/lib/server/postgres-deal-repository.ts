import postgres from "postgres";
import { partnerOptions } from "@/mocks/partners";
import type { DashboardDataDto, DashboardStatusPoint } from "@/lib/dashboard-data";
import type {
  DealRepository,
  DealsPageInput,
} from "@/lib/server/deal-repository-types";
import type {
  CreateDealPayload,
  DealDecision,
  DealDto,
  UpdateDealPayload,
} from "@/types/deal";

type DealRow = {
  id: string;
  title: string;
  description: string;
  category: DealDto["category"];
  price_cents: number;
  status: DealDto["status"];
  partner_id: string;
  partner_name: string;
  starts_at: Date | string;
  ends_at: Date | string;
  created_at: Date | string;
  updated_at: Date | string;
};

type SummaryRow = {
  total: number | string;
  draft: number | string;
  pending: number | string;
  approved: number | string;
  rejected: number | string;
  approved_value_cents: number | string;
};

type RateLimitRow = {
  scope: string;
  request_count: number;
  retry_after_seconds: number;
};

function toIsoString(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function mapDealRow(row: DealRow): DealDto {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    priceCents: Number(row.price_cents),
    status: row.status,
    partnerId: row.partner_id,
    partnerName: row.partner_name,
    startsAt: toIsoString(row.starts_at),
    endsAt: toIsoString(row.ends_at),
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
  };
}

function getPartner(partnerId: string) {
  return partnerOptions.find((partner) => partner.id === partnerId);
}

function getStatusSeries(summary: SummaryRow): DashboardStatusPoint[] {
  return [
    { status: "draft", label: "Draft", count: Number(summary.draft) },
    { status: "pending", label: "Pending", count: Number(summary.pending) },
    {
      status: "approved",
      label: "Approved",
      count: Number(summary.approved),
    },
    {
      status: "rejected",
      label: "Rejected",
      count: Number(summary.rejected),
    },
  ];
}

export function createPostgresDealRepository(
  databaseUrl: string,
): DealRepository {
  const sql = postgres(databaseUrl, {
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
  });

  return {
    async close() {
      await sql.end();
    },

    async getDealsPage({ filters, cursor, limit }: DealsPageInput) {
      let cursorUpdatedAt: string | null = null;

      if (cursor) {
        const cursorRows = await sql<Array<{ updated_at: Date | string }>>`
          SELECT updated_at
          FROM deals
          WHERE id = ${cursor}
          LIMIT 1
        `;

        if (!cursorRows[0]) {
          return undefined;
        }

        cursorUpdatedAt = toIsoString(cursorRows[0].updated_at);
      }

      const query = filters.query;
      const status = filters.status ?? "";
      const category = filters.category ?? "";
      const totalRows = await sql<Array<{ total: number | string }>>`
        SELECT COUNT(*) AS total
        FROM deals
        WHERE POSITION(LOWER(${query}) IN LOWER(title || ' ' || partner_name)) > 0
          AND (${status} = '' OR status = ${status})
          AND (${category} = '' OR category = ${category})
      `;
      const rows = await sql<DealRow[]>`
        SELECT
          id, title, description, category, price_cents, status,
          partner_id, partner_name, starts_at, ends_at, created_at, updated_at
        FROM deals
        WHERE POSITION(LOWER(${query}) IN LOWER(title || ' ' || partner_name)) > 0
          AND (${status} = '' OR status = ${status})
          AND (${category} = '' OR category = ${category})
          AND (
            ${cursorUpdatedAt}::timestamptz IS NULL
            OR (updated_at, id) < (${cursorUpdatedAt}::timestamptz, ${cursor ?? ""})
          )
        ORDER BY updated_at DESC, id DESC
        LIMIT ${limit + 1}
      `;
      const hasNextPage = rows.length > limit;
      const pageRows = hasNextPage ? rows.slice(0, limit) : rows;
      const nextCursor = hasNextPage
        ? (pageRows[pageRows.length - 1]?.id ?? null)
        : null;

      return {
        deals: pageRows.map(mapDealRow),
        total: Number(totalRows[0]?.total ?? 0),
        hasNextPage,
        nextCursor,
      };
    },

    async getDealById(dealId) {
      const rows = await sql<DealRow[]>`
        SELECT
          id, title, description, category, price_cents, status,
          partner_id, partner_name, starts_at, ends_at, created_at, updated_at
        FROM deals
        WHERE id = ${dealId}
        LIMIT 1
      `;

      return rows[0] ? mapDealRow(rows[0]) : undefined;
    },

    async updateDeal(dealId: string, payload: UpdateDealPayload) {
      const partner = getPartner(payload.partnerId);

      if (!partner) {
        return { status: "not_found" } as const;
      }

      return sql.begin(async (transaction) => {
        const updatedRows = await transaction<DealRow[]>`
          UPDATE deals
          SET
            title = ${payload.title},
            description = ${payload.description},
            category = ${payload.category},
            price_cents = ${payload.priceCents},
            partner_id = ${payload.partnerId},
            partner_name = ${partner.name},
            starts_at = ${payload.startsAt},
            ends_at = ${payload.endsAt},
            updated_at = GREATEST(NOW(), updated_at + INTERVAL '1 millisecond')
          WHERE id = ${dealId}
            AND updated_at = ${payload.expectedUpdatedAt}
          RETURNING
            id, title, description, category, price_cents, status,
            partner_id, partner_name, starts_at, ends_at, created_at, updated_at
        `;

        if (updatedRows[0]) {
          return { status: "updated", deal: mapDealRow(updatedRows[0]) } as const;
        }

        const currentRows = await transaction<DealRow[]>`
          SELECT
            id, title, description, category, price_cents, status,
            partner_id, partner_name, starts_at, ends_at, created_at, updated_at
          FROM deals
          WHERE id = ${dealId}
          LIMIT 1
        `;

        if (currentRows[0]) {
          return {
            status: "conflict",
            deal: mapDealRow(currentRows[0]),
          } as const;
        }

        return { status: "not_found" } as const;
      });
    },

    async createDeal(payload: CreateDealPayload) {
      const partner = getPartner(payload.partnerId);

      if (!partner) {
        return undefined;
      }

      const rows = await sql<DealRow[]>`
        INSERT INTO deals (
          id, title, description, category, price_cents, status,
          partner_id, partner_name, starts_at, ends_at
        ) VALUES (
          ${`deal-${crypto.randomUUID()}`}, ${payload.title},
          ${payload.description}, ${payload.category}, ${payload.priceCents},
          ${payload.status}, ${payload.partnerId}, ${partner.name},
          ${payload.startsAt}, ${payload.endsAt}
        )
        RETURNING
          id, title, description, category, price_cents, status,
          partner_id, partner_name, starts_at, ends_at, created_at, updated_at
      `;

      return rows[0] ? mapDealRow(rows[0]) : undefined;
    },

    async setDealStatus(dealId: string, status: DealDecision) {
      const rows = await sql<DealRow[]>`
        UPDATE deals
        SET
          status = ${status},
          updated_at = GREATEST(NOW(), updated_at + INTERVAL '1 millisecond')
        WHERE id = ${dealId}
        RETURNING
          id, title, description, category, price_cents, status,
          partner_id, partner_name, starts_at, ends_at, created_at, updated_at
      `;

      return rows[0] ? mapDealRow(rows[0]) : undefined;
    },

    async getDashboardData(): Promise<DashboardDataDto> {
      return sql.begin(
        "isolation level repeatable read read only",
        async (transaction) => {
          const summaryRows = await transaction<SummaryRow[]>`
            SELECT
              COUNT(*) AS total,
              COUNT(*) FILTER (WHERE status = 'draft') AS draft,
              COUNT(*) FILTER (WHERE status = 'pending') AS pending,
              COUNT(*) FILTER (WHERE status = 'approved') AS approved,
              COUNT(*) FILTER (WHERE status = 'rejected') AS rejected,
              COALESCE(
                SUM(price_cents) FILTER (WHERE status = 'approved'),
                0
              ) AS approved_value_cents
            FROM deals
          `;
          const pendingRows = await transaction<DealRow[]>`
            SELECT
              id, title, description, category, price_cents, status,
              partner_id, partner_name, starts_at, ends_at, created_at, updated_at
            FROM deals
            WHERE status = 'pending'
            ORDER BY updated_at DESC, id DESC
            LIMIT 5
          `;
          const recentRows = await transaction<DealRow[]>`
            SELECT
              id, title, description, category, price_cents, status,
              partner_id, partner_name, starts_at, ends_at, created_at, updated_at
            FROM deals
            ORDER BY updated_at DESC, id DESC
            LIMIT 5
          `;
          const summaryRow = summaryRows[0] ?? {
            total: 0,
            draft: 0,
            pending: 0,
            approved: 0,
            rejected: 0,
            approved_value_cents: 0,
          };

          return {
            summary: {
              total: Number(summaryRow.total),
              draft: Number(summaryRow.draft),
              pending: Number(summaryRow.pending),
              approved: Number(summaryRow.approved),
              rejected: Number(summaryRow.rejected),
              approvedValueCents: Number(summaryRow.approved_value_cents),
            },
            statusSeries: getStatusSeries(summaryRow),
            pendingDeals: pendingRows.map(mapDealRow),
            recentDeals: recentRows.map(mapDealRow),
          };
        },
      );
    },

    async consumeMutationRateLimit(input) {
      const globalScope = "global";
      const clientScope = `client:${input.clientKey}`;
      return sql.begin(async (transaction) => {
        const globalRows = await transaction<RateLimitRow[]>`
          WITH expired AS (
            DELETE FROM mutation_rate_limits
            WHERE window_started_at < NOW() - INTERVAL '1 hour'
          )
          INSERT INTO mutation_rate_limits (
            scope,
            window_started_at,
            request_count
          ) VALUES (${globalScope}, NOW(), 1)
          ON CONFLICT (scope) DO UPDATE
          SET
            request_count = CASE
              WHEN mutation_rate_limits.window_started_at <=
                NOW() - make_interval(secs => ${input.windowSeconds})
              THEN 1
              ELSE mutation_rate_limits.request_count + 1
            END,
            window_started_at = CASE
              WHEN mutation_rate_limits.window_started_at <=
                NOW() - make_interval(secs => ${input.windowSeconds})
              THEN NOW()
              ELSE mutation_rate_limits.window_started_at
            END
          RETURNING
            scope,
            request_count,
            GREATEST(
              1,
              CEIL(EXTRACT(EPOCH FROM (
                window_started_at + make_interval(secs => ${input.windowSeconds})
                - NOW()
              )))
            )::INTEGER AS retry_after_seconds
        `;
        const globalCounter = globalRows[0];

        if (!globalCounter) {
          throw new Error("Global mutation rate-limit counter was not returned");
        }

        if (globalCounter.request_count > input.globalLimit) {
          return {
            allowed: false,
            limit: input.globalLimit,
            remaining: 0,
            retryAfterSeconds: globalCounter.retry_after_seconds,
          };
        }

        const clientRows = await transaction<RateLimitRow[]>`
          INSERT INTO mutation_rate_limits (
            scope,
            window_started_at,
            request_count
          ) VALUES (${clientScope}, NOW(), 1)
          ON CONFLICT (scope) DO UPDATE
          SET
            request_count = CASE
              WHEN mutation_rate_limits.window_started_at <=
                NOW() - make_interval(secs => ${input.windowSeconds})
              THEN 1
              ELSE mutation_rate_limits.request_count + 1
            END,
            window_started_at = CASE
              WHEN mutation_rate_limits.window_started_at <=
                NOW() - make_interval(secs => ${input.windowSeconds})
              THEN NOW()
              ELSE mutation_rate_limits.window_started_at
            END
          RETURNING
            scope,
            request_count,
            GREATEST(
              1,
              CEIL(EXTRACT(EPOCH FROM (
                window_started_at + make_interval(secs => ${input.windowSeconds})
                - NOW()
              )))
            )::INTEGER AS retry_after_seconds
        `;
        const clientCounter = clientRows[0];

        if (!clientCounter) {
          throw new Error("Client mutation rate-limit counter was not returned");
        }

        return {
          allowed: clientCounter.request_count <= input.clientLimit,
          limit:
            clientCounter.request_count <= input.clientLimit
              ? input.globalLimit
              : input.clientLimit,
          remaining: Math.min(
            Math.max(0, input.globalLimit - globalCounter.request_count),
            Math.max(0, input.clientLimit - clientCounter.request_count),
          ),
          retryAfterSeconds: Math.max(
            globalCounter.retry_after_seconds,
            clientCounter.retry_after_seconds,
          ),
        };
      });
    },
  };
}
