import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'nhs-band-8c-salary',
  group: 'bands',
  order: 18,
  tool: { kind: 'nhs', props: { band: '8c' } },
  related: ['nhs-band-8b-salary', 'nhs-band-8d-salary', 'nhs-pay-progression', 'pension-lump-sum-commutation'],
  sources: ['nhse_afc', 'nhse_handbook', 'nhsbsa_tiers', 'hmrc_rates'],
  slug: 'nhs-band-8c-salary',
  nav: 'Band 8c',
  card: 'Three points to £91,609, the re-earnable top of the band, and the take-home at each point.',
  title: 'NHS Band 8c Salary 2026/27: Pay Points, Take-Home, Top Pay',
  description: 'NHS band 8c salary for 2026/27: £79,504, £84,346 and £91,609 in England. Take-home pay a month and the rule that makes part of top-of-band pay re-earnable.',
  h1: 'NHS band 8c salary in 2026/27 and the re-earnable top',
  intro: 'Band 8c is a senior management and consultant grade. Set your point and nation in the calculator; the page explains the rule that applies once you reach the top.',
  resume: (h) => {
    const p = h.PAY.afcPoints('england', '8c'), a = h.nhsNet('england', p[0].pay), c = h.nhsNet('england', p[2].pay);
    return `Band 8c in England pays ${h.m(p[0].pay)} at entry, ${h.m(p[1].pay)} after ${p[0].years} years and ${h.m(p[2].pay)} after ${p[1].years} more, on the 2026/27 scale published by NHS Employers. The whole band is in the top NHS pension tier, ${h.pc(a.pensionRate)} of pensionable pay, and most of each salary is taxed at 40 %. Take-home pay is ${h.m(a.monthly)} a month at entry and ${h.m(c.monthly)} at the top point, full time, outside London, without a student loan. Band 8c is also the first band where the top point is not simply kept. Under paragraph 1.11 of the NHS terms and conditions handbook, twelve months after reaching the top of bands 8c, 8d and 9, 5 % or 10 % of basic salary becomes re-earnable: it stays in your pay if the Annex 23 standards are met each year and can be reduced from the pay step date if they are not.`;
  },
  faqs: (h) => [
    { q: 'What does re-earnable pay at the top of band 8c mean?', a: `Twelve months after you reach ${h.m(h.PAY.afcPay('england', '8c', 2))}, a slice of 5 % or 10 % of basic salary depends on meeting the pay progression standards each year. If they are met, pay stays at the top. If not, it can be reduced by that slice from the pay step date and restored at the end of the following year once the standards are met again. You can contest a reduction through the local procedure.` },
    { q: 'How much would a 10 % reduction at the top of band 8c cost each month?', a: `Ten per cent of ${h.m(h.PAY.afcPay('england', '8c', 2))} is ${h.m(h.PAY.afcPay('england', '8c', 2) * 0.1)} a year gross. After the lower pension contribution, tax and National Insurance, take-home would fall by ${h.m(h.nhsNet('england', h.PAY.afcPay('england', '8c', 2)).monthly - h.nhsNet('england', h.PAY.afcPay('england', '8c', 2) * 0.9).monthly)} a month, since a large part of the slice would have been taxed at 40 %. The pension rate would stay the same.` },
    { q: 'Is a band 8c salary above the £100,000 taper line?', a: `No. The top of band 8c is ${h.m(h.PAY.afcPay('england', '8c', 2))}, and taxable income is lower still once the NHS pension is taken off. The Personal Allowance starts to be withdrawn above ${h.m(h.P.tax.taperThreshold)} of adjusted net income, which in Agenda for Change is first reached in band 8d. In inner London, the capped supplement of ${h.m(h.P.afc.england.hcas.inner.max)} still leaves the top of 8c below it.` },
  ],
  body: (h) => {
    const p = h.PAY.afcPoints('england', '8c');
    const nations = (['england', 'scotland', 'wales', 'ni'] as const).map((n) => { const pts = h.PAY.afcPoints(n, '8c'); const lo = h.nhsNet(n, pts[0].pay), hi = h.nhsNet(n, pts[pts.length - 1].pay); return [h.PAY.NATION_LABEL[n] + (n === 'ni' ? ` (${h.P.afc.ni.year})` : ''), `${h.m(pts[0].pay)} to ${h.m(pts[pts.length - 1].pay)}`, `${h.m(lo.monthly)} to ${h.m(hi.monthly)}`]; });
    return `<h2>Band 8c take-home, England 2026/27</h2>
${h.bandNetTable('england', '8c')}
<h2>Band 8c across the four nations</h2>
${h.table(['Nation', 'Basic pay', 'Take-home a month'], nations, 'Band 8c, full time, no student loan, pension in the nation’s NHS or HSC scheme, Scottish income tax for Scotland.', ['l', 'r', 'r'])}
<p>Scotland has two 8c points, ${h.m(h.PAY.afcPay('scotland', '8c', 0))} and ${h.m(h.PAY.afcPay('scotland', '8c', 1))}. Both are high enough that, after the ${h.pc(h.PEN.tier('nhsScot', 95000).rate)} Scottish pension contribution, part of taxable income is charged at the 45 % advanced rate, which starts ${h.m(h.P.tax.scotland.bands[3].upTo!)} above the Personal Allowance. Welsh 8c pay is ${h.m(h.PAY.afcPay('wales', '8c', 0))} to ${h.m(h.PAY.afcPay('wales', '8c', 2))}. Northern Ireland's ${h.P.afc.ni.year} figures will be replaced when the ${h.P.afc.ni.next.year} circular is issued.</p>
<h2>The re-earnable top, in practice</h2>
<p>The rule in paragraph 1.11 of the handbook applies only to the top of bands 8c, 8d and 9 in England. It does not create a new pay point; it puts a share of top-of-band pay at risk each year after the first. The standards are the same as for any pay step under Annex 23: a completed appraisal in the last twelve months, no formal capability process, no live disciplinary sanction, training up to date and, for managers, appraisals done for their own staff. The calculator assumes the standards are met and shows the full top point. To see the effect of a reduction, set the hours field to 90 % or 95 %, which scales basic pay in the same way.</p>
<h2>From band 8b to 8c, and on to 8d</h2>
<p>The entry point of 8c is ${h.m(p[0].pay - h.PAY.afcPay('england', '8b', 2))} above the top of 8b. Both are in the same pension tier and the same tax band, so the move keeps a steady share: take-home rises by ${h.m(h.nhsNet('england', p[0].pay).monthly - h.nhsNet('england', h.PAY.afcPay('england', '8b', 2)).monthly)} a month. The next move, to the entry point of band 8d at ${h.m(h.PAY.afcPay('england', '8d', 0))}, is the last one before the Personal Allowance taper comes into play; the ${h.a('nhs-band-8d-salary', 'band 8d page')} shows how the pension contribution keeps most of 8d below it.</p>
<h2>Pension at band 8c</h2>
<p>At ${h.pc(h.PEN.tier('nhsEW', p[0].pay).rate)} the contribution at the top point is ${h.m(h.PEN.contribution('nhsEW', p[2].pay))} a year, and with relief at 40 % on most of it the net cost is much less. Each year at that point adds ${h.m(p[2].pay / 54)} to the yearly pension. Members at this level often consider how much of the pension to exchange for a lump sum at retirement; the ${h.a('pension-lump-sum-commutation', 'lump sum page')} shows the trade at £12 for every £1 of pension given up, and what is left to live on each year after it.</p>`;
  },
});
