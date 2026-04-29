# tden-skills

> Status: **Phase A2.6** — first 5 official manifests + JSON schema. Phase B opens for community PRs and adds chain-anchored manifest hashes.

A marketplace of pre-baked TDEN scene-package recipes. Each "Skill" is a JSON manifest that an RP can fork into the TDEN RP Toolkit's Designer page, customise, and submit to the Portal — saving them the design work of figuring out which fields and what justifications fit a vertical.

Think: Browser extensions, but for identity scenarios.

## Why this repo exists

TDEN is horizontal infrastructure (OIDC IdP + scene packages + consent ledger). We're not banking experts, healthcare experts, or e-commerce experts. The Skills marketplace is how we let domain specialists share field-set recipes that are battle-tested for their industry — and how we let RPs go from zero to "Sign in with TDEN" in minutes instead of days.

## Available Skills (Phase A2.6 official set)

| ID | Name | Category | Sensitivity | Use case |
|---|---|---|---|---|
| `kyc-crypto-exchange` | Crypto Exchange KYC | kyc | sensitive | FATF Travel Rule compliant onboarding |
| `age-gate-18` | Age Gate (18+) | age-verification | sensitive | Adult content / gambling / age-restricted services |
| `ecommerce-shipping` | E-commerce Shipping | ecommerce | sensitive | Standard cart checkout (name + phone + address) |
| `social-basic` | Social Platform Basic Profile | social | normal | Anonymous-by-default social onboarding |
| `gov-permit` | Government Permit Application | gov | sensitive | China 政务服务 / equivalent citizen services |

## Manifest format

Each Skill is a single JSON file under `manifests/<id>.json` validated against `schema/skill-v1.schema.json`. Required fields:

- `id`, `name`, `version`, `category`
- `fields[]` — array of `{ tag, required, justification }`
- `purpose` — what data is used for, displayed to users at consent time
- `lawful_basis` — GDPR-style declaration
- `auth_types[]`, `max_validity_seconds`, `max_queries_per_day`

Optional but encouraged: `name_zh`, `description_zh`, `purpose_zh`, `compliance[]`.

## Using a Skill in your RP

1. Open **TDEN RP Toolkit** (the Tauri app)
2. Go to **Skills** tab
3. Browse + click "Fork to Designer"
4. Customise — change package_id to yours, add your redirect URIs, tweak field justifications to match your phrasing
5. Submit via Designer's "🚀 提交到 Portal"
6. Wait for SIN reviewer approval (3-of-N for normal, 5-of-N + DAO for sensitive)
7. Receive `client_id` + `client_secret` once
8. Plug into `@tden/sdk` or `tden-sdk-go` — done

## Contributing a new Skill

We're accepting community PRs as of Phase A2.6.

1. Fork this repo
2. Add `manifests/<your-skill-id>.json` matching the schema
3. Validate locally:
   ```bash
   npx ajv-cli validate -s schema/skill-v1.schema.json -d manifests/your-skill.json
   ```
4. Open a PR with:
   - Brief description (what's the use case?)
   - Why the chosen field set is the minimal sufficient set
   - Compliance considerations (what regulations does this serve / risk?)
5. TDEN team reviews; once approved, manifest goes live in the marketplace

### Acceptance criteria

A Skill is accepted if:

- ✅ Field set is **minimal sufficient** — no "we might want this someday" fields
- ✅ Justifications are **truthful and specific** — not "for service improvement"
- ✅ Compliance flags are **accurate** — no GDPR claim without clear basis
- ✅ Author identifies themselves (real name / org / DID)
- ✅ Schema-valid

A Skill is rejected if:

- ❌ Includes obviously unnecessary sensitive fields ("dob" for a chat app)
- ❌ Justifications are vague ("user experience optimization")
- ❌ Sensitivity-elevating fields without clear regulatory need
- ❌ Author is anonymous AND skill targets sensitive data

## Phase B roadmap

- **Chain-anchored manifest hash** — each approved Skill gets a TDEN chain anchor; RPs can verify a Skill they downloaded matches what was approved, prevents supply-chain attacks
- **Skill ratings** — RPs that have used a Skill rate it (0-5), surfaces quality
- **Localization registry** — community-translated `*_zh` / `*_es` / `*_ar` etc.
- **Vertical packs** — bundles of related Skills (e.g. "ecommerce starter pack" = shipping + age-gate + customer-support)

## License

The schema and tooling: AGPL-3.0.
The manifest files in `manifests/`: **CC0-1.0** (public domain). Take them, modify them, ship them. We retain no rights over your fork.
