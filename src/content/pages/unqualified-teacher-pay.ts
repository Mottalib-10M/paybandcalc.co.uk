import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'unqualified-teacher-pay',
  group: 'teachers',
  order: 44,
  tool: { kind: 'teacher', props: { point: 'Q1' } },
  related: ['ect-teacher-salary', 'teacher-pay-scales', 'part-time-teacher-pay', 'teacher-take-home-pay'],
  sources: ['stpcd26', 'strb36', 'tp_tiers', 'tp_parttime', 'hmrc_rates'],
  slug: 'unqualified-teacher-pay',
  nav: 'Unqualified teacher pay',
  card: 'The six points of the unqualified range in each pay area, 2026 and 2027, and take-home pay.',
  title: 'Unqualified Teacher Pay 2026/27: Six Points and Take-Home',
  description: 'Unqualified teacher pay 2026/27 in England: all six points of the range in each pay area, the 5 % rise at the minimum, the 2027 figures and take-home a month.',
  h1: 'Unqualified teacher pay in England, 2026/27',
  intro: 'The unqualified teacher pay range has six advisory points in each pay area. Choose one in the calculator to see the take-home after pension, tax and NI.',
  resume: (h) => {
    const u = (p: number, a = 0) => h.PAY.unqualifiedEngland(p, a as 0);
    return `An unqualified teacher in a maintained school in England is paid on the unqualified teacher pay range, which runs from ${h.m(u(1))} to ${h.m(u(6))} outside London from 1 September 2026, and from ${h.m(u(1, 3))} to ${h.m(u(6, 3))} in inner London. Every pay and allowance range rose by ${h.pc(h.P.teachers.england.awardSep2026)} in September 2026 except the minimum of the range outside London, which rose by ${h.pc(h.P.teachers.england.sep2026.unqualifiedPoint1Award)}: the School Teachers' Review Body gave the aim as reducing the risk of falling below the National Living Wage. The School Teachers' Pay and Conditions Document 2026 sets six advisory points in Annex 4, and a further rise from 1 September 2027 takes the minimum outside London to ${h.m(h.PAY.unqualifiedEngland(1, 0, 'sep2027'))}. An unqualified teacher cannot hold a TLR, but the school may pay an allowance for a sustained additional responsibility or for qualifications or experience that add value to the role. Take-home at the minimum outside London is about ${h.m(h.teacherNet('england', u(1)).monthly)} a month, because the Teachers' Pension starts at its lowest tier.`;
  },
  faqs: (h) => [
    { q: 'Can an unqualified teacher be paid more than the range?', a: 'Not as salary, but the school can add an unqualified teacher allowance where the teacher has taken on a sustained additional responsibility focused on teaching and learning, or has qualifications or experience that bring added value to the role. The amount is whatever the school considers appropriate under its pay policy. TLR payments, however, are reserved for qualified teachers.' },
    { q: 'Does an unqualified teacher pay into the Teachers’ Pension?', a: `Yes, on the same tiers as qualified teachers, so most of the range sits in the lowest tier at ${h.pc(h.PEN.tier('tps', h.PAY.unqualifiedEngland(1)).rate)}. Part-time and supply work is placed in a tier by actual earnings, not the full-time equivalent, which can keep the rate low. The scheme builds a pension of one fifty-seventh of each year’s pay.` },
    { q: 'Will my pay go up when I gain qualified teacher status?', a: `Yes. You must move onto the main pay range, which starts at ${h.m(h.PAY.teacherEngland('M1'))} outside London. If you stay at the same school, your new salary cannot be lower than your unqualified salary plus any allowance. When QTS is awarded with an earlier effective date, the school pays a lump sum covering the difference back to that date.` },
  ],
  body: (h) => {
    const rows = [1, 2, 3, 4, 5, 6].map((p) => [`Point ${p}`, ...[0, 1, 2, 3].map((a) => h.m(h.PAY.unqualifiedEngland(p, a as 0))), h.m(h.teacherNet('england', h.PAY.unqualifiedEngland(p)).monthly)]);
    const y27 = [1, 3, 6].map((p) => [`Point ${p}`, h.m(h.PAY.unqualifiedEngland(p, 0)), h.m(h.PAY.unqualifiedEngland(p, 0, 'sep2027')), h.m(h.PAY.unqualifiedEngland(p, 3)), h.m(h.PAY.unqualifiedEngland(p, 3, 'sep2027'))]);
    return `<h2>The six points in every pay area</h2>
${h.table(['Point', 'Rest of England', 'Fringe', 'Outer London', 'Inner London', 'Take-home a month, rest of England'], rows, 'From 1 September 2026, School Teachers’ Pay and Conditions Document 2026, Annex 4. Full time, Teachers’ Pension at the tier for the salary, no student loan.', ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>From September 2027</h2>
${h.table(['Point', 'Rest of England 2026', 'Rest of England 2027', 'Inner London 2026', 'Inner London 2027'], y27, 'September 2027 range from Annex 5 of the 2026 pay document.', ['l', 'r', 'r', 'r', 'r'])}
<h2>Who is paid on this range</h2>
<p>The range applies to teachers in maintained schools who do not hold qualified teacher status. The school decides where on the range each one is paid, and must consider every year whether to move a teacher up after a year of service, using its appraisal process and its pay policy. The six points are advisory: a school may pay any salary between the minimum and the maximum. Graduate teachers and trainees on an employment-based route are placed by the school either on the qualified or the unqualified basis, as the pay document allows. Academies can set their own pay for unqualified staff, so the contract is the place to check. When a school appoints you, it must tell you in writing, within a month of the decision, where you sit on the range and the value of any allowance and what it is for.</p>
<h2>Why the minimum rose faster</h2>
<p>The National Living Wage is ${h.m2(h.P.tax.nationalLivingWage)} an hour from April 2026. The review body looked at the bottom of the range against that floor and recommended a larger rise at that single point, and the 2026 pay document applies it to the minimum of the range outside London only. The other five points rose by the same ${h.pc(h.P.teachers.england.awardSep2026)} as every other range, which is why the gap between point 1 and point 2 narrowed slightly. In the three London areas the minimum rose by the standard ${h.pc(h.P.teachers.england.awardSep2026)}. From September 2027 every point, including the minimum, rises by ${h.pc(h.P.teachers.england.awardSep2027)}.</p>
<h2>Take-home at this level</h2>
<p>At these salaries National Insurance and the pension take a larger share than income tax. Most of the range sits in the lowest Teachers' Pension tier. A student loan on Plan 5 starts at ${h.m(h.P.tax.studentLoans.plan5.threshold)} and on Plan 2 at ${h.m(h.P.tax.studentLoans.plan2.threshold)}, so the first points may repay little or nothing. The ${h.a('part-time-teacher-pay', 'part-time page')} shows how fractional contracts change the picture, and the ${h.a('ect-teacher-salary', 'early career page')} shows the main pay range you move to on qualifying. Moving from the top of this range to M1 is worth ${h.m(h.PAY.teacherEngland('M1') - h.PAY.unqualifiedEngland(6))} a year outside London, about ${h.m(h.teacherNet('england', h.PAY.teacherEngland('M1')).monthly - h.teacherNet('england', h.PAY.unqualifiedEngland(6)).monthly)} a month after deductions, and more from lower points.</p>`;
  },
});
