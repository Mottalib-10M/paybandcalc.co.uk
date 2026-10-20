import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'nhs-wales-pay-scales',
  group: 'nations',
  order: 61,
  tool: { kind: 'nhs', props: { nation: 'wales', band: '5' } },
  related: ['nhs-pay-rise-2026', 'teacher-pay-wales', 'nhs-pension-calculator', 'agenda-for-change-pay-scales'],
  sources: ['wales_afc', 'wales_stmt', 'nhsbsa_tiers', 'hmrc_rates'],
  slug: 'nhs-wales-pay-scales',
  nav: 'NHS Wales pay',
  card: 'The Welsh 2026/27 Agenda for Change scale from pay letter AfC(W) 02/2026, with take-home on every band.',
  title: 'NHS Wales Pay Scales 2026/27: Every Band and Take-Home Pay',
  description: 'NHS Wales pay scales 2026/27 from pay letter AfC(W) 02/2026: every Agenda for Change band and point from 1 April 2026, with take-home after pension, tax and NI.',
  h1: 'NHS Wales pay scales for 2026/27',
  intro: 'Choose your band and pay step. The calculator uses the Welsh scale with the NHS Pension Scheme tiers of England and Wales and UK income tax.',
  resume: (h) => {
    const W = h.P.afc.wales, b5 = h.PAY.afcPay('wales', '5', 0), r = h.nhsNet('wales', b5);
    return `NHS Wales pays Agenda for Change staff on a Welsh scale, published by the Welsh Government in pay letter AfC(W) 02/2026 on ${h.date(W.published)} and effective from 1 April 2026. The scale follows the same bands and the same three-point structure from band 5 upward as England, but the figures are Welsh. The floor is higher: band 1 is ${h.m(W.band1)}, and band 2 and the entry point of band 3 are both ${h.m(h.PAY.afcPay('wales', '2', 0))}, above the English band 2 of ${h.m(h.PAY.afcPay('england', '2', 0))}. Band 5 runs from ${h.m(b5)} to ${h.m(h.PAY.afcPay('wales', '5', 2))}, band 6 from ${h.m(h.PAY.afcPay('wales', '6', 0))} to ${h.m(h.PAY.afcPay('wales', '6', 2))}, and band 9 tops out at ${h.m(h.PAY.afcPay('wales', '9', 2))}. Welsh NHS staff belong to the NHS Pension Scheme of England and Wales, run by NHSBSA, and pay UK income tax at the same rates as England. A band 5 at entry takes home about ${h.m(r.monthly)} a month, with a pension rate of ${h.pc(r.pensionRate)}. There is no High Cost Area Supplement in Wales.`;
  },
  faqs: (h) => [
    { q: 'Is NHS Wales pay the same as England?', a: `No. Wales publishes its own scale, with a higher floor and different figures at most points. For 2026/27, band 5 starts at ${h.m(h.PAY.afcPay('wales', '5', 0))} in Wales and ${h.m(h.PAY.afcPay('england', '5', 0))} in England, and band 7 at ${h.m(h.PAY.afcPay('wales', '7', 0))} against ${h.m(h.PAY.afcPay('england', '7', 0))}. Tax and pension rules are the same in both, so the take-home difference follows the pay difference.` },
    { q: 'Why are band 2 and band 3 the same in Wales?', a: `Because the Welsh floor of ${h.m(h.PAY.afcPay('wales', '2', 0))} applies to the bottom of the scale: in AfC(W) 02/2026, band 2 and the entry point of band 3 share that figure, and the second point of band 3 is ${h.m(h.PAY.afcPay('wales', '3', 1))}. A band 3 in Wales gains on the move to the top point rather than on entry.` },
    { q: 'Which pension scheme do NHS Wales staff join?', a: `The NHS Pension Scheme for England and Wales, administered by NHSBSA. The 2015 scheme builds a pension of one fifty-fourth of each year’s pensionable pay, revalued by CPI plus 1.5 % while you work. Contributions follow the same tiers as in England, from ${h.pc(h.PEN.tierTable('nhsEW')[0].rate)} to ${h.pc(h.PEN.tierTable('nhsEW').at(-1)!.rate)}.` },
  ],
  body: (h) => {
    const rows = h.PAY.BANDS.map((b) => { const pts = h.PAY.afcPoints('wales', b); return [`Band ${b}`, pts.map((p) => h.m(p.pay)).join(' / '), h.m(h.nhsNet('wales', pts[0].pay).monthly), h.m(h.nhsNet('wales', pts.at(-1)!.pay).monthly)]; });
    const cmp = (['2', '4', '5', '6', '7', '8a', '9'] as const).map((b) => { const w = h.PAY.afcPay('wales', b, 0), e = h.PAY.afcPay('england', b, 0); return [`Band ${b} entry`, h.m(w), h.m(e), h.m(w - e), h.m(h.nhsNet('wales', w).monthly - h.nhsNet('england', e).monthly)]; });
    return `<h2>Every band, 2026/27</h2>
${h.table(['Band', 'Points from 1 April 2026', 'Take-home a month, first point', 'Take-home a month, top'], rows, `NHS Wales Agenda for Change, pay letter AfC(W) 02/2026 of ${h.date(h.P.afc.wales.published)}. Full time, NHS Pension Scheme tier, UK income tax and NI, no student loan.`, ['l', 'l', 'r', 'r'])}
<h2>Wales against England, entry points</h2>
${h.table(['Point', 'Wales', 'England', 'Gross difference', 'Take-home difference a month'], cmp, 'Full time, outside London, 2026/27.', ['l', 'r', 'r', 'r', 'r'])}
<p>The gap is largest in pounds at the bottom of the scale, where the Welsh floor lifts band 2 and band 3, and it persists through the higher bands. Because the tax and pension rules are identical, most of the gross difference reaches take-home, minus the share taken by tax, NI and the pension at your tier.</p>
<h2>Same handbook, Welsh decisions</h2>
<p>Agenda for Change in Wales uses the NHS terms and conditions handbook, with Welsh annexes where the rules differ, and the Welsh Government decides the award after the NHS Pay Review Body reports. Its written statement of ${h.date(h.P.afc.wales.published)} set out the response for 2026/27. Unsocial hours, overtime and annual leave follow the handbook rules described on the ${h.a('nhs-unsocial-hours-pay', 'unsocial hours')} and ${h.a('nhs-overtime-pay', 'overtime')} pages, but the hourly rate they multiply is the Welsh one, which this site does not yet publish because the Welsh pay letter gives annual figures.</p>
<h2>Working across the border</h2>
<p>Staff who live in England and work for a Welsh health board, or the reverse, are paid on the employer's scale and pay the same UK income tax either way. The pension scheme is also the same, so moving between an English trust and a Welsh health board does not interrupt membership. Pay on moving follows the receiving employer's scale at your band and point. The ${h.a('nhs-pension-calculator', 'pension calculator')} projects the pension for either nation, since both use the 2015 scheme.</p>
<h2>Reading your Welsh payslip</h2>
<p>Your basic pay line should match your band and point in the table above, divided by twelve. Pension appears as a percentage of pensionable pay at your tier, taken before income tax, and National Insurance is charged on the full amount. If you work extra hours as a part-time member of staff, those hours are pensionable up to the full-time equivalent, as NHSBSA explains for the whole England and Wales scheme. A change of tier happens when your pensionable pay crosses a boundary, usually on a pay step date or on 1 April when a new scale starts, and the new rate then applies to all of your pay.</p>`;
  },
});
