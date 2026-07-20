# Remediation status

This file preserves the original production-readiness review below. The implementation pass resolved every actionable finding. Authentication is the sole accepted exception: this is intentionally a public pet project, and the owner explicitly chose to allow anyone to view and mutate data.

| Original finding | Resolution |
| --- | --- |
| Every dashboard and API operation is publicly accessible | Accepted product decision — intentionally public; documented prominently |
| Process-local storage loses data and diverges across instances | Resolved — production requires PostgreSQL; migrations and cross-instance integration tests added |
| Stale edits can silently undo newer review decisions | Resolved — status removed from general edits and optimistic concurrency returns 409 |
| Dashboard presents fabricated and inconsistent data | Resolved — repository-backed aggregate endpoint and consistent chart/queues |
| Critical behavior has no automated coverage or CI | Resolved — Vitest/RTL suites and PostgreSQL-backed GitHub Actions workflow |
| Mutation endpoints accept unbounded bodies and strings without rate limiting | Resolved — 32 KiB streaming limit, field bounds, shared 429 throttling |
| Core text and semantic status colors fail WCAG AA contrast | Resolved — accessible light/dark tokens |
| Form-control labeling is inconsistent and invalid | Resolved — explicit labels and error descriptions |
| Search contradicts its prompt and pollutes browser history | Resolved — partner search, debouncing, and history replacement |
| Malformed JSON is reported as an internal server error | Resolved — standardized 400/413/415 parsing responses |
| Two-month calendar is clipped on small phones | Resolved — responsive month count and bounded scrolling |
| Listing and filtering load and render every offer | Resolved — server filtering and cursor pagination |
| Chart values have no accessible non-visual representation | Resolved — named figure and accessible data table |
| Security headers and framing protection are not configured | Resolved — CSP and defense-in-depth response headers |
| Offer times use ambiguous UTC wall-clock conversion | Resolved — explicit UTC input, storage, and display policy |
| Reduced-motion preferences are ignored | Resolved — global reduced-motion override |
| No application-level error or not-found boundaries | Resolved — route/global boundaries and deal-specific 404 state |
| Locked dependency tree contains an audited PostCSS vulnerability | Resolved — framework upgrade and patched override; clean audit |
| Runtime typography is externally loaded and contradicts documentation | Resolved — self-hosted Geist through `next/font` |

## Original review

