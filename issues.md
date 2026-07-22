# Production-readiness code review

> Resolution update (2026-07-22): 13 findings below have been implemented and verified. The anonymous-access finding is an explicitly accepted product risk for this public pet project. Each item retains the original problem statement for traceability and includes its current disposition.

## Findings

### [Critical] All operational data and mutations are publicly accessible

**Location:** `src/app/api/deals/route.ts:17-87`, `src/app/api/deals/[id]/route.ts:14-69`, `src/app/api/deals/[id]/approve/route.ts:6-22`, `src/app/api/deals/[id]/reject/route.ts:6-22`, `README.md:169-177`
**Status:** Confirmed — accepted for pet-project scope
**Disposition:** Authentication and roles were intentionally removed at the owner's direction. The deployment uses public, shared demo data and must not contain sensitive or real operational records. Validation, request-size limits, rate limits, optimistic concurrency, idempotent decisions, and append-only history remain in place, but they do not mitigate the identity or authorization risk described below.
**Problem:**
No route authenticates the caller or checks a role or permission. Anonymous users can list and read every offer and can create, edit, approve, or reject records. The README explicitly accepts this for the public pet-project deployment, but that makes the application unsafe under the requested production-operations threat model.

**Impact:**
Anyone who can reach the deployment can read internal commerce data and alter the review queue. Rate limiting reduces request volume but does not establish identity, authorization, or accountability.

**Example:**
A visitor can enumerate IDs with `GET /api/deals` and directly submit `POST /api/deals/deal-002/approve` without a session or permission check.

**Recommended fix:**
Add server-side authentication and role-based authorization at a shared API/data-access boundary. Require an authenticated operator for reads and a specific mutation permission for create, edit, approve, and reject. If the public demo must remain anonymous, make it read-only or isolate each visitor in disposable demo data.

**Fix scope:** Large
**Regression risk:** High

### [High] Concurrent review decisions overwrite each other without conflict detection

**Location:** `src/app/api/deals/[id]/approve/route.ts:6-22`, `src/app/api/deals/[id]/reject/route.ts:6-22`, `src/lib/server/postgres-deal-repository.ts:248-260`, `src/mocks/deal-repository.ts:198-218`, `src/components/deals/detail/deal-status-actions.tsx:53-104`
**Status:** Resolved
**Resolution:** Decision requests now carry `expectedUpdatedAt` and a UUID request ID. Both repositories enforce the version and transition precondition, return 409 on stale state, and make a repeated request ID idempotent.
**Problem:**
Metadata edits use `expectedUpdatedAt`, but approve and reject requests carry no version precondition. Both repositories update status unconditionally, so a stale or racing review decision succeeds and the last database write wins.

**Impact:**
One operator can silently reverse another operator's decision. The UI then presents the final status as authoritative even though neither operator was told that a conflict occurred.

**Example:**
Two operators open the same pending offer. One approves it while the other rejects the stale view a moment later. Both requests return 200, and the offer ends as rejected with no conflict warning.

**Recommended fix:**
Send the last-seen revision or `updatedAt` with decision commands and perform a conditional update in the same transaction. Return 409 with the current record when the precondition fails. Define and test allowed state transitions and make repeat submissions explicitly idempotent.

**Fix scope:** Medium
**Regression risk:** Medium

### [High] Approval and rejection history is not retained

**Location:** `db/migrations/001_create_deals.sql:1-30`, `src/lib/server/postgres-deal-repository.ts:248-260`, `src/components/deals/detail/deal-detail-content.tsx:101-119`, `README.md:179-181`
**Status:** Resolved
**Resolution:** Added migration `002_create_deal_audit_events.sql`; decisions now atomically update current state and append actor-attributed events. The detail API and page render the real decision history.
**Problem:**
Workflow changes overwrite `deals.status` and `updated_at`; there is no append-only decision or audit table. The UI section titled “Record history” shows only creation and last-update timestamps, not a history of edits or decisions. The README also identifies an audit log as future work.

**Impact:**
Operators cannot determine who approved or rejected an offer, when a reversal happened, what the previous state was, or why the action occurred. Incident investigation and recovery are therefore impossible from application data.

**Example:**
An approved offer is later rejected. The database retains only `rejected` and the latest timestamp, so support cannot establish whether the change was intentional or restore the previous decision from an audit record.

