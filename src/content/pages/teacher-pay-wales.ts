import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'teacher-pay-wales',
  group: 'nations',
  order: 64,
  tool: { kind: 'teacher', props: { nation: 'wales', point: 'M2' } },
  related: ['nhs-wales-pay-scales', 'teacher-pay-rise-2026-2027', 'upper-pay-range-teachers', 'teachers-pension-calculator'],
  sources: ['wales_stpcd', 'wales_tch_2026', 'tp_tiers', 'hmrc_rates'],
  slug: 'teacher-pay-wales',
  nav: 'Teacher pay in Wales',
  card: 'The Welsh main and upper scales in force, the 3.5 % award announced for September 2026, and take-home.',
  title: 'Teacher Pay Wales 2026/27: Pay Scale, Award and Take-Home',
  description: 'Teacher pay in Wales 2026/27: the Welsh main and upper pay scales in force, the 3.5 % award announced on 14 October 2026, still to come, and take-home a month.',
  h1: 'Teacher pay in Wales for 2026/27',
  intro: 'The Welsh scale in force is the one from September 2025. Choose a point to see take-home after the Teachers’ Pension, tax and NI.',
  resume: (h) => {
    const W = h.P.teachers.wales, r = h.teacherNet('wales', h.PAY.teacherWales('M2'));
    return `Teachers in Wales are paid under the School Teachers' Pay and Conditions (Wales) Document, set by the Welsh Government. The scale in force on 20 October 2026 is the one from 1 September 2025: the main pay scale starts at M2, ${h.m(h.PAY.teacherWales('M2'))}, and rises to M6, ${h.m(h.PAY.teacherWales('M6'))}; the upper pay scale runs from ${h.m(h.PAY.teacherWales('U1'))} to ${h.m(h.PAY.teacherWales('U3'))}. On ${h.date(W.next.announced)} the Cabinet Minister for Education announced a ${h.pc(W.next.award)} rise for teachers and leaders and ${h.pc(W.next.unqualifiedAward)} for unqualified teachers, backdated to 1 September 2026, lower than the ${h.pc(W.next.iwprbRecommended)} recommended by the Independent Welsh Pay Review Body. The revised Welsh document with the new figures was due the following week, so they are still to come here. Wales differs from England in other ways: progression on the main scale is an annual step unless capability procedures are under way, and moving to the upper scale needs no application. Welsh teachers join the Teachers' Pension Scheme of England and Wales. On M2, take-home is about ${h.m(r.monthly)} a month.`;
  },
  faqs: (h) => [
    { q: 'When will Welsh teachers get the 2026 pay rise?', a: `The award of ${h.pc(h.P.teachers.wales.next.award)} is backdated to 1 September 2026. The Minister said on ${h.date(h.P.teachers.wales.next.announced)} that the revised pay document and the order giving it effect would follow the next week, and that the timing of payment is for employers, who are encouraged to pay arrears as soon as possible.` },
    { q: 'Do Welsh teachers have to apply for the upper pay scale?', a: 'No. Since the 2025 Welsh document, a qualified teacher moves from the main to the upper pay scale after completing a year on M6, unless they have been told that capability procedures are under way for that year. This implemented a recommendation of the Independent Welsh Pay Review Body. In England an application is still required.' },
    { q: 'What will change in the Welsh pay structure?', a: 'The Minister’s statement says the revised document will bring a single pay scale for classroom teachers, so that they progress and see their pay rise every year; changes to protect leaders’ holidays and weekends; and the removal of barriers to car salary sacrifice schemes. The new scale had not been published on 20 October 2026.' },
  ],
  body: (h) => {
    const W = h.P.teachers.wales;
    const rows = h.PAY.WALES_POINTS.map((p) => { const g = h.PAY.teacherWales(p), r = h.teacherNet('wales', g); return [p, h.m(g), h.pc(r.pensionRate), h.m(r.monthly), h.m(h.PAY.teacherEngland(p as 'M2'))]; });
    const A = W.allowances;
    return `<h2>The Welsh scale in force</h2>
${h.table(['Point', 'Wales from 1 Sep 2025', 'Pension rate', 'Take-home a month', 'England outside London from 1 Sep 2026'], rows, 'School Teachers’ Pay and Conditions (Wales) Document 2025, revised March 2026. Take-home at 2026/27 rates, Teachers’ Pension tier, no student loan. The Welsh 2026 award is still to come.', ['l', 'r', 'r', 'r', 'r'])}
<p>The comparison column is not like for like: England moved to its 2026 scale in September, Wales has announced its award but not yet published the scale. Once the Welsh figures are out, the gap will narrow, since the announced percentage matches England's.</p>
<h2>Allowances in Wales</h2>
<p>The 2025 Welsh document sets a TLR1 at ${h.m(A.tlr1[0])} to ${h.m(A.tlr1[1])}, a TLR2 at ${h.m(A.tlr2[0])} to ${h.m(A.tlr2[1])} and a TLR3 at ${h.m(A.tlr3[0])} to ${h.m(A.tlr3[1])}, which should typically not last longer than two years. Instead of the English SEN allowance, Wales pays an additional learning needs (ALN) allowance of ${h.m(A.aln[0])} to ${h.m(A.aln[1])}. The leading practitioner range runs from ${h.m(W.leadingPractitioner[0])} to ${h.m(W.leadingPractitioner[1])}. All of these will rise with the 2026 award.</p>
<h2>How progression works in Wales</h2>
<p>The Welsh document requires a school to award one point a year on M2 to M5 after a year as a qualified teacher, and one point a year on the unqualified scale, unless the teacher has been told that capability procedures are under way. There is a presumption in favour of progression from 1 September each year. Progression on the upper scale is in most cases every two years. A school may award an extra point to a main scale teacher whose performance in the previous year was excellent, if its pay policy allows. There is no M1 in the Welsh scale.</p>
<h2>Pension and tax</h2>
<p>Teachers in Wales are members of the Teachers' Pension Scheme for England and Wales, with the same tiers and the same 1/57th accrual as in England, and they pay UK income tax at the same rates. The ${h.a('teachers-pension-calculator', 'pension calculator')} works for Welsh teachers without change.</p>
<h2>Why the award was lower than recommended</h2>
<p>The Minister's statement says a ${h.pc(W.next.iwprbRecommended)} increase was not affordable within existing budgets, and that ${h.pc(W.next.award)} was chosen to match the figure recommended in England, under the principle that teachers and leaders in Wales should not be disadvantaged relative to England. Further education lecturers in Wales receive the same ${h.pc(W.next.award)} for parity. The review body has already been asked to start work on 2027 to 2028 earlier than usual.</p>`;
  },
});
