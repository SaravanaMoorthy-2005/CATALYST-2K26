# CareCircle 3.0 — Antigravity Project Kit

**Mission:** Build and verify a secure, accessible, collaborative elderly-care application for the PromptWars × Catalyst challenge. This repository kit is an **agent instruction/specification bundle**, **not** a completed application. The Antigravity agent must generate and test the actual code.

## Quick start in Google Antigravity

1. Extract this kit into a new `carecircle/` repository root. For an existing project, copy the files into its root without overwriting working application code. Preserve `.agents/`, `docs/`, and `references/` paths.
2. Open the repository **root** as the Antigravity workspace. `AGENTS.md` is discovered automatically; `.agents/rules/*.md` and `.agents/skills/*/SKILL.md` are recognized customizations.
3. Open `MASTER_PROMPT.md`; paste its **Start message** into Antigravity in a software-engineering session. Optionally attach `references/dashboard-full.png`, `references/dashboard-closeup.png`, and `references/branding-type-palette.png` when discussing visual design.
4. Let the agent **inspect existing code** (or initialize a new npm workspace), create a short implementation plan, and implement **one tested vertical slice at a time**. Approve real Firebase/Vercel credentials and paid deployments explicitly.
5. Use the installed skills as needed: `/implement-feature`, `/visual-qa`, `/security-audit`, `/release-verify`. You may also ask Antigravity in natural language to use them.
6. Before submitting, review `docs/REQUIREMENTS_MATRIX.md`, real test logs, Firestore Rules results, accessibility screenshots, and deployment smoke-test evidence.

## File map

| File | Purpose |
|---|---|
| `AGENTS.md` | **Automatically loaded** project-wide invariant instructions and document navigation |
| `agent.md` | Requested lowercase entrypoint; points to canonical instructions |
| `MASTER_PROMPT.md` | Ready-to-paste kickoff prompt for Antigravity, with milestone execution and handoff format |
| `ui and ux.md` | Full visual design system, Dribbble-reference analysis, component and page specs |
| `docs/PRODUCT_REQUIREMENTS.md` | User problems, complete feature specifications, acceptance criteria and role responsibilities |
| `docs/ARCHITECTURE_AND_DATA.md` | React/Firebase architecture, entities, contracts, state machines and scheduling |
| `docs/SECURITY_AND_PRIVACY.md` | Threat model, algorithm choices, RBAC, invitations, encryption, audit policies |
| `docs/QUALITY_AND_TESTING.md` | Code quality, testing matrix, coverage, accessibility and CI acceptance gates |
| `docs/ACCESSIBILITY.md` | Elder-first accessibility principles, manual + automated testing |
| `docs/PERFORMANCE.md` | Bounded live listeners, Firestore query efficiency, scheduling cost and performance |
| `docs/GOOGLE_SERVICES.md` | Real Google services integration and local emulator expectations |
| `docs/VERCEL_DEPLOYMENT.md` | Deployment boundaries, Vercel SPA routing, environment and production runbook |
| `docs/REQUIREMENTS_MATRIX.md` | Assessment-aligned requirements → implementation → test evidence |
| `docs/IMPLEMENTATION_PLAN.md` | Work phases, definition of done, checkpoints and feature priorities |
| `docs/REFERENCE_ASSETS.md` | How to use uploaded screenshots, design inspiration and licensing guardrails |
| `.agents/rules/*.md` | Focused Antigravity rule files with valid trigger frontmatter |
| `.agents/skills/*/SKILL.md` | Repeatable Antigravity procedures: implement, visual QA, security and release |
| `references/*` | User-provided challenge and UI reference screenshots |
| `templates/.env.example` | Client variable examples and server-secret names; no real credentials |

## Critical naming clarification

Antigravity recognizes `AGENTS.md` and `GEMINI.md` as project instructions, rather than `agent.md`. The requested `agent.md` is provided for convenience, but keep `AGENTS.md` at the repository root.

The older `.agent/` path is a legacy form; this kit uses the current `.agents/` convention. Workflows are being superseded by skills; this kit uses `SKILL.md` rather than deprecated workflow files.

## External prerequisites

- Node.js compatible LTS, npm and Java when required for emulators
- Google/Firebase project with Auth + Firestore; billing-enabled plan for deployed Cloud Functions and scheduled jobs
- Google Cloud Secret Manager/KMS IAM and APIs when configured
- Transactional email account, verified sender, and credentials stored only server-side
- Vercel account and GitHub repository for frontend deploy
- Browser automation support for visual QA

Do **not** copy real medical records into demo databases. Do **not** claim regulated healthcare compliance solely from security features.

## Sources for the configuration choices

- Antigravity rules: https://antigravity.google/docs/rules/
- Antigravity skills: https://antigravity.google/docs/skills
- Customization discovery: https://antigravity.google/docs/customization-discovery/
- Vite on Vercel: https://vercel.com/docs/frameworks/frontend/vite
- Scheduled Functions: https://firebase.google.com/docs/functions/schedule-functions


## Updated single-paste option

Open `SINGLE_MASTER_PROMPT.md` and paste it as one self-contained Antigravity engineering request. For the **complete source text of every project instruction document**, use `ALL_FILES_COPY_PASTE.md` or the combined `ONE_PASTE_ALL_FILES_AND_MASTER.md`. Every `.agents/rules/*.md` has valid `trigger` YAML frontmatter, while `AGENTS.md` itself has none.