**Recommended fix:**
Add an append-only workflow-event table containing deal ID, previous and next status, actor identity, timestamp, reason/comment, and request/idempotency ID. Write the event and current-state update atomically, then render actual history in the detail page.

**Fix scope:** Large
**Regression risk:** Medium

### [Medium] Filtering unmounts the search control and drops keyboard focus

**Location:** `src/components/deals/deals-view.tsx:31-48`, `src/components/deals/deals-view.tsx:84-104`
**Status:** Resolved
**Resolution:** Filters remain mounted while only the results region displays loading or error state. Unit and Chromium tests assert that the search element and keyboard focus survive query changes.
**Problem:**
Every new debounced filter value creates a new React Query key. While that uncached request is pending, `DealsView` returns only `DealsTableSkeleton`, unmounting the filters as well as the results. A headless-browser check with a delayed API response confirmed that focus moved from `#deal-search` to `<body>` and did not return after the input remounted.

**Impact:**
Keyboard users can be interrupted while typing, and all users see the filter panel disappear on slower connections. The core search flow becomes unreliable and is particularly disruptive for assistive-technology users.

**Example:**
An operator types “Northstar,” pauses after the debounce interval, and then tries to refine the query. The input has disappeared during loading and returns unfocused, so the next keystrokes go nowhere.

**Recommended fix:**
Keep filters mounted for pending/refetch states. Preserve the previous result set with React Query placeholder data or show a loading state only over the results region. Add a browser test that delays the API and asserts that the search input remains present and focused.

**Fix scope:** Small
**Regression risk:** Low

### [Medium] Pagination cursors change meaning when the cursor record is updated

**Location:** `src/lib/server/postgres-deal-repository.ts:102-149`, `src/lib/server/deal-repository-types.ts:15-25`, `src/types/deal.ts:25-38`
**Status:** Resolved
**Resolution:** The cursor implementation was removed during the pet-project simplification. The API now uses validated page numbers and `LIMIT`/`OFFSET`, while TanStack Query caches page/filter combinations and preserves the previous page during transitions. This deliberately trades cursor-level consistency under concurrent reordering for a smaller, easier-to-understand pagination contract.
**Problem:**
The cursor contains only a deal ID. On the next request, the repository looks up that deal's current `updated_at` and uses the current tuple as the page boundary. Because `updated_at` is mutable, the boundary can move after the first page was returned.

**Impact:**
Active queues can duplicate or skip records while an operator loads subsequent pages. This undermines the expectation that cursor pagination gives a stable traversal order.

**Example:**
Page one returns records A and B, with B as the cursor. If B is edited and moves above A before page two is requested, the server uses B's new timestamp; A can satisfy the new “less than cursor” predicate and appear again on page two.

**Recommended fix:**
Encode the immutable boundary values from the response—at least `updatedAt` and `id`—in an opaque, signed or validated cursor. Apply both values directly in the next query without re-reading the cursor row. Add mutation-between-pages tests for duplicates and gaps.

**Fix scope:** Medium
**Regression risk:** Medium

### [Medium] Production database misconfiguration is detected only on the first request

**Location:** `src/lib/server/deal-repository.ts:12-43`, `.github/workflows/ci.yml:43-58`, `README.md:148-156`
**Status:** Resolved
**Resolution:** Added startup production configuration validation, a migration-version table, an idempotent multi-migration runner, `check:production`, `/api/health/ready`, a `prestart` gate, and a CI readiness step against PostgreSQL.
**Problem:**
Repository creation is lazy, so `DATABASE_URL` is not validated during build or application startup. The production build completed successfully without the variable even though production has no memory fallback; the first API request is where the code throws.

**Impact:**
A deployment can pass CI and become publicly available while every data-backed screen fails at runtime. Missing migrations similarly have no readiness check before traffic arrives.

**Example:**
A new environment is deployed without `DATABASE_URL`. `next build` is green, but `/api/dashboard` throws and the dashboard shows an error to the first operator.

**Recommended fix:**
Add an explicit production environment validation/preflight step and a database readiness check that verifies connectivity and the expected migration version. Run it in CI/deployment before promoting the release, and expose a health/readiness endpoint appropriate to the hosting platform.

**Fix scope:** Small
**Regression risk:** Low

### [Medium] A four-bar chart adds about 191 KiB of compressed route JavaScript

