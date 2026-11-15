# Elderly-First Accessibility Plan (WCAG 2.2 AA Target)

## Core design

Older adults may have reduced visual acuity, motor precision, hearing, memory and digital familiarity. Make the next action obvious, use plain text, honor autonomy, and never demand an advanced interaction for basic medication confirmation.

## Mandatory behavior

- Normal content 16px minimum where practical; elder-focused pages 18–20px; line-height ≈1.5; headings with intentional hierarchy; Stack Sans fonts with Tamil/Devanagari supported fallbacks.
- Normal text 4.5:1 contrast, large text 3:1, non-text interactive components/focus boundary 3:1 where required. Verify across **translucent glass** and pastel colors.
- Large primary tap areas ideally ≥48×48 CSS px, adequate spacing; do not encode state only with red/green.
- HTML controls with accessible names, associated form labels, clear required/error descriptions and native semantics; no interactive `<div>` impersonations.
- Keyboard-only workflow from login → invited code → medication confirmation → appointment → caregiver alert acknowledgement. Focus visible, logical order, dialogs trap/manage/restore focus, no keyboard traps.
- Screen-reader `aria-live` for due/confirmation status used sparingly; no repeated alert spam; label date/time and pill instructions contextually.
- Support 200% zoom, 320 CSS px reflow, text enlargement, high-contrast mode, reduced motion and reduced transparency. No horizontal scroll except genuinely tabular content with accessible mobile alternative.
- Tamil/English/Hindi locale: layout handles expansion; verify translated dates and real fonts, not placeholder mixed-language text.
- CareVoice: user-initiated, speechSynthesis feature-detected, stop/pause visible, same info in text. Never auto-speak confidential medication content in public. Push opt-in, not required.
- Charts provide textual summary and data table; status detail available without hover/color.

## Test matrix

| Test | Elder | Family | Caregiver |
|---|---|---|---|
| Keyboard primary tasks | Medication confirm / Skip / Help | View update / claim task | Alert ack / edit permitted med |
| Screen reader | Next dose and state | Access-limited list | Pending queue and status |
| Mobile 360px | No clipped help CTA | No horizontal overflow | Task action visible |
| 200% zoom | Cards reflow | Timeline legible | Tables accessible |
| Locales | Tamil/Hindi fonts | Dates and directions | Label truncation |
| Error messages | Stale/offline and rejected dose | Permission denied | Concurrent conflict |

Automated axe tests help but cannot verify language quality or cognitive usability. Include manual checks and screenshots in release evidence. The stated target is **WCAG AA**, not a certification claim.