# CareCircle UI & UX — Premium Healthcare Design System

**Product:** CareCircle 3.0 — Connected Care. Confident Living.  
**Design reference:** User-provided screenshots in `references/` and https://dribbble.com/shots/27480941-Healthcare-Web-Patient-Portal .  
**Design goal:** A restrained, beautifully composed patient portal with sophisticated frosted surfaces **and excellent usability for older adults**. This is an adaptation of layout, typography and atmosphere, not a clone of MediApp's brand, assets or component copy.

## 1. What the reference actually communicates

- Large **Stack Sans Headline** display type with simple modern shapes; companion **Stack Sans Text** for functional UI.
- Dark almost-black text, warm off-white, pale powder blue/green, striking lemon accent, matte white cards.
- **Soft glassmorphism** in the application background/shell: blue-green mist, translucent navigation, mild depth; primary chart/list cards stay nearly opaque.
- Desktop three-zone dashboard: **left navigation (~240–260px), primary content (flexible), right utility column (~300–340px)**; 16–24px gaps, softly rounded cards, short labels.
- Capsule tabs (active almost black), low-contrast chart grid, pastel appointment/medicine entries, a compact clean calendar.
- Content grouped by user intent: title, most important information, utility panels—not an AI-themed page of floating decorative charts.
- In the reference's sidebar there is a subscription advert. **Replace it** with a functional care-support card, or omit it. Do not copy logo, medical photographs, data, branding, doctor names or image artwork.

### Reference assets

- `references/branding-type-palette.png`: type and palette evidence.
- `references/dashboard-full.png`: desktop layout, card proportions and sidebar.
- `references/dashboard-closeup.png`: headings, selected pills, strokes and graph style.
- `references/official-problem-statement.jpeg`: feature alignment; do not style-copy the challenge announcement.

## 2. Original CareCircle design DNA

**Design words:** calming, precise, human, accessible, premium, non-institutional, self-directed.

**Visual tokens** (create CSS variables, Tailwind theme and Storybook/sample page if useful):

| Semantic token | Hex or pattern | Use |
|---|---|---|
| `--cc-ink` | `#11141A` | title/body/active buttons |
| `--cc-ivory` | `#F9F5F1` | warm overall background |
| `--cc-lemon` | `#FFF25C` | focus/selected highlight or small support accent **only** |
| `--cc-powder` | `#B2D8DD` | ambient blue-green backdrop (adaptation) |
| `--cc-mist` | `#EAF2ED` | calendar/neutral panels |
| `--cc-ice` | `#EAF2FF` | appointments |
| `--cc-mint` | `#EDF5E8` | care success/medication context, never status by color alone |
| `--cc-surface` | `#FFFFFF` | all key action and read-heavy cards |
| `--cc-muted-text` | dark gray meeting contrast, e.g. `#526166` on white | readable captions |
| `--cc-border` | `rgba(17,20,26,.08)` | unobtrusive separators |
| `--cc-focus` | accessible visible outline, test contrast | keyboard focus |

The screenshot shows an apparent powder-blue swatch with an inconsistent printed code. Treat the palette tokens here as **deliberate CareCircle adaptations** rather than claiming the reference contains exact sampled values.

### Typography and localization

- Prefer licensed **Stack Sans Headline** for page titles/metric numbers, **Stack Sans Text** for controls and descriptions, loaded via Fontsource/official web CSS after checking available package names. Use stable font fallbacks.
- Tamil UI requires a suitable Tamil-script fallback (e.g. Noto Sans Tamil), and Hindi a Devanagari fallback (e.g. Noto Sans Devanagari); verify with actual glyph rendering and realistic translated copy. Do not assume Latin Stack Sans supports these scripts.
- Desktop h1: 32–36px/1.12, 600; h2 card 22–24px/1.2, 600; smaller headings 18–20px, 600; normal body ≥16px/1.5; elderly view 18–20px; supporting text ≥14px with proven contrast; buttons 16–18px semibold.
- Avoid ALL CAPS body text and data-dense abbreviations. Use plain labels: **Taken**, **Skipped**, **Not confirmed**, **Needs help**, **Awaiting caregiver**.
- Numeric times show timezone context when needed; respect user locale for date/time and screen reader announcements.

### Composition and spacing

- Outer desktop content max width can be 1536–1680px; adapt to viewport; 24–32px outer padding.
- Sidebar 240–260px fixed within the app grid, right utility 300–340px at wide widths, content center minmax(0,1fr).
- Gaps 16–24px (base 4/8px tokens); radius content cards 20–24px; compact controls 12–14px; selected pills 999px.
- Subtle shadows: `0 8px 28px rgba(17,20,26,.05)` only on important raised cards; do not stack multiple shadow layers.
- Borders at 1px and low contrast; increase contrast for focus and forms.

