import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'nurse-vs-teacher-pay',
  group: 'takehome',
  order: 84,
  tool: { kind: 'mini:compare', props: { band: 3, step: 0, point: 0 } },
  related: ['nhs-take-home-pay', 'teacher-take-home-pay', 'london-teacher-pay', 'teachers-pension-calculator'],
  sources: ['nhse_afc', 'stpcd26', 'nhsbsa_tiers', 'tp_tiers', 'hmrc_rates'],
  slug: 'nurse-vs-teacher-pay',
  nav: 'NHS against teacher pay',
  card: 'Any NHS band against any teacher pay point: gross, take-home, pension rate and pension built.',
  title: 'Nurse vs Teacher Pay 2026/27: NHS Band Against Teacher Point',
  description: 'Nurse vs teacher pay 2026/27 in England: any NHS band and step against any teacher pay point, with take-home, pension rate and pension built each year.',
  h1: 'NHS pay against teacher pay in 2026/27',
  intro: 'Choose an NHS band and step and a teacher pay point. The calculator compares gross pay and monthly take-home, each with its own pension scheme.',
  resume: (h) => {
    const b5 = h.PAY.afcPay('england', '5', 0), m1 = h.PAY.teacherEngland('M1'), a = h.nhsNet('england', b5), c = h.teacherNet('england', m1);
    return `NHS staff on Agenda for Change and school teachers in England are paid on national scales, but the two differ in timing, structure and pension. NHS pay changes on 1 April, with ${h.m(b5)} at band 5 entry in 2026/27; teacher pay changes on 1 September, with ${h.m(m1)} at M1 from September 2026. On those two salaries, take-home is about ${h.m(a.monthly)} a month for the NHS post and ${h.m(c.monthly)} for the teacher, with no student loan. The pensions differ too: the NHS 2015 scheme adds 1/${h.num(h.P.pension.nhsEW.accrual)} of pay each year, revalued at CPI plus ${h.pc(h.P.pension.nhsEW.realRevaluation)}, and the band 5 pays ${h.pc(a.pensionRate)}; the Teachers' Pension Scheme adds 1/${h.num(h.P.pension.tps.accrual)}, revalued at CPI plus ${h.pc(h.P.pension.tps.realRevaluation)}, and M1 pays ${h.pc(c.pensionRate)}. In London the NHS adds a separate High Cost Area Supplement to basic pay, while teachers have whole London scales. Nurses are employed across several bands, so the calculator lets you set any band against any teacher point rather than assume one.`;
  },
  faqs: (h) => [
    { q: 'Do nurses or teachers earn more in England?', a: `At the start, teachers earn more: M1 is ${h.m(h.PAY.teacherEngland('M1'))} and band 5 entry ${h.m(h.PAY.afcPay('england', '5', 0))}. At the top of the classroom scales, U3 at ${h.m(h.PAY.teacherEngland('U3'))} sits close to the second point of band 7, ${h.m(h.PAY.afcPay('england', '7', 1))}. Both careers continue upward into management bands or leadership posts.` },
    { q: 'Which pension is better, NHS or teachers?', a: 'They are close. The NHS 2015 scheme builds pension slightly faster, at 1/54 of pay a year against 1/57, while the teachers’ scheme revalues slightly faster while you work. Contribution rates differ by tier and by salary, so the cost to you depends on where your pay falls. Both have a normal pension age equal to State Pension age, minimum 65.' },
    { q: 'Why does the comparison use England outside London?', a: 'Because both scales are set nationally for England and the London rules work differently: the NHS adds a capped percentage supplement to basic pay, while teachers move to a separate London pay range. The London teacher page sets each inner London teacher point against the nearest NHS pay with the supplement, for a fair London comparison.' },
  ],
  body: (h) => {
    const pairs = ([['5', 0, 'M1'], ['5', 2, 'M4'], ['6', 0, 'M5'], ['6', 2, 'U1'], ['7', 1, 'U3']] as Array<['5' | '6' | '7', number, 'M1' | 'M4' | 'M5' | 'U1' | 'U3']>);
    const rows = pairs.map(([b, s, p]) => { const n = h.PAY.afcPay('england', b, s), t = h.PAY.teacherEngland(p), a = h.nhsNet('england', n), c = h.teacherNet('england', t);
      return [`Band ${b} ${h.PAY.stepLabel('england', b, s).toLowerCase()} / ${p}`, `${h.m(n)} / ${h.m(t)}`, `${h.m(a.monthly)} / ${h.m(c.monthly)}`, `${h.pc(a.pensionRate)} / ${h.pc(c.pensionRate)}`, `${h.m(n / h.P.pension.nhsEW.accrual)} / ${h.m(t / h.P.pension.tps.accrual)}`]; });
    return `<h2>Common pairs side by side</h2>
${h.table(['NHS post / teacher point', 'Gross pay', 'Take-home a month', 'Pension rate', 'Pension added a year'], rows, 'England outside London. NHS from 1 April 2026, teachers from 1 September 2026. Full time, no student loan, 2026/27 tax. Worked out by the engine of this site.', ['l', 'r', 'r', 'r', 'r'])}
<h2>How each career progresses</h2>
<p>Agenda for Change pay moves up a band through fixed points, after set periods at each point when the progression standards are met, and then only with the annual award or a move to a higher band. Teachers in England move up the main pay range by annual decisions under the school's pay policy, then apply for the upper pay range, then may move into leadership. The NHS steps are more predictable; the teacher ranges let a school start or move a teacher above the advisory points. The ${h.a('nhs-pay-progression', 'NHS progression page')} and the ${h.a('upper-pay-range-teachers', 'upper pay range page')} cover each in detail.</p>
<h2>Hours and extra pay</h2>
<p>An NHS full-time post is 37.5 hours a week, and shift work earns unsocial hours payments and, up to band 7, overtime at time and a half. A full-time teacher can be directed for ${h.num(h.P.teachers.england.directedHours)} hours a year, plus reasonable additional hours needed for the job, and extra pay comes from allowances such as a TLR. A comparison of basic pay alone can therefore understate NHS earnings for shift workers and teacher earnings for those with responsibilities, so add them in the full calculators when you compare.</p>
<h2>Different pay years</h2>
<p>Because NHS awards start in April and teacher awards in September, any comparison is a snapshot. Between April and August each year, NHS pay has had its new award and teacher pay has not; from September the order reverses until the next April. The figures here use the current scale of each: NHS 2026/27 from April and teachers from September 2026, which is the position on payslips from September 2026 to March 2027.</p>
<h2>Tax and deductions are the same</h2>
<p>Both groups pay the same income tax, National Insurance and student loan rules, so the take-home difference between an NHS post and a teaching post comes from the gross pay and the pension tier alone. At similar pay, the two pension schemes can place you in different tiers, which explains small differences in take-home even when gross pay is close.</p>`;
  },
});
