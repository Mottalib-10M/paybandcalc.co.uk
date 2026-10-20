import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'nhs-unsocial-hours-pay',
  group: 'nhs',
  order: 34,
  tool: { kind: 'mini:unsocial' },
  related: ['nhs-overtime-pay', 'nhs-band-5-salary', 'nhs-band-2-salary', 'nhs-pension-contributions'],
  sources: ['nhse_unsocial', 'nhse_handbook', 'nhse_afc'],
  slug: 'nhs-unsocial-hours-pay',
  nav: 'Unsocial hours pay',
  card: 'Time plus 30 to 94 % by band, the hours that count, and a month of nights and weekends in pounds.',
  title: 'NHS Unsocial Hours Pay 2026/27: Enhancements by Band',
  description: 'NHS unsocial hours pay 2026/27: time plus 30 % to 94 % by band for nights, Saturdays, Sundays and public holidays. Price a month of shifts at your hourly rate.',
  h1: 'NHS unsocial hours pay in 2026/27',
  intro: 'Enter the hours you work on nights and Saturdays, and on Sundays and public holidays, in a typical month: the enhancement is worked out on your band’s published hourly rate.',
  resume: (h) => {
    const r1 = h.PAY.unsocialRates('2'), r3 = h.PAY.unsocialRates('3'), r4 = h.PAY.unsocialRates('5');
    return `NHS staff in England on Agenda for Change contracts are paid an enhancement for standard hours worked at unsocial times, set in section 2 of the NHS terms and conditions handbook and restated by NHS Employers. All time on a Saturday and any weekday hours after 8pm and before 6am are paid at time plus ${h.pc(r1[0], 0)} in band 2, plus ${h.pc(r3[0], 0)} in band 3 and plus ${h.pc(r4[0], 0)} in bands 4 to 9. All time on Sundays and public holidays is paid at time plus ${h.pc(r1[1], 0)}, ${h.pc(r3[1], 0)} and ${h.pc(r4[1], 0)} respectively. Band 1, closed to new entrants, has the highest rates. The enhancement is worked out on basic pay including any long-term recruitment and retention premium, but not on the London supplement. When more than half of a weekday shift falls in the unsocial period, the whole shift qualifies. Unsocial hours payments are pensionable and count for sick pay and contractual maternity pay. The calculator uses the 2026/27 hourly rates published by NHS Employers.`;
  },
  faqs: (h) => [
    { q: 'Is NHS unsocial hours pay included in holiday pay?', a: 'Yes. Paragraph 13.9 of the handbook says pay during annual leave includes regularly paid supplements, including payments for work outside normal hours, on the basis of what you would have received at work. For regular hours the reference period is the previous three months; for irregular hours it has been the last 52 weeks since 6 April 2020.' },
    { q: 'Does a night shift that starts at 7.30pm count as unsocial?', a: 'On a weekday, the unsocial period is after 8pm and before 6am. When more than half of a shift that is not on a public holiday falls within that period, the whole shift is paid at the unsocial rate. A shift from 7.30pm to 8am clearly qualifies in full; a shift from 2pm to 10pm, with two of its eight hours after 8pm, does not.' },
    { q: 'Are unsocial hours payments pensionable in the NHS?', a: `Yes. Paragraph 2.14 of the handbook says all unsocial hours payments are pensionable, and they count for occupational sick pay and contractual maternity pay. Because they add to pensionable pay, regular nights and weekends can carry you into a higher contribution tier: in England and Wales the rate moves from ${h.pc(h.PEN.tier('nhsEW', 35000).rate)} to ${h.pc(h.PEN.tier('nhsEW', 36000).rate)} above ${h.m(35155)}.` },
  ],
  body: (h) => {
    const rows = h.PAY.BANDS.map((b) => { const hr = h.PAY.afcHourly(b, 0), [a, c] = h.PAY.unsocialRates(b); return [`Band ${b}`, h.m2(hr), `+${h.pc(a, 0)}`, h.m2(hr * a), `+${h.pc(c, 0)}`, h.m2(hr * c)]; });
    return `<h2>The enhancement per hour, entry point of each band</h2>
${h.table(['Band', 'Hourly rate', 'Nights and Saturdays', 'Extra per hour', 'Sundays and public holidays', 'Extra per hour'], rows, 'England 2026/27, hourly rates published by NHS Employers; enhancements from section 2 of the handbook.', ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>How the payment is built</h2>
<p>The basic salary already pays for every contracted hour. The unsocial hours payment is the extra percentage on top, worked out on the hourly value of basic pay. NHS Employers publishes those hourly values with the annual scale: ${h.m2(h.PAY.afcHourly('5', 0))} at the entry point of band 5, for example. The London supplement is left out of the base, and so are short-term recruitment and retention premia; long-term ones are included. Staff on part-time contracts are eligible on the same basis, and so are staff on annualised hours contracts.</p>
<p>Payments can be made in arrears, for the hours actually worked in the previous month, when shifts vary. When shifts are fixed, employers can pay them as a regular monthly amount. Overtime worked at unsocial times is not enhanced twice: it is paid at the overtime rate of time and a half, or double time on a general public holiday, for bands 1 to 7.</p>
<h2>Unsocial hours in Scotland, Wales and Northern Ireland</h2>
<p>The handbook has a separate section 2 for each nation. The calculator on this page uses the England rates and the England hourly values. Northern Ireland's ${h.P.afc.ni.year} circular applies the same enhancements as England, band by band. Scotland and Wales publish their own hourly values with their scales, so for those nations use this page as a guide, check the hourly rate on your payslip and multiply it by the percentage for your band.</p>
<h2>A month of nights for a band 5 nurse</h2>
<p>Take a band 5 nurse at entry who works three twelve-hour nights a fortnight, about 72 hours a month at night, with one Sunday night in the month among them. At ${h.m2(h.PAY.afcHourly('5', 0))} an hour, 60 weeknight or Saturday hours add ${h.m2(60 * h.PAY.afcHourly('5', 0) * h.PAY.unsocialRates('5')[0])} and 12 Sunday hours add ${h.m2(12 * h.PAY.afcHourly('5', 0) * h.PAY.unsocialRates('5')[1])}. Over a year that is around ${h.m(12 * (60 * h.PAY.afcHourly('5', 0) * h.PAY.unsocialRates('5')[0] + 12 * h.PAY.afcHourly('5', 0) * h.PAY.unsocialRates('5')[1]))} of pensionable pay, enough to move total pay past the ${h.m(35155)} tier line. Enter your own hours in the calculator above, and add the result to basic pay in the take-home calculator.</p>`;
  },
});
