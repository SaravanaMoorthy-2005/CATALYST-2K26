---
name: visual-qa
description: "Reviews CareCircle healthcare dashboard UI in browser screenshots against uploaded Dribbble-style reference, responsive layout, typography, glassmorphism, accessibility and role-specific workflows."
---
# Visual & Accessibility QA

1. Read `ui and ux.md` and open `references/dashboard-full.png`, `references/dashboard-closeup.png`, `references/branding-type-palette.png`. Copy layout principles but not MediApp identity.
2. Launch the real app using documented commands; if backend required, run emulators with synthetic data.
3. Visit CareDay, CarePulse, family, medication, appointment, invitations, DischargeSync, Refill Guardian, CareShift and CareCircle View.
4. Capture actual screenshots at 1440, 1280, 1024, 768, 390 and 360px as tools permit. Compare alignment, Stack Sans rendering, subtle glass quality, card density, body readability, selected pills, icons, click targets, CTA and whitespace. Inspect whether calendar and lists overflow.
5. Run Playwright axe, keyboard-only flows, 200% zoom, reduced motion, locale expansion, and high-contrast mode. Prioritize elderly legibility over glass aesthetics.
6. Fix source code defects and regenerate screenshots. Document remaining blockers; do not claim to have viewed screenshots without using browser tooling.