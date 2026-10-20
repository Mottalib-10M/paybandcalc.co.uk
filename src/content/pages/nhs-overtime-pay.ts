import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'nhs-overtime-pay',
  group: 'nhs',
  order: 35,
  tool: { kind: 'mini:overtime' },
  related: ['nhs-unsocial-hours-pay', 'nhs-part-time-pay', 'nhs-band-6-salary', 'nhs-take-home-pay'],
  sources: ['nhse_handbook', 'nhse_unsocial', 'nhse_afc'],
  slug: 'nhs-overtime-pay',
  nav: 'Overtime pay',
  card: 'Time and a half for bands 1 to 7, double time on public holidays, plain time for part-time staff first.',
  title: 'NHS Overtime Pay 2026/27: Rates for Bands 2 to 7 in Pounds',
  description: 'NHS overtime pay 2026/27: time and a half for bands 1 to 7, double time on public holidays, plain time for part-time staff up to 37.5 hours. Price extra hours.',
  h1: 'NHS overtime pay: what extra hours are worth in 2026/27',
  intro: 'Pick your band and step and enter your overtime hours for the month. The rates come from section 3 of the NHS handbook and the 2026/27 hourly values of NHS Employers.',
  resume: (h) => {
    const O = h.P.unsocial.overtime, hr = h.PAY.afcHourly('5', 0);
    return `Section 3 of the NHS terms and conditions handbook defines overtime as hours worked in excess of ${h.num(O.weeklyHours)} hours a week, and gives all staff in bands 1 to ${O.maxBand} a single rate of time and a half, except for work on general public holidays, which is paid at double time. The rate is based on the hourly value of basic pay plus any long-term recruitment and retention premium; the London supplement does not count towards it. A band 5 nurse at entry, with an hourly rate of ${h.m2(hr)} in 2026/27, earns ${h.m2(hr * O.rate)} for an hour of overtime and ${h.m2(hr * O.publicHoliday)} on a public holiday. Part-time staff are paid plain time for extra hours until their total in the week passes ${h.num(O.weeklyHours)}, and only then the overtime rate. Staff in bands 8a to 9 are outside the overtime rules: any arrangement for extra hours is made locally. Overtime is not enhanced again for unsocial hours.`;
  },
  faqs: (h) => [
    { q: 'Is NHS overtime pensionable?', a: 'For full-time staff, hours above 37.5 a week are not pensionable in the 2015 scheme. For part-time staff, NHSBSA explains that additional hours worked up to the whole-time equivalent are automatically pensionable, after a change to the scheme regulations; hours beyond the whole-time equivalent remain non-pensionable for everyone. So a part-time nurse picking up extra shifts adds to pension until reaching full-time hours.' },
    { q: 'Do band 8a staff get paid overtime in the NHS?', a: 'Not under the national rules. Section 3 of the handbook limits overtime payments to staff in bands 1 to 7. For bands 8a, 8b, 8c, 8d and 9, any arrangement for hours worked beyond the contract is agreed locally with the employer, and the calculator on this page offers only bands 2 to 7 for that reason.' },
    { q: 'How is overtime taxed on an NHS payslip?', a: `It is added to the pay of the month and taxed through PAYE with the rest, at your marginal rate, and bears National Insurance at 8 % below ${h.m(h.P.tax.ni.upperEarningsLimit)} a year and 2 % above. Overtime above full-time hours is not pensionable, so no pension contribution is taken from it and it gets no relief through the pension either.` },
  ],
  body: (h) => {
    const O = h.P.unsocial.overtime;
    const rows = h.PAY.BANDS.slice(0, 6).map((b) => { const p = h.PAY.afcPoints('england', b); const lo = h.PAY.afcHourly(b, 0), hi = h.PAY.afcHourly(b, p.length - 1); return [`Band ${b}`, h.m2(lo * O.rate), h.m2(hi * O.rate), h.m2(lo * O.publicHoliday), h.m2(hi * O.publicHoliday)]; });
    const ex = h.PAY.afcPay('england', '6', 0), extra = 8 * 12 * h.PAY.afcHourly('6', 0) * O.rate, a = h.nhsNet('england', ex), b = h.NET.takeHome({ gross: ex + extra, pensionable: ex, scheme: 'nhsEW' });
    return `<h2>Overtime rates for bands 2 to 7, England 2026/27</h2>
${h.table(['Band', 'Time and a half, entry', 'Time and a half, top', 'Double time, entry', 'Double time, top'], rows, 'Per hour, from the hourly values published by NHS Employers for 2026/27 and the rates of section 3 of the handbook.', ['l', 'r', 'r', 'r', 'r'])}
<h2>What a year of overtime adds after deductions</h2>
<p>Take a full-time band 6 at entry who works eight hours of overtime a month at time and a half: ${h.m(extra)} a year gross. Overtime above full-time hours is not pensionable, so the pension contribution stays at ${h.m(a.pension)} and the extra pay meets only income tax and National Insurance. Take-home rises from ${h.m(a.monthly)} to ${h.m(b.monthly)} a month, so about ${h.pc((b.net - a.net) / extra, 0)} of the overtime reaches the bank. For a band 7 at the top point, where most of the overtime falls in the 40 % band, the share kept is much lower.</p>
<h2>Public holidays</h2>
<p>Double time applies to overtime worked on a general public holiday. Hours worked on a public holiday within your contracted hours are not overtime: they are paid through the unsocial hours rules, at time plus ${h.pc(h.PAY.unsocialRates('5')[1], 0)} for bands 4 to 9 and more for bands 1 to 3, and the handbook sets separate arrangements for the holidays around Christmas and New Year in Annex 25. A shift worked partly in contracted hours and partly as overtime is split between the two rules.</p>
<h2>Overtime, bank shifts and additional hours</h2>
<p>Three kinds of extra work look alike on a rota but are paid differently. Overtime, under section 3, is work above 37.5 hours a week in your own contract. Additional hours are extra hours for part-time staff below 37.5 a week, paid at plain time and, since the change to the pension regulations, pensionable up to the whole-time equivalent. Bank shifts are worked under a separate bank contract with its own rates set by the employer or its bank provider; they are outside the national overtime rules and this calculator.</p>
<p>The ${h.a('nhs-part-time-pay', 'part-time page')} shows how plain-time hours change take-home and the contribution tier, and the ${h.a('nhs-unsocial-hours-pay', 'unsocial hours page')} prices nights and weekends worked within contracted hours. Together with the take-home calculator, they cover every regular line of an Agenda for Change payslip except on-call, which is agreed locally under Annex 29 and varies too much between employers to model.</p>`;
  },
});
