import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'teacher-pay-scales',
  group: 'teachers',
  order: 40,
  tool: { kind: 'teacher' },
  related: ['teacher-take-home-pay', 'teacher-pay-rise-2026-2027', 'london-teacher-pay', 'teacher-pay-scotland'],
  sources: ['strb36', 'dfe_hub', 'hmrc_rates', 'tp_tiers'],
  slug: 'teacher-pay-scales',
  nav: 'Teacher pay scales',
  card: 'M1 to U3, leading practitioners and leadership in all four pay areas, September 2026 and September 2027.',
  title: 'Teacher Pay Scales 2026/27: M1 to U3 and Take-Home Pay',
  description: 'Teacher pay scales 2026/27 for England: M1 to U3 in all four pay areas from 1 September 2026, the 2027 figures already agreed, and take-home after tax.',
  h1: 'Teacher pay scales in England, September 2026',
  intro: 'The main and upper pay ranges for each pay area, from the STRB 36th report accepted by the government. Choose a point in the calculator to see what reaches your account each month.',
  resume: (h) => {
    const E = h.P.teachers.england;
    return `From 1 September 2026, teachers in maintained schools in England are paid on scales raised by ${h.pc(E.awardSep2026)}, the figure the School Teachers' Review Body recommended in its 36th report and the government accepted in full on ${h.date(E.accepted)}. Outside London the main pay range runs from ${h.m(h.PAY.teacherEngland('M1'))} at M1 to ${h.m(h.PAY.teacherEngland('M6'))} at M6, and the upper pay range from ${h.m(h.PAY.teacherEngland('U1'))} to ${h.m(h.PAY.teacherEngland('U3'))}. Inner London pays ${h.m(h.PAY.teacherEngland('M1', 3))} at M1 and ${h.m(h.PAY.teacherEngland('U3', 3))} at U3. A second rise of ${h.pc(E.awardSep2027)} is already agreed from 1 September 2027, taking M1 outside London to ${h.m(h.PAY.teacherEngland('M1', 0, 'sep2027'))}. The figures come from Appendix F of the report, because the 2026 School Teachers' Pay and Conditions Document had not been published on 20 October 2026; the Department for Education said the award would be backdated to 1 September. Academies set their own pay, but the Department notes that most follow these scales.`;
  },
  faqs: (h) => [
    { q: 'What is the starting salary for a teacher in England in 2026?', a: `M1, the minimum of the main pay range, is ${h.m(h.PAY.teacherEngland('M1'))} outside London from 1 September 2026, ${h.m(h.PAY.teacherEngland('M1', 1))} in the fringe, ${h.m(h.PAY.teacherEngland('M1', 2))} in outer London and ${h.m(h.PAY.teacherEngland('M1', 3))} in inner London. After the Teachers' Pension contribution, tax and NI, M1 outside London leaves about ${h.m(h.teacherNet('england', h.PAY.teacherEngland('M1')).monthly)} a month.` },
    { q: 'When will the 2026 teacher pay rise be paid?', a: `The Department for Education said on ${h.date(h.P.teachers.england.hubPosted)} that the pay award would go through twelve weeks of consultation, that the School Teachers' Pay and Conditions Document would then be published for schools to implement, and that the award would be backdated to 1 September 2026. Schools that have not yet paid it will owe arrears from that date.` },
    { q: 'Do academy teachers get the same pay scales?', a: 'Not automatically. The national scales apply to maintained schools. The Department for Education says most academies choose to follow them in practice, and that through the Children’s Wellbeing and Schools Act academies will be required to have regard to the pay document, expected from September 2027. Check your contract and your trust’s pay policy.' },
  ],
  body: (h) => {
    const E = h.P.teachers.england.sep2026;
    const rows = [...Object.entries(E.main), ...Object.entries(E.upper)].map(([k, v]) => [k, ...(v as number[]).map((x) => h.m(x))]);
    const net = (['M1', 'M3', 'M6', 'U1', 'U3'] as const).map((p) => [p, h.m(h.PAY.teacherEngland(p)), h.pc(h.PEN.tier('tps', h.PAY.teacherEngland(p)).rate), h.m(h.teacherNet('england', h.PAY.teacherEngland(p)).monthly), h.m(h.teacherNet('england', h.PAY.teacherEngland(p, 3)).monthly)]);
    return `<h2>Main and upper pay ranges from 1 September 2026</h2>
${h.table(['Point', 'Rest of England', 'Fringe', 'Outer London', 'Inner London'], rows, 'Annual salary, STRB 36th report, Appendix F, recommended pay levels from 1 September 2026, accepted on 1 July 2026.', ['l', 'r', 'r', 'r', 'r'])}
<h2>Take-home pay on the main points</h2>
${h.table(['Point', 'Salary, rest of England', 'Pension rate', 'Take-home a month', 'Same point, inner London'], net, 'Full time, Teachers’ Pension Scheme at the tier for the salary, no student loan, 2026/27 tax rates. Worked out by the engine of this site.', ['l', 'r', 'r', 'r', 'r'])}
<h2>Leading practitioners and leadership</h2>
<p>The leading practitioner range runs from ${h.m(E.leadingPractitioner.min[0])} to ${h.m(E.leadingPractitioner.max[0])} outside London, and the leadership range from ${h.m(E.leadership.min[0])} to ${h.m(E.leadership.max[0])}, rising to ${h.m(E.leadership.max[3])} in inner London. Head teachers are paid within the range of their school's group; the ${h.a('head-teacher-salary', 'head teacher page')} has all eight groups.</p>
<h2>What else changes from September 2026</h2>
<p>The 36th report also recommended, from September 2026, letting maintained schools run a modest, locally governed recognition scheme: one-off payments for exceptional contribution, distinct from pay progression and from the annual uplift, which academies could already make. The Department for Education has said the 2026 pay document will include it, together with more flexibility on training days and clearer protection of leaders' working time. Recognition payments are not consolidated into salary, so they would not appear on the scale. If you receive one, it is taxed through PAYE in the month it is paid; whether it is pensionable depends on the rules of the Teachers' Pension Scheme for that kind of payment, which this site does not model.</p>
<p>Unqualified teachers have their own range, with a larger rise of ${h.pc(h.P.teachers.england.sep2026.unqualifiedPoint1Award)} at its minimum outside London: the report gives the aim as reducing the risk of falling below the National Living Wage. The ${h.a('unqualified-teacher-pay', 'unqualified teacher page')} has all six points.</p>
<h2>How the ranges are used</h2>
<p>The scale gives advisory points inside each range. The Department for Education describes the STRB as the independent body that recommends the award each year, after evidence from the department, employers and unions; the government then decides. For 2026 the Education Secretary asked for recommendations covering two years, to give schools and teachers more certainty, and both were accepted together: ${h.pc(h.P.teachers.england.awardSep2026)} from September 2026 and ${h.pc(h.P.teachers.england.awardSep2027)} from September 2027, with an indicative ${h.pc(h.P.teachers.england.indicativeSep2028)} for September 2028 that is subject to a future remit and is not shown as a figure here. The department puts the average school teacher salary at over ${h.m(h.P.teachers.england.averageSep2026)} from September 2026.</p>
<p>The ${h.a('teacher-take-home-pay', 'teacher take-home calculator')} gives the full deduction line by line, with allowances and student loans, and the pages for ${h.a('teacher-pay-scotland', 'Scotland')}, ${h.a('teacher-pay-wales', 'Wales')} and ${h.a('teacher-pay-northern-ireland', 'Northern Ireland')} cover the other nations.</p>`;
  },
});