[Critical] Every dashboard and API operation is publicly accessible
Location: src/app/api/deals/route.ts:9-33, src/app/api/deals/[id]/route.ts:9-41, src/app/api/deals/[id]/approve/route.ts:5-15, src/app/api/deals/[id]/reject/route.ts:5-15, src/app/dashboard/layout.tsx:5-10
Status: Confirmed
Problem:
There is no authentication, session validation, authorization, or role check on the UI or API routes. Anonymous callers can list, read, create, edit, approve, and reject offers.
Impact:
Anyone who can reach the deployment can view internal commerce data and alter workflow state.
Example:
An anonymous direct POST /api/deals/deal-002/approve returned 200 and changed the offer from pending to approved.
Recommended fix:
Add production authentication and server-side role-based authorization. Verify permissions inside every route handler through a server-only data-access layer; do not rely solely on layout or navigation protection.
Fix scope: Large
Regression risk: High
[High] Process-local storage loses data and diverges across instances
Location: src/mocks/deal-repository.ts:10-25, src/mocks/deal-repository.ts:38-108
Status: Confirmed
Problem:
All mutations are stored in a globalThis array. Data disappears on restart and is neither shared nor coordinated across processes, regions, or serverless instances.
Impact:
Users can receive different records depending on which instance handles a request. Successful production writes are not durable.
Example:
Two production server processes initially returned pending for the same offer. After approving it through one process, that process returned approved while the second still returned pending.
Recommended fix:
Replace the mock repository with a durable database-backed repository. Use transactional writes, database-generated identifiers, migrations, and integration tests covering multiple application instances.
Fix scope: Large
Regression risk: High
[High] Stale edits can silently undo newer review decisions
Location: src/components/deals/edit/deal-edit-form.tsx:35-52, src/components/deals/edit/deal-edit-form.tsx:162-181, src/lib/schemas/deal.ts:65-77, src/mocks/deal-repository.ts:38-60
Status: Confirmed
Problem:
The edit form submits the entire record, including status, without a version or updatedAt precondition. The PATCH endpoint also permits arbitrary status changes, bypassing the dedicated decision routes.
Impact:
Concurrent operators can overwrite each other, and ordinary metadata edits can revert approved or rejected decisions without warning.
Example:
A pending offer was approved, then a stale edit payload containing status: "pending" was submitted. The API returned 200 and changed the status back to pending.
Recommended fix:
Remove workflow status from general edits, enforce a status-transition state machine in dedicated commands, and implement optimistic concurrency using a revision or updatedAt precondition. Return 409 Conflict for stale writes.
Fix scope: Large
Regression risk: High
[High] The operations dashboard presents fabricated and internally inconsistent data
Location: src/app/dashboard/page.tsx:29-149, src/app/dashboard/page.tsx:173-332, src/components/dashboard/overview-chart.tsx:84-160
Status: Confirmed
Problem:
Metrics, audit records, and the pending queue are hard-coded and unrelated to the repository. The dashboard reports eight offers and three pending while the initial API contains six and two respectively. Although the chart supplies approved, pending, and rejected values, it renders only the rejected line while showing a three-series legend.
Impact:
Operators can make decisions based on false queue counts, values, history, and trends. Mutations never update the overview.
Example:
The chart visually shows a red line of rejected counts but labels green “approved” and amber “pending” series that are not rendered.
Recommended fix:
Create real aggregate and audit data sources, fetch them from the repository, and render all declared series. Remove placeholder operational data until it is clearly marked as demo content.
Fix scope: Large
Regression risk: High
[High] Critical behavior has no automated coverage or CI safety net
Location: package.json:5-10, README.md:140-153
Status: Confirmed
Problem:
There is no test script, test configuration, or repository test file. npm test fails because the script does not exist.
Impact:
Authorization, validation, concurrency, filtering, mapping, mutations, and accessibility can regress while lint, types, and build remain green.
Example:
The partner-search defect and stale-status overwrite both pass the current lint, type-check, and production-build gates.
Recommended fix:
Add unit tests for schemas, mappers, and filters; route/repository integration tests for authorization, transitions, malformed input, and conflicts; component tests for forms; and end-to-end tests for create/edit/decision flows. Run them with lint, type-check, and build in CI.
Fix scope: Large
Regression risk: Low
[Medium] Mutation endpoints accept unbounded bodies and strings without rate limiting
Location: src/app/api/deals/route.ts:15-16, src/app/api/deals/[id]/route.ts:22-24, src/lib/schemas/deal.ts:65-77, src/lib/schemas/deal.ts:107-122
Status: Potential risk
Problem:
Routes fully parse request bodies before validation. Title, description, and identifiers have no maximum lengths, and there is no application-level request-size or request-rate control.
Impact:
Large or repeated requests can consume memory, inflate storage, degrade UI rendering, and increase hosting costs. Platform limits may reduce but do not eliminate this risk.
Example:
A client repeatedly submits multi-megabyte descriptions; each request is parsed before rejection or storage.
Recommended fix:
Enforce body-size limits, sensible field maxima, numeric business bounds, authenticated per-user rate limits, and standardized 413/429 responses.
Fix scope: Medium
Regression risk: Medium
[Medium] Core text and semantic status colors fail WCAG AA contrast
Location: src/app/globals.css:22-43, src/app/globals.css:75-106, src/components/ui/badge.tsx:15-22, src/components/ui/button.tsx:19-22
Status: Confirmed
Problem:
Several small-text color combinations are below the required 4.5:1 contrast ratio. Measured light-theme examples include --text-faint at 4.39:1 on white and 3.68:1 on the page background. Success, warning, and danger text on their soft backgrounds measure approximately 3.52:1, 3.49:1, and 3.80:1.
Impact:
Metadata, status badges, helper text, and action labels can be unreadable for low-vision users.
Example:
An operator in light mode may struggle to distinguish pending or approved status text inside its tinted badge.
Recommended fix:
Darken the faint and semantic foreground tokens or lighten their backgrounds, then add automated contrast checks for both themes and every component state.
Fix scope: Small
Regression risk: Low
[Medium] Form-control labeling is inconsistent and invalid
Location: src/components/deals/deals-filters.tsx:23-81, src/components/deals/create/deal-create-form.tsx:86-215, src/components/deals/edit/deal-edit-form.tsx:77-206, src/components/ui/label.tsx:10-19
Status: Confirmed
Problem:
The list’s status and category select triggers have no htmlFor, aria-label, or aria-labelledby; Chromium exposed both as unnamed comboboxes. The create and edit forms obtain names by nesting Radix <Label> elements inside native <label> wrappers—six nested labels per form—which is invalid HTML. Error messages also lack explicit aria-describedby associations.
Impact:
Screen-reader users may not know what list filters control, and form naming/error behavior can vary between browsers and assistive technologies.
Example:
The rendered accessibility tree reported role="combobox", name="" for both list filters.
Recommended fix:
Give every control a stable ID, connect native labels with htmlFor or custom controls with aria-labelledby, remove nested labels, and connect helper/error messages with aria-describedby.
Fix scope: Medium
Regression risk: Low
[Medium] Search contradicts its prompt and pollutes browser history
Location: src/components/deals/deals-filters.tsx:30-35, src/lib/deal-filters.ts:51-68, src/components/deals/deals-view.tsx:36-57
Status: Confirmed
Problem:
The input promises “search title or partner,” but filtering checks only deal.title. Every keystroke also calls router.push, creating a separate history entry and route navigation.
Impact:
Valid searches return false empty states, Back navigation cycles through individual keystrokes, and typing causes unnecessary navigation work.
Example:
Searching for “Northstar” returned zero rows even though “Northstar Roasters” is visible as a partner. Typing three intermediate values increased history length from one to four.
Recommended fix:
Include normalized partnerName in the search predicate. Debounce URL synchronization and use router.replace for transient typing, reserving push for committed filter changes if desired.
Fix scope: Small
Regression risk: Low
[Medium] Malformed JSON is reported as an internal server error
Location: src/app/api/deals/route.ts:15-22, src/app/api/deals/[id]/route.ts:22-30
Status: Confirmed
Problem:
request.json() executes outside error handling. Invalid JSON throws before Zod validation and becomes an empty 500 response.
Impact:
Client mistakes appear as server failures, error responses are inconsistent, and logs receive avoidable stack traces.
Example:
Posting { with Content-Type: application/json produced 500 with an empty body; the server logged a JSON SyntaxError.
Recommended fix:
Catch parse errors, verify content type where appropriate, and return a consistent 400 Bad Request error envelope before schema validation.
Fix scope: Small
Regression risk: Low
[Medium] The two-month calendar is clipped on small phones
Location: src/components/ui/date-time-range-picker.tsx:192-221, src/components/ui/calendar.tsx:29-86
Status: Confirmed
Problem:
The popover always renders two months. They stack vertically on mobile, but the popover has no viewport-height constraint or internal scrolling.
Impact:
Dates and month navigation can be positioned outside the viewport, preventing operators from completing the form.
Example:
At 375×667, the open popover measured 642px high and was positioned from top: -292px to bottom: 350px, clipping nearly half of it with no internal scroll area.
Recommended fix:
Render one month at small breakpoints or add a collision-aware maximum height and accessible scrolling. Test keyboard operation and short mobile viewports.
Fix scope: Medium
Regression risk: Medium
[Medium] Listing and filtering load and render every offer
Location: src/app/api/deals/route.ts:9-12, src/components/deals/deals-view.tsx:27-31, src/components/deals/deals-view.tsx:75-92, src/components/deals/deals-table.tsx:78-159
Status: Potential risk
Problem:
The list API returns the full store, and search/filtering/rendering are entirely client-side. There is no pagination, result cap, or server-side filtering.
Impact:
Response size, validation cost, React rendering, and browser memory grow linearly with the dataset.
Example:
A production catalog with tens of thousands of offers would be downloaded and rendered before the operator could inspect the first page.
Recommended fix:
Add server-side query parsing, filtering, sorting, and cursor pagination with total/page metadata. Include normalized query parameters in React Query keys.
Fix scope: Large
Regression risk: High
[Medium] Chart values have no accessible non-visual representation
Location: src/components/dashboard/overview-chart.tsx:84-160, src/app/dashboard/page.tsx:213-235
Status: Confirmed
Problem:
The SVG chart has no accessible title, summary, table, or keyboard-accessible data points. Values are available only through a mouse tooltip.
Impact:
Screen-reader and keyboard-only users cannot determine the monthly values or trend.
Example:
The accessibility tree exposes axis and legend text but not the numeric monthly series represented by the line.
Recommended fix:
Wrap the visualization in a named figure and provide an adjacent accessible data table or textual summary. Treat the tooltip as an enhancement rather than the only value channel.
Fix scope: Medium
Regression risk: Low
[Medium] Security headers and framing protection are not configured
Location: next.config.ts:3-5
Status: Potential risk
Problem:
The application does not configure CSP, frame-ancestors, content-type sniffing protection, referrer policy, or permissions policy, and it exposes X-Powered-By.
Impact:
A self-hosted deployment lacks defense-in-depth against clickjacking, script injection, and unnecessary browser capabilities. Hosting platforms may supply only some of these controls.
Example:
An authenticated review screen could be embedded in a hostile iframe and positioned to trick an operator into clicking a decision control.
Recommended fix:
Define tested production headers, including a CSP with frame-ancestors, X-Content-Type-Options, Referrer-Policy, and a scoped Permissions-Policy; disable poweredByHeader. Account for Analytics and font policy when constructing CSP.
Fix scope: Medium
Regression risk: Medium
[Medium] Offer times use ambiguous UTC wall-clock conversion
Location: src/lib/mappers/deal.ts:68-96, src/lib/mappers/deal.ts:101-113, src/components/deals/edit/deal-edit-form.tsx:210-241
Status: Potential risk
Problem:
ISO timestamps are converted to form values by slicing off the timezone, and submitted values have Z appended directly. The create form does not tell users that entered times are interpreted as UTC.
Impact:
Operators may enter local wall-clock times that publish several hours earlier or later than intended. DST and multi-region operation would increase ambiguity.
Example:
A Baku operator choosing 09:00 expecting local time stores 09:00Z, corresponding to 13:00 local time.
Recommended fix:
Define the product’s timezone policy. Either label and display all controls explicitly as UTC, or convert between a selected IANA timezone and stored UTC while showing the applicable zone and offset.
Fix scope: Medium
Regression risk: Medium
[Low] Reduced-motion preferences are ignored
Location: src/app/globals.css:176-391, src/components/ui/skeleton.tsx:4-9, src/components/deals/detail/deal-status-actions.tsx:81-100, src/components/ui/popover.tsx:27-29
Status: Confirmed
Problem:
Skeletons pulse, loaders spin, and popovers animate without any prefers-reduced-motion override, despite the product documentation explicitly requiring reduced-motion-friendly behavior.
Impact:
Motion-sensitive users cannot suppress nonessential animation.
Example:
A user with reduced motion enabled still receives pulsing loading placeholders and animated popover transitions.
Recommended fix:
Add a global reduced-motion rule and motion-safe variants that disable or simplify nonessential animation while preserving state feedback.
Fix scope: Small
Regression risk: Low
[Low] There are no application-level error or not-found boundaries
Location: src/app/layout.tsx:12-22, src/components/deals/detail/deal-detail-view.tsx:19-27, src/components/deals/detail/deal-detail-error.tsx:6-31
Status: Confirmed
Problem:
The App Router contains no error.tsx, global-error.tsx, or custom not-found.tsx. Missing deal IDs are handled as a generic retryable client error rather than a not-found state.
Impact:
Unexpected render failures fall back to framework UI, and users may repeatedly retry records that definitively do not exist.
Example:
Opening an invalid deal URL displays “could not be loaded” with Retry instead of a specific 404 recovery path.
Recommended fix:
Add accessible route/global error boundaries and a not-found page. Distinguish 404 API responses from transient failures in the client.
Fix scope: Medium
Regression risk: Low
[Low] The locked dependency tree contains an audited PostCSS vulnerability
Location: package-lock.json:8079-8090, package-lock.json:8142-8169
Status: Potential risk
Problem:
npm audit reports two moderate findings for Next.js’s bundled PostCSS 8.4.31 under GHSA-qx2v-qp2m-jg93. The application does not process user-supplied CSS, so direct exploitability appears limited.
Impact:
The repository cannot pass a clean dependency audit and could become exploitable if untrusted CSS processing is introduced.
Example:
A future user-controlled CSS feature could reach the vulnerable PostCSS stringify behavior.
Recommended fix:
Track a Next.js release that upgrades its internal PostCSS to a patched version and upgrade with tests. Do not run the suggested npm audit fix --force, which proposed an invalid breaking downgrade to Next 9.
Fix scope: Medium
Regression risk: Medium
[Low] Runtime typography is externally loaded and contradicts the design documentation
Location: src/app/globals.css:1-15, src/app/globals.css:172-190, DESIGN.md:25-55, DESIGN.md:148-164
Status: Confirmed
Problem:
The CSS requests three Google font families at runtime but uses JetBrains Mono for both sans and mono roles. The design system specifies Geist and a one-sans-family interface. The rendered dashboard consequently uses monospace throughout.
Impact:
The extra external request adds a privacy/reliability dependency and font swap, while stale documentation makes future UI work inconsistent. The loaded JetBrains font was approximately 31KB compressed in the browser trace.
Example:
If Google Fonts is blocked, the entire application changes metrics to a platform-dependent monospace fallback despite the documented Geist design.
Recommended fix:
Choose the actual type system, align DESIGN.md, and self-host only the required family through next/font or local assets.
Fix scope: Small
Regression risk: Low
