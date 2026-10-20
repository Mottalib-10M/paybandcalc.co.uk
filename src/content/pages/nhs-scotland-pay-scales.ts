import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'nhs-scotland-pay-scales',
  group: 'nations',
  order: 60,
  tool: { kind: 'nhs', props: { nation: 'scotland', band: '5' } },
  related: ['scottish-tax-nhs-teachers', 'nhs-pay-rise-2026', 'teacher-pay-scotland', 'nhs-pension-contributions'],
  sources: ['scot_afc', 'sppa_nhs_tiers', 'nhse_handbook', 'gov_tax'],
  slug: 'nhs-scotland-pay-scales',
  nav: 'NHS Scotland pay',
  card: 'Every band and point of the 2026/27 Scottish scale, with Scottish income tax and the SPPA pension tiers.',
  title: 'NHS Scotland Pay Scales 2026/27: Bands, Points and Take-Home',
  description: 'NHS Scotland pay scales 2026/27: every Agenda for Change band and point from 1 April 2026, take-home after Scottish income tax, NI and the SPPA pension tier.',
  h1: 'NHS Scotland pay scales for 2026/27',
  intro: 'Choose your band and point. The calculator uses the Scottish scale, Scottish income tax bands and the NHS Superannuation Scheme (Scotland) tiers.',
  resume: (h) => {
    const S = h.P.afc.scotland, b5 = h.PAY.afcPay('scotland', '5', 0), r = h.nhsNet('scotland', b5);
    return `NHS Scotland pays Agenda for Change staff on its own scale, which from 1 April 2026 is ${h.pc(S.award)} higher than in 2025/26, the second year of a two-year deal. The Scottish Government page, updated on ${h.date(S.updated)}, gives band 1 at ${h.m(S.band1)}, band 2 from ${h.m(h.PAY.afcPay('scotland', '2', 0))}, band 5 from ${h.m(b5)} to ${h.m(h.PAY.afcPay('scotland', '5', 2))}, band 7 from ${h.m(h.PAY.afcPay('scotland', '7', 0))} and band 9 up to ${h.m(h.PAY.afcPay('scotland', '9', 1))}. Scottish pay is higher than in England at most points, but three things change the take-home. Income tax follows the six Scottish bands, so most staff from band 5 upward pay the 21 % intermediate rate on part of their pay and band 7 reaches the 42 % higher rate. The pension is the NHS Superannuation Scheme (Scotland), with its own tiers from the SPPA. And there is no High Cost Area Supplement. A band 5 at entry takes home about ${h.m(r.monthly)} a month after a pension of ${h.pc(r.pensionRate)}, Scottish tax and NI, with no student loan.`;
  },
  faqs: (h) => [
    { q: 'Is NHS pay higher in Scotland than in England?', a: `At most points, yes. Band 5 starts at ${h.m(h.PAY.afcPay('scotland', '5', 0))} in Scotland against ${h.m(h.PAY.afcPay('england', '5', 0))} in England in 2026/27, and band 2 at ${h.m(h.PAY.afcPay('scotland', '2', 0))} against ${h.m(h.PAY.afcPay('england', '2', 0))}. Scottish income tax takes more from salaries above the starter and basic bands, so the take-home gap is narrower than the gross gap.` },
    { q: 'What pension do NHS Scotland staff pay?', a: `Members of the NHS Superannuation Scheme (Scotland) pay a rate set by their tier on actual pensionable pay. From 1 April 2026 the SPPA circular sets ${h.num(h.PEN.tierTable('nhsScot').length)} tiers, from ${h.pc(h.PEN.tierTable('nhsScot')[0].rate)} to ${h.pc(h.PEN.tierTable('nhsScot').at(-1)!.rate)}. A band 5 at entry pays ${h.pc(h.PEN.tier('nhsScot', h.PAY.afcPay('scotland', '5', 0)).rate)}. The contribution is taken before Scottish income tax.` },
    { q: 'How does pay progression work in NHS Scotland?', a: 'The Scottish scale lists the points of each band without waiting times, and the Scottish section of the NHS terms and conditions handbook makes progression automatic except in named cases, such as a capability process at a formal stage or mandatory training not completed for reasons within your control. Your pay step date is set in your contract.' },
  ],
  body: (h) => {
    const rows = h.PAY.BANDS.map((b) => { const pts = h.PAY.afcPoints('scotland', b); return [`Band ${b}`, pts.map((p) => h.m(p.pay)).join(' / '), h.m(h.nhsNet('scotland', pts[0].pay).monthly), h.m(h.nhsNet('scotland', pts.at(-1)!.pay).monthly)]; });
    const cmp = (['3', '5', '6', '7', '8a'] as const).map((b) => { const s = h.PAY.afcPay('scotland', b, 0), e = h.PAY.afcPay('england', b, 0); return [`Band ${b} entry`, h.m(s), h.m(e), h.m(h.nhsNet('scotland', s).monthly), h.m(h.nhsNet('england', e).monthly)]; });
    return `<h2>Every band, 2026/27</h2>
${h.table(['Band', 'Points from 1 April 2026', 'Take-home a month, first point', 'Take-home a month, top'], rows, `NHS Scotland Agenda for Change, gov.scot, updated ${h.date(h.P.afc.scotland.updated)}. Full time, Scottish income tax, NI, NHS Superannuation Scheme (Scotland) tier, no student loan.`, ['l', 'l', 'r', 'r'])}
<h2>Scotland against England at the same band</h2>
${h.table(['Point', 'Scotland', 'England', 'Take-home Scotland', 'Take-home England'], cmp, 'Entry point, full time, outside London, 2026/27. Each nation with its own tax and pension scheme.', ['l', 'r', 'r', 'r', 'r'])}
<p>The gross gap is wider than the take-home gap. For pay between the Scottish basic and higher thresholds, the 21 % intermediate rate and the 42 % higher rate starting lower in the scale take back part of the advantage, and the Scottish pension tiers are not identical to those of England and Wales. The ${h.a('scottish-tax-nhs-teachers', 'Scottish tax page')} measures the tax difference alone for any salary.</p>
<h2>Fewer points in each band</h2>
<p>The Scottish scale has two points in bands 2, 3 and 4 and in bands 8a to 9, and three points in bands 5, 6 and 7, so the top of a band is reached by a different route than in England. A band 8a in Scotland moves from ${h.m(h.PAY.afcPay('scotland', '8a', 0))} to ${h.m(h.PAY.afcPay('scotland', '8a', 1))}; a band 7 has three points, from ${h.m(h.PAY.afcPay('scotland', '7', 0))} to ${h.m(h.PAY.afcPay('scotland', '7', 2))}. Band 1 is still open in Scotland, at ${h.m(h.P.afc.scotland.band1)}, whereas England closed it to new entrants.</p>
<h2>The two-year deal</h2>
<p>The 2025/26 rise of ${h.pc(h.P.afc.scotland.previousAward)} and the 2026/27 rise of ${h.pc(h.P.afc.scotland.award)} come from the same agreement, which guaranteed at least one percentage point above CPI inflation; the gov.scot page explains that the first year was raised once inflation was known. The ${h.a('nhs-pay-rise-2026', 'pay rise page')} sets the Scottish figures beside the other nations, point by point.</p>
<p>If you live in Scotland but work for an English trust, or the other way round, your income tax follows where you live, not where you work, while the pay scale and pension follow the employer. Check the tax code on your payslip: it starts with S for Scottish taxpayers. In the calculator, the option for where you pay income tax lets you set this separately from where you work.</p>
<h2>Reading the Scottish table</h2>
<p>The gov.scot page lists each band with its points in order, the first being the entry point. A new starter is normally appointed to the first point of the band; if your offer letter names a higher point, it should say why, for example recognised previous experience. Pay is shown as an annual full-time salary for the standard Scottish working week, and part-time staff are paid the matching share. When you compare a Scottish post with an English one, compare take-home rather than salary, because the tax and pension differences shown above can turn a higher gross figure into a smaller net gain than expected.</p>`;
  },
});
