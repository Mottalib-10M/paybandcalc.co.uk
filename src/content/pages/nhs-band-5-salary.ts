import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'nhs-band-5-salary',
  group: 'bands',
  order: 13,
  tool: { kind: 'nhs', props: { band: '5' } },
  related: ['nhs-band-6-salary', 'nhs-london-weighting-hcas', 'student-loan-nhs-teachers', 'nurse-vs-teacher-pay'],
  sources: ['nhse_afc', 'nhsbsa_tiers', 'hmrc_rates', 'scot_afc', 'wales_afc'],
  slug: 'nhs-band-5-salary',
  nav: 'Band 5',
  card: 'The newly qualified nurse band: three points, London figures, and take-home with a Plan 2 or Plan 5 loan.',
  title: 'NHS Band 5 Salary 2026/27: Nurse Take-Home Pay by Step',
  description: 'NHS band 5 salary for 2026/27: £32,073, £34,592 and £39,043 in England. Monthly take-home for a nurse after tax, NI, pension and student loan, London included.',
  h1: 'NHS band 5 salary in 2026/27: what a nurse takes home',
  intro: 'Band 5 is where most newly registered nurses, midwives and allied health professionals start. Set your step, your London area and your student loan in the calculator.',
  resume: (h) => {
    const p = h.PAY.afcPoints('england', '5'), a = h.nhsNet('england', p[0].pay), c = h.nhsNet('england', p[2].pay), l = h.nhsNet('england', p[0].pay, p[0].pay, ['plan2']);
    return `Band 5 has three pay points in England in 2026/27: ${h.m(p[0].pay)} at entry, ${h.m(p[1].pay)} after ${p[0].years} years and ${h.m(p[2].pay)} after ${p[0].years! + p[1].years!} years, from the NHS Employers scale in force since 1 April 2026. A newly registered nurse on the entry point takes home ${h.m(a.monthly)} a month after an NHS pension contribution of ${h.pc(a.pensionRate)}, income tax and National Insurance. With a Plan 2 student loan the figure falls to ${h.m(l.monthly)}. At the top point take-home is ${h.m(c.monthly)}, but the pension rate there is ${h.pc(c.pensionRate)} because ${h.m(p[2].pay)} is above the ${h.m(35155)} tier line. In inner London the entry salary becomes ${h.m(p[0].pay + h.PAY.hcas(p[0].pay, 'inner'))} with the High Cost Area Supplement, the figure NHS Employers gives in its own table. Scotland pays ${h.m(h.PAY.afcPay('scotland', '5', 0))} at entry and Wales ${h.m(h.PAY.afcPay('wales', '5', 0))}.`;
  },
  faqs: (h) => [
    { q: 'What is a newly qualified nurse paid in England in 2026?', a: `A newly registered nurse on band 5 starts on ${h.m(h.PAY.afcPay('england', '5', 0))} a year from 1 April 2026, or ${h.m2(h.PAY.afcHourly('5', 0))} an hour. That is about ${h.m(h.nhsNet('england', h.PAY.afcPay('england', '5', 0)).monthly)} a month after tax, NI and pension, before any student loan, unsocial hours or London supplement. The first step, to ${h.m(h.PAY.afcPay('england', '5', 1))}, comes after two years.` },
    { q: 'How much more does a band 5 nurse earn in London?', a: `The High Cost Area Supplement adds the higher of 20 % of basic pay and ${h.m(h.P.afc.england.hcas.inner.min)} in inner London, so ${h.m(h.PAY.hcas(h.PAY.afcPay('england', '5', 0), 'inner'))} at entry. Outer London adds ${h.m(h.PAY.hcas(h.PAY.afcPay('england', '5', 0), 'outer'))} and the fringe ${h.m(h.PAY.hcas(h.PAY.afcPay('england', '5', 0), 'fringe'))}. The supplement is pensionable and taxed like basic pay, but it is not used to work out overtime or unsocial hours.` },
    { q: 'Does a band 5 nurse repay a student loan?', a: `On a Plan 2 loan, yes: ${h.pc(h.P.tax.studentLoans.plan2.rate, 0)} of pay above ${h.m(h.P.tax.studentLoans.plan2.threshold)}, which is ${h.m(h.TAX.studentLoan(h.PAY.afcPay('england', '5', 0), 'plan2'))} a year at the entry point. Plan 5, with a threshold of ${h.m(h.P.tax.studentLoans.plan5.threshold)}, takes ${h.m(h.TAX.studentLoan(h.PAY.afcPay('england', '5', 0), 'plan5'))}. A postgraduate loan adds ${h.pc(h.P.tax.studentLoans.postgrad.rate, 0)} above ${h.m(h.P.tax.studentLoans.postgrad.threshold)} on top. Repayments are based on pay before the pension contribution, like National Insurance, so the pension does not reduce them.` },
    { q: 'When does a band 5 nurse reach the top of the band?', a: `After four years in England, Wales and Northern Ireland: two years on the entry point, two on the intermediate point. Each step is paid on your pay step date when the appraisal and training standards are met. In Scotland band 5 has three points with progression that the national guidance describes as automatic in all but exceptional circumstances.` },
  ],
  body: (h) => {
    const p = h.PAY.afcPoints('england', '5');
    const loans: Array<[string, Array<'plan1' | 'plan2' | 'plan5' | 'postgrad'>]> = [['No loan', []], ['Plan 1', ['plan1']], ['Plan 2', ['plan2']], ['Plan 5', ['plan5']], ['Plan 2 and postgraduate', ['plan2', 'postgrad']]];
    const rows = loans.map(([l, pl]) => [l, ...p.map((x) => h.m(h.nhsNet('england', x.pay, x.pay, pl).monthly))]);
    return `<h2>Band 5 take-home with each student loan plan</h2>
<p>Most band 5 staff have a student loan, and the plan changes the monthly figure more than the step does in the first years. Repayments are 9 % of pay above the plan threshold, on pay before the pension, and a postgraduate loan adds 6 % above ${h.m(h.P.tax.studentLoans.postgrad.threshold)}.</p>
${h.table(['Loan', 'Entry', 'Intermediate', 'Top'], rows, 'Band 5, England 2026/27, full time, outside London: take-home a month. Worked out by the engine of this site.', ['l', 'r', 'r', 'r'])}
<p>Plan 2, with the highest threshold of the three at ${h.m(h.P.tax.studentLoans.plan2.threshold)}, takes the least at band 5; Plan 1, from ${h.m(h.P.tax.studentLoans.plan1.threshold)}, takes more; and Plan 5, from ${h.m(h.P.tax.studentLoans.plan5.threshold)}, takes the most. A nurse with both an undergraduate loan and a postgraduate loan repays on both at once, which is the last row of the table. The difference between the first and last rows is larger than the first pay step of the band, so a loan is worth entering in the calculator under More before comparing posts.</p>
<h2>The pension tier at the top of band 5</h2>
<p>The entry and intermediate points sit in the NHS tier that ends at ${h.m(35155)}, charged at ${h.pc(h.PEN.tier('nhsEW', p[0].pay).rate)}. The top point, ${h.m(p[2].pay)}, falls in the next tier, ${h.pc(h.PEN.tier('nhsEW', p[2].pay).rate)}, and the rate applies to the whole salary. The step from intermediate to top is ${h.m(p[2].pay - p[1].pay)} gross; after the higher pension rate, tax and NI it adds ${h.m(h.nhsNet('england', p[2].pay).monthly - h.nhsNet('england', p[1].pay).monthly)} a month. In return each year at the top point adds ${h.m(p[2].pay / 54)} a year of pension, against ${h.m(p[0].pay / 54)} at entry.</p>
<h2>Band 5 in the four nations</h2>
${h.table(['Point', 'England', 'Scotland', 'Wales', 'Northern Ireland ' + h.P.afc.ni.year], [0, 1, 2].map((i) => [i === 0 ? 'Entry / point 1' : i === 1 ? 'Intermediate / point 2' : 'Top / point 3', h.m(h.PAY.afcPay('england', '5', i)), h.m(h.PAY.afcPay('scotland', '5', i)), h.m(h.PAY.afcPay('wales', '5', i)), h.m(h.PAY.afcPay('ni', '5', i))]), 'Band 5 basic pay a year. England, Scotland and Wales 2026/27; Northern Ireland 2025/26, its 2026/27 circular still to come.', ['l', 'r', 'r', 'r', 'r'])}
<p>Scotland pays the most at every point after its two-year deal of ${h.pc(h.P.afc.scotland.previousAward)} in 2025/26 and ${h.pc(h.P.afc.scotland.award)} in 2026/27, but Scottish income tax is higher above about ${h.m(h.P.tax.personalAllowance + h.P.tax.scotland.bands[2].upTo!)}, where the 21 % intermediate rate gives way to 42 %. Band 5 stays below that line, so a Scottish nurse keeps most of the difference. The ${h.a('nhs-scotland-pay-scales', 'NHS Scotland page')} gives the full comparison.</p>
<p>Wales pays a little more than England at each point, and Northern Ireland less, because its ${h.P.afc.ni.year} scale has not yet been replaced. The Northern Ireland Health Minister said on ${h.date(h.P.afc.ni.next.statement)} that the ${h.pc(h.P.afc.ni.next.committedAward)} award for ${h.P.afc.ni.next.year} would be paid, but no pay circular had been issued on 20 October 2026, so this site shows the 2025/26 figures and will replace them when it is.</p>
<h2>Unsocial hours and the band 5 payslip</h2>
<p>Ward-based band 5 staff often earn more from unsocial hours than from the first pay step. Hours on a Saturday or between 8pm and 6am on a weekday are paid at time plus ${h.pc(h.PAY.unsocialRates('5')[0], 0)}, Sundays and public holidays at time plus ${h.pc(h.PAY.unsocialRates('5')[1], 0)}, on the hourly rate of ${h.m2(h.PAY.afcHourly('5', 0))} at entry. Those payments are pensionable, so they can move the pension rate into the next tier when they push total pensionable pay above ${h.m(35155)}. The ${h.a('nhs-unsocial-hours-pay', 'unsocial hours calculator')} totals a month of shifts.</p>`;
  },
});
