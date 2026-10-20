import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'nhs-northern-ireland-pay-scales',
  group: 'nations',
  order: 62,
  tool: { kind: 'nhs', props: { nation: 'ni', band: '5' } },
  related: ['nhs-pay-rise-2026', 'teacher-pay-northern-ireland', 'nhs-pension-contributions', 'agenda-for-change-pay-scales'],
  sources: ['ni_afc', 'ni_minister', 'hsc_tiers', 'hmrc_rates'],
  slug: 'nhs-northern-ireland-pay-scales',
  nav: 'HSC Northern Ireland pay',
  card: 'The HSC Agenda for Change scale in force in Northern Ireland, the 2026/27 award still to come, and take-home.',
  title: 'NHS Northern Ireland Pay Scales: HSC Bands and Take-Home Pay',
  description: 'NHS Northern Ireland pay scales: the HSC Agenda for Change scale in force on 20 October 2026, the 2026/27 award still to come, and take-home after pension.',
  h1: 'HSC Northern Ireland pay scales',
  intro: 'Health and social care staff in Northern Ireland are still paid on the 2025/26 scale. Choose your band and step to see take-home with the HSC pension tier.',
  resume: (h) => {
    const N = h.P.afc.ni, b5 = h.PAY.afcPay('ni', '5', 0), r = h.nhsNet('ni', b5);
    return `Agenda for Change staff in health and social care (HSC) in Northern Ireland are paid on a scale set by the Department of Health in Belfast. On 20 October 2026 the scale in force was the ${N.year} one, from circular HSC (AfC) 06/2025 of ${h.date(N.published)}, which applied a ${h.pc(N.award)} award from ${h.date(N.effective)}. For 2026/27, the Health Minister's statement of ${h.date(N.next.statement)} committed to the ${h.pc(N.next.committedAward)} awarded in England, but no pay circular had been issued, so the new figures are still to come and this site does not invent them. On the current scale band 2 is ${h.m(h.PAY.afcPay('ni', '2', 0))}, band 5 runs from ${h.m(b5)} to ${h.m(h.PAY.afcPay('ni', '5', 2))}, band 6 from ${h.m(h.PAY.afcPay('ni', '6', 0))} to ${h.m(h.PAY.afcPay('ni', '6', 2))}, and band 9 reaches ${h.m(h.PAY.afcPay('ni', '9', 2))}. HSC staff join the HSC Pension Scheme, with its own tiers from April 2026, and pay UK income tax. A band 5 at entry takes home about ${h.m(r.monthly)} a month at 2026/27 tax rates.`;
  },
  faqs: (h) => [
    { q: 'When will HSC staff get the 2026/27 pay rise?', a: `When the Department of Health issues its 2026/27 Agenda for Change circular. The Minister committed on ${h.date(h.P.afc.ni.next.statement)} to the ${h.pc(h.P.afc.ni.next.committedAward)} awarded in England, but no circular had been published on 20 October 2026. The 2025/26 award was backdated when it arrived in December 2025, and any arrears would normally be paid once the new scale is issued.` },
    { q: 'What is the HSC pension contribution rate?', a: `The HSC Pension Scheme sets a rate by tier on pensionable pay, like the NHS schemes in Great Britain, but with its own figures. From April 2026, a band 5 at the entry point of the current scale pays ${h.pc(h.PEN.tier('hscNI', h.PAY.afcPay('ni', '5', 0)).rate)} and a band 7 at entry ${h.pc(h.PEN.tier('hscNI', h.PAY.afcPay('ni', '7', 0)).rate)}. The contribution comes off before income tax.` },
    { q: 'Is HSC pay lower than NHS pay in England?', a: `On 20 October 2026, yes, because Northern Ireland is still on the 2025/26 scale while England moved to 2026/27 in April. Band 5 entry is ${h.m(h.PAY.afcPay('ni', '5', 0))} in Northern Ireland against ${h.m(h.PAY.afcPay('england', '5', 0))} in England. The 2025/26 Northern Ireland figures match the English scale of that year at most points.` },
  ],
  body: (h) => {
    const rows = h.PAY.BANDS.map((b) => { const pts = h.PAY.afcPoints('ni', b); return [`Band ${b}`, pts.map((p) => h.m(p.pay)).join(' / '), h.m(h.nhsNet('ni', pts[0].pay).monthly), h.m(h.nhsNet('ni', pts.at(-1)!.pay).monthly)]; });
    return `<h2>The scale in force, ${h.P.afc.ni.year}</h2>
${h.table(['Band', 'Points', 'Take-home a month, first point', 'Take-home a month, top'], rows, `HSC Agenda for Change, circular HSC (AfC) 06/2025 of ${h.date(h.P.afc.ni.published)}, from ${h.date(h.P.afc.ni.effective)}. Take-home at 2026/27 tax, NI and HSC pension tiers, full time, no student loan.`, ['l', 'l', 'r', 'r'])}
<h2>The 2026/27 award: still to come</h2>
<p>This site shows only published figures. The committed rise of ${h.pc(h.P.afc.ni.next.committedAward)} is a percentage, not a scale: when the circular comes out, the exact figure for each point will be the one it prints, which can differ from a simple percentage by rounding. Until then, the take-home figures here use the current scale with this year's tax rates, which is what HSC payslips show. The calculator's award option on the ${h.a('nhs-pay-rise-2026', 'pay rise page')} lets you test the committed percentage on your band as your own assumption.</p>
<h2>What the delay means for you</h2>
<p>A late award arrives as arrears. If the 2026/27 scale is backdated to 1 April 2026, as the 2025/26 one was, the months already paid at the old rate are made up in a single payment, which is taxed and pensioned in the month it is paid. That month's take-home will be higher than usual, and the pension contribution on the arrears is taken at your tier. Keep payslips from April onward so you can check the arrears against the new scale. The tier itself is read from your annual pensionable pay, so a backdated rise that carries you over a tier boundary also changes the rate on future months. The HSC Pension Service publishes the tier boundaries, which this site updates when a new year's table is issued.</p>
<h2>Same structure, separate administration</h2>
<p>The bands, the three-point structure from band 5 upward and the waiting times between points are the same as in England's scale of the same year. What differs is the administration: the Department of Health issues the circulars, the HSC Pension Service runs the pension, and the award depends on the Northern Ireland budget. Your take-home today is lower than that of an English colleague at the same band and point, partly because of the pay delay and partly because the HSC pension tiers differ. The ${h.a('nhs-pension-contributions', 'pension contributions page')} compares the HSC tiers with the other schemes, and the ${h.a('teacher-pay-northern-ireland', 'teacher pay page')} covers teachers in Northern Ireland, who face a similar delay.</p>`;
  },
});
