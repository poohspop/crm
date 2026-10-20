# Security validation

The five reviewed findings are addressed on `fix/security-privacy-controls`.

Next.js is pinned to 16.3.8. The Bun lockfile includes matching Next.js binaries and updated sharp dependencies.
The [upstream advisory](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4) lists 16.3.3 as the first fixed 16.x release.

## Rechecked findings

| Finding | Evidence and fix |
| --- | --- |
| Next.js AVIF advisory | Both app and UI package copies now use 16.3.8. The lockfile removes 16.2.12 and 16.3.0. |
| PostgreSQL exposure | Compose now binds only to IPv4 loopback and rejects an absent or empty password. |
| Shared settings authorization | All three mutations check owner or admin status before writes, model catalog requests, or key verification. |
| Telemetry default | Server and marketing telemetry require separate explicit consent. Server disable flags retain precedence. |
| Agent email access | All three history readers enforce an operator policy before email queries. Missing consent disables access. |

The email finding concerns stored, CRM-linked full message bodies. This review does not establish unrestricted provider-wide agent access.
Read `docs/ai-privacy.md` for existing-data limits and the database password transition.

## Local verification

- `bun install --frozen-lockfile --ignore-scripts` passes.
- `bun run check-types` passes.
- `bun run lint` passes with existing repository warnings.
- `bun run lint:slop` passes.
- `bun run test` passes: 1,170 tests, zero failures.
- `bun run --filter=app build` passes.
- `git diff --check` passes.

Tests use a disposable PostgreSQL 17 cluster on IPv4 loopback, with a random password and a separate `_test` database.
No production database, real mailbox, live model, or deployment participates in verification.
The marketing consent value participates in the build cache key. Changing consent requires an app rebuild.

Docker is unavailable locally. Compose validation covers the configuration diff; no Docker container starts during verification.
The fork contains only `release`, so the draft PR targets that branch.
Inherited workflows refer to `main`. Review that automation before enabling it on the fork.
Median tooling and a project binding are absent, so no Median task ID accompanies this change.

## Additional dependency audit findings

`bun audit --json` reports the following additional advisories on 2026-10-20.
This audit matches dependency versions. It does not establish exploitability in this application.
These transitive findings remain outside the five-item remediation scope.