### Subtle glassmorphism—do not obscure content

Use a softly colored ambient page background, then a frosted glass **outer shell, sidebar, and optionally header**. Example CSS guidance (adapt to real browser support):

```css
.cc-glass-shell {
  background: rgba(255, 255, 255, 0.58);
  border: 1px solid rgba(255, 255, 255, 0.70);
  backdrop-filter: blur(16px) saturate(130%);
  -webkit-backdrop-filter: blur(16px) saturate(130%);
}
.cc-content-card {
  background: #fff;
  color: #11141a;
  border: 1px solid rgba(17, 20, 26, 0.08);
  border-radius: 22px;
  box-shadow: 0 8px 28px rgba(17,20,26,.05);
}
@supports not (backdrop-filter: blur(16px)) {
  .cc-glass-shell { background: #f6f9f8; }
}
@media (prefers-reduced-transparency: reduce) {
  .cc-glass-shell { background: #f6f9f8; backdrop-filter: none; }
}
```

Do not blur readable medication and form content. Limit expensive effects on mobile/low-power devices. Support high-contrast mode with opaque components.

## 3. Information architecture by user, not by the database

### Elder main nav: five items maximum

`Today` · `My Medicines` · `Appointments` · `My Care Circle` · `More`

Keep **Need Help** always discoverable as a prominent contextual action, not buried in More. More houses reports, access settings, accessibility and activity history.

### Caregiver nav

`Overview` · `Care Tasks` · `Medications` · `Appointments` · `Care Circle`.

Alerts, refill tasks, activity, insights, discharge reconciliation and security settings are contextual subviews, not more top-level sidebar items.

### Family nav

`Overview` · `Updates` · `Responsibilities` · `Appointments` · `Family`.

Show only granted data. Never show an edit button that cannot be used; accessible disabled state plus explanation if needed.

## 4. Dashboard specifications

### A. CareDay — elder dashboard (priority: clarity)

1. Header: real display name, greeting, local date, contrast/text-scale controls and notifications.
2. **Dominant next-action card**: next medication, scheduled time, clinician-issued instruction, button **Mark as Taken**, secondary **Skip**, a clear status and visible error/sync indicators. Need Help easily accessible.
3. **Today's Care Timeline**: event-by-event medication and appointments; visually restrained thin timeline and truthful states; current item highlighted.
4. **Upcoming appointments**: pastel blue/green clinician cards with date, time and location.
5. Right utility cards at wide widths: month calendar; "My Medicines" pastel rows with names, daily times and low-stock warnings.
6. Family connection snippet: named authorized members and any pending responses, never false online/safety assertions.
7. Avoid large chart-led header or graphs on main elder dashboard; keep trends in Insights.

### B. CarePulse — caregiver dashboard (priority: action)

1. Header with selected *authorized* care circle, timezone and clear current state.
2. Attention queue: **Unconfirmed doses**, **Help requests**, **Low stock**, **Overdue assigned tasks**, **Upcoming appointments**—real data ordered by urgency/time.
3. One large white card for actionable queue; each item includes an action and status, not just a count.
4. Compact 7-day adherence trend and an activity timeline using real data, with explanatory metric definitions.
5. Real acknowledgement and resolution action; optimistic UI only when safe, roll back on failure; no fake progress.
6. Allow care-circle switcher with scoped subscription cleanup and no data flash from previous circle.

### C. Family Overview (priority: visibility)

Show a concise care summary, changes since last visit, shared tasks, appointments and alerts. Respect view-only vs editor grants. Do not show clinical details not explicitly shared.

### D. My Medicines

- Clear active/paused medication group with dosage information as *prescribed data* only.
- Status chips with text and icons (not color alone), schedule and next dose.
- Contextual actions: manage schedule, confirm dose, follow-up reason, stock/refill, prescription history.
- **SafeDose Shield**: if already confirmed, modal explains time/actor; no second creation; authorized correction separately logged.
- **WhyMissed?**: large selectable reason cards and safe follow-up; do not advise taking a late dose or changing dose.
- **Refill Guardian**: estimated inventory timeline and assigned refill task, explicit estimation assumptions.
- **DischargeSync**: compare old/new schedule in columns desktop, stacked on mobile; Added/Changed/Stopped/Unchanged textual chips, human confirmation before activation.

### E. CareShift and CareCircle View