**Location:** `src/components/dashboard/overview-chart.tsx:3-12`, `src/components/dashboard/dashboard-overview.tsx:21`, `src/components/dashboard/dashboard-overview.tsx:203-215`, `package.json:38`
**Status:** Resolved
**Resolution:** Replaced Recharts with a semantic HTML/CSS chart and removed `recharts` plus its 35 transitive packages from the dependency graph.
**Problem:**
The dashboard imports Recharts for a static four-value bar chart. The production manifest associates two large route-specific chunks with the dashboard; in the reviewed build they totaled 715,983 bytes uncompressed and approximately 190,798 bytes gzip-compressed before the small page chunk.

**Impact:**
The dashboard pays avoidable download, parse, and hydration cost for a visualization that can be expressed with substantially less code. The cost is most visible on cold loads and lower-powered devices.

**Example:**
An operator opening the dashboard on a constrained connection downloads roughly 191 KiB gzip of chart-related JavaScript before the small status chart becomes interactive.

**Recommended fix:**
Render this simple chart as semantic HTML/CSS or a small accessible SVG. If Recharts is retained for future complexity, lazy-load the chart below the primary queue and measure the resulting route bundle and Core Web Vitals.

**Fix scope:** Medium
**Regression risk:** Low

### [Medium] Core pages add a client-hydration data-fetch waterfall

**Location:** `src/app/dashboard/page.tsx:6-8`, `src/components/dashboard/dashboard-overview.tsx:45-52`, `src/app/dashboard/deals/page.tsx:10-26`, `src/components/deals/deals-view.tsx:24-48`, `src/components/deals/detail/deal-detail-view.tsx:14-22`
**Status:** Resolved
**Resolution:** Dashboard, list, detail, and edit pages now load their initial records in Server Components and seed the client queries, while retaining React Query for interactive refreshes and mutations.
**Problem:**
Dashboard, list, and detail pages render client query components without server-prefetched data. Their HTML starts with a skeleton; useful data is requested from the application's own route handlers only after JavaScript loads and hydrates.

**Impact:**
Each initial navigation adds an avoidable browser-to-API round trip and leaves the primary content unavailable longer during cold starts or slow database responses. It also duplicates server boundaries inside the same Next.js application.

**Example:**
The initial dashboard response contains the loading skeleton even though the Server Component could access the repository directly; the browser must hydrate React Query and then call `/api/dashboard` before any queue data appears.

**Recommended fix:**
Fetch initial data in Server Components and either render it directly or dehydrate it into React Query for subsequent client mutations/refetches. Keep client queries for interactive refreshes and pagination rather than the first meaningful render.

**Fix scope:** Medium
**Regression risk:** Medium

### [Medium] Primary navigation and complementary regions have weak landmark semantics

**Location:** `src/components/dashboard/sidebar.tsx:75-119`, `src/components/dashboard/sidebar.tsx:122-175`, `src/components/deals/detail/deal-detail-content.tsx:123-159`
**Status:** Resolved
**Resolution:** The route list is now `<nav aria-label="Primary">`; the workspace and review complementary regions have distinct names. Browser coverage asserts the primary landmark and visible control names.
**Problem:**
The primary route list is inside a generic `<div>` within an `<aside>` rather than a named `<nav>`. On the detail page, that application sidebar and the review panel are both unnamed `<aside>` landmarks. Browser inspection confirmed zero navigation landmarks and two indistinguishable complementary landmarks on detail pages.

**Impact:**
Screen-reader users cannot jump directly to primary navigation and receive ambiguous landmark lists, making repeated page navigation slower. This weakens semantic structure under WCAG 1.3.1.

**Example:**
A screen-reader landmark menu reports two “complementary” regions on an offer detail page but no “navigation” region, so the user must explore their contents to discover which is the site menu.

**Recommended fix:**
Wrap the route list in `<nav aria-label="Primary">`. Use a neutral container for the outer shell or label it only if it remains complementary. Give the review aside a distinct accessible label tied to its visible heading.

**Fix scope:** Small
**Regression risk:** Low

### [Medium] Automated tests do not exercise the critical browser workflows

