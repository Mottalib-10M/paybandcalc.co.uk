import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'upper-pay-range-teachers',
  group: 'teachers',
  order: 42,
  tool: { kind: 'teacher', props: { point: 'U1' } },
  related: ['teacher-pay-scales', 'tlr-sen-allowances', 'teacher-pay-wales', 'teachers-pension-contributions'],
  sources: ['stpcd26', 'wales_stpcd', 'tp_tiers', 'hmrc_rates'],
  slug: 'upper-pay-range-teachers',
  nav: 'Upper pay range',
  card: 'U1 to U3 in each pay area, the two criteria for moving up, and what crossing from M6 is worth.',
  title: 'Upper Pay Range Teachers 2026/27: U1 to U3 and How to Apply',
  description: 'Upper pay range for teachers 2026/27: U1 to U3 in each pay area of England, the two criteria schools apply to your application, and the take-home gain over M6.',
  h1: 'The upper pay range for teachers in 2026/27',
  intro: 'U1 to U3 for each pay area of England, with take-home pay. Pick a point in the calculator, or start at M6 to see what crossing to the upper range adds.',
  resume: (h) => {
    const m6 = h.PAY.teacherEngland('M6'), u1 = h.PAY.teacherEngland('U1');
    return `The upper pay range in England runs from ${h.m(u1)} at U1 to ${h.m(h.PAY.teacherEngland('U3'))} at U3 outside London from 1 September 2026, and from ${h.m(h.PAY.teacherEngland('U1', 3))} to ${h.m(h.PAY.teacherEngland('U3', 3))} in inner London. A qualified teacher reaches it by applying to the school. The School Teachers' Pay and Conditions Document 2026 lets a teacher apply at least once a year, in line with the school's pay policy, and says the application succeeds where the school is satisfied that the teacher is highly competent in all elements of the relevant standards and that their achievements and contribution to an educational setting are substantial and sustained. The decision applies only to employment in that school. Moving from M6 to U1 adds ${h.m(u1 - m6)} a year outside London, about ${h.m(h.teacherNet('england', u1).monthly - h.teacherNet('england', m6).monthly)} a month after pension, tax and NI. Once on the range, progression must be decided at least every two years. Wales removed the application step in 2025.`;
  },
  faqs: (h) => [
    { q: 'Do I keep the upper pay range if I change school?', a: 'Not automatically. The pay document says a successful application applies only to the school that granted it. A new school may pay you on the upper range because you were assessed elsewhere, but it does not have to. Ask before accepting a post, and check the starting point written into the offer.' },
    { q: 'How often is progression decided on the upper pay range?', a: 'The 2026 pay document adds that, while appraisal should still happen every year, pay progression for teachers on the upper pay range must be determined at least every two years. Your school’s pay policy says whether it reviews every year or every second year, and what evidence it looks at when it does.' },
    { q: 'Is the upper pay range the same in Wales?', a: `The structure is similar but Wales sets its own scale, and its 2025 pay document removed the application requirement to move from the main to the upper pay scale. U1 in Wales was ${h.m(h.PAY.teacherWales('U1'))} from September 2025; the 2026 rise had been announced but not yet written into the Welsh document on 20 October 2026.` },
  ],
  body: (h) => {
    const rows = (['M6', 'U1', 'U2', 'U3'] as const).map((p) => [p, ...[0, 1, 2, 3].map((a) => h.m(h.PAY.teacherEngland(p, a as 0)))]);
    const net = (['M6', 'U1', 'U2', 'U3'] as const).map((p) => { const r = h.teacherNet('england', h.PAY.teacherEngland(p)); return [p, h.pc(r.pensionRate), h.m(r.pension), h.m(r.monthly), h.m(h.teacherNet('england', h.PAY.teacherEngland(p, 3)).monthly)]; });
    return `<h2>M6 and the upper range in every area</h2>
${h.table(['Point', 'Rest of England', 'Fringe', 'Outer London', 'Inner London'], rows, 'From 1 September 2026, School Teachers’ Pay and Conditions Document 2026, Annex 3 advisory points.', ['l', 'r', 'r', 'r', 'r'])}
<h2>Pension tier and take-home</h2>
${h.table(['Point', 'Pension rate', 'Pension a year', 'Take-home a month', 'Take-home, inner London'], net, 'Outside London unless stated, full time, no student loan, 2026/27 rates.', ['l', 'r', 'r', 'r', 'r'])}
<p>The step from M6 to U1 crosses a Teachers' Pension tier boundary in some areas, so a slice of the rise goes to the higher contribution rate, which applies to the whole salary. That contribution is not a loss: it buys more pension, and the ${h.a('teachers-pension-calculator', 'pension calculator')} shows how much.</p>
<h2>Who must be paid on the range</h2>
<p>The pay document lists three cases in which the school must pay a teacher on the upper pay range: a post-threshold teacher employed at the school without a break; a teacher whose application to that school succeeded and who is still employed there; and a teacher who was a member of the leadership group at that school for at least a year in total, first appointed on or after 1 September 2000. It may also pay on the range a teacher assessed by another school, a former leading practitioner, or a post-threshold teacher who has had a break in service.</p>
<h2>Preparing an application</h2>
<p>The pay document leaves each school to define what "highly competent" and "substantial and sustained" mean, so the evidence asked for varies. The policy has to say how applications are made, when they are assessed and how the criteria are read, and where a teacher is subject to the appraisal regulations, the school must take the appraisal reports into account. Your appraisal record over the last two years is usually the core of the case, and the window for applying is set by the school, at least once a year. A successful application takes effect on the date the school sets, and you must be told in writing within one month of the decision.</p>
<p>Your school's pay policy must explain how it assesses applications and how it reads the two criteria. Every school covered by the document must adopt a written pay policy and a procedure for pay grievances, so ask to see it before you apply, and keep a copy of the version in force on the date you submit. A teacher on the upper range who takes on a sustained additional responsibility can also hold a ${h.a('tlr-sen-allowances', 'TLR payment')} on top.</p>`;
  },
});