| Package | Severity | Advisory |
| --- | --- | --- |
| `@modelcontextprotocol/sdk` | high | [MCP TypeScript SDK: OAuth client could send credentials to an authorization server chosen by the MCP server](https://github.com/advisories/GHSA-6qxp-vccf-f47h) |
| `@xmldom/xmldom` | moderate | [xmldom: XML fragment injection via invalid EntityReference.nodeName during requireWellFormed serialization](https://github.com/advisories/GHSA-6gmq-8vp8-gcm6) |
| `@xmldom/xmldom` | high | [xmldom: Element name injection via createElement() bypasses requireWellFormed](https://github.com/advisories/GHSA-w2rr-34g9-rvrj) |
| `@xmldom/xmldom` | high | [xmldom: Attribute name injection via setAttribute() bypasses requireWellFormed](https://github.com/advisories/GHSA-4w3w-2rp5-g8jm) |
| `@xmldom/xmldom` | high | [xmldom: Processing Instruction Target Injection Bypasses requireWellFormed](https://github.com/advisories/GHSA-c7q8-3ch8-vqpv) |
| `@xmldom/xmldom` | high | [xmldom: DocType `name` Injection Bypasses requireWellFormed](https://github.com/advisories/GHSA-27p8-2357-5qqv) |
| `@xmldom/xmldom` | moderate | [xmldom: Parser silently accepts a not-well-formed end tag whose name is followed by a line break and trailing content](https://github.com/advisories/GHSA-6h8r-xr42-gp59) |
| `@xmldom/xmldom` | high | [xmldom: Quadratic-time attribute deduplication](https://github.com/advisories/GHSA-8344-3jmq-59r6) |
| `@xmldom/xmldom` | high | [xmldom: End-tag Whitespace-Trim Regex ReDoS — quadratic backtracking in the 0.8.x end-tag parser](https://github.com/advisories/GHSA-x4fp-j954-r2f4) |
| `@xmldom/xmldom` | high | [xmldom: Quadratic-memory consumption](https://github.com/advisories/GHSA-965w-775f-mr7g) |
| `@xmldom/xmldom` | high | [xmldom: Quadratic-time parsing via the malformed-input recovery path — `parseElementStartPart` re-scan and `normalize()` adjacent-text merge](https://github.com/advisories/GHSA-93r5-fhx6-vmg9) |
| `better-auth` | moderate | [Better Auth: OAuth callback accepts mismatched `state` when cookie-backed state storage is used without PKCE](https://github.com/advisories/GHSA-wxw3-q3m9-c3jr) |
| `better-auth` | low | [Better Auth: Stale sessions persist after user deletion across admin, anonymous, and SCIM flows](https://github.com/advisories/GHSA-2vg6-77g8-24mp) |
| `better-auth` | high | [Better Auth has insecure cryptographic defaults in oidcProvider: alg=none advertised and plain PKCE accepted by default](https://github.com/advisories/GHSA-9h47-pqcx-hjr4) |
| `better-auth` | high | [Better Auth has stored XSS in the auth-server origin via javascript: redirect_uri in oidc-provider and mcp](https://github.com/advisories/GHSA-86j7-9j95-vpqj) |
| `better-auth` | high | [@better-auth/oauth-provider's OAuth authorization-code grant allows concurrent redemption when two token requests race the find-then-delete primitive](https://github.com/advisories/GHSA-7w99-5wm4-3g79) |
| `better-auth` | high | [Better Auth: OAuth refresh-token rotation forks the token family on concurrent redemption](https://github.com/advisories/GHSA-392p-2q2v-4372) |
| `better-auth` | high | [Better Auth has an account takeover issue via OAuth auto-link to unverified pre-registered email](https://github.com/advisories/GHSA-g38m-r43w-p2q7) |
| `better-auth` | high | [Better Auth vulnerable to unauthorized invitation acceptance via unverified email match in organization plugin](https://github.com/advisories/GHSA-fmh4-wcc4-5jm3) |
| `better-auth` | critical | [Better Auth: OAuth refresh-token replay via missing client authentication on oidc-provider and mcp plugins](https://github.com/advisories/GHSA-pw9m-5jxm-xr6h) |
| `better-auth` | high | [Better Auth: Account takeover via pre-account hijacking on magic-link and email-OTP sign-in](https://github.com/advisories/GHSA-qq9h-g4jm-xgf3) |
| `brace-expansion` | high | [brace-expansion: DoS via uncontrolled recursion on nested brace groups causing stack exhaustion](https://github.com/advisories/GHSA-qhr7-859c-m2p7) |
| `brace-expansion` | high | [brace-expansion: DoS via uncontrolled recursion in parseCommaParts causing stack exhaustion](https://github.com/advisories/GHSA-6j4f-fj2g-mc7p) |
| `brace-expansion` | moderate | [brace-expansion: Quadratic-time expansion of the `{a},b}` rewrite causes CPU denial of service](https://github.com/advisories/GHSA-q2hr-2g5m-vwhr) |
| `braces` | high | [braces vulnerable to stack-exhaustion denial of service through deeply nested patterns](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) |
| `deepmerge-ts` | high | [DeepmergeTS has stack exhaustion when merging recursive object graphs](https://github.com/advisories/GHSA-ggr8-5vv4-36mx) |
| `dompurify` | moderate | [DOMPurify: IN_PLACE hook removal leaves a detached subtree executable, causing XSS](https://github.com/advisories/GHSA-55q2-fjhq-7xh7) |
| `dompurify` | low | [DOMPurify: IN_PLACE returns a force-removed rawtext root whose text carries attacker markup — pure HTML reparse executes](https://github.com/advisories/GHSA-6688-9rhm-gjv2) |
| `drizzle-orm` | high | [Drizzle ORM has SQL injection via improperly escaped SQL identifiers](https://github.com/advisories/GHSA-gpj5-g38j-94v9) |
| `fast-uri` | high | [fast-uri vulnerable to host confusion via skipped IDN canonicalization on scheme-relative references](https://github.com/advisories/GHSA-5jgf-p345-68v8) |
| `fast-uri` | high | [fast-uri vulnerable to server-side request forgery via malformed IPv6 normalization](https://github.com/advisories/GHSA-f65p-4m7j-42xc) |
| `fast-uri` | high | [fast-uri vulnerable to server-side request forgery via repeated hostname percent-decoding](https://github.com/advisories/GHSA-fph4-wmhf-6fwf) |
| `fast-uri` | high | [fast-uri vulnerable to host confusion via percent-encoded scheme normalization](https://github.com/advisories/GHSA-jqff-g426-hqxp) |
| `fast-uri` | high | [fast-uri vulnerable to authority injection via an unvalidated port in serialize](https://github.com/advisories/GHSA-qw65-cvwx-89v3) |
| `fast-uri` | moderate | [fast-uri vulnerable to inconsistent host case normalization via percent-encoded octets](https://github.com/advisories/GHSA-hrr3-gc8f-f4qj) |
| `hono` | moderate | [Hono: ReDoS in CORS middleware via Access-Control-Request-Headers](https://github.com/advisories/GHSA-8j4g-w8fx-2239) |
| `hono` | moderate | [Hono: `memo()` retains SSR output across requests, leading to cross-user data disclosure](https://github.com/advisories/GHSA-f23p-vx2j-j53r) |
| `hono` | low | [Hono: Proxy Helper does not remove response headers listed in the `Connection` header](https://github.com/advisories/GHSA-79qm-7rj5-m7r9) |
| `hono` | moderate | [Hono: Algorithmic Complexity DoS in Language Middleware](https://github.com/advisories/GHSA-54fx-42gc-7vw4) |
| `hono` | moderate | [Hono: Incomplete fix for CVE-2026-39408: `toSSG()` still writes files outside the output directory](https://github.com/advisories/GHSA-gqvv-2mrq-wpjv) |
| `hono` | moderate | [Hono: Unbounded dot-notation nesting in `parseBody()` can cause memory exhaustion](https://github.com/advisories/GHSA-g6gw-c38x-mqfc) |
| `hono` | moderate | [Hono: Query parser reads parameters after the URL fragment, causing cache-key and proxy interpretation differentials](https://github.com/advisories/GHSA-crvj-82cr-hjcx) |
| `hono` | moderate | [hono/jsx renders plain strings unescaped in boundary components, leading to XSS](https://github.com/advisories/GHSA-hxh3-vqpv-xpqv) |
| `hono` | moderate | [Hono: `serveStatic` decodes the request path a second time, leading to bypass of middleware on static paths](https://github.com/advisories/GHSA-5r4p-p66f-jhc7) |
| `ip-address` | moderate | [ip-address: Address6.isLinkLocal() recognizes fe80::/64 rather than fe80::/10, allowing SSRF and trust-boundary bypass to on-link hosts](https://github.com/advisories/GHSA-rpw4-54j3-4h4q) |
| `ip-address` | moderate | [ip-address: no classifier recognizes the NAT64 local-use range 64:ff9b:1::/48, allowing SSRF and trust-boundary bypass](https://github.com/advisories/GHSA-2vr4-cq9g-pvrc) |
| `ip-address` | moderate | [ip-address: isInSubnet() and isHostInSubnet() compare addresses of different families as if they shared an address space, allowing an allowlist check to admit an address outside its range](https://github.com/advisories/GHSA-j6r3-76f7-8jcv) |
| `ip-address` | moderate | [ip-address: Address6 builds a parse diagnostic proportional to the input with no length bound, allowing a single long string to stall or crash the process](https://github.com/advisories/GHSA-h3mg-xc3c-68pw) |
| `js-yaml` | high | [JS-YAML: Quadratic CPU consumption in !!omap resolution (3.x and 4.x) — CVE-2026-59870 fix not backported](https://github.com/advisories/GHSA-5p4m-2wfm-xmqj) |
| `js-yaml` | high | [js-yaml: maxTotalMergeKeys does not limit CPU use for empty merge sources](https://github.com/advisories/GHSA-2883-xcg3-v3hh) |
| `js-yaml` | moderate | [js-yaml: maxTotalMergeKeys does not limit CPU use for empty merge sources](https://github.com/advisories/GHSA-r3ph-w7gj-g6xm) |
| `katex` | low | [KaTeX: Existing prototype pollution can bypass trust restrictions](https://github.com/advisories/GHSA-238p-pmpm-9mq7) |
| `lodash` | moderate | [Lodash has Prototype Pollution Vulnerability in `_.unset` and `_.omit` functions](https://github.com/advisories/GHSA-xxjr-mmjv-4gpg) |
| `lodash` | high | [lodash vulnerable to Code Injection via `_.template` imports key names](https://github.com/advisories/GHSA-r5fr-rjxr-66jc) |
| `lodash` | moderate | [lodash vulnerable to Prototype Pollution via array path bypass in `_.unset` and `_.omit`](https://github.com/advisories/GHSA-f23m-r3pf-42rh) |
| `mermaid` | low | [Mermaid configuration APIs allow prototype pollution](https://github.com/advisories/GHSA-c4c3-pg64-4m4v) |
| `mermaid` | moderate | [Mermaid allows CSS injection applying to sibling elements of the diagram](https://github.com/advisories/GHSA-6x64-9x62-f2gx) |
| `mermaid` | moderate | [Mermaid Architecture diagrams are vulnerable to prototype pollution](https://github.com/advisories/GHSA-3rrr-jr9j-h3q3) |
| `mermaid` | moderate | [Mermaid XY Charts are vulnerable to an infinite loop DoS](https://github.com/advisories/GHSA-2v8p-3f2j-5mp7) |
| `mermaid` | moderate | [Mermaid radar diagrams are vulnerable to DoS](https://github.com/advisories/GHSA-rhh3-jpg6-66xh) |
| `multer` | high | [multer vulnerable to Denial of Service via crafted multipart field names](https://github.com/advisories/GHSA-wc9g-mqfw-jrwm) |
| `multer` | high | [multer vulnerable to Denial of Service via file descriptor leak on aborted uploads](https://github.com/advisories/GHSA-qfvm-cv95-jqjf) |
| `multer` | low | [multer vulnerable to file size limit bypass via async fileFilter race condition](https://github.com/advisories/GHSA-qvfw-j98x-7q72) |
| `multer` | high | [multer vulnerable to Denial of Service via oversized array index in field names](https://github.com/advisories/GHSA-535w-7cp7-47q4) |
| `multer` | moderate | [multer vulnerable to Denial of Service via orphaned disk writes on aborted uploads](https://github.com/advisories/GHSA-3pph-fpjx-jg34) |
| `mysql2` | moderate | [MySQL2: Unbounded zlib inflate in compressed MySQL protocol handler allows decompression-bomb DoS](https://github.com/advisories/GHSA-rgwj-5xj2-c3m3) |
| `mysql2` | high | [MySQL2: Auth Plugin Downgrade to mysql_clear_password Leaks Plaintext Credentials](https://github.com/advisories/GHSA-3f6p-5ww8-9rcr) |
| `nanoid` | high | [nanoid: custom generators can loop indefinitely when size is zero](https://github.com/advisories/GHSA-2v37-7h3g-55p8) |
| `postcss-selector-parser` | moderate | [PostCSS: Quadratic complexity in flat selector parsing allows CPU exhaustion](https://github.com/advisories/GHSA-rj75-hqrm-r3gf) |
| `proxy-addr` | critical | [proxy-addr vulnerable to IP spoofing via IPv4-mapped IPv6 trust subnet](https://github.com/advisories/GHSA-jqcg-44mw-7w3h) |
| `qs` | moderate | [qs array-limit bypass via bracket-key comma parsing](https://github.com/advisories/GHSA-x5fp-wj9c-mxmx) |
| `qs` | moderate | [qs: Denial of Service via Attacker Controlled isBuffer](https://github.com/advisories/GHSA-4mjr-xmp4-gh2g) |
| `shell-quote` | critical | [shell-quote: `quote()` command injection via a line terminator in a token after a `{ comment }` token](https://github.com/advisories/GHSA-pqg4-j6r4-53mv) |
| `smol-toml` | moderate | [smol-toml: Quadratic-time parse() from parseKey rescanning to end of document on each key line](https://github.com/advisories/GHSA-r4xh-jqrq-34v2) |
| `source-map-js` | high | [source-map-js allows event-loop denial of service through indexed source-map section offsets](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) |
| `sprintf-js` | moderate | [sprintf-js vulnerable to denial of service through unbounded precision specifiers](https://github.com/advisories/GHSA-hp3w-g68c-fv3c) |
| `undici` | moderate | [undici vulnerable to Denial of Service via unhandled error in WebSocket permessage-deflate decompression](https://github.com/advisories/GHSA-3wwx-pv8p-q78v) |
| `undici` | moderate | [undici vulnerable to Denial of Service via unhandled error in WebSocket permessage-deflate decompression](https://github.com/advisories/GHSA-3wwx-pv8p-q78v) |
| `undici` | moderate | [undici vulnerable to Denial of Service via unhandled error in WebSocket permessage-deflate decompression](https://github.com/advisories/GHSA-3wwx-pv8p-q78v) |
| `undici` | moderate | [undici vulnerable to Denial of Service via orphaned RetryHandler response body](https://github.com/advisories/GHSA-pmjh-fq2x-6v4x) |
| `undici` | moderate | [undici vulnerable to Denial of Service via orphaned RetryHandler response body](https://github.com/advisories/GHSA-pmjh-fq2x-6v4x) |
| `undici` | low | [undici vulnerable to downstream response splitting via retry interceptor](https://github.com/advisories/GHSA-r53p-7pc4-xj5r) |
| `undici` | low | [undici vulnerable to downstream response splitting via retry interceptor](https://github.com/advisories/GHSA-r53p-7pc4-xj5r) |
| `undici` | low | [undici vulnerable to downstream response splitting via retry interceptor](https://github.com/advisories/GHSA-r53p-7pc4-xj5r) |
| `undici` | high | [undici vulnerable to Denial of Service via unrequested WebSocket subprotocol](https://github.com/advisories/GHSA-rfgv-xxqx-mfg5) |
| `undici` | high | [undici vulnerable to Denial of Service via unrequested WebSocket subprotocol](https://github.com/advisories/GHSA-rfgv-xxqx-mfg5) |
| `undici` | high | [undici vulnerable to Denial of Service via unrequested WebSocket subprotocol](https://github.com/advisories/GHSA-rfgv-xxqx-mfg5) |
| `undici` | moderate | [undici vulnerable to Denial of Service via unbounded decompression of compressed responses](https://github.com/advisories/GHSA-3xpg-4rpp-hhhm) |
| `undici` | moderate | [undici vulnerable to Denial of Service via unbounded decompression of compressed responses](https://github.com/advisories/GHSA-3xpg-4rpp-hhhm) |
| `undici` | moderate | [undici vulnerable to cross-user cookie disclosure via Set-Cookie caching in shared caches](https://github.com/advisories/GHSA-2jfj-6hjv-fm6j) |
| `undici` | moderate | [undici vulnerable to cross-user cookie disclosure via Set-Cookie caching in shared caches](https://github.com/advisories/GHSA-2jfj-6hjv-fm6j) |
| `undici` | low | [undici vulnerable to response truncation via oversized chunked responses in the dump interceptor](https://github.com/advisories/GHSA-2gqq-gqf2-x968) |
| `undici` | low | [undici vulnerable to response truncation via oversized chunked responses in the dump interceptor](https://github.com/advisories/GHSA-2gqq-gqf2-x968) |
| `undici` | high | [undici vulnerable to TLS certificate validation bypass via dropped connect options in BalancedPool](https://github.com/advisories/GHSA-w293-vg96-wgc3) |
| `undici` | high | [undici vulnerable to TLS certificate validation bypass via dropped connect options in BalancedPool](https://github.com/advisories/GHSA-w293-vg96-wgc3) |
| `undici` | low | [undici vulnerable to caching and replay of unsafe HTTP method responses](https://github.com/advisories/GHSA-8436-99hf-9mmv) |
| `undici` | low | [undici vulnerable to caching and replay of unsafe HTTP method responses](https://github.com/advisories/GHSA-8436-99hf-9mmv) |
| `undici` | moderate | [undici vulnerable to Denial of Service via WebSocketStream unclean close](https://github.com/advisories/GHSA-rx4f-c7p8-82vq) |
| `undici` | moderate | [undici vulnerable to Denial of Service via WebSocketStream unclean close](https://github.com/advisories/GHSA-rx4f-c7p8-82vq) |
