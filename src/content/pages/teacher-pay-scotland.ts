import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'teacher-pay-scotland',
  group: 'nations',
  order: 63,
  tool: { kind: 'teacher', props: { nation: 'scotland', point: 'S1' } },
  related: ['nhs-scotland-pay-scales', 'scottish-tax-nhs-teachers', 'teacher-pay-rise-2026-2027', 'teachers-pension-contributions'],
  sources: ['snct_21', 'snct_deal', 'sppa_tch', 'gov_tax'],
  slug: 'teacher-pay-scotland',
  nav: 'Teacher pay in Scotland',
  card: 'The SNCT main grade from probationer to point 5, promoted posts, and take-home with Scottish tax.',
  title: 'Teacher Pay Scotland 2026: SNCT Main Grade and Take-Home Pay',
  description: 'Teacher pay in Scotland 2026: the SNCT main grade from probationer to point 5 from 1 August 2026, promoted posts, and take-home after Scottish income tax.',
  h1: 'Teacher pay in Scotland from August 2026',
  intro: 'Choose a main grade point. The calculator applies Scottish income tax, NI and the Scottish Teachers’ Pension Scheme tier for the salary.',
  resume: (h) => {
    const S = h.P.teachers.scotland, r = h.teacherNet('scotland', S.main[1]);
    return `Teachers in Scotland are paid on national salary tables agreed by the Scottish Negotiating Committee for Teachers (SNCT), not on the English scales. From 1 August 2026 the main grade runs from ${h.m(S.main[0])} for a probationer to ${h.m(S.main[1])} at point 1 and ${h.m(S.main[5])} at point 5, the top. The tables show three changes in a year: point 5 was ${h.m(S.mainAug2025[5])} from 1 August 2025, ${h.m(S.mainApr2026[5])} from 1 April 2026 and ${h.m(S.main[5])} from 1 August 2026, a rise of ${h.pc(S.main[5] / S.mainApr2026[5] - 1)} in August, under the SNCT agreement covering August 2025 to July 2027. Every figure is rounded to the nearest multiple of £${h.num(S.roundTo)}. Promoted posts have their own tables: principal teachers from ${h.m(S.principal[0])} to ${h.m(S.principal.at(-1)!)}, depute heads and head teachers from ${h.m(S.headteacher[0])} to ${h.m(S.headteacher.at(-1)!)}. Scottish teachers pay Scottish income tax and join the Scottish Teachers' Pension Scheme. A teacher on point 1 takes home about ${h.m(r.monthly)} a month, with a pension rate of ${h.pc(r.pensionRate)}.`;
  },
  faqs: (h) => [
    { q: 'How much does a probationer teacher earn in Scotland?', a: `${h.m(h.P.teachers.scotland.main[0])} a year from 1 August 2026, point 0 of the SNCT main grade. After the probation year a teacher moves to point 1, ${h.m(h.P.teachers.scotland.main[1])}, a jump of ${h.m(h.P.teachers.scotland.main[1] - h.P.teachers.scotland.main[0])}. On the probationer salary, take-home is about ${h.m(h.teacherNet('scotland', h.P.teachers.scotland.main[0]).monthly)} a month with no student loan.` },
    { q: 'Do Scottish teachers pay more tax than teachers in England?', a: 'On most of the main grade, yes, slightly. Scottish income tax charges 21 % on income between the basic and higher thresholds and 42 % from a lower threshold than the English 40 %. A teacher at the top of the main grade pays more income tax than an English teacher on the same salary would, but Scottish salaries at that level are higher.' },
    { q: 'What is a chartered teacher in Scotland?', a: `The SNCT tables still carry a chartered teacher spine, from ${h.m(h.P.teachers.scotland.chartered[0])} to ${h.m(h.P.teachers.scotland.chartered.at(-1)!)} from 1 August 2026, for teachers who already hold that status. It sits above the main grade without being a management post. The tables also include a lead teacher spine of three points.` },
  ],
  body: (h) => {
    const S = h.P.teachers.scotland;
    const rows = S.main.map((x, i) => [i === 0 ? '0 (probationer)' : String(i), h.m(S.mainAug2025[i]), h.m(S.mainApr2026[i]), h.m(x), h.m(h.teacherNet('scotland', x).monthly)]);
    const prom = ([['Chartered teacher', S.chartered], ['Lead teacher', S.lead], ['Principal teacher', S.principal], ['Depute head and head teacher', S.headteacher]] as Array<[string, number[]]>).map(([l, v]) => [l, `${h.num(v.length)} points`, `${h.m(v[0])} to ${h.m(v.at(-1)!)}`, `${h.m(h.teacherNet('scotland', v[0]).monthly)} to ${h.m(h.teacherNet('scotland', v.at(-1)!).monthly)}`]);
    return `<h2>Main grade, three dates</h2>
${h.table(['Point', '1 August 2025', '1 April 2026', '1 August 2026', 'Take-home a month from August 2026'], rows, 'SNCT Handbook, Part 2 Appendix 2.1, salary tables. Take-home with Scottish income tax, NI and the Scottish Teachers’ Pension Scheme tier, no student loan, 2026/27 rates.', ['l', 'r', 'r', 'r', 'r'])}
<h2>Promoted posts and other spines</h2>
${h.table(['Post', 'Spine', 'From 1 August 2026', 'Take-home a month'], prom, 'SNCT salary tables from 1 August 2026. Take-home for the first and last point of each spine.', ['l', 'r', 'r', 'r'])}
<h2>Three pay dates in a year</h2>
<p>The SNCT agreement covers August 2025 to July 2027 and changes the tables more than once, which is why the main grade has a figure from August 2025, a small step from April 2026 and a larger rise from August 2026. If your payslip has not moved in August, check whether your council has applied the 1 August 2026 table yet; arrears are owed from that date.</p>
<p>The April 2026 step was small: point 5 moved from ${h.m(S.mainAug2025[5])} to ${h.m(S.mainApr2026[5])}, a rise of ${h.pc(S.mainApr2026[5] / S.mainAug2025[5] - 1)}. Most of the gain in 2026 arrived in August. For take-home, that means two payslip changes in the 2026/27 tax year, and arrears if either was applied late. The tables in the SNCT handbook carry all three dates side by side, which makes it easy to check which one your council used.</p>
<h2>Pension and tax</h2>
<p>The Scottish Teachers' Pension Scheme sets contributions by tier, like the scheme in England and Wales, but with its own boundaries from April 2026, published by the SPPA. Main grade salaries fall in the lower and middle tiers. Contributions come off before income tax, which in Scotland is charged at the Scottish rates of the 2026/27 tax year: the starter and basic rates, then 21 % intermediate, then 42 % higher. The step into the 42 % band starts at a lower salary than the English 40 % band, so a principal teacher or depute head pays noticeably more tax than an English colleague on the same pay. The ${h.a('scottish-tax-nhs-teachers', 'Scottish tax page')} works out the difference for any salary.</p>
<h2>Comparing with England</h2>
<p>The SNCT salary tables are national, with no London-style pay areas, so a comparison with England should use the English rest-of-England column. Point 5 of the Scottish main grade, ${h.m(S.main[5])} from August 2026, is above the English M6 outside London, ${h.m(h.PAY.teacherEngland('M6'))} from September 2026, and the Scottish main grade reaches its top in five steps after probation. The ${h.a('teacher-pay-scales', 'English scales page')} has all the English points, and the ${h.a('nhs-scotland-pay-scales', 'NHS Scotland page')} gives health service pay in Scotland for comparison.</p>`;
  },
});
