import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'head-teacher-salary',
  group: 'teachers',
  order: 43,
  tool: { kind: 'mini:head', props: { group: 2, area: 0 } },
  related: ['teacher-pay-scales', 'teachers-pension-contributions', 'teacher-pay-rise-2026-2027', 'scottish-tax-nhs-teachers'],
  sources: ['stpcd26', 'tp_tiers', 'hmrc_rates', 'gov_tax'],
  slug: 'head-teacher-salary',
  nav: 'Head teacher salary',
  card: 'The eight head teacher groups in every pay area, how pupil numbers set the group, and take-home.',
  title: 'Head Teacher Salary 2026/27: All Eight Groups and Take-Home',
  description: 'Head teacher salary 2026/27 in England: the pay range of all eight school groups in each pay area, how pupil numbers set the group, and take-home after pension.',
  h1: 'Head teacher salary in England, 2026/27',
  intro: 'Choose the school group and pay area to see the head teacher pay range and what it leaves each month after the Teachers’ Pension, tax and NI.',
  resume: (h) => {
    const G = h.P.teachers.england.sep2026.headGroups, L = h.P.teachers.england.sep2026.leadership;
    return `Head teachers in maintained schools in England are paid within the range of their school's group, from group 1 for the smallest schools to group 8 for the largest. From 1 September 2026 the group 1 range outside London is ${h.m(G[0][0][0])} to ${h.m(G[0][0][1])}, and the group 8 range is ${h.m(G[7][0][0])} to ${h.m(G[7][0][1])}; in inner London group 8 reaches ${h.m(G[7][3][1])}. These sit inside the leadership group pay range, ${h.m(L.min[0])} to ${h.m(L.max[0])} outside London, which also covers deputy and assistant heads. The governing body places the school in a group by its total unit score: each pupil counts ${h.num(h.P.teachers.england.headUnits.perPupil.ks12)} units in the early years and key stages 1 and 2, ${h.num(h.P.teachers.england.headUnits.perPupil.ks3)} in key stage 3, ${h.num(h.P.teachers.england.headUnits.perPupil.ks4)} in key stage 4 and ${h.num(h.P.teachers.england.headUnits.perPupil.ks5)} in key stage 5, from the latest school census. A primary school of 300 pupils scores 2,100 units and falls in group 2. The figures come from the School Teachers' Pay and Conditions Document 2026, and a second rise applies from September 2027.`;
  },
  faqs: (h) => [
    { q: 'How is a school’s head teacher group decided?', a: 'By its total unit score. Count the pupils on the register at each key stage from the latest census, multiply by 7, 9, 11 or 13 units, add three units for each pupil with an EHC plan in a special class, and halve the units of pupils who attend half days. The total places an ordinary school in one of eight groups; special schools start at group 2.' },
    { q: 'What is the highest head teacher salary in England?', a: `The top of group 8 in inner London, ${h.m(h.P.teachers.england.sep2026.headGroups[7][3][1])} from 1 September 2026, which is also the maximum of the leadership range there. A head’s range should not normally exceed the group maximum, but may where the role or candidate warrants it; with temporary payments it must stay within 25 % above the group maximum except in exceptional cases backed by external advice.` },
    { q: 'What does a head teacher on group 4 take home?', a: `Outside London, group 4 runs from ${h.m(h.P.teachers.england.sep2026.headGroups[3][0][0])} to ${h.m(h.P.teachers.england.sep2026.headGroups[3][0][1])}. After the Teachers’ Pension tier, income tax and NI, that leaves about ${h.m(h.teacherNet('england', h.P.teachers.england.sep2026.headGroups[3][0][0]).monthly)} to ${h.m(h.teacherNet('england', h.P.teachers.england.sep2026.headGroups[3][0][1]).monthly)} a month, before any student loan. Your own figure depends on the individual range the governing body set for your post, which can start above the group minimum.` },
  ],
  body: (h) => {
    const G = h.P.teachers.england.sep2026.headGroups, G7 = h.P.teachers.england.sep2027.headGroups, U = h.P.teachers.england.headUnits.groupMax;
    const rows = G.map((g, i) => [`Group ${i + 1}`, i === 0 ? `up to ${h.num(U[0])}` : i === 7 ? `${h.num(U[6] + 1)} and over` : `${h.num(U[i - 1] + 1)} to ${h.num(U[i])}`, `${h.m(g[0][0])} to ${h.m(g[0][1])}`, `${h.m(g[3][0])} to ${h.m(g[3][1])}`, `${h.m(G7[i][0][0])} to ${h.m(G7[i][0][1])}`]);
    const net = [0, 2, 4, 7].map((i) => { const top = G[i][0][1], r = h.teacherNet('england', top); return [`Group ${i + 1}, top`, h.m(top), h.pc(r.pensionRate), h.pc(r.marginal, 0), h.m(r.monthly)]; });
    return `<h2>Head teacher groups and pay ranges</h2>
${h.table(['Group', 'Unit score (ordinary school)', 'Rest of England, 2026', 'Inner London, 2026', 'Rest of England, 2027'], rows, 'School Teachers’ Pay and Conditions Document 2026: Table 2 and Table 3 for September 2026, Annex 5 for September 2027.', ['l', 'l', 'r', 'r', 'r'])}
<h2>Take-home at the top of four groups</h2>
${h.table(['Post', 'Salary', 'Pension rate', 'Top tax rate', 'Take-home a month'], net, 'Outside London, full time, Teachers’ Pension at the tier for the salary, no student loan, 2026/27 rates. Worked out by the engine of this site.', ['l', 'r', 'r', 'r', 'r'])}
<h2>The tax trap above £100,000</h2>
<p>From group 6 upward the ranges cross ${h.m(h.P.tax.taperThreshold)}, where the Personal Allowance starts to shrink by £1 for every £2 of income above it. Because Teachers' Pension contributions come off before income tax, they reduce the income used for that test, which softens the effect. The calculator applies the taper; the ${h.a('teachers-pension-contributions', 'contributions page')} shows the top tiers.</p>
<h2>Fixing a head teacher's pay</h2>
<p>The governing body sets an individual pay range for the head, taking into account all the permanent responsibilities of the role and any challenges specific to it, with room for progression over time; for a new appointment it may start above the group minimum. It considers progression every year. A deputy or assistant head's range must not exceed the maximum of the head teacher group, and should overlap the head's range only in exceptional circumstances. When a head is appointed to lead more than one school permanently, the unit scores of all the schools are added together to find the group. Special schools use a modified score that weights pupils by staffing ratio. Academy trusts are free to set their own head teacher pay, so these ranges apply in full only to maintained schools.</p>
<h2>Temporary payments on top</h2>
<p>A governing body may pay a head extra for clearly temporary responsibilities beyond the post, such as covering another school, provided they were not already counted when the range was set. In any school year those payments must not exceed 25 % of the head's salary, and salary plus payments must stay within 25 % above the maximum of the group, unless the circumstances are wholly exceptional and the governing body has taken external independent advice and written a business case. Residential duties that are part of the job, and housing or relocation costs tied to the head's own circumstances, sit outside that cap. Payments of this kind are taxed like salary, so the take-home figures above rise by less than the gross amount.</p>`;
  },
});
