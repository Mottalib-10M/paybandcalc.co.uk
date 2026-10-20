import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'teacher-pay-northern-ireland',
  group: 'nations',
  order: 65,
  tool: { kind: 'teacher', props: { nation: 'ni', point: 'M2' } },
  related: ['nhs-northern-ireland-pay-scales', 'teacher-pay-rise-2026-2027', 'teachers-pension-contributions', 'teacher-take-home-pay'],
  sources: ['ni_tch', 'nitps_tiers', 'hmrc_rates'],
  slug: 'teacher-pay-northern-ireland',
  nav: 'Teacher pay in Northern Ireland',
  card: 'The NI main and upper pay scales from September 2025, allowances, principal groups and take-home.',
  title: 'Teacher Pay Northern Ireland: Scales, Allowances and Net Pay',
  description: 'Teacher pay in Northern Ireland: the main and upper scales from 1 September 2025, teaching allowances, principal pay groups and take-home after the NITPS tier.',
  h1: 'Teacher pay in Northern Ireland',
  intro: 'The scale in force is the one from 1 September 2025; no 2026 award had been published on 20 October 2026. Choose a point to see take-home.',
  resume: (h) => {
    const N = h.P.teachers.ni, r = h.teacherNet('ni', h.PAY.teacherNI('M2'));
    return `Teachers in grant-aided schools in Northern Ireland are paid under a determination of the Department of Education. The latest, circular 2026/07 issued on ${h.date(N.published)}, gives effect to a ${h.pc(N.award2025)} consolidated award from 1 September 2025 on every scale point, with teaching and special needs allowances also raised by ${h.pc(N.award2025)}. The main pay scale runs from M2, ${h.m(h.PAY.teacherNI('M2'))}, to M6, ${h.m(h.PAY.teacherNI('M6'))}, and the upper pay scale for post-threshold teachers from ${h.m(h.PAY.teacherNI('U1'))} to ${h.m(h.PAY.teacherNI('U3'))}. Teaching allowances have five levels, from ${h.m(N.allowances[0])} to ${h.m(N.allowances[4])}, and principals are paid on eight groups, from ${h.m(N.principalGroups[0][0])} to ${h.m(N.principalGroups[7][1])}. No award for September 2026 had been published on 20 October 2026, so it is still to come on this site. Teachers join the Northern Ireland Teachers' Pension Scheme and pay UK income tax. On M2, take-home is about ${h.m(r.monthly)} a month, with a pension rate of ${h.pc(r.pensionRate)}.`;
  },
  faqs: (h) => [
    { q: 'What is the starting salary for a teacher in Northern Ireland?', a: `M2 of the main pay scale, ${h.m(h.PAY.teacherNI('M2'))} from 1 September 2025 under Department of Education circular 2026/07. The circular lists no M1. After the Northern Ireland Teachers’ Pension contribution, income tax and NI, that leaves about ${h.m(h.teacherNet('ni', h.PAY.teacherNI('M2')).monthly)} a month with no student loan.` },
    { q: 'What allowances can NI teachers receive?', a: `Teaching allowances at five levels, from ${h.m(h.P.teachers.ni.allowances[0])} to ${h.m(h.P.teachers.ni.allowances[4])}; recruitment and retention allowances of ${h.m(h.P.teachers.ni.recruitment[0])} or ${h.m(h.P.teachers.ni.recruitment[1])}; and special needs allowances of ${h.m(h.P.teachers.ni.sen[0])} or ${h.m(h.P.teachers.ni.sen[1])}, all from 1 September 2025. They are added to salary and carry pension, tax and NI.` },
    { q: 'Is a 2026 pay award coming for NI teachers?', a: 'No figure had been published on 20 October 2026. The 2025 award reached teachers through a determination issued in January 2026, months after the 1 September 2025 effective date, and was paid with arrears. This site will show a 2026 scale once the Department of Education publishes the circular, and not before.' },
  ],
  body: (h) => {
    const N = h.P.teachers.ni;
    const rows = h.PAY.WALES_POINTS.map((p) => { const g = h.PAY.teacherNI(p), r = h.teacherNet('ni', g); return [p === 'U1' ? 'UPS 1' : p === 'U2' ? 'UPS 2' : p === 'U3' ? 'UPS 3' : p, h.m(g), h.pc(r.pensionRate), h.m(r.pension), h.m(r.monthly)]; });
    const pr = N.principalGroups.map((g, i) => [`Group ${i + 1}`, `${h.m(g[0])} to ${h.m(g[1])}`, `${h.m(h.teacherNet('ni', g[0]).monthly)} to ${h.m(h.teacherNet('ni', g[1]).monthly)}`]);
    return `<h2>Classroom teacher scales from 1 September 2025</h2>
${h.table(['Point', 'Salary', 'Pension rate', 'Pension a year', 'Take-home a month'], rows, `Department of Education circular 2026/07, issued ${h.date(N.published)}. Take-home at 2026/27 tax and NI, Northern Ireland Teachers’ Pension Scheme tier from April 2026, no student loan.`, ['l', 'r', 'r', 'r', 'r'])}
<h2>Principal pay groups</h2>
${h.table(['Group', 'Salary range', 'Take-home a month'], pr, 'Principal pay ranges from 1 September 2025, circular 2026/07. Each range is a band of points on the leadership spine L1 to L43.', ['l', 'r', 'r'])}
<h2>The leadership spine</h2>
<p>Vice-principals and principals are paid on a leadership spine of ${h.num(N.leadershipSpine.points)} points, from ${h.m(N.leadershipSpine.L1)} at L1 to ${h.m(N.leadershipSpine.L43)} at L43 from 1 September 2025. Each principal group covers a band of points: group 1 runs from L6 to L18, group 8 from L28 to L43. The board of governors places the principal within the group's range.</p>
<h2>Pension and tax</h2>
<p>The Northern Ireland Teachers' Pension Scheme has its own contribution tiers from April 2026, published by the Department of Education in circular 2026/11; they are close to, but not identical with, those of England and Wales. The contribution comes off before income tax, which is the same as in England. A move from M6 to UPS 1, worth ${h.m(h.PAY.teacherNI('U1') - h.PAY.teacherNI('M6'))} a year,${h.PEN.tier('nitps', h.PAY.teacherNI('U1')).index > h.PEN.tier('nitps', h.PAY.teacherNI('M6')).index ? ' crosses a tier boundary, so part of the rise goes to the higher contribution rate on the whole salary' : ' stays in the same tier, so the contribution rises only in proportion to pay'}. Like the other teachers' schemes, the Northern Ireland scheme builds a career average pension; this site estimates the pension itself only for the scheme of England and Wales, because the Northern Ireland revaluation figures were not found in a published circular.</p>
<h2>Post-threshold and allowances</h2>
<p>The upper pay scale in Northern Ireland is labelled for post-threshold teachers, with three points, UPS 1 to UPS 3. Teaching allowances are fixed amounts at five levels rather than ranges, and the circular also sets two recruitment and retention allowances, two special needs allowances, and an hourly rate for teachers employed in homework centres. An allowance is paid on top of the scale point and counts as pay for the pension, so it can move a teacher into a higher contribution tier.</p>
<h2>Comparing with England</h2>
<p>The gap with England is widest in October 2026 because England has applied its September 2026 award and Northern Ireland has not. M6 is ${h.m(h.PAY.teacherNI('M6'))} in Northern Ireland and ${h.m(h.PAY.teacherEngland('M6'))} in England outside London. The ${h.a('teacher-pay-rise-2026-2027', 'pay rise page')} follows each nation's award, and the ${h.a('nhs-northern-ireland-pay-scales', 'HSC pay page')} shows the same delay for health service staff. When the 2026 circular is issued, this page will switch to the new scale and keep the 2025 figures for comparison.</p>`;
  },
});