**Location:** `package.json:5-14`, `src/components/deals/deals-view.test.tsx:31-42`, `src/components/deals/deals-view.test.tsx:44-80`, `src/app/api/deals/deal-update-conflict.test.ts:55-117`, `README.md:169-181`
**Status:** Resolved
**Resolution:** Added Playwright configuration and four Chromium workflows covering sign-in/CSP, filter focus, edit/decision/history, missing records, keyboard focus, theme, mobile overflow, and basic automated accessibility checks. CI installs Chromium and runs the suite.
**Problem:**
The suite has useful unit, route, component, and optional PostgreSQL integration tests, but no end-to-end browser test command. `DealsView` mocks `useInfiniteQuery` as a permanently successful object, so it cannot expose pending-state focus loss. There is also no test for racing approve/reject requests or full create, edit-conflict, decision, theme, mobile, and keyboard flows.

**Impact:**
Critical regressions can pass lint, types, unit tests, and build. The confirmed filter-focus defect is an example: the current navigation test passes because it bypasses real query state transitions.

**Example:**
A change that unmounts the search form during loading remains green because the test asserts only `router.replace`, not focus or DOM continuity during an actual request.

**Recommended fix:**
Add Playwright or an equivalent browser suite for list filtering under delayed responses, create/edit/409 recovery, concurrent decisions, not-found/error recovery, keyboard navigation, theme persistence, and representative mobile viewports. Add automated accessibility checks, while retaining manual assistive-technology testing for release candidates.

**Fix scope:** Medium
**Regression risk:** Low

### [Low] The design-system documentation no longer describes the implemented theme

**Location:** `DESIGN.md:4-24`, `DESIGN.md:105-146`, `DESIGN.md:181-203`, `src/app/globals.css:7-115`
**Status:** Resolved
**Resolution:** Reconciled `DESIGN.md` with the implemented grayscale light theme, dark-theme source of truth, semantic colors, shell behavior, and control rules.
**Problem:**
`DESIGN.md` specifies an emerald primary (`#047857`), dark evergreen sidebar (`#13231b`), stone canvas, and 12–16px component vocabulary. The implementation uses a grayscale primary (`#181c23`), light gray sidebar (`#d8dde5`) and a substantially different light/dark token set. The design detector also found undocumented color and radius values.

**Impact:**
Maintainers cannot tell whether the implementation or documentation is authoritative. Future changes based on the documented tokens will reintroduce visual inconsistency and make review feedback difficult to resolve.

**Example:**
A contributor following the documented “Shell Rule” adds an evergreen sidebar component that visibly conflicts with the current gray application shell.

**Recommended fix:**
Choose the intended system, then update either the tokens/components or `DESIGN.md` so colors, radii, elevations, responsive navigation, and component rules match. Add a lightweight token/documentation check if the document is intended as an enforceable contract.

**Fix scope:** Medium
**Regression risk:** Medium

### [Low] The production CSP still permits all inline scripts

**Location:** `next.config.ts:14-27`, `next.config.test.ts:4-23`
**Status:** Resolved
**Resolution:** Moved CSP generation into Next.js 16 Proxy, added a per-request nonce and `strict-dynamic`, propagated the nonce to `next-themes`, and added unit/browser assertions that production `script-src` excludes `unsafe-inline`.
**Problem:**
The CSP includes `script-src 'unsafe-inline'` in production. Other directives provide useful defense in depth, but this token allows injected inline script to execute and substantially reduces CSP protection against XSS. The configuration test checks framing and objects but does not constrain script policy.

**Impact:**
There is no confirmed injection sink in the reviewed code, so immediate exploitability is low. If an HTML injection is introduced later, the current CSP may not prevent script execution as maintainers could expect.

**Example:**
A future rich-text or partner-description feature accidentally renders attacker-controlled HTML containing an inline script; the current script policy does not block that script.

**Recommended fix:**
Adopt the nonce- or hash-based CSP pattern supported by the installed Next.js version and ensure Analytics receives the required nonce. Extend configuration or browser tests to assert that production `script-src` does not contain `unsafe-inline`.

**Fix scope:** Medium
**Regression risk:** High

### [Low] The shadcn CLI is installed as a production dependency

**Location:** `package.json:16-43`, `package-lock.json`
**Status:** Resolved
**Resolution:** Moved `shadcn` to `devDependencies` with npm so the lockfile and production install graph agree.
**Problem:**
`shadcn` is a code-generation/development CLI, is not imported by application code, and is listed under `dependencies`. Its installed package is about 6.8 MB and pulls development-oriented transitive packages including the MCP SDK and Express into production installs.

