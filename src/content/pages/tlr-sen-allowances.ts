import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'tlr-sen-allowances',
  group: 'teachers',
  order: 45,
  tool: { kind: 'mini:tlr', props: { point: 5, tlr: 3651 } },
  related: ['upper-pay-range-teachers', 'teacher-take-home-pay', 'part-time-teacher-pay', 'teachers-pension-contributions'],
  sources: ['stpcd26', 'tp_tiers', 'hmrc_rates'],
  slug: 'tlr-sen-allowances',
  nav: 'TLR and SEN allowances',
  card: 'TLR1, TLR2, TLR3 and SEN allowance ranges for 2026 and 2027, the rules, and what each adds after tax.',
  title: 'TLR and SEN Allowances 2026/27: Values and Take-Home Impact',
  description: 'TLR and SEN allowances 2026/27 in England: the TLR1, TLR2, TLR3 and SEN ranges for 2026 and 2027, the new part-time rule, and the take-home a payment adds.',
  h1: 'TLR and SEN allowances in 2026/27',
  intro: 'Enter your pay point and the allowance you hold or are offered. The calculator adds it to salary and shows how much reaches you each month.',
  resume: (h) => {
    const A = h.P.teachers.england.sep2026.allowances;
    return `Teaching and learning responsibility (TLR) payments and special educational needs (SEN) allowances are the main additions to a classroom teacher's salary in England. From 1 September 2026 a TLR1 is worth ${h.m(A.tlr1[0])} to ${h.m(A.tlr1[1])} a year, a TLR2 ${h.m(A.tlr2[0])} to ${h.m(A.tlr2[1])}, a fixed-term TLR3 ${h.m(A.tlr3[0])} to ${h.m(A.tlr3[1])}, and a SEN allowance ${h.m(A.sen[0])} to ${h.m(A.sen[1])}, under the School Teachers' Pay and Conditions Document 2026. A TLR rewards a sustained additional responsibility focused on teaching and learning, for which the teacher is accountable; a TLR1 also needs line management of a significant number of people. A teacher cannot hold a TLR1 and a TLR2 together but can hold either with a TLR3. The SEN allowance is mandatory in the posts the document lists, such as a special school or a designated unit. Both are paid with salary, so they carry pension, tax and NI: on M6 outside London, a TLR2 of ${h.m(A.tlr2[0])} adds about ${h.m(h.teacherNet('england', h.PAY.teacherEngland('M6') + A.tlr2[0]).monthly - h.teacherNet('england', h.PAY.teacherEngland('M6')).monthly)} a month to take-home.`;
  },
  faqs: (h) => [
    { q: 'How are TLRs paid to part-time teachers from September 2026?', a: 'The 2026 pay document makes it mandatory to set the value of any TLR1 or TLR2 by the share of the full-time responsibility the teacher actually carries, rather than by their working hours. A part-time teacher with the whole responsibility can receive the full value, and a full-time teacher sharing a responsibility can receive part of it. A TLR3 is never pro-rated.' },
    { q: 'Is a SEN allowance compulsory?', a: 'In the posts the pay document lists, yes: a SEN post needing a mandatory SEN qualification, any post in a special school, teaching in a designated special class or unit, and similar non-designated settings such as a pupil referral unit where the work with SEN pupils is substantial. The school sets a single spot value within the range.' },
    { q: 'Is a TLR3 safeguarded if the project ends?', a: 'No. A TLR3 is fixed-term from the start, for a clearly time-limited school improvement project or a one-off externally driven responsibility. The duration is set at the outset and it is paid monthly over that period. When the school notifies you of the award, it must state that the TLR3 will not be safeguarded, unlike a TLR1 or TLR2 lost in a restructure.' },
  ],
  body: (h) => {
    const A = h.P.teachers.england.sep2026.allowances, B = h.P.teachers.england.sep2027.allowances;
    const rows = (['tlr1', 'tlr2', 'tlr3', 'sen'] as const).map((k) => [k === 'sen' ? 'SEN allowance' : k.toUpperCase(), `${h.m(A[k][0])} to ${h.m(A[k][1])}`, `${h.m(B[k][0])} to ${h.m(B[k][1])}`]);
    const base = h.PAY.teacherEngland('U1'), r0 = h.teacherNet('england', base);
    const add = ([['TLR2 minimum', A.tlr2[0]], ['TLR2 maximum', A.tlr2[1]], ['TLR1 minimum', A.tlr1[0]], ['TLR1 maximum', A.tlr1[1]], ['SEN maximum', A.sen[1]]] as Array<[string, number]>).map(([l, v]) => { const r = h.teacherNet('england', base + v); return [l, h.m(v), h.pc(r.pensionRate), h.m((r.net - r0.net) / 12), h.pc((r.net - r0.net) / v, 0)]; });
    return `<h2>Allowance ranges</h2>
${h.table(['Allowance', 'From 1 September 2026', 'From 1 September 2027'], rows, 'Annual values, School Teachers’ Pay and Conditions Document 2026, paragraphs 20 and 21 and Annex 5. The same in every pay area.', ['l', 'r', 'r'])}
<h2>What an allowance adds on U1</h2>
${h.table(['Allowance', 'Gross a year', 'Pension rate with it', 'Extra take-home a month', 'Share kept'], add, `U1 outside London (${h.m(base)}), full time, no student loan, 2026/27 rates. Worked out by the engine of this site.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The share kept falls as the allowance grows, because a larger addition can push the whole salary into a higher Teachers' Pension tier, and a TLR1 near the top of its range can take part of the salary above the higher rate threshold. The extra pension contribution is not lost: it is added to your pension account at the scheme's accrual rate.</p>
<h2>The conditions for a TLR</h2>
<p>Before awarding a TLR1 or TLR2 the school must be satisfied that the responsibility is not required of all classroom teachers and that it is focused on teaching and learning, needs a teacher's professional skills and judgement, involves leading, managing and developing a subject or curriculum area or pupil development across the curriculum, affects the progress of pupils beyond the teacher's own classes, and involves leading and developing the teaching practice of other staff. For a TLR3 the last two leadership conditions do not have to apply. Unqualified teachers cannot be awarded a TLR. The school's pay policy sets the values it uses within each range and must be applied fairly.</p>
<h2>SEN allowance values</h2>
<p>The SEN allowance is a spot value, not a scale, set by the school with regard to the structure of its SEN provision, whether a mandatory qualification is required, the teacher's qualifications or expertise and the relative demands of the post. Unlike a TLR, it follows the usual pro rata rule for part-time teachers, so a teacher on 0.6 of a full-time contract receives 60 % of the spot value. The pay policy must set out how SEN responsibilities are rewarded.</p>
<h2>Allowances and the pension</h2>
<p>TLR and SEN payments are part of salary, so the Teachers' Pension contribution is taken on them and they count towards the pension built each year, at one fifty-seventh of pensionable pay in the career average scheme. A TLR2 held for ten years therefore adds to the pension for life, not only to monthly pay. The contribution tier is set on the whole salary including the allowance, which is why the table above shows the rate rising with the larger awards. When the school removes a TLR1 or TLR2 in a restructure, the pay document's safeguarding rules can keep the old value for a period; a TLR3 is excluded from that protection.</p>`;
  },
});
