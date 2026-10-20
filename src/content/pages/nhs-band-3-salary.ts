import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'nhs-band-3-salary',
  group: 'bands',
  order: 11,
  tool: { kind: 'nhs', props: { band: '3' } },
  related: ['nhs-band-2-salary', 'nhs-band-4-salary', 'nhs-pay-progression', 'student-loan-nhs-teachers'],
  sources: ['nhse_afc', 'nhsbsa_tiers', 'hmrc_rates', 'scot_afc'],
  slug: 'nhs-band-3-salary',
  nav: 'Band 3',
  card: 'Two points two years apart, the take-home of each, and why the step is worth less than it looks.',
  title: 'NHS Band 3 Salary 2026/27: Pay Points and Monthly Take-Home',
  description: 'NHS band 3 salary in 2026/27: £25,760 at entry and £27,476 after two years in England, with the monthly take-home after tax, NI and pension at each point.',
  h1: 'NHS band 3 salary: both pay points and your take-home',
  intro: 'Band 3 is the grade of senior healthcare assistants, phlebotomists, team clerks and many estates staff. The calculator shows both points; change the step to see the second one.',
  resume: (h) => {
    const p = h.PAY.afcPoints('england', '3'), a = h.nhsNet('england', p[0].pay), b = h.nhsNet('england', p[1].pay);
    return `Band 3 in England starts at ${h.m(p[0].pay)} and moves to ${h.m(p[1].pay)} after ${p[0].years} years, on the 2026/27 scale of NHS Employers in force from 1 April 2026. That step is worth ${h.m(p[1].pay - p[0].pay)} a year before deductions. After the NHS pension at ${h.pc(a.pensionRate)}, income tax and National Insurance, the entry point leaves ${h.m(a.monthly)} a month and the top point ${h.m(b.monthly)}, so the step adds ${h.m(b.monthly - a.monthly)} a month to what reaches your account: about ${h.pc((b.net - a.net) / (p[1].pay - p[0].pay), 0)} of the gross rise, since the rest goes in tax, NI and pension. Wales starts band 3 at ${h.m(h.PAY.afcPay('wales', '3'))}, the same figure as its band 2. Scotland pays ${h.m(h.PAY.afcPay('scotland', '3', 0))} and ${h.m(h.PAY.afcPay('scotland', '3', 1))}. Every figure above is worked out by the same engine as the calculator, from the circulars and HMRC rates cited at the foot of the page.`;
  },
  faqs: (h) => [
    { q: 'How long does it take to reach the top of band 3?', a: `Two years in England, Wales and Northern Ireland. After ${h.PAY.afcPoints('england', '3')[0].years} years on the entry point you move to the top point of ${h.m(h.PAY.afcPay('england', '3', 1))} in England, provided the standards of Annex 23 of the handbook are met: an appraisal in the last 12 months, statutory and mandatory training done, and no formal capability process or live disciplinary sanction.` },
    { q: 'What does a band 3 salary come to each week?', a: `Spread over 52 weeks, the entry point of ${h.m(h.PAY.afcPay('england', '3', 0))} is about ${h.m(h.PAY.afcPay('england', '3', 0) / 52)} a week before deductions and ${h.m(h.nhsNet('england', h.PAY.afcPay('england', '3', 0)).net / 52)} after them. NHS Employers publishes the hourly rate as ${h.m2(h.PAY.afcHourly('3', 0))} at entry and ${h.m2(h.PAY.afcHourly('3', 1))} at the top point, for a 37.5 hour week.` },
    { q: 'Does moving from band 2 to band 3 change my pension rate?', a: `Not in England and Wales at these salaries. Both ${h.m(h.PAY.afcPay('england', '2'))} and ${h.m(h.PAY.afcPay('england', '3', 1))} fall in the tier that runs to ${h.m(28854)}, charged at ${h.pc(h.PEN.tier('nhsEW', 27000).rate)}. The next tier, ${h.pc(h.PEN.tier('nhsEW', 30000).rate)}, starts above that line, which only the top of band 4 reaches outside London. In inner London the supplement can push a band 3 salary into it, since HCAS counts as pensionable pay.` },
  ],
  body: (h) => {
    const p = h.PAY.afcPoints('england', '3');
    const loan = h.nhsNet('england', p[1].pay, p[1].pay, ['plan2']);
    return `<h2>Band 3 take-home at each point</h2>
${h.bandNetTable('england', '3')}
<p>The table assumes a full-time contract, the standard tax code and no student loan. A Plan 2 loan starts at ${h.m(h.P.tax.studentLoans.plan2.threshold)}, which is above both band 3 points, so it takes nothing here. On the higher Plan 5 threshold of ${h.m(h.P.tax.studentLoans.plan5.threshold)}, a band 3 salary does repay: ${h.m(h.TAX.studentLoan(p[1].pay, 'plan5'))} a year at the top point. Choose your plan in the calculator under More.</p>
<h2>Why the two-year step is smaller in your pocket</h2>
<p>A rise of ${h.m(p[1].pay - p[0].pay)} becomes less once it passes through the four deductions. The pension takes ${h.pc(h.PEN.tier('nhsEW', p[1].pay).rate)} of it. Income tax takes 20 % of what remains, because the whole band is in the basic rate band. National Insurance takes 8 % of the gross rise, without any reduction for the pension. What is left is a little under two thirds of the headline figure. The same arithmetic applies to every pay award: a ${h.pc(h.P.afc.england.award)} award on band 3 is worth less in take-home than in gross pay, which is why the ${h.a('nhs-pay-rise-2026', 'pay rise page')} shows both.</p>
<p>The NHS pension contribution is not lost money in the way tax is. Each year adds 1/54th of pensionable pay to a pension payable from State Pension age, revalued every April by 1.5 % above inflation while you stay in the scheme. At the top of band 3 one year of work adds ${h.m(p[1].pay / 54)} a year of pension, in today's money.</p>
<h2>Pay step dates at band 3</h2>
<p>The move to the top point happens on your pay step date, set from the date you started in the band, not on 1 April. The pay award, by contrast, applies to everyone on 1 April. In England the step is paid when the standards of Annex 23 are met; if they are not, the step can be delayed and is paid from the date they are met, while the pay step date for later years stays the same. A regrading from band 2 is worth checking the same way: the calculator shows what it adds month by month, at each point.</p>
<h2>Band 3 in Scotland, Wales and Northern Ireland</h2>
<p>Scotland's band 3 has two points with no fixed waiting time in the table published by gov.scot: ${h.m(h.PAY.afcPay('scotland', '3', 0))} and ${h.m(h.PAY.afcPay('scotland', '3', 1))} from 1 April 2026. Scottish staff also pay income tax at the Scottish rates, with a starter rate of 19 % on the first slice and an intermediate rate of 21 % above about ${h.m(h.P.tax.personalAllowance + h.P.tax.scotland.bands[1].upTo!)}, and pension at the SPPA tiers, ${h.pc(h.PEN.tier('nhsScot', h.PAY.afcPay('scotland', '3', 0)).rate)} at this pay. Wales pays ${h.m(h.PAY.afcPay('wales', '3', 0))} rising to ${h.m(h.PAY.afcPay('wales', '3', 1))}. Northern Ireland's ${h.P.afc.ni.year} scale pays ${h.m(h.PAY.afcPay('ni', '3', 0))} to ${h.m(h.PAY.afcPay('ni', '3', 1))}, with its ${h.P.afc.ni.next.year} award still to come. The take-home with a Plan 2 loan at the top of the English scale would be ${h.m(loan.monthly)} a month, unchanged, since the threshold is not reached.</p>`;
  },
});