**Impact:**
Production dependency installation is larger and has unnecessary supply-chain and advisory surface, even though tree shaking prevents the CLI from entering the browser bundle.

**Example:**
A container using `npm ci --omit=dev` still installs the shadcn CLI and its server/tooling dependencies despite the running application never invoking them.

**Recommended fix:**
Move `shadcn` to `devDependencies` if the CLI is used locally, or remove it if generated components are maintained directly. Recreate the lockfile with the normal package-manager command and verify CI/build behavior.

**Fix scope:** Small
**Regression risk:** Low

### [Low] Unused legacy component CSS creates a second styling system

**Location:** `src/app/globals.css:258-361`, `src/components/ui/button.tsx:6-35`, `src/components/ui/input.tsx:4-18`, `src/components/ui/textarea.tsx:4-14`, `src/components/ui/select.tsx:22-41`
**Status:** Resolved
**Resolution:** Removed the unused `.ui-input`, `.ui-select`, `.ui-textarea`, and `.ui-button-*` global rules after verifying that no source consumer referenced them.
**Problem:**
The `.ui-input`, `.ui-select`, `.ui-textarea`, and `.ui-button-*` rules are not referenced in the source. Active controls instead use Tailwind/CVA component definitions. Because these are hand-written global rules, they remain shipped CSS and encode different radii, focus, hover, and dark-theme behavior.

**Impact:**
The duplicate system adds maintenance ambiguity and a small amount of unused production CSS. A contributor may accidentally revive only part of it and create inconsistent control behavior.

**Example:**
A new button uses `.ui-button-primary` from globals; in dark mode that rule sets white text on the white `--primary-strong` background, unlike the active `Button` component's dark foreground token.

**Recommended fix:**
After verifying no external consumer depends on them, remove the unused global component rules or make them the single documented implementation and migrate the active primitives consistently.

**Fix scope:** Small
**Regression risk:** Low

## Resolution summary

- Resolved: 13 of 14 findings (High 2, Medium 7, Low 4)
- Accepted risk: 1 Critical finding (intentional public/shared access)
- Remaining untriaged findings: 0
- Verification after the authentication and pagination simplifications: lint passed; strict type-check passed; 31 unit/route/component tests passed; 7 PostgreSQL tests remain environment-gated locally; production build passed; 5 Chromium end-to-end workflows passed; the offline production-dependency audit reported 0 known vulnerabilities.
- Production readiness is now explicitly gated by `npm run check:production`, PostgreSQL migration version 2, and `/api/health/ready`.
- Assumption: only disposable demonstration data is stored. Authentication becomes required if that scope changes.

## Original review summary

### Finding counts

- Critical: 1
- High: 2
- Medium: 7
- Low: 4
- Total: 14

### Commands and results

- `git status --short`, `rg --files`, `find`, `rg`, `nl`, and targeted file reads: mapped the repository, architecture, integrations, source, tests, generated build manifests, and documentation. The only pre-existing tracked change was an empty `issues.md` replacing the prior report.
- `npm ls --all`: passed. The displayed unmet packages were platform/feature optional dependencies, not required installation failures.
- `npm run lint`: passed with no warnings.
- `npm run typecheck -- --incremental false`: passed.
- `npm run test`: 26 tests passed; 5 PostgreSQL integration tests were skipped because `TEST_DATABASE_URL` was not set.
- `npm run build`: passed twice with Next.js 16.2.10. All application and API routes compiled; the build also confirmed that `DATABASE_URL` is not validated at build time.
- `npm audit --omit=dev --offline`: reported 0 known vulnerabilities from local audit data. This is not equivalent to a current online audit.
- `npm audit --omit=dev`: could not reach the registry in the sandbox. Escalated registry access was rejected because it would disclose the repository's dependency tree externally.
- Headless Chromium checks at 1440×900 and 390×844: dashboard, list, create/calendar, and detail routes rendered without page errors or failed HTTP responses; no document-level horizontal overflow was found. The delayed-filter check confirmed loss of search focus. The one-month mobile calendar fit inside the viewport.
- Production chunk inspection: the dashboard's two large route-specific chart chunks measured 715,983 bytes raw and approximately 190,798 bytes gzip-compressed.
- Contrast calculations for faint and semantic text tokens in both themes: reviewed combinations were above 4.5:1.
- Impeccable design detector: exited with three advisory design-system drift findings (one undocumented color and two undocumented radii); no blocking detector finding was reported.

