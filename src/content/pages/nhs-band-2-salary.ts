import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'nhs-band-2-salary',
  group: 'bands',
  order: 10,
  tool: { kind: 'nhs', props: { band: '2' } },
  related: ['nhs-band-3-salary', 'nhs-unsocial-hours-pay', 'nhs-overtime-pay', 'nhs-part-time-pay'],
  sources: ['nhse_afc', 'nhsbsa_tiers', 'hmrc_rates', 'wales_afc', 'ni_afc'],
  slug: 'nhs-band-2-salary',
  nav: 'Band 2',
  card: 'One pay point across England, what a healthcare support worker keeps each month, and the Welsh and NI figures.',
  title: 'NHS Band 2 Salary 2026/27: Take-Home Pay and Hourly Rate',
  description: 'NHS band 2 salary for 2026/27: £25,272 in England, £26,300 in Wales, £26,696 in Scotland, with take-home pay a month after tax, NI and the NHS pension.',
  h1: 'NHS band 2 salary in 2026/27 and what you take home',
  intro: 'Band 2 covers healthcare support workers, domestic and catering staff and many clerical roles. Pick your step and nation below: the take-home figure updates as you go.',
  resume: (h) => {
    const p = h.PAY.afcPay('england', '2'), r = h.nhsNet('england', p), w = h.PAY.afcPay('wales', '2'), s = h.PAY.afcPay('scotland', '2', 1);
    return `An NHS band 2 post in England pays ${h.m(p)} a year from 1 April 2026, under the pay scale NHS Employers published on ${h.date(h.P.afc.england.published)}. The entry and top points are the same figure, so there is no step to wait for: the only rises come from the yearly award or a move to band 3. Full time, with the NHS Pension Scheme at the ${h.pc(r.pensionRate)} tier, income tax of ${h.m(r.tax)} and National Insurance of ${h.m(r.ni)}, the take-home pay is ${h.m(r.net)} a year, or ${h.m(r.monthly)} a month. The hourly rate is ${h.m2(h.PAY.afcHourly('2', 0))}, just above the National Living Wage of ${h.m2(h.P.tax.nationalLivingWage)}. Wales pays more for the same band, ${h.m(w)}, and Scotland, which has two points, pays up to ${h.m(s)}. Shift work adds the highest unsocial hours rates in Agenda for Change.`;
  },
  faqs: (h) => [
    { q: 'Why do band 2 staff in Wales earn more than in England?', a: `The Welsh Government set its own 2026/27 scale in pay letter AfC(W) 02/2026, with a floor of ${h.m(h.PAY.afcPay('wales', '2'))} that covers bands 1, 2 and the entry point of band 3. England pays ${h.m(h.PAY.afcPay('england', '2'))}. The difference comes from Wales lifting the bottom of the scale further than the NHS Employers circular did, not from a different tax or pension rule.` },
    { q: 'Do band 2 healthcare assistants pay into the NHS pension?', a: `Yes, unless they opt out. On ${h.m(h.PAY.afcPay('england', '2'))} the tier is ${h.pc(h.PEN.tier('nhsEW', h.PAY.afcPay('england', '2')).rate)}, taken before income tax, so part of it comes back as tax relief. The pension builds at 1/54th of pay each year and is revalued above inflation. Opting out raises take-home a little today but gives up the employer's share, which is far larger than the member's.` },
    { q: 'How much is a band 2 night shift worth on top of basic pay?', a: `Each hour on a weekday night or a Saturday is paid at time plus ${h.pc(h.PAY.unsocialRates('2')[0], 0)}, and each hour on a Sunday or public holiday at time plus ${h.pc(h.PAY.unsocialRates('2')[1], 0)}. At the band 2 hourly rate of ${h.m2(h.PAY.afcHourly('2', 0))}, a single night hour adds ${h.m2(h.PAY.afcHourly('2', 0) * h.PAY.unsocialRates('2')[0])} gross. The unsocial hours page totals a month of shifts.` },
  ],
  body: (h) => {
    const e = h.PAY.afcPay('england', '2'), ni = h.PAY.afcPay('ni', '2');
    const nlwYear = h.P.tax.nationalLivingWage * h.P.afc.england.hours * 52;
    return `<h2>Band 2 pay in the four nations</h2>
<p>Agenda for Change is one pay system, but since devolution each nation agrees its own award, and band 2 is where the gap is most visible. England pays ${h.m(e)} on the circular of NHS Employers. Wales pays ${h.m(h.PAY.afcPay('wales', '2'))}. Scotland has two points, ${h.m(h.PAY.afcPay('scotland', '2', 0))} and ${h.m(h.PAY.afcPay('scotland', '2', 1))}, set by the Scottish Government's two-year deal. Northern Ireland is still on its ${h.P.afc.ni.year} scale, ${h.m(ni)}, because the Department of Health had not issued a ${h.P.afc.ni.next.year} circular by 20 October 2026; the Health Minister's statement of ${h.date(h.P.afc.ni.next.statement)} committed to a ${h.pc(h.P.afc.ni.next.committedAward)} award, which is still to come.</p>
${h.bandNetTable('england', '2')}
<h2>Band 2 and the National Living Wage</h2>
<p>The bottom of the NHS scale sits close to the legal minimum. From April 2026 the National Living Wage is ${h.m2(h.P.tax.nationalLivingWage)} an hour. Over a 37.5 hour week for 52 weeks that comes to about ${h.m(nlwYear)}, a little below the England band 2 salary of ${h.m(e)}. NHS Employers publishes the band 2 hourly rate as ${h.m2(h.PAY.afcHourly('2', 0))}. Because band 1 is closed to new entrants and band 2 has a single point, a new healthcare support worker starts and stays on the same figure until the next award or a regrading to band 3, which many trusts now use for support workers who take on clinical tasks.</p>
<h2>What comes off a band 2 payslip</h2>
<p>The lines are always the same four. The pension contribution is ${h.pc(h.PEN.tier('nhsEW', e).rate)} of pensionable pay in England and Wales, because ${h.m(e)} falls in the second tier of the NHSBSA table. It is taken before income tax, so tax is charged on pay after the pension. Income tax is 20 % of what is left above the ${h.m(h.P.tax.personalAllowance)} Personal Allowance. National Insurance is 8 % of pay above ${h.m(h.P.tax.ni.primaryThreshold)}, worked out on pay before the pension. A student loan only appears if your pay passes the threshold of your plan: Plan 5 starts at ${h.m(h.P.tax.studentLoans.plan5.threshold)}, which band 2 pay crosses.</p>
<p>Part-time posts are common at this band. A 0.6 contract earns 60 % of the salary and the pension tier is set on the pay actually earned, so the rate can be lower. The hours field of the calculator handles this, and the ${h.a('nhs-part-time-pay', 'part-time page')} lists the effect band by band.</p>
<h2>How band 2 staff add to basic pay</h2>
<p>For staff on rotas, unsocial hours are the biggest extra. Band 2 has its own rates, higher than the ${h.pc(h.PAY.unsocialRates('6')[0], 0)} and ${h.pc(h.PAY.unsocialRates('6')[1], 0)} of bands 4 to 9, and they are pensionable. Overtime above 37.5 hours a week is paid at time and a half, double time on public holidays. In London the High Cost Area Supplement is at its minimum for this band: ${h.m(h.P.afc.england.hcas.inner.min)} in inner London, because 20 % of ${h.m(e)} is below that floor.</p>`;
  },
});
