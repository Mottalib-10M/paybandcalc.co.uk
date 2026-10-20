import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'nhs-band-7-salary',
  group: 'bands',
  order: 15,
  tool: { kind: 'nhs', props: { band: '7' } },
  related: ['nhs-band-6-salary', 'nhs-band-8a-salary', 'nhs-pension-contributions', 'scottish-tax-nhs-teachers'],
  sources: ['nhse_afc', 'nhsbsa_tiers', 'hmrc_rates', 'scot_afc'],
  slug: 'nhs-band-7-salary',
  nav: 'Band 7',
  card: 'Where higher rate tax and the 2 % NI rate begin, and how the pension keeps most of band 7 below them.',
  title: 'NHS Band 7 Salary 2026/27: Take-Home and Higher Rate Tax',
  description: 'NHS band 7 salary for 2026/27: £49,387 to £56,515 in England. Take-home pay a month and why the pension keeps most of band 7 under the 40 % income tax line.',
  h1: 'NHS band 7 salary in 2026/27 and the higher rate line',
  intro: 'Band 7 covers advanced practitioners, ward managers and senior specialists. It is the band where the higher rate of income tax first comes into view; the calculator shows exactly where.',
  resume: (h) => {
    const p = h.PAY.afcPoints('england', '7'), a = h.nhsNet('england', p[0].pay), c = h.nhsNet('england', p[2].pay);
    const line = h.P.tax.personalAllowance + h.P.tax.ruk.bands[0].upTo!;
    return `Band 7 in England pays ${h.m(p[0].pay)}, ${h.m(p[1].pay)} and ${h.m(p[2].pay)} in 2026/27 under the NHS Employers circular, with five years from entry to top. Two thresholds sit inside the band. National Insurance falls from 8 % to 2 % on pay above ${h.m(h.P.tax.ni.upperEarningsLimit)}, so every band 7 salary pays the lower rate on part of its pay. Income tax rises from 20 % to 40 % on taxable pay above ${h.m(line)}, but taxable pay is pay after the NHS pension, so the entry and intermediate points stay entirely in the basic rate band: at the top point only ${h.m(Math.max(0, c.taxable + h.TAX.personalAllowance(c.gross - c.pension) - line))} is taxed at 40 %. The pension rate is ${h.pc(a.pensionRate)} for the first two points and ${h.pc(c.pensionRate)} at the top. Take-home is ${h.m(a.monthly)} a month at entry and ${h.m(c.monthly)} at the top, full time, outside London, with no student loan.`;
  },
  faqs: (h) => [
    { q: 'Do band 7 nurses pay 40 % tax?', a: `Only a little, and only at the top point outside London. The NHS pension is taken before tax, so a salary of ${h.m(h.PAY.afcPay('england', '7', 2))} gives taxable pay just over the higher rate line. In inner London, where HCAS adds up to ${h.m(h.P.afc.england.hcas.inner.max)}, every band 7 point has some pay in the 40 % band. In Scotland the 42 % rate starts lower and catches all of band 7.` },
    { q: 'Why is the band 7 pension rate higher at the top point?', a: `The NHSBSA tier that runs from ${h.m(35156)} to ${h.m(52778)} is charged at ${h.pc(h.PEN.tier('nhsEW', 50000).rate)}. The top of band 7, ${h.m(h.PAY.afcPay('england', '7', 2))}, falls in the next tier, ${h.pc(h.PEN.tier('nhsEW', 56515).rate)}, which applies to the whole salary. Because contributions come off before tax, part of the extra cost is returned as tax relief, at 40 % on the slice above the line.` },
    { q: 'How much is band 7 in Scotland after tax?', a: `Scotland pays ${h.m(h.PAY.afcPay('scotland', '7', 0))} to ${h.m(h.PAY.afcPay('scotland', '7', 2))}, more than England, but Scottish income tax is 42 % above about ${h.m(h.P.tax.personalAllowance + h.P.tax.scotland.bands[2].upTo!)} of income. Take-home runs from ${h.m(h.nhsNet('scotland', h.PAY.afcPay('scotland', '7', 0)).monthly)} to ${h.m(h.nhsNet('scotland', h.PAY.afcPay('scotland', '7', 2)).monthly)} a month, with the Scottish NHS pension tiers. The Scottish pension tiers are narrower too, so the contribution rate climbs from point to point inside the band, which takes a further share of each step.` },
  ],
  body: (h) => {
    const p = h.PAY.afcPoints('england', '7');
    const nations = (['england', 'scotland', 'wales', 'ni'] as const).map((n) => { const top = h.PAY.afcPay(n, '7', 2), r = h.nhsNet(n, top); return [h.PAY.NATION_LABEL[n] + (n === 'ni' ? ` (${h.P.afc.ni.year})` : ''), h.m(top), h.pc(r.pensionRate), h.m(r.tax), h.m(r.monthly)]; });
    return `<h2>Band 7 take-home, England 2026/27</h2>
${h.bandNetTable('england', '7')}
<h2>The top of band 7 in each nation</h2>
${h.table(['Nation', 'Top point', 'Pension rate', 'Income tax', 'Take-home a month'], nations, 'Top point of band 7, full time, no student loan; Scottish income tax for Scotland. Worked out by the engine of this site.', ['l', 'r', 'r', 'r', 'r'])}
<p>The Scottish column shows the effect of the 42 % higher rate, which in 2026/27 starts once taxable income passes ${h.m(h.P.tax.scotland.bands[2].upTo!)} above the Personal Allowance, against ${h.m(h.P.tax.ruk.bands[0].upTo!)} elsewhere. A band 7 nurse in Glasgow earns more than one in Leeds and pays more tax on it; the ${h.a('scottish-tax-nhs-teachers', 'Scottish tax page')} compares any salary.</p>
<h2>Why salary sacrifice is not in the calculator</h2>
<p>Many employers run salary sacrifice schemes, for example for cars or bicycles, which lower the pay on which income tax and National Insurance are worked out. NHSBSA states that NHS pension contributions themselves cannot be paid by salary sacrifice. The effect on take-home is larger at band 7 than at lower bands because of the higher rate line, but the terms differ by employer. The calculator leaves them out; your payslip shows the sacrificed amount on its own line.</p>
<h2>How the pension softens the higher rate</h2>
<p>Contributions under the NHS scheme are taken from pay before income tax, the arrangement GOV.UK describes as the employer taking workplace pension contributions out of pay before deducting tax. For a band 7 salary that has the effect of pulling taxable pay back under the higher rate line at two of the three points. At the top point the contribution of ${h.m(h.PEN.contribution('nhsEW', p[2].pay))} saves 20 % tax on most of it and 40 % on the slice that would otherwise have been taxed at the higher rate. National Insurance gets no such relief: it is charged on pay before the pension, at 8 % up to ${h.m(h.P.tax.ni.upperEarningsLimit)} and 2 % above.</p>
<p>Someone at band 7 who also repays a Plan 2 student loan loses a further 9 % of pay above ${h.m(h.P.tax.studentLoans.plan2.threshold)}, which is ${h.m(h.TAX.studentLoan(p[0].pay, 'plan2'))} a year at the entry point. With the pension, tax, NI and loan together, the marginal deduction on a pound of band 7 pay is well over a third.</p>
<h2>From band 7 to band 8a</h2>
<p>Band 8a starts at ${h.m(h.PAY.afcPay('england', '8a', 0))}, ${h.m(h.PAY.afcPay('england', '8a', 0) - p[2].pay)} above the top of band 7. All of that rise is in the higher rate band and the 2 % NI band, and the pension rate stays at ${h.pc(h.PEN.tier('nhsEW', h.PAY.afcPay('england', '8a', 0)).rate)}, so take-home rises by ${h.m(h.nhsNet('england', h.PAY.afcPay('england', '8a', 0)).monthly - h.nhsNet('england', p[2].pay).monthly)} a month. The ${h.a('nhs-band-8a-salary', 'band 8a page')} continues from there.</p>`;
  },
});
