import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'london-teacher-pay',
  group: 'teachers',
  order: 46,
  tool: { kind: 'teacher', props: { point: 'M1', area: 3 } },
  related: ['nhs-london-weighting-hcas', 'teacher-pay-scales', 'nurse-vs-teacher-pay', 'teacher-take-home-pay'],
  sources: ['stpcd26', 'nhse_afc', 'tp_tiers', 'hmrc_rates'],
  slug: 'london-teacher-pay',
  nav: 'London teacher pay',
  card: 'Inner, outer and fringe pay for every point, the boroughs in each area, and NHS London pay alongside.',
  title: 'London Teacher Pay 2026/27: Inner, Outer and Fringe Scales',
  description: 'London teacher pay 2026/27: inner London, outer London and fringe salaries for M1 to U3, the boroughs and districts in each area, and take-home a month.',
  h1: 'London teacher pay in 2026/27',
  intro: 'Choose your pay area and point. The calculator shows the London salary and what remains each month after the Teachers’ Pension, tax and NI.',
  resume: (h) => {
    const T = (p: 'M1' | 'U3', a: number) => h.PAY.teacherEngland(p, a as 0);
    return `Teachers in maintained schools in London and the surrounding fringe are paid on higher pay ranges than the rest of England, set out area by area in the School Teachers' Pay and Conditions Document 2026. From 1 September 2026, M1 is ${h.m(T('M1', 3))} in inner London, ${h.m(T('M1', 2))} in outer London and ${h.m(T('M1', 1))} in the fringe, against ${h.m(T('M1', 0))} elsewhere; at U3 the figures are ${h.m(T('U3', 3))}, ${h.m(T('U3', 2))}, ${h.m(T('U3', 1))} and ${h.m(T('U3', 0))}. Unlike the NHS, which adds a separate High Cost Area Supplement to basic pay, teachers have whole separate scales, so the London element is part of salary for pension and every allowance calculation. Inner London covers 18 named boroughs and the City of London, from Camden and Hackney to Merton and Wandsworth; outer London covers 14 more, from Barnet to Waltham Forest; and the fringe takes in all of Surrey and named districts of five other counties. On M1, inner London leaves about ${h.m(h.teacherNet('england', T('M1', 3)).monthly)} a month after deductions.`;
  },
  faqs: (h) => [
    { q: 'Which boroughs are in the inner London pay area?', a: 'Barking and Dagenham, Brent, Camden, the City of London, Ealing, Greenwich, Hackney, Hammersmith and Fulham, Haringey, Islington, Kensington and Chelsea, Lambeth, Lewisham, Merton, Newham, Southwark, Tower Hamlets, Wandsworth and Westminster.  The list comes from the definitions in the School Teachers’ Pay and Conditions Document 2026, and the school’s address decides.' },
    { q: 'Which places are in the fringe pay area?', a: 'All of Surrey; Bracknell Forest, Slough, and Windsor and Maidenhead in Berkshire; South Buckinghamshire and Chiltern; Basildon, Brentwood, Epping Forest, Harlow and Thurrock in Essex; Broxbourne, Dacorum, East Hertfordshire, Hertsmere, St Albans, Three Rivers, Watford and Welwyn Hatfield; Dartford and Sevenoaks in Kent; and Crawley in West Sussex.' },
    { q: 'Do I keep London pay if I move to a school outside London?', a: 'Only in narrow cases. A teacher who leaves the inner London area may keep the inner London range while still paid by the same authority, and similar rules protect outer London and fringe pay. Otherwise the new school pays its own area’s range. A teacher temporarily required to work elsewhere keeps the range of their normal area.' },
  ],
  body: (h) => {
    const rows = h.PAY.EN_POINTS.map((p) => { const g = h.PAY.teacherEngland(p, 3), r = h.teacherNet('england', g); return [p, h.m(g), h.m(r.monthly), h.m(h.teacherNet('england', h.PAY.teacherEngland(p, 2)).monthly), h.m(h.teacherNet('england', h.PAY.teacherEngland(p, 1)).monthly)]; });
    const nhs = h.PAY.BANDS.flatMap((b) => h.PAY.afcPoints('england', b).map((pt, i) => ({ b, i, total: pt.pay + h.PAY.hcas(pt.pay, 'inner'), basic: pt.pay })));
    const near = (['M1', 'M4', 'M6', 'U1', 'U3'] as const).map((p) => { const g = h.PAY.teacherEngland(p, 3); const n = nhs.reduce((x, y) => (Math.abs(y.total - g) < Math.abs(x.total - g) ? y : x));
      return [`${p}: ${h.m(g)}`, h.m(h.teacherNet('england', g).monthly), `Band ${n.b}, ${h.PAY.stepLabel('england', n.b, n.i).toLowerCase()}: ${h.m(n.total)}`, h.m(h.nhsNet('england', n.total).monthly)]; });
    return `<h2>Take-home pay on every point, by London area</h2>
${h.table(['Point', 'Inner London salary', 'Inner, take-home a month', 'Outer, take-home a month', 'Fringe, take-home a month'], rows, 'From 1 September 2026, Annex 3 of the School Teachers’ Pay and Conditions Document 2026. Full time, Teachers’ Pension at the tier for the salary, no student loan, 2026/27 rates.', ['l', 'r', 'r', 'r', 'r'])}
<h2>Inner London teachers and the nearest NHS pay</h2>
${h.table(['Teacher point, inner London', 'Teacher take-home a month', 'Nearest NHS pay with inner London HCAS', 'NHS take-home a month'], near, 'NHS England pay from 1 April 2026 plus the inner London High Cost Area Supplement (pensionable), NHS Pension Scheme tier. Teacher pay from 1 September 2026. Worked out by the engine of this site.', ['l', 'r', 'l', 'r'])}
<p>At similar gross pay the two take-home figures differ mainly through the pension: the NHS and Teachers' Pension schemes have different tier boundaries and rates, so one can sit a tier above the other at the same salary. The ${h.a('nurse-vs-teacher-pay', 'nurse against teacher page')} compares any band and point.</p>
<h2>Who decides the area</h2>
<p>The area is set by where the school is, not where you live. The pay document defines the London Area as the inner area, the outer area and the fringe together. If a teacher was already paid on one of the London ranges on 31 August 2026, the school must keep paying that range for as long as they stay in the same post, even if the rules would not otherwise give it. Academies in London set their own pay, so the contract states the figure that applies.</p>
<h2>The outer London boroughs</h2>
<p>The outer London area comprises Barnet, Bexley, Bromley, Croydon, Enfield, Harrow, Havering, Hillingdon, Hounslow, Kingston upon Thames, Redbridge, Richmond upon Thames, Sutton and Waltham Forest. A school in one of these boroughs pays the outer London range, which sits between the fringe and inner London: at M1 it is ${h.m(h.PAY.teacherEngland('M1', 2) - h.PAY.teacherEngland('M1', 0))} a year above the rest of England, and at U3 ${h.m(h.PAY.teacherEngland('U3', 2) - h.PAY.teacherEngland('U3', 0))} above. The inner London premium is wider, ${h.m(h.PAY.teacherEngland('M1', 3) - h.PAY.teacherEngland('M1', 0))} at M1 and ${h.m(h.PAY.teacherEngland('U3', 3) - h.PAY.teacherEngland('U3', 0))} at U3, so the step up from M6 to U1 is much larger in inner London than anywhere else. The fringe premium is the smallest, about ${h.m(h.PAY.teacherEngland('M1', 1) - h.PAY.teacherEngland('M1', 0))} at M1.</p>
<h2>Leadership and allowances in London</h2>
<p>The leadership group range, the head teacher groups and the leading practitioner range all have their own London figures; the ${h.a('head-teacher-salary', 'head teacher page')} lists them. TLR and SEN allowance values are the same in every area, so in London they make up a smaller share of total pay. A TLR2 at its minimum adds the same gross amount on an inner London U1 as on a U1 in the north of England, but slightly less after deductions where the London salary sits in a higher pension tier.</p>`;
  },
});
