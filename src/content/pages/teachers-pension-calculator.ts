import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'teachers-pension-calculator',
  group: 'pensions',
  order: 72,
  tool: { kind: 'pension', props: { scheme: 'tps', pay: 46940, age: 35 } },
  related: ['teachers-pension-contributions', 'pension-lump-sum-commutation', 'nhs-pension-calculator', 'teacher-pay-scales'],
  sources: ['tps_regs', 'tp_updates', 'tp_lump', 'tp_parttime', 'pspa_s10', 'gov_spa'],
  slug: 'teachers-pension-calculator',
  nav: 'Teachers’ pension calculator',
  card: 'Estimate the career average teachers’ pension at normal pension age in today’s money, with the lump sum limit.',
  title: 'Teachers Pension Calculator 2026: Career Average Estimate',
  description: 'Teachers pension calculator 2026: estimate the career average pension at your normal pension age in today’s money, with 1/57th accrual and CPI + 1.6 %.',
  h1: 'Teachers’ pension calculator: career average scheme',
  intro: 'Enter your salary, age and State Pension age. The estimate projects the Teachers’ Pension Scheme career average pension to your normal pension age, in today’s money.',
  resume: (h) => {
    const S = h.P.pension.tps, pay = h.PAY.teacherEngland('M6'), pr = h.PEN.project({ scheme: 'tps', pay, age: 30, retireAge: 67 });
    return `The Teachers' Pension Scheme for England and Wales has been a career average scheme for all service since April 2022. Regulation 53 of the Teachers' Pension Scheme Regulations 2014 sets the accrual: each year adds one fifty-seventh of that year's pensionable earnings. While you are in service the pension built so far is revalued each April by CPI plus ${h.pc(S.realRevaluation)}; Teachers' Pensions confirmed an active revaluation rate of ${h.pc(S.revaluationApril2026)} for 2026, with Pensions Increase of ${h.pc(S.pensionsIncrease2026)}. Projected in today's money, a teacher on M6 outside London at ${h.m(pay)} from age 30, with salary flat in real terms, would reach about ${h.m(pr.pension)} a year at 67. The normal pension age is the State Pension age, with a floor of 65. At retirement you can exchange pension for a tax-free lump sum at £12 for each £1 a year given up, up to a maximum that the Teachers' Pensions factsheet sets at 30/7 of the annual pension. The employer adds ${h.pc(S.employerRate)} of salary on top of your own contribution.`;
  },
  faqs: (h) => [
    { q: 'How much pension will a teacher get after 30 years?', a: `It depends on salary each year. With 30 years on ${h.m(h.PAY.teacherEngland('U3'))}, the U3 salary outside London, held flat in real terms, the career average scheme builds about ${h.m(h.PEN.project({ scheme: 'tps', pay: h.PAY.teacherEngland('U3'), age: 37, retireAge: 67 }).pension)} a year in today’s money. Earlier years on lower points reduce that, while promotion raises it.` },
    { q: 'What is the maximum lump sum from the Teachers’ Pension?', a: `The Teachers’ Pensions retirement lump sum factsheet sets the maximum at 30/7 of the annual pension before commutation. Each £1 a year of pension you give up pays £${h.num(h.P.pension.tps.commutation)} at once. A pension of ${h.m(20000)} a year could therefore give a lump sum of up to about ${h.m(h.PEN.commute('tps', 20000, 1e9).lumpSum)}, leaving about ${h.m(h.PEN.commute('tps', 20000, 1e9).pension)} a year.` },
    { q: 'Is the teachers’ pension better than a workplace pension?', a: `It is a defined benefit scheme, so the pension is a guaranteed amount linked to pay and revalued above inflation while you teach, not a pot that depends on investments. The employer pays ${h.pc(h.P.pension.tps.employerRate)} of salary, far above the minimum in auto-enrolment schemes. Your own contribution, from ${h.pc(h.PEN.tierTable('tps')[0].rate)}, depends on your tier.` },
  ],
  body: (h) => {
    const pts = (['M1', 'M6', 'U3'] as const).map((p) => [p, h.PAY.teacherEngland(p)] as [string, number]);
    pts.push(['Head teacher, group 4 top', h.P.teachers.england.sep2026.headGroups[3][0][1]]);
    const rows = pts.map(([l, p]) => [l, h.m(p), ...[25, 35, 45].map((a) => h.m(h.PEN.project({ scheme: 'tps', pay: p, age: a, retireAge: 67 }).pension))]);
    const cmp = [h.PAY.teacherEngland('M6'), h.PAY.teacherEngland('U3')].map((p) => { const t = h.PEN.project({ scheme: 'tps', pay: p, age: 35, retireAge: 67 }).pension, n = h.PEN.project({ scheme: 'nhsEW', pay: p, age: 35, retireAge: 67 }).pension; return [h.m(p), h.m(t), h.m(n)]; });
    return `<h2>Pension at 67 by salary and starting age</h2>
${h.table(['Salary point', 'Salary', 'From age 25', 'From age 35', 'From age 45'], rows, 'Teachers’ Pension Scheme career average, England outside London from 1 September 2026, salary flat in real terms to 67, 1/57th accrual, CPI + 1.6 %, today’s money, no lump sum. Worked out by the engine of this site.', ['l', 'r', 'r', 'r', 'r'])}
<h2>Teachers against the NHS scheme</h2>
${h.table(['Same salary', 'Teachers’ Pension at 67', 'NHS Pension at 67'], cmp, 'Both from age 35 to 67, same salary, each scheme’s own accrual and revaluation. Contributions differ too; see the contributions pages.', ['r', 'r', 'r'])}
<p>The NHS scheme accrues faster, at one fifty-fourth against one fifty-seventh, while the teachers' scheme revalues slightly faster, at CPI plus ${h.pc(h.P.pension.tps.realRevaluation)} against CPI plus ${h.pc(h.P.pension.nhsEW.realRevaluation)}. Over a long career the two effects nearly balance, as the table shows for two common salaries.</p>
<h2>What the estimate leaves out</h2>
<p>Final salary service is calculated on different rules and appears separately on your annual benefit statement; add it to the estimate here. Early retirement reductions and the annual allowance are not modelled. If you leave teaching, the pension built so far stops growing above inflation and is increased by prices only. Use the options for pay growth above inflation to reflect moving up the scale.</p>
<h2>Checking against your statement</h2>
<p>Log in to your Teachers' Pensions account to see the career average pension built so far, and enter it as the pension already built up. The estimate then adds the years ahead at your current salary. The ${h.a('teachers-pension-contributions', 'contributions page')} shows the tier you pay, and the ${h.a('pension-lump-sum-commutation', 'lump sum page')} the trade at retirement.</p>
<h2>Why the employer contribution matters</h2>
<p>Your own contribution is the visible cost on the payslip, but the scheme is funded mostly by employers, who pay ${h.pc(h.P.pension.tps.employerRate)} of salary. On M6 outside London that is ${h.m(h.PAY.teacherEngland('M6') * h.P.pension.tps.employerRate)} a year, on top of your own ${h.m(h.PEN.contribution('tps', h.PAY.teacherEngland('M6')))}. Opting out saves your contribution but loses both, along with the pension each year would have added. Before opting out, compare the take-home gained with the pension lost, using this calculator and the take-home calculator side by side.</p>
<h2>Part-time and supply teachers</h2>
<p>Part-time service counts in the career average scheme on the pay you actually earn, so a part-time year adds one fifty-seventh of your part-time salary. The tier for your contribution is also based on actual earnings, not the full-time equivalent, which keeps the rate lower. Enter your actual annual pay in the calculator. If your hours change during the year, enter the average you expect to earn over the year.</p>`;
  },
});
