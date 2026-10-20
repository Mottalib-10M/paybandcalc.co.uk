import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'nhs-pay-progression',
  group: 'nhs',
  order: 33,
  tool: { kind: 'mini:progression' },
  related: ['agenda-for-change-pay-scales', 'nhs-band-6-salary', 'nhs-band-8c-salary', 'nhs-pay-rise-2026'],
  sources: ['nhse_handbook', 'nhse_afc', 'nhsbsa_tiers', 'hmrc_rates'],
  slug: 'nhs-pay-progression',
  nav: 'Pay progression',
  card: 'When the next step comes, the five standards behind it in England, and what it is worth after deductions.',
  title: 'NHS Pay Progression 2026/27: Step Dates, Rules and Value',
  description: 'NHS pay progression in 2026/27: when each Agenda for Change step is due, the five standards of Annex 23 in England, and what your next step is worth each month.',
  h1: 'NHS pay progression: your next step and what it is worth',
  intro: 'Choose your band and your current point: the calculator gives the gross rise at the next step, the extra take-home each month and how far the top of the band is.',
  resume: (h) => {
    const b = h.PAY.afcPoints('england', '6');
    return `Agenda for Change pay rises inside a band at fixed points. In England the 2026/27 scale of NHS Employers sets how long you stay on each point: two years at the entry point of bands 3 and 5 to 9, three years at the entry point of band 4, then two or three years at the intermediate point of bands 5 to 9. A band 6, for example, moves from ${h.m(b[0].pay)} to ${h.m(b[1].pay)} after ${b[0].years} years and to ${h.m(b[2].pay)} after ${b[1].years} more. The step is paid on your pay step date when the standards in paragraph 19 of Annex 23 of the NHS handbook are met: an appraisal in the last twelve months in line with the organisation's standards, no formal capability process, no live disciplinary sanction, statutory and mandatory training completed, and, for line managers, appraisals done for their own staff. Scotland's guidance makes progression automatic except where a formal capability process at stage 2 or beyond is under way or required training has not been done.`;
  },
  faqs: (h) => [
    { q: 'What happens if my NHS pay step is delayed?', a: 'Under Annex 23, a step held back because a standard was not met is paid from the earliest date the requirement is shown to have been met, and your pay step date for later years stays the same. A step delayed by a live disciplinary sanction is paid from the day after the sanction expires, provided the other standards are met. You can contest a decision through the local procedure.' },
    { q: 'Does a pay step happen on 1 April with the pay award?', a: 'No. The pay award changes every point on 1 April, but your pay step date is personal and is set from when you started in the band. In a year when your step date comes round, you get both: the award in April and the step on your own date. Both appear on your payslip as a change in basic pay.' },
    { q: 'Is pay progression different at the top of the senior bands?', a: `Yes. Twelve months after an employee reaches the top of bands 8c, 8d or 9, 5 % or 10 % of basic salary becomes re-earnable under paragraph 1.11 of the handbook. If the Annex 23 standards are met each year the pay stays at the top; if not, it can be reduced from the pay step date and restored the following year once they are.` },
  ],
  body: (h) => {
    const rows = h.PAY.BANDS.filter((b) => h.PAY.stepCount('england', b) > 1).map((b) => { const p = h.PAY.afcPoints('england', b), first = h.nhsNet('england', p[1].pay).net - h.nhsNet('england', p[0].pay).net; return [`Band ${b}`, `${p[0].years} years`, h.m(p[1].pay - p[0].pay), h.m(first / 12), p.length === 3 ? `${p[1].years} years` : '', p.length === 3 ? h.m((h.nhsNet('england', p[2].pay).net - h.nhsNet('england', p[1].pay).net) / 12) : '']; });
    return `<h2>Every step in England, and its value after deductions</h2>
${h.table(['Band', 'Wait at entry', 'First step, gross', 'First step, a month net', 'Wait at intermediate', 'Second step, a month net'], rows, 'England 2026/27, full time, outside London, NHS pension at the tier for each pay, no student loan. Worked out by the engine of this site.', ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>Reading the table</h2>
<p>A step is worth less in take-home than in salary, and how much less depends on the deductions it runs into. Steps that cross an NHS pension tier line lose more, because the higher rate applies to the whole salary: the top step of band 5 and the first step of band 8b are the clearest cases. Steps taxed at 40 % lose more again, which is why the net value of a step at band 8a is about half its gross value. Where a step stays in the basic rate band and inside one tier, as both steps of band 6 do, it keeps around three fifths.</p>
<h2>The pay step review</h2>
<p>Annex 23 asks employers to hold a pay step review meeting before your pay step date, normally as part of the appraisal. Where the standards are met, the step is applied on the date. Where one is not, the manager is expected to have discussed it with you beforehand and to agree what is needed; a further review is then arranged and the step paid from the date the standard is met. Staff on long-term leave on their step date receive the step in their absence unless a formal capability process was under way.</p>
<h2>Steps and the pension you build</h2>
<p>The part of a step that goes to the pension is not lost. Each pound of pensionable pay adds 1/54th of a pound to the yearly pension in the 2015 scheme, revalued at 1.5 % above inflation each April. The first step of band 6, ${h.m(h.PAY.afcPay('england', '6', 1) - h.PAY.afcPay('england', '6', 0))} gross, adds ${h.m((h.PAY.afcPay('england', '6', 1) - h.PAY.afcPay('england', '6', 0)) / 54)} a year to the pension for every year spent on the new point.</p>
<h2>Wales and Northern Ireland</h2>
<p>Wales uses the same three-point structure and timings for bands 5 to 9 as England, with its own appraisal arrangements described in the Welsh annex to the handbook. Northern Ireland's ${h.P.afc.ni.year} scale also uses the same waiting times. In Scotland the published table gives points without waiting times, and progression is automatic in all but the exceptional cases named in the Scottish section of the handbook.</p>`;
  },
});
