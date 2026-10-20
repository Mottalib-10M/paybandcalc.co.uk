import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'ect-teacher-salary',
  group: 'teachers',
  order: 41,
  tool: { kind: 'mini:teacher-next', props: { point: 0 } },
  related: ['teacher-pay-scales', 'teacher-take-home-pay', 'unqualified-teacher-pay', 'student-loan-nhs-teachers'],
  sources: ['stpcd26', 'tp_tiers', 'hmrc_rates'],
  slug: 'ect-teacher-salary',
  nav: 'Early career teacher pay',
  card: 'M1 and M2 in every pay area, what the second year adds, and take-home with a student loan.',
  title: 'ECT Teacher Salary 2026/27: M1 Pay, M2 Rise and Take-Home',
  description: 'ECT teacher salary 2026/27 in England: M1 in all four pay areas, the rise to M2 after the first year, and take-home a month with a Plan 2 or Plan 5 loan.',
  h1: 'Early career teacher salary in England, 2026/27',
  intro: 'Choose your pay point and area to see the next step on the main pay range and what it adds to your take-home pay each month.',
  resume: (h) => {
    const a = h.PAY.teacherEngland('M1'), b = h.PAY.teacherEngland('M2');
    return `An early career teacher (ECT) in England is a qualified teacher in statutory induction, paid on the main pay range like any other classroom teacher. From 1 September 2026 the minimum, M1, is ${h.m(a)} outside London, ${h.m(h.PAY.teacherEngland('M1', 1))} in the fringe area, ${h.m(h.PAY.teacherEngland('M1', 2))} in outer London and ${h.m(h.PAY.teacherEngland('M1', 3))} in inner London. The next advisory point, M2, is ${h.m(b)} outside London, ${h.m(b - a)} more. The School Teachers' Pay and Conditions Document 2026 says that for ECTs the school must base performance and any pay recommendation on the statutory induction process, must make sure ECTs are not disadvantaged by the extension of induction from one year to two, and may still award progression at the end of the first year. Take-home on M1 outside London is about ${h.m(h.teacherNet('england', a).monthly)} a month without a student loan. The same pay document sets a second rise for September 2027, taking M1 outside London to ${h.m(h.PAY.teacherEngland('M1', 0, 'sep2027'))}.`;
  },
  faqs: (h) => [
    { q: 'Do ECTs move up the pay scale after one year?', a: 'They can. The 2026 pay document says induction now lasts two years but that this must not hold ECTs back on pay, and it states plainly that a school may award progression at the end of the first year. How the decision is made is set in your school’s pay policy, which must be written down and available to staff.' },
    { q: 'Is an ECT paid less than other teachers on M1?', a: `No. There is no separate ECT rate: the minimum of the main pay range applies to every qualified teacher on it. A school may start a new teacher above M1 if its pay policy allows, but never below ${h.m(h.PAY.teacherEngland('M1'))} outside London from September 2026. Academies set their own pay, though most follow the national ranges.` },
    { q: 'What happens to my salary when I gain QTS as an unqualified teacher?', a: 'You must be moved onto the main pay range. If you stay at the same school, the 2026 pay document says your new salary must be at least equal to what you were paid as an unqualified teacher, allowance included. If QTS is backdated, the school pays a lump sum for the difference from the date it took effect.' },
  ],
  body: (h) => {
    const rows = [0, 1, 2, 3].map((a) => { const x = h.PAY.teacherEngland('M1', a as 0), y = h.PAY.teacherEngland('M2', a as 0); return [h.PAY.TEACHER_AREA_LABEL[a], h.m(x), h.m(h.teacherNet('england', x).monthly), h.m(y), h.m(h.teacherNet('england', y).monthly)]; });
    const loan = (['plan2', 'plan5'] as const).map((p) => [p === 'plan2' ? 'Plan 2' : 'Plan 5', h.m(h.TAX.studentLoan(h.PAY.teacherEngland('M1'), p) / 12), h.m(h.teacherNet('england', h.PAY.teacherEngland('M1'), [p]).monthly), h.m(h.teacherNet('england', h.PAY.teacherEngland('M1', 3), [p]).monthly)]);
    return `<h2>M1 and M2 in every pay area</h2>
${h.table(['Pay area', 'M1', 'M1 take-home a month', 'M2', 'M2 take-home a month'], rows, 'From 1 September 2026, advisory pay points of the School Teachers’ Pay and Conditions Document 2026, Annex 3. Teachers’ Pension at the tier for the salary, no student loan.', ['l', 'r', 'r', 'r', 'r'])}
<h2>With a student loan</h2>
${h.table(['Loan', 'Repayment a month on M1', 'Take-home on M1', 'Take-home on M1, inner London'], loan, 'Outside London unless stated, 2026/27 thresholds.', ['l', 'r', 'r', 'r'])}
<p>Most new teachers repay a loan, and the plan makes a visible difference at this salary: a Plan 5 threshold is lower than a Plan 2 threshold, so the same M1 salary repays more each month. Repayments are worked out on pay before the pension contribution, so they do not fall when your pension tier changes.</p>
<h2>Your first payslip</h2>
<p>You are enrolled in the Teachers' Pension Scheme from day one and pay the tier for your salary, ${h.pc(h.PEN.tier('tps', h.PAY.teacherEngland('M1')).rate)} at M1 outside London. Opting out raises take-home, but it gives up a pension of one fifty-seventh of each year's pay, revalued above inflation, and an employer contribution of ${h.pc(h.P.pension.tps.employerRate)} of your salary.</p>
<h2>How progression is decided after induction</h2>
<p>Every school must consider each year whether to raise the salary of a teacher who has completed a year since the last pay decision. A written pay recommendation follows the school's appraisal, and for an ECT that appraisal is the statutory induction process itself. The 2026 document then limits the reasons for holding a teacher back: a school that keeps performance-related pay in its policy may withhold progression only for poor performance, and a school that has dropped it may withhold progression only when the teacher is in capability proceedings. In practice that means most teachers who complete induction successfully move up a point each September until M6.</p>
<p>Advisory points M1 to M6 are not compulsory steps: the pay document sets only the minimum and maximum of the main pay range, and Annex 3 lists the points to help schools. Your contract and your school's pay policy show whether your school uses them, and an academy may use a different structure altogether, so check the offer letter for the exact starting salary and the rule for moving up. Pay is decided with effect from 1 September each year, and you must be told in writing within one month of the decision, with your position on the range and any allowance.</p>
<p>The ${h.a('teacher-pay-scales', 'teacher pay scales')} page has every point to U3, and the ${h.a('teacher-take-home-pay', 'take-home calculator')} adds allowances and loans.</p>`;
  },
});
