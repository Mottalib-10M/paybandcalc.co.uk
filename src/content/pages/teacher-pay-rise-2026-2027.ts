import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'teacher-pay-rise-2026-2027',
  group: 'teachers',
  order: 47,
  tool: { kind: 'mini:teacher-2027' },
  related: ['teacher-pay-scales', 'teacher-pay-scotland', 'teacher-pay-wales', 'nhs-pay-rise-2026'],
  sources: ['stpcd26', 'strb36', 'dfe_hub', 'snct_21', 'wales_tch_2026', 'ni_tch'],
  slug: 'teacher-pay-rise-2026-2027',
  nav: 'Teacher pay rise 2026 and 2027',
  card: 'The 3.5 % rise from September 2026 and the 3 % already set for September 2027, point by point.',
  title: 'Teacher Pay Rise 2026 and 2027: 3.5 % Then 3 % for England',
  description: 'Teacher pay rise 2026 and 2027 in England: 3.5 % from 1 September 2026 and 3 % from 1 September 2027, every point compared, with Scotland, Wales and NI.',
  h1: 'The teacher pay rise for 2026 and 2027',
  intro: 'Pick a pay point and area: the calculator shows your salary from September 2026, from September 2027, and the take-home of each.',
  resume: (h) => {
    const E = h.P.teachers.england;
    return `Teachers in England received a two-year pay award in 2026. The School Teachers' Review Body recommended ${h.pc(E.awardSep2026)} from 1 September 2026 and ${h.pc(E.awardSep2027)} from 1 September 2027, and the government accepted both on ${h.date(E.accepted)}. After statutory consultation the School Teachers' Pay and Conditions Document 2026 was published on ${h.date(E.stpcdPublished)} with the tables for both years, and the 2026 rise is backdated to 1 September. It applies to every pay and allowance range except the minimum of the unqualified range outside London, which rose by ${h.pc(E.sep2026.unqualifiedPoint1Award)}. M1 outside London goes from ${h.m(h.PAY.teacherEngland('M1'))} in 2026 to ${h.m(h.PAY.teacherEngland('M1', 0, 'sep2027'))} in 2027, and U3 from ${h.m(h.PAY.teacherEngland('U3'))} to ${h.m(h.PAY.teacherEngland('U3', 0, 'sep2027'))}. An indicative ${h.pc(E.indicativeSep2028)} for September 2028 depends on a future remit and is not a figure yet. The Department for Education puts the average teacher salary at over ${h.m(E.averageSep2026)} in 2026 and ${h.m(E.averageSep2027)} in 2027.`;
  },
  faqs: (h) => [
    { q: 'When will teachers get the 2026 pay rise arrears?', a: `The award runs from 1 September 2026 and the pay document that schools need was published on ${h.date(h.P.teachers.england.stpcdPublished)}. Schools and local authorities then update payroll; arrears for the months already paid at the old rate are added to a later payslip and taxed in that month. Academies follow their own timetable, set by the trust.` },
    { q: 'Is the September 2027 teacher pay rise confirmed?', a: `Yes for England. Both years were recommended together and accepted together, and the 2026 pay document already contains the September 2027 tables in Annex 5, a rise of ${h.pc(h.P.teachers.england.awardSep2027)} on every range. Only the 2028 figure is indicative. Tax thresholds for 2027/28 are not known yet, so take-home for 2027 here uses 2026/27 rates.` },
    { q: 'Did teachers in Wales get the same rise?', a: `The Welsh Government announced on ${h.date(h.P.teachers.wales.next.announced)} a rise of ${h.pc(h.P.teachers.wales.next.award)} backdated to 1 September 2026, with ${h.pc(h.P.teachers.wales.next.unqualifiedAward)} for unqualified teachers. The new Welsh scale had not been written into the Welsh pay document on 20 October 2026, so this site still shows the September 2025 Welsh figures as current.` },
  ],
  body: (h) => {
    const rows = h.PAY.EN_POINTS.map((p) => { const a = h.PAY.teacherEngland(p), b = h.PAY.teacherEngland(p, 0, 'sep2027'); return [p, h.m(a), h.m(b), h.m(b - a), h.m(h.teacherNet('england', b).monthly - h.teacherNet('england', a).monthly)]; });
    const S = h.P.teachers.scotland;
    return `<h2>Every point, 2026 against 2027</h2>
${h.table(['Point', 'From 1 Sep 2026', 'From 1 Sep 2027', 'Rise a year', 'Extra take-home a month'], rows, 'England outside London. Annex 3 and Annex 5 of the School Teachers’ Pay and Conditions Document 2026. Take-home for both years on 2026/27 tax and pension rules, to isolate the pay rise.', ['l', 'r', 'r', 'r', 'r'])}
<h2>The rest of the UK</h2>
<p>Each nation sets teacher pay on its own. In Scotland the SNCT tables show the main grade top point at ${h.m(S.mainApr2026[5])} from 1 April 2026 and ${h.m(S.main[5])} from 1 August 2026, under the agreement covering August 2025 to July 2027; the ${h.a('teacher-pay-scotland', 'Scotland page')} has every point. In Wales a ${h.pc(h.P.teachers.wales.next.award)} rise from September 2026 was announced but is not yet in a published scale. In Northern Ireland the latest published scale is the one from 1 September 2025, issued in ${h.date(h.P.teachers.ni.published).replace(/^\d+ /, '')}, and no 2026 award had been published on 20 October 2026; the ${h.a('teacher-pay-northern-ireland', 'Northern Ireland page')} shows that scale.</p>
<h2>Why two years at once</h2>
<p>The Education Secretary asked the review body for recommendations covering two years, to give schools and teachers more certainty when planning budgets and careers, and both were accepted together. The Department for Education also set out other changes for September 2026 in the same award: optional recognition awards for exceptional contribution, more flexibility on training days, and clearer expectations on leaders' working time. None of these changes the pay tables.</p>
<h2>What the rise is worth after deductions</h2>
<p>A pay rise keeps less than its gross value, because each extra pound carries the Teachers' Pension contribution, tax and NI, and sometimes a student loan repayment. For most classroom points about two thirds of the gross rise reaches the bank. Where the rise pushes a salary across a pension tier boundary, the higher rate applies to the whole salary, so that year keeps less; the table shows those points with a smaller extra take-home. Your pension builds faster in return.</p>
<h2>Checking your payslip</h2>
<p>From September 2026, the salary on your payslip should match your point and pay area in the 2026 tables, or the individual figure your school set within the range. Once the arrears are paid, the September and October difference should appear as a separate line. If your school has not applied the new rate by the end of the autumn term, ask the school business manager which payroll month will carry the uplift. The ${h.a('teacher-take-home-pay', 'take-home calculator')} gives the monthly figure to check against for each nation, point and loan.</p>`;
  },
});
