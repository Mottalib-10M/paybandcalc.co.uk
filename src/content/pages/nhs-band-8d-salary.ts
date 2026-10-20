import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'nhs-band-8d-salary',
  group: 'bands',
  order: 19,
  tool: { kind: 'nhs', props: { band: '8d' } },
  related: ['nhs-band-8c-salary', 'nhs-band-9-salary', 'nhs-pension-calculator', 'nhs-london-weighting-hcas'],
  sources: ['nhse_afc', 'nhsbsa_tiers', 'hmrc_rates', 'gov_tax', 'gov_relief'],
  slug: 'nhs-band-8d-salary',
  nav: 'Band 8d',
  card: 'The band that straddles £100,000, and how the pension contribution keeps its taxable pay under the taper.',
  title: 'NHS Band 8d Salary 2026/27: Take-Home and the £100k Taper',
  description: 'NHS band 8d salary in 2026/27: £94,356 to £108,814 in England. Monthly take-home and why the NHS pension keeps taxable pay under the £100,000 allowance taper.',
  h1: 'NHS band 8d salary and the £100,000 line',
  intro: 'Band 8d is the grade of directors of service, chief professionals and senior consultants in non-medical roles. The calculator starts on the entry point; try the top point to see the taper question.',
  resume: (h) => {
    const p = h.PAY.afcPoints('england', '8d'), a = h.nhsNet('england', p[0].pay), c = h.nhsNet('england', p[2].pay);
    const adj = p[2].pay - c.pension;
    return `Band 8d in England pays ${h.m(p[0].pay)} at entry, ${h.m(p[1].pay)} at the intermediate point and ${h.m(p[2].pay)} at the top in 2026/27, on the NHS Employers scale. Two of those salaries are above ${h.m(h.P.tax.taperThreshold)}, the income at which the Personal Allowance starts to fall by £1 for every £2, which would make part of the pay taxed at an effective 60 %. In practice none of them loses any allowance outside London. NHS pension contributions are taken from pay before income tax, so the income that counts is pay after the ${h.pc(c.pensionRate)} contribution: at the top point that is ${h.m(adj)}, below the line. Take-home pay is ${h.m(a.monthly)} a month at entry and ${h.m(c.monthly)} at the top, full time, with no student loan. In inner London the capped supplement of ${h.m(h.P.afc.england.hcas.inner.max)} changes that for the top point, which then loses part of the allowance, as the London table below shows.`;
  },
  faqs: (h) => [
    { q: 'Does a band 8d salary lose the Personal Allowance?', a: `Not outside London. The allowance tapers on income above ${h.m(h.P.tax.taperThreshold)} after pension contributions taken under the net pay arrangement. The top of band 8d, ${h.m(h.PAY.afcPay('england', '8d', 2))}, is ${h.m(h.PAY.afcPay('england', '8d', 2) - h.PEN.contribution('nhsEW', h.PAY.afcPay('england', '8d', 2)))} after the ${h.pc(h.PEN.tier('nhsEW', 108814).rate)} contribution, so the full ${h.m(h.P.tax.personalAllowance)} is kept. Other income, such as rent or savings interest, can still take you over.` },
    { q: 'What is the 60 % tax trap for NHS managers?', a: `Between ${h.m(h.P.tax.taperThreshold)} and ${h.m(h.P.tax.ruk.bands[1].upTo!)} of income, each £2 of extra income removes £1 of Personal Allowance, which is then taxed at 40 %. So £100 of extra pay costs £40 of tax plus £20 on the lost allowance: an effective 60 %, before National Insurance and pension. Band 8d and 9 staff in London are the Agenda for Change staff most likely to meet it.` },
    { q: 'How much pension does a year at the top of band 8d add?', a: `One year at ${h.m(h.PAY.afcPay('england', '8d', 2))} adds ${h.m(h.PAY.afcPay('england', '8d', 2) / 54)} a year to a 2015 scheme pension, payable from your normal pension age and revalued at CPI plus 1.5 % every April while you are an active member. The contribution for that year is ${h.m(h.PEN.contribution('nhsEW', h.PAY.afcPay('england', '8d', 2)))}, before tax relief at 40 %.` },
  ],
  body: (h) => {
    const p = h.PAY.afcPoints('england', '8d');
    const ldn = p.map((x, i) => { const g = x.pay + h.PAY.hcas(x.pay, 'inner'), r = h.nhsNet('england', g), adj = g - r.pension; return [h.PAY.stepLabel('england', '8d', i), h.m(g), h.m(adj), h.m(h.TAX.personalAllowance(adj)), h.m(r.monthly)]; });
    return `<h2>Band 8d take-home, England 2026/27</h2>
${h.bandNetTable('england', '8d')}
<h2>Band 8d in inner London</h2>
${h.table(['Point', 'Pay with HCAS', 'Income after pension', 'Personal Allowance left', 'Take-home a month'], ldn, 'Band 8d with the inner London supplement, full time, no other income. Worked out by the engine of this site.', ['l', 'r', 'r', 'r', 'r'])}
<p>With ${h.m(h.P.afc.england.hcas.inner.max)} of HCAS, the top point passes the line even after the pension, while the intermediate point stays just under it. The allowance lost is half of the excess, and the tax on it is at 40 %, so the effective rate on that slice of pay is 60 % before National Insurance at 2 %. Paying more into the pension through additional voluntary contributions would reduce income below the line, but the scheme's options and limits are outside what this site models.</p>
<h2>Why the pension matters more at band 8d</h2>
<p>GOV.UK describes the way the NHS scheme gives tax relief: the employer takes pension contributions out of pay before deducting income tax. At band 8d that relief is worth 40 % on most of the contribution and up to 60 % on any part that keeps income below the taper line. It does not reduce National Insurance or student loan repayments, which are worked out on pay before the pension.</p>
<p>At this level the yearly growth of the pension can also be large enough to meet the annual allowance for pension saving. The test uses the growth in the value of your NHS benefits over the year, not your contribution, and depends on your whole record; the NHS Pensions annual statement gives the figure. This site does not estimate it.</p>
<h2>Other income and the taper</h2>
<p>The taper is applied to adjusted net income from all sources, not to NHS pay alone. Rent from a let property, savings interest above the allowances, dividends or a second job all count, and a Gift Aid donation or a pension contribution paid with relief at source reduces the figure. An 8d manager outside London at the top point has about ${h.m(h.P.tax.taperThreshold - (p[2].pay - h.PEN.contribution('nhsEW', p[2].pay)))} of room before the line. Beyond that, each £100 of other income costs £60 in income tax. The calculator only knows your NHS pay, so add other income to your own check.</p>
<h2>Band 8d outside England</h2>
<p>Scotland pays ${h.m(h.PAY.afcPay('scotland', '8d', 0))} and ${h.m(h.PAY.afcPay('scotland', '8d', 1))}; the Scottish taper works the same way, but income above ${h.m(h.P.tax.scotland.bands[3].upTo!)} of taxable pay is charged at 45 %, so the effective rate on the tapered slice is higher. Wales pays ${h.m(h.PAY.afcPay('wales', '8d', 0))} to ${h.m(h.PAY.afcPay('wales', '8d', 2))}, and Northern Ireland's ${h.P.afc.ni.year} scale ${h.m(h.PAY.afcPay('ni', '8d', 0))} to ${h.m(h.PAY.afcPay('ni', '8d', 2))}.</p>`;
  },
});
