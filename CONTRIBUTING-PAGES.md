# Adding or editing a page

One page = one file `src/content/pages/<id>.ts`, exported with `definePage` (types in `src/lib/guide-types.ts`). The file name is the id. The page is built at `/en/<slug>/` and listed on the home page, in the menu, the footer, the sitemap and `llms.txt` automatically.

## Page types

- Every content page carries a calculator on the first screen (`tool`):
  - `{ kind: 'nhs', props: { nation, band, step, area, fte } }`: full NHS take-home calculator;
  - `{ kind: 'teacher', props: { nation, point, area, year, fte } }`: full teacher take-home calculator (points `M1`..`U3`, `Q1`..`Q6` for unqualified, `S0`..`S5` for Scotland, `M2`..`U3` for Wales and NI);
  - `{ kind: 'pension', props: { scheme, pay, age } }`: career average pension projection (`nhsEW` or `tps`);
  - `{ kind: 'mini:<spec>', props }`: a mini calculator of `src/lib/mini-specs.ts` (defaults by input id).
- Groups: `bands`, `nhs`, `teachers`, `pensions`, `takehome`, `nations` (labels in `src/i18n/nav.ts`).
- Citable block (`resume`) + body of 500 words or more.

## Rules checked by `npx vitest run tests/pages.test.ts` and `npm run check`

- `title` 50 to 60 characters, key term first, never starting with a nation or a tool or question word. `description` 150 to 160 characters.
- `resume`: one paragraph of 120 words or more that answers the page's question with figures.
- `faqs`: 3 to 8 questions, answers of 40 to 90 words, each question used once on the whole site.
- No em dash. British English. No personal advice, no union, adviser or lender named or ranked.
- Internal links only through `h.a('<page id>', text)`; unknown ids fail the test and the build.
- Every figure comes from the engines (`h.PAY`, `h.TAX`, `h.PEN`, `h.nhsNet`, `h.teacherNet`) or from `h.P`: never type an amount, a rate or a date that exists in `src/data/params-2026.json`.
- At least two `sources` keys of the parameter file.
- A figure that is announced but not printed in a published scale (NI Agenda for Change 2026/27, Welsh and NI teacher scales from September 2026) is shown as still to come, with what is known and its date, never computed from a percentage.
- No claim about job roles, local practice or employer policy without a source.

## Data

All figures: `src/data/params-2026.json`, each with its official source in `sources` and the date read in `retrieved_at`. Engines: `src/lib/engine/pay.ts` (Agenda for Change, HCAS, teacher scales), `tax.ts` (income tax rUK and Scotland, NI, student loans), `pension.ts` (tiers, career average projection, lump sum), `net.ts` (take-home). Tests: `tests/engine.test.ts`.

Yearly cycle: NHS scales and pension tiers in April, teacher scales in September (August in Scotland), tax thresholds in April. Update the parameter file, run `npm test`, then `npm run check`.