### Checks not run

- The PostgreSQL integration suite was not run locally because no `TEST_DATABASE_URL` or disposable PostgreSQL service was available. CI is configured to run it with PostgreSQL 17.
- A current online vulnerability/advisory lookup was not permitted; the offline audit result may be stale.
- No destructive or persistent end-to-end mutation was performed during the review, so create/edit/approve/reject were inspected through code and existing tests rather than changing repository or live data.
- Full NVDA, VoiceOver, keyboard-only, Firefox, Safari, and real-device testing was not available. Browser inspection used Chromium; no axe/Lighthouse dependency is installed.

### Frontend audit health

| Dimension | Score | Key finding |
| --- | ---: | --- |
| Accessibility | 3/4 | Good labels and focus styles; filter focus and landmark semantics need work. |
| Performance | 2/4 | Responsive rendering is sound, but the chart payload and client fetch waterfalls are material. |
| Responsive design | 3/4 | No page-level horizontal overflow; mobile calendar and primary routes fit as intended. |
| Theming | 2/4 | Light/dark tokens work and contrast is healthy, but the implementation diverges from `DESIGN.md`. |
| Anti-patterns | 3/4 | The UI is coherent and task-oriented; duplicated styling rules and panel-heavy treatment remain. |
| **Total** | **13/20** | **Acceptable; significant production work remains.** |

The interface does not present as an extreme AI-pattern collection: it uses familiar operator-console controls, restrained motion, semantic status colors, and consistent typography. The main visual-system concern is that the committed design specification and actual theme have diverged.

### Five issues to fix first

1. Protect all UI and API operations with authentication and authorization, or make the public deployment read-only.
2. Add version preconditions and conflict responses to approve/reject decisions.
3. Persist an append-only, actor-attributed workflow audit log in the same transaction as each state change.
4. Keep list filters mounted during refetches so search never loses focus.
5. Replace ID-only pagination cursors with immutable `(updatedAt, id)` boundaries.

### Suggested implementation order

1. Establish identity, authorization, and the production trust boundary.
2. Design the workflow transition rules, revision contract, and audit-event schema together; implement them transactionally.
3. Correct pagination cursor encoding and add mutation-between-pages integration tests.
4. Fix filter loading behavior and introduce browser tests for the complete operator flows.
5. Add production environment/migration readiness validation.
6. Reduce the dashboard chart payload and server-prefetch initial route data.
7. Correct landmarks, tighten the CSP, and complete browser/accessibility coverage.
8. Reconcile `DESIGN.md`, remove duplicate CSS, and move the shadcn CLI out of production dependencies.

### Reviewed areas that appeared healthy

- Strict TypeScript, ESLint, production compilation, and the runnable test suite all pass.
- Request bodies are streamed with a 32 KiB limit, JSON content types are checked, malformed JSON is normalized, and Zod schemas enforce field and business bounds.
- PostgreSQL queries use tagged parameters, schema constraints protect categories/status/prices/date ranges, and production deliberately avoids a non-durable memory fallback.
- Metadata edits have optimistic concurrency protection and return a useful 409 recovery path.
- Dashboard aggregates use a repeatable-read transaction; list filtering is server-side and page size is bounded.
- UTC input, storage, and display policy is explicit and consistently implemented.
- Error, global-error, not-found, empty, loading, and API-not-found states are present.
- Focus indicators, form labels/error associations, semantic status text, reduced-motion overrides, and reviewed color contrast are sound.
- Mobile routes avoid document-level horizontal overflow; wide data tables scroll within bounded containers, and the date picker adapts to one month.
- Security headers disable framing, MIME sniffing, unnecessary permissions, and framework disclosure; the CSP concern is specifically its inline-script allowance.

### Assumptions and uncertainties

- This review applies the user's requested production deployment standard. The README's explicit decision to keep the pet project publicly mutable is acknowledged, but it does not reduce the production severity of anonymous data access and mutation.
- PostgreSQL-specific concurrency and cursor findings were traced from SQL behavior and existing integration structure; the local PostgreSQL suite could not be executed in this environment.
- Bundle sizes are from the reviewed local production build and may vary slightly by platform or future dependency resolution.
- Browser findings were verified in Chromium development mode using the documented memory repository. Generated `.next` artifacts were rebuilt during checks and remain ignored; `issues.md` is the only tracked file changed.
