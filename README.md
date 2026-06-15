# Commerce Ops Console

A focused interview-prep project demonstrating frontend architecture for an internal commerce operations dashboard. Operators can browse, filter, create, edit, approve, and reject community deals through a typed mock API.

The project intentionally stays small. Each feature demonstrates a specific ownership boundary in a modern React and Next.js application rather than simulating a production commerce platform.

## Stack

- Next.js App Router and React
- TypeScript in strict mode
- Tailwind CSS
- TanStack Query for server state and mutations
- Zustand for shared client-only UI state
- Formik for form state
- Zod for runtime boundary validation
- Axios for the typed API client
- CVA and `clsx` for component class composition
- Next.js Route Handlers as the mock backend

## Features

- Responsive dashboard shell with summary metrics
- Deals table with loading, error, and empty states
- Shareable title, status, and category filters
- Comfortable and compact table density
- Deal detail pages with cached server state
- Create and edit forms with visible validation
- Explicit approve and reject mutations
- Query cache updates and invalidation after mutations
- Typed DTO, UI model, form value, and API payload boundaries

## Routes

| Route | Purpose |
| --- | --- |
| `/dashboard` | Static operations overview |
| `/dashboard/deals` | Deals table and URL filters |
| `/dashboard/deals/new` | Create deal form |
| `/dashboard/deals/[id]` | Deal details and review actions |
| `/dashboard/deals/[id]/edit` | Edit deal form |
| `/api/deals` | List and create mock deals |
| `/api/deals/[id]` | Read and update one deal |
| `/api/deals/[id]/approve` | Approve one deal |
| `/api/deals/[id]/reject` | Reject one deal |

## State ownership

State is assigned according to its lifecycle and sharing requirements:

- **Server data: TanStack Query.** Deal lists, detail records, request status, caching, mutations, and invalidation stay in the query layer. API records are never copied into Zustand.
- **Shared UI state: Zustand.** Table density is client-only presentation state shared by the density control and table. Components subscribe with selectors to avoid receiving unrelated state.
- **Shareable filters: URL search params.** Search, status, and category filters survive reloads, support browser history, and can be shared as links.
- **Form state: Formik.** Create and edit values, touched fields, submission state, and field errors belong to each form instance.
- **Validation: Zod.** API responses, API payloads, and form values are checked at their boundaries.
- **API boundary: Axios client + Zod + DTO mapping.** Axios performs transport, Zod verifies runtime data, and mappers convert external DTOs into render-ready UI models.
- **Local component state:** Used only where a value is private to one component and does not need another ownership mechanism.

## Data shapes

The code deliberately avoids using one type everywhere:

- `DealDto` represents the mock backend response.
- `Deal` and `DealDetail` contain formatted, render-ready values.
- `DealFormValues` and `DealCreateFormValues` contain browser-friendly strings such as decimal prices and `datetime-local` values.
- `CreateDealPayload` and `UpdateDealPayload` contain API-ready integer cents and ISO timestamps.

Mappers in `src/lib/mappers/deal.ts` perform price and date conversions explicitly.

## API and data flow

A typical detail request follows this path:

1. A client component calls a typed function in `src/lib/api/deals.ts`.
2. Axios requests a Next.js Route Handler under `/api/deals`.
3. The route reads from the process-local mock repository.
4. The client validates the response with Zod.
5. A mapper converts the DTO into a UI model.
6. TanStack Query caches the server record using keys such as `['deal', dealId]`.

Mutations validate payloads on the server, update the mock repository, seed or refresh the detail cache, and invalidate the deals list deliberately.

## Architecture notes

- Server Components provide route layouts and page structure. Client Components are introduced only for browser APIs, forms, queries, mutations, and Zustand subscriptions.
- Query keys are centralized in `src/lib/query-keys.ts`.
- Shared types live under `src/types`.
- Styling variants use CVA; ordinary class composition uses `clsx`.
- TSX templates avoid ternary expressions in favor of named helpers or explicit conditional rendering.
- Invalid URL filter values are ignored safely while unrelated query parameters are preserved.

## Project structure

```text
src/
  app/
    api/deals/           Mock backend route handlers
    dashboard/           Dashboard, list, detail, create, and edit routes
  components/
    dashboard/           Dashboard shell and reusable overview components
    deals/               List, filters, forms, detail UI, and mutations
    providers/           TanStack Query provider
  lib/
    api/                 Axios client and typed request functions
    mappers/             DTO, UI, form, and payload conversions
    schemas/             Zod schemas
    validation/          Formik-compatible validation adapters
  mocks/                 Mock records, partners, and in-memory repository
  stores/                Zustand UI store
  types/                 Dedicated domain and UI types
```

## Running locally

Requirements: a current Node.js LTS release and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard).

Quality checks:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Current limitations

- The backend is an in-memory mock with no database or durable persistence.
- Mock changes reset when the server process restarts and are not safe across multiple server instances.
- There is no authentication, authorization, pagination, or real partner management.
- Dashboard metrics are static.
- The project has not yet added automated tests.
- Accessibility is considered in semantic structure and focus states, but it has not undergone a full assistive-technology audit.

This repository is an architecture exercise, not a production-ready commerce system.

## Next steps

The next milestone is focused automated coverage with Vitest and React Testing Library for a presentational component, form validation, and a mutation or request state.