- CareShift: simple assignment list with owner, due date, status, acknowledgement, reassignment and handoff; no heavy Kanban unless it truly improves task completion.
- CareCircle View: an elder-centered family/caregiver relationship layout with permission cards. Provide an **equivalent accessible list** rather than requiring graph navigation.
- Remove/invite/revoke access only after reauth or step-up checks where appropriate and with confirmation. Do not expose invitation codes after creation except safe owner-needed flows.

### F. Calendar and Appointments

- Use modern minimal calendar with keyboard/screen-reader date navigation and meaningful event markers. Never make appointments depend solely on color dots.
- Appointment cards visually match reference: pastel surface, concise clinician/visit label, time, status and contextual action.
- Support cancel/reschedule/notes/companion questions; appointment cancellation invalidates old reminders.

### G. Secondary features and locations

- **CareVoice**: optional user-triggered spoken read-aloud; visible same information; language preference persisted, text alternatives always available.
- **CarePassport**: authenticated, consent-controlled PDF/print summary that displays updated timestamp; no anonymous share link by default.
- **Appointment Companion**: questions-to-ask and follow-up checklist in appointment detail.
- **Wellbeing Check-In**: simple two-state check-in; no physical safety guarantee.
- **Care Handoff Report**: read-only generated summary with task acceptance/ownership, fresh timestamp and bounded data range.
- P2 OCR, symptom journal, offline schedule and clinician-review flags should not clutter main nav.

## 5. Components to create and reuse

`AppShell`, `SidebarNav`, `Topbar`, `PageHeader`, `GlassShell`, `SurfaceCard`, `MetricCard`, `MedicationCard`, `AppointmentCard`, `CalendarWidget`, `CareTimeline`, `StatusBadge`, `CareTaskRow`, `AlertRow`, `MemberCard`, `PermissionPanel`, `EmptyState`, `ErrorState`, `LoadingSkeleton`, `AccessibleDialog`, `ReasonPicker`, `ContrastToggle`, `TextSizeControl`, `LanguageSwitcher`.

Use shadcn/ui primitives and Radix-derived accessibility when relevant. Build custom behavior only when necessary. Native `<button>` for actions, visible `<label>` for forms and `aria-live` for statuses.

## 6. Interaction principles

- One primary action per card or screen; secondary actions are quiet but discoverable.
- Each backend mutation has `idle/loading/success/error` state, explicit retries and focus management.
- Distinguish **draft**, **pending sync**, **server-confirmed**, **failed** and **stale/offline**. Do not immediately claim a dose was recorded before server confirmation.
- Help request visible for elders; clearly explain the service does not call emergency responders.
- Error text plain and specific; never expose internal stack traces or private records.
- Motion 140–220ms for microinteractions only; no parallax, spinning cards, neon/glow, glass over glass, floating pills, or fake live activity.
- The reference sidebar promo card should be a supportive action CTA such as “Care feels better together — Contact caregiver” and **not an advertisement**.

## 7. Accessibility acceptance (see `docs/ACCESSIBILITY.md`)

- WCAG 2.2 AA target; normal text minimum contrast 4.5:1, large text 3:1, distinguishable UI boundaries and visible keyboard focus.
- Elder primary touch targets ideally 48x48px; support 200% zoom without losing tasks and 320 CSS px reflow wherever required.
- No small gray status labels as the only clue. Provide text + icon.
- Voice, FCM push, animation and device presence are **optional**, never needed to operate essential functions.
- Test on keyboard, screen reader, mobile, high contrast, reduced motion, enlarged fonts, Tamil and Hindi labels.
- Sensitive personal health info should not be read aloud or push-displayed unexpectedly.

## 8. Visual QA checklist

Run the actual app and capture screenshots at **1440, 1280, 1024, 768, 390 and 360px**. Evaluate: type hierarchy, alignment, rhythm, legibility on glass, calendar responsiveness, chart axes, pill tabs, accessible buttons, state labels, help CTA, no overflow, no disabled/decorative controls mistaken as functional. Check zoom and language expansion. Compare visual *principles* with the supplied screenshots, not pixel-perfect copying. Capture at least CareDay, CarePulse, medication details, DischargeSync, CareShift, invitations, and mobile nav. Fix visual defects and rerun a11y checks.

## 9. Explicit design anti-patterns

No generic AI-slop design; no futuristic medical holograms, giant decorative hero images, irrelevant health graphs, stock doctor faces copied from reference, fake chat UI, dark-matte graphs everywhere, giant yellow banners, blank cards pretending to be functionality, or unnecessary navigation depth. Under no circumstance let heavy glass effects impair elder readability or interaction latency.

## 10. Deliverable gate

A reusable tokenized UI, role-specific navigation, all functional pages restyled, strict accessibility, responsive screenshots, verified backend interactions, and visual QA findings summarized. It must look like **CareCircle**, not renamed MediApp Pro.