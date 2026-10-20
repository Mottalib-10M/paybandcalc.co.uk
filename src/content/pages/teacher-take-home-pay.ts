import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'teacher-take-home-pay',
  group: 'takehome',
  order: 81,
  tool: { kind: 'teacher', props: { point: 'M3' } },
  related: ['teacher-pay-scales', 'teachers-pension-contributions', 'student-loan-nhs-teachers', 'nurse-vs-teacher-pay'],
  sources: ['stpcd26', 'tp_tiers', 'hmrc_rates', 'gov_relief'],
  slug: 'teacher-take-home-pay',
  nav: 'Teacher take-home pay',
  card: 'Net monthly pay on every point from M1 to U3, after the Teachers’ Pension tier, tax, NI and student loan.',
  title: 'Teacher Take-Home Pay 2026/27: Net Salary From M1 to U3',
  description: 'Teacher take-home pay 2026/27: net monthly salary on every point from M1 to U3 after the Teachers’ Pension, income tax, National Insurance and student loan.',
  h1: 'Teacher take-home pay in 2026/27',
  intro: 'Pick your nation, pay point and pay area. The calculator takes off the Teachers’ Pension contribution first, then income tax, National Insurance and any student loan.',
  resume: (h) => {
    const m1 = h.PAY.teacherEngland('M1'), r = h.teacherNet('england', m1), u3 = h.PAY.teacherEngland('U3'), q = h.teacherNet('england', u3);
    return `A classroom teacher in England outside London on M1 earns ${h.m(m1)} a year from 1 September 2026 and takes home about ${h.m(r.monthly)} a month with no student loan. Four deductions explain the gap. The Teachers' Pension Scheme takes ${h.pc(r.pensionRate)} of pay at that salary, ${h.m(r.pension)} a year, and it comes off before income tax under the net pay arrangement, so tax is charged on ${h.m(r.taxable)} rather than on the full salary. Income tax is ${h.m(r.tax)} at the 2026/27 rates. National Insurance, ${h.m(r.ni)}, is worked out on the full salary, because pension contributions do not reduce it. A student loan, if you have one, is also worked out on pay before pension. At the top of the upper pay range, U3 at ${h.m(u3)}, the pension rate rises to ${h.pc(q.pensionRate)} and take-home reaches ${h.m(q.monthly)} a month. In Scotland the Scottish income tax bands apply instead, which the calculator handles when you choose that nation.`;
  },
  faqs: (h) => [
    { q: 'How much does a newly qualified teacher take home a month?', a: `On M1 outside London, about ${h.m(h.teacherNet('england', h.PAY.teacherEngland('M1')).monthly)} a month from September 2026 without a student loan. With a Plan 5 loan it falls to about ${h.m(h.teacherNet('england', h.PAY.teacherEngland('M1'), ['plan5']).monthly)}, and with Plan 2 to about ${h.m(h.teacherNet('england', h.PAY.teacherEngland('M1'), ['plan2']).monthly)}. Inner London M1 leaves about ${h.m(h.teacherNet('england', h.PAY.teacherEngland('M1', 3)).monthly)} without a loan.` },
    { q: 'Why is my teacher pension contribution not taxed?', a: 'Teachers’ Pension contributions are taken from gross pay before income tax is worked out, which HMRC calls the net pay arrangement. You get relief at your top rate automatically, with nothing to claim. National Insurance and student loan repayments do not get the same treatment: both are charged on your pay before the pension comes off.' },
    { q: 'Does a TLR change my take-home pay by its full amount?', a: `No. A TLR or SEN allowance is added to salary, so it carries the same pension contribution, tax and NI as the rest of your pay, and it can push you into a higher pension tier. On M6 outside London, a TLR2 of ${h.m(h.P.teachers.england.sep2026.allowances.tlr2[0])} adds roughly ${h.m(h.teacherNet('england', h.PAY.teacherEngland('M6') + h.P.teachers.england.sep2026.allowances.tlr2[0]).monthly - h.teacherNet('england', h.PAY.teacherEngland('M6')).monthly)} a month to take-home.` },
  ],
  body: (h) => {
    const rows = h.PAY.EN_POINTS.map((p) => { const g = h.PAY.teacherEngland(p), r = h.teacherNet('england', g); return [p, h.m(g), `${h.m(r.pension)} (${h.pc(r.pensionRate)})`, h.m(r.tax), h.m(r.ni), h.m(r.monthly)]; });
    const loans = (['M1', 'M4', 'U1'] as const).map((p) => { const g = h.PAY.teacherEngland(p); return [p, h.m(h.teacherNet('england', g).monthly), h.m(h.teacherNet('england', g, ['plan2']).monthly), h.m(h.teacherNet('england', g, ['plan5']).monthly), h.m(h.teacherNet('england', g, ['plan5', 'postgrad']).monthly)]; });
    return `<h2>Take-home pay on every point, England outside London</h2>
${h.table(['Point', 'Salary', 'Pension', 'Income tax', 'NI', 'Take-home a month'], rows, 'Full time from 1 September 2026, Teachers’ Pension Scheme at the tier for the salary, no student loan, 2026/27 tax and NI. Worked out by the engine of this site.', ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>The same points with a student loan</h2>
${h.table(['Point', 'No loan', 'Plan 2', 'Plan 5', 'Plan 5 and postgraduate'], loans, 'Take-home a month, England outside London, 2026/27 thresholds from HMRC.', ['l', 'r', 'r', 'r', 'r'])}
<p>Which plan you repay depends on where and when your course started; your payslip shows it. The ${h.a('student-loan-nhs-teachers', 'student loan page')} explains each threshold.</p>
<h2>Why the pension tier matters more than the tax band</h2>
<p>Most classroom teachers pay basic rate tax only, so the main step in deductions comes from the pension. The Teachers' Pension Scheme sets one rate for the whole of your pay, chosen by the tier your salary falls in, and the rate rises with pay: moving into a higher tier can cost more than the pay rise that took you there brings in pension contributions alone. The ${h.a('teachers-pension-contributions', 'contributions page')} lists every tier from April 2026. The money is not lost: it buys a pension of one fifty-seventh of each year's pay, revalued every year, which the ${h.a('teachers-pension-calculator', 'pension calculator')} projects to your retirement age.</p>
<h2>London and the other nations</h2>
<p>The London pay areas raise gross pay by a fixed amount for each point, and for most classroom teachers take-home rises by about two thirds of it once the pension, tax and NI on the extra are paid. Inner London M1 shows the effect clearly in the calculator. In Scotland, the Scottish income tax bands take a little more than the rest of the UK from most teaching salaries, and the Scottish Teachers' Pension Scheme has its own tiers; in Wales and Northern Ireland the tax is the same as in England but the scales differ. Choose the nation in the calculator to switch all of it at once.</p>
<h2>What the calculator does not include</h2>
<p>It does not know your tax code, so it assumes the standard Personal Allowance. Salary sacrifice schemes that your school runs, such as cycle to work, reduce gross pay and are not modelled. Pay for extra duties, such as exam marking or residential trips, varies by school and is left out, as are one-off recognition awards. Arrears of the September 2026 award, paid late by some schools, are taxed in the month they arrive, so that month can look higher than the figure here.</p>`;
  },
});
