import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'part-time-teacher-pay',
  group: 'teachers',
  order: 48,
  tool: { kind: 'teacher', props: { point: 'M4', fte: 60 } },
  related: ['nhs-part-time-pay', 'tlr-sen-allowances', 'teacher-take-home-pay', 'teachers-pension-contributions'],
  sources: ['stpcd26', 'tp_parttime', 'tp_tiers', 'hmrc_rates'],
  slug: 'part-time-teacher-pay',
  nav: 'Part-time teacher pay',
  card: 'Pro rata pay from the timetabled teaching week, the pension tier on actual pay, and take-home.',
  title: 'Part-Time Teacher Pay 2026/27: Pro Rata Salary and Take-Home',
  description: 'Part-time teacher pay 2026/27 in England: how the pro rata share is worked out from the timetabled week, the new TLR rule, the pension tier and the take-home.',
  h1: 'Part-time teacher pay in 2026/27',
  intro: 'Set your pay point and the share of a full-time timetable you work. The calculator pro-rates the salary and applies the pension tier on what you actually earn.',
  resume: (h) => {
    const g = h.PAY.teacherEngland('M4'), part = g * 0.6, a = h.teacherNet('england', g), b = h.teacherNet('england', part);
    return `A part-time teacher in England is paid a share of the full-time salary for the same post, worked out under the pro rata principle of the School Teachers' Pay and Conditions Document 2026: the hours you are employed during the school's timetabled teaching week, divided by the total hours of that week. The timetabled week counts sessions timetabled for teaching, including PPA and other non-contact time, but not breaks, registration or assemblies. The same share applies to allowances, except TLRs, and to directed time: a full-time teacher can be directed for ${h.num(h.P.teachers.england.directedHours)} hours a year, a part-time teacher for the matching share. On 0.6 of M4 outside London, salary is ${h.m(part)} a year from September 2026. Teachers' Pensions sets the contribution tier on actual part-time earnings, not the full-time equivalent, so the rate can drop: here from ${h.pc(a.pensionRate)} to ${h.pc(b.pensionRate)}. With the Personal Allowance unchanged, take-home is ${h.m(b.monthly)} a month, ${h.pc(b.net / a.net, 0)} of the full-time ${h.m(a.monthly)}.`;
  },
  faqs: (h) => [
    { q: 'How is a part-time teacher’s percentage calculated?', a: 'Take the hours you are employed in the school’s timetabled teaching week and divide them by the full timetabled week of a full-time teacher at the same school. The guidance example is a school day of 9.00 to 12.15 and 1.15 to 3.30 with two 15 minute breaks, a 25 hour timetabled week. The percentage stays the same whatever the timetable cycle.' },
    { q: 'Do part-time teachers have to attend INSET days?', a: 'A part-time teacher cannot be required to work on days, or parts of days, when they do not normally work, including non-pupil days. They can attend by agreement with the head teacher, and the extra hours are then paid using the same pro rata calculation. On normal working days the school can direct non-teaching duties within the pro rata share of directed time.' },
    { q: 'How are supply teachers paid per day?', a: `A teacher employed day to day or at short notice is paid under the pay document on a daily basis, assuming a full working year of ${h.num(h.P.teachers.england.shortNoticeDays)} days, with part days pro rata. On M1 outside London that is ${h.m(h.PAY.teacherEngland('M1') / h.P.teachers.england.shortNoticeDays)} a day from September 2026.` },
  ],
  body: (h) => {
    const shares = [0.4, 0.6, 0.8, 1];
    const rows = (['M1', 'M4', 'M6', 'U3'] as const).map((p) => [p, ...shares.map((s) => { const r = h.teacherNet('england', h.PAY.teacherEngland(p) * s); return `${h.m(r.monthly)} (${h.pc(r.pensionRate)})`; })]);
    return `<h2>Take-home a month by share of a full-time timetable</h2>
${h.table(['Point', '0.4', '0.6', '0.8', 'Full time'], rows, 'England outside London from 1 September 2026, take-home a month with the Teachers’ Pension rate in brackets, tier on actual earnings, no student loan, 2026/27 rates. Worked out by the engine of this site.', ['l', 'r', 'r', 'r', 'r'])}
<p>The table shows why part-time take-home is more than the simple share: the Personal Allowance and the National Insurance threshold are not pro-rated, and the pension tier is chosen on the salary you actually receive. Teachers' Pensions made that change for part-time members from April 2015: before then, the tier was read from the full-time equivalent salary.</p>
<h2>TLRs for part-time teachers from September 2026</h2>
<p>From 1 September 2026 the value of a TLR1 or TLR2 must follow the share of the full-time responsibility the teacher is carrying, not their working hours. A part-time teacher holding the whole responsibility can be paid the whole TLR, and a full-time teacher sharing a responsibility can be paid part of it. The pay document asks schools to act fairly and appropriately when they set the value. A TLR3 is never pro-rated. Other allowances, including the SEN allowance, keep the usual pro rata rule. The ${h.a('tlr-sen-allowances', 'allowances page')} has the ranges.</p>
<h2>Hours and extra work</h2>
<p>The pro rata principle applies not only to contracted hours but also to any additional hours a part-time teacher agrees to work at the head teacher's request, which must be paid on the same basis. Time on non-teaching duties outside school sessions on your working days must stay within the same share of what a full-time colleague can be asked to do. Breaks and travel to work do not count towards directed time. All contractual arrangements must respect the Part-time Workers Regulations and the Equality Act 2010, so a part-time teacher cannot be treated less favourably on pay or progression because of working part time.</p>
<p>Your pay statement should show the full-time equivalent salary, the percentage and the resulting pay; if the percentage looks wrong, ask for the timetabled week used to work it out. When your hours change during the year, the percentage, and with it the pension tier, changes from the date of the new contract.</p>
<p>The ${h.a('nhs-part-time-pay', 'NHS part-time page')} shows the same effects for Agenda for Change staff, where the share is set by hours out of 37.5.</p>`;
  },
});
