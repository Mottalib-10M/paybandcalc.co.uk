import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'teachers-pension-contributions',
  group: 'pensions',
  order: 73,
  tool: { kind: 'mini:contrib', props: { scheme: 3, pay: 46940 } },
  related: ['teachers-pension-calculator', 'part-time-teacher-pay', 'teacher-take-home-pay', 'nhs-pension-contributions'],
  sources: ['tp_tiers', 'tp_parttime', 'sppa_tch', 'nitps_tiers', 'gov_relief'],
  slug: 'teachers-pension-contributions',
  nav: 'Teachers’ pension contributions',
  card: 'Teachers’ Pension tiers from April 2026 for England and Wales, Scotland and Northern Ireland, and the cost after tax.',
  title: 'Teachers Pension Contributions 2026/27: Tiers and Net Cost',
  description: 'Teachers pension contributions 2026/27: the tiers from 1 April 2026 in England and Wales, Scotland and Northern Ireland, and the net cost on each pay point.',
  h1: 'Teachers’ pension contribution tiers for 2026/27',
  intro: 'Choose your scheme and enter your salary. The calculator shows your tier, the contribution a year and what it costs after income tax relief.',
  resume: (h) => {
    const T = h.PEN.tierTable('tps'), m1 = h.PAY.teacherEngland('M1'), u3 = h.PAY.teacherEngland('U3');
    return `Teachers pay into their pension at a rate set by tier. Teachers' Pensions published the tiers of the Teachers' Pension Scheme for England and Wales from 1 April 2026: ${h.num(T.length)} tiers, from ${h.pc(T[0].rate)} on salaries up to ${h.m(T[0].upTo!)} to ${h.pc(T.at(-1)!.rate)} at the top. The rate of your tier applies to the whole of your pensionable salary. A teacher on M1 outside London, ${h.m(m1)}, pays ${h.pc(h.PEN.tier('tps', m1).rate)}; on U3, ${h.m(u3)}, the rate is ${h.pc(h.PEN.tier('tps', u3).rate)}. Since April 2015 the tier for part-time teachers has been chosen on actual earnings rather than the full-time equivalent, Teachers' Pensions explains, which often puts them in a lower tier. Scotland and Northern Ireland have their own schemes and tables, from the SPPA and the Department of Education. Contributions are taken before income tax, so relief comes automatically at your top rate; National Insurance is still charged on the full salary. The employer adds ${h.pc(h.P.pension.tps.employerRate)} of salary in England and Wales.`;
  },
  faqs: (h) => [
    { q: 'What tier will I be in on the upper pay range?', a: `Outside London, U1 at ${h.m(h.PAY.teacherEngland('U1'))} is in the ${h.pc(h.PEN.tier('tps', h.PAY.teacherEngland('U1')).rate)} tier and U3 at ${h.m(h.PAY.teacherEngland('U3'))} in the ${h.pc(h.PEN.tier('tps', h.PAY.teacherEngland('U3')).rate)} tier from April 2026. In inner London the same points pay more, because the London salaries are higher and can fall in a higher tier.` },
    { q: 'Does a TLR change my teachers’ pension tier?', a: 'It can. The tier is chosen on your pensionable salary including allowances such as a TLR or SEN allowance, and the new rate applies to the whole salary. A TLR that takes your salary over a tier boundary therefore raises the rate on all of your pay, so check the tier table before and after the award.' },
    { q: 'Are Scottish teachers’ pension contributions different?', a: `Yes. The Scottish Teachers’ Pension Scheme has its own tiers, set by the SPPA from April 2026, from ${h.pc(h.PEN.tierTable('stps')[0].rate)} to ${h.pc(h.PEN.tierTable('stps').at(-1)!.rate)}. The relief follows the Scottish income tax rates, so a teacher paying 21 % or 42 % saves that share of the contribution in tax.` },
  ],
  body: (h) => {
    const tab = (s: 'tps' | 'stps' | 'nitps') => h.PEN.tierTable(s).map((t, i) => [String(i + 1), t.upTo === null ? `${h.m(t.from)} and above` : `${h.m(t.from)} to ${h.m(t.upTo)}`, h.pc(t.rate)]);
    const pts = h.PAY.EN_POINTS.map((p) => { const g = h.PAY.teacherEngland(p), c = h.PEN.contribution('tps', g), relief = h.TAX.incomeTax(g).tax - h.TAX.incomeTax(g - c).tax; return [p, h.m(g), h.pc(h.PEN.tier('tps', g).rate), h.m(c / 12), h.m((c - relief) / 12)]; });
    return `<h2>England and Wales, from 1 April 2026</h2>
${h.table(['Tier', 'Salary a year', 'Rate'], tab('tps'), 'Teachers’ Pension Scheme, Teachers’ Pensions. Rate on the whole pensionable salary.', ['l', 'r', 'r'])}
<h2>Each pay point, outside London</h2>
${h.table(['Point', 'Salary', 'Rate', 'Contribution a month', 'Cost after tax relief'], pts, 'From 1 September 2026, full time, 2026/27 rUK tax rates. Worked out by the engine of this site.', ['l', 'r', 'r', 'r', 'r'])}
<h2>Scotland and Northern Ireland</h2>
${h.table(['Tier', 'Salary a year', 'Rate'], tab('stps'), 'Scottish Teachers’ Pension Scheme, SPPA teachers circular 2026/03.', ['l', 'r', 'r'])}
${h.table(['Tier', 'Salary a year', 'Rate'], tab('nitps'), 'Northern Ireland Teachers’ Pension Scheme, Department of Education circular 2026/11.', ['l', 'r', 'r'])}
<h2>Overtime and additional pay</h2>
<p>Teachers' Pensions explained in its 2015 notice that, in the career average arrangement, extra earnings such as overtime are included in the salary on which you contribute but not in the figure that chooses your tier. Your tier follows your contractual salary. The ${h.a('teachers-pension-calculator', 'pension calculator')} shows what the contributions buy, and the ${h.a('part-time-teacher-pay', 'part-time page')} the effect of a fractional contract on the tier.</p>
<h2>Where the boundaries bite</h2>
<p>Along the main and upper pay ranges, the boundaries of the England and Wales table fall between some points and not others, so moving one point up the scale can either leave your rate unchanged or move you to the next tier, with the new rate applying to the whole salary. The table of pay points above shows exactly where this happens outside London; in London, the higher salaries move the boundaries to different points. Because the pension each year is one fifty-seventh of salary whatever the tier, a higher tier means paying more for the same pension, which is the design of a tiered scheme: higher earners contribute a larger share.</p>
<h2>What the contribution buys</h2>
<p>Each year in service adds one fifty-seventh of that year's salary to the career average pension, revalued by CPI plus ${h.pc(h.P.pension.tps.realRevaluation)} while you teach. On M6 outside London, a year adds ${h.m(h.PAY.teacherEngland('M6') / h.P.pension.tps.accrual)} a year of pension for life, for a contribution of ${h.m(h.PEN.contribution('tps', h.PAY.teacherEngland('M6')))} before tax relief. The employer pays ${h.pc(h.P.pension.tps.employerRate)} of salary on top. Pensions in payment rise with prices. Few savings products offer a guaranteed, inflation-linked income on those terms, which is why opting out is rarely worth the extra take-home.</p>
<h2>Northern Ireland and Scotland in practice</h2>
<p>The Northern Ireland table is close to the one for England and Wales, with slightly different rates in some tiers. The Scottish table has its own boundaries and rates. In both nations the contribution comes off before income tax, and in Scotland the relief follows the Scottish bands, so a teacher on the 21 % intermediate rate saves a little more per pound contributed than a basic rate taxpayer elsewhere.</p>`;
  },
});
