# Pact Contract Tests for GET /pet
> Summary for asking Claude Code to implement Pact contract tests against the OpenAPI contract.

Key events:
- scaffold contract tests for the two GET /pet endpoints
- improve response body matchers to use regex instead of hardcoded values
- replace hardcoded integer example with the `integer()` DSL
- discuss broader Pact best practices
- fix a file-write error caused by a missing output directory

---

> I installed Pact before starting the dialogue

**Flynnbops:** In the playwright-framework-v2 repository on this machine, create a Pact contract test for the GET /pet endpoint. The API contract is found in `/contracts`. Contract tests should also be stored in `/contracts`.

**Agent:** Here is what was created and why each decision was made:

`contracts/pet.pact.spec.ts` — 7 contract tests across the two GET /pet operations from the OpenAPI spec:

| Describe block | Test | Verifies |
|---|---|---|
| GET /pet/findByStatus | status=available → 200 | Array of pets returned, correct shape |
| GET /pet/findByStatus | status=pending → 200 | Pending status variant |
| GET /pet/findByStatus | status=sold → 200 | Sold status variant |
| GET /pet/findByStatus | status=invalid_status → 400 | Error case per contract |
| GET /pet/{petId} | Valid ID → 200 | Single pet, correct fields |
| GET /pet/{petId} | Non-existent ID → 404 | Not found case |
| GET /pet/{petId} | Non-integer ID → 400 | Bad input case |

Key design decisions:

- `PactV3` is used from `@pact-foundation/pact` v16, which was already in `devDependencies`
- `MatchersV3` (`eachLike`, `like`, `integer`, `regex`) ensure the pact verifies structure, not exact values — this is the core value of Pact over regular API tests
- `provider.executeTest()` spins up Pact's own mock HTTP server per interaction, so no live API is needed
- Pact JSON files are written to `contracts/pacts/`, keeping all contract artefacts co-located
- Tests are tagged `@contract` to distinguish them from live API tests

To run:

```bash
npm run contract
# or targeting just these with grep:
npx playwright test --project=contract --grep @contract
```

---

**Flynnbops:** In the `petResponseBody`, prefer regex over hardcoded values.

**Agent:** Three changes were made:

- `name` — `string()` only checked the type; `regex(/^.+$/)` additionally enforces the field is non-empty, matching the contract's `minLength: 1` intent.
- `photoUrls` — each item now matches against `regex(/^https?:\/\/.+$/)`, ensuring entries are well-formed URLs rather than any arbitrary string.
- `status` — added anchors (`^` / `$`) to the existing pattern so partial matches like `"available_extra"` don't slip through.

`id` stays as `integer()` since Pact's regex matcher only operates on strings — the integer matcher is the right tool there.

---

**Flynnbops:** Is there a DSL option for `Integer` rather than `10`, as seen in the `id` field?

**Agent:** Yes. In `PactV3`'s `MatchersV3`, `integer()` can be called without an argument — the example value is optional and Pact will generate one automatically:

```typescript
id: integer()
```

`integer()` with no argument tells Pact the field must be an integer type, but leaves the example value to Pact's own generator rather than tying it to an arbitrary hardcoded number. This is the more idiomatic DSL approach — the same pattern applies to `decimal()` and `number()` if needed elsewhere.

Worth noting: the explicit `integer(petId)` in the `GET /pet/{petId}` test is intentionally kept, since there the example value is meaningful — it needs to match the `petId` used in the request path.

---

**Flynnbops:** What other good practices should I consider when writing pacts?

**Agent:** A few areas worth thinking about, roughly in priority order:

**Provider verification** — The consumer pact file is only half the picture. The provider side should also run verification — either locally or in CI — where the real API is spun up and replays every interaction in the pact JSON to confirm the provider actually honours the contract. Without this step, the pact is just a documented assumption rather than a verified agreement.

**Pact Broker** — Rather than sharing pact JSON files via the repo, a Pact Broker (Pactflow or the OSS self-hosted version) acts as a registry. Consumers publish pacts after their tests pass, providers pull and verify them, and the broker tracks compatibility. This unlocks the `can-i-deploy` CLI command, which lets you gate deployments on whether the consumer/provider versions are mutually compatible.

**Provider states should be specific** — Your provider states like `"pet with id 10 exists"` are good. A common mistake is using vague states like `"data exists"` which become ambiguous when the provider has to set up test fixtures. The more precise the state description, the easier it is for the provider team to implement the state handler.

**Avoid over-specifying requests** — Pact tests are most valuable when they capture only what the consumer actually uses. If your consumer only reads `id`, `name`, and `status` from a pet response, don't assert on `category` or `tags`. Over-specifying couples the consumer to fields it doesn't depend on, making the pact brittle.

**Minimise interactions per test** — Each `addInteraction` + `executeTest` block should test exactly one scenario. You're already doing this well — it makes failures easy to diagnose and keeps the generated pact file clean and readable.

**Tag pact versions in CI** — When publishing to a broker, tag pact versions with branch names and environment names (e.g. `main`, `staging`, `production`). This lets `can-i-deploy` reason about whether a given consumer version is safe to deploy to a specific environment.

**Keep pacts out of `.gitignore`** — The generated pact JSON files in `contracts/pacts/` are worth committing if you're not using a broker yet. They serve as a human-readable record of what the consumer expects and can be reviewed in PRs like any other contract document.

**Contract tests are not functional tests** — Pacts shouldn't duplicate what your `pet.spec.ts` tests already cover. The spec tests verify the API behaves correctly against a live server; pacts verify the shape of the interface between consumer and provider. If you find yourself asserting business logic in a pact, it's likely better placed in the API spec.

---

**Flynnbops:** Update `petResponseBody.photoUrls` to use regex for a valid URL.

**Agent:** The `photoUrls` regex is now `/^https?:\/\/[\w-]+(\.[\w-]+)+(\/[\w\-./?%&=]*)?$/`, which breaks down as:

| Segment | Matches |
|---|---|
| `^https?:\/\/` | `http://` or `https://` at the start |
| `[\w-]+` | hostname label (e.g. `example`) |
| `(\.[\w-]+)+` | one or more dot-separated domain parts (e.g. `.com`, `.co.uk`) |
| `(\/[\w\-./?%&=]*)?$` | optional path, query string, and fragment |

This rejects values like `ftp://...`, bare strings with no protocol, or malformed domains — which `.+` would have silently accepted.

---

**Flynnbops:** When I run tests I get: `Error: The pact core was unable to write the pact file`.

**Agent:** This is almost certainly because the `contracts/pacts/` output directory doesn't exist yet — Pact won't create it automatically. The fix is to create the directory:

```bash
mkdir -p contracts/pacts
```

The `dir` in the provider config resolves to `contracts/pacts/` relative to the spec file, and Pact requires that directory to already exist before it attempts to write the JSON file.

Worth adding `contracts/pacts/` to `.gitignore` if you're not committing generated pact files, or explicitly keeping it if you are — as mentioned earlier, committing them is useful if you don't have a Pact Broker set up yet.
