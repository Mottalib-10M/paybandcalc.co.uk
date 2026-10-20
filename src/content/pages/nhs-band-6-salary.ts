import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'nhs-band-6-salary',
  group: 'bands',
  order: 14,
  tool: { kind: 'nhs', props: { band: '6' } },
  related: ['nhs-band-5-salary', 'nhs-band-7-salary', 'nhs-pay-progression', 'nhs-pension-calculator'],
  sources: ['nhse_afc', 'nhsbsa_tiers', 'hmrc_rates', 'nhse_handbook'],
  slug: 'nhs-band-6-salary',
  nav: 'Band 6',
  card: 'Three points over five years, why band 6 is one pension tier from end to end, and the pension a year adds.',
  title: 'NHS Band 6 Salary 2026/27: Monthly Take-Home at Each Point',
  description: 'NHS band 6 salary for 2026/27: £39,959 to £48,117 in England over five years. See the take-home a month at each point and the pension that each year adds.',
  h1: 'NHS band 6 salary: the three points and the monthly take-home',
  intro: 'Band 6 is the grade of many senior staff nurses, specialist practitioners and experienced therapists. The calculator below starts on the entry point in England.',
  resume: (h) => {
    const p = h.PAY.afcPoints('england', '6'), a = h.nhsNet('england', p[0].pay), c = h.nhsNet('england', p[2].pay);
    return `Band 6 in England pays ${h.m(p[0].pay)} at entry, ${h.m(p[1].pay)} after ${p[0].years} years and ${h.m(p[2].pay)} at the top, reached after ${p[0].years! + p[1].years!} years in all, on the 2026/27 scale of NHS Employers. All three points fall inside one NHS pension tier, ${h.m(35156)} to ${h.m(52778)}, so the contribution rate stays at ${h.pc(a.pensionRate)} from the first day to the last and every rise is taxed only at the basic rate. Take-home pay runs from ${h.m(a.monthly)} a month at entry to ${h.m(c.monthly)} at the top point, full time and outside London. That makes band 6 the band where a step is worth the most in take-home for each pound of gross rise. A year at the top point also adds ${h.m(p[2].pay / 54)} a year to the NHS pension payable from State Pension age, revalued at 1.5 % above inflation each April while you remain in the scheme.`;
  },
  faqs: (h) => [
    { q: 'How long is it from the bottom to the top of band 6?', a: `Five years in England: ${h.PAY.afcPoints('england', '6')[0].years} years on the entry point, then ${h.PAY.afcPoints('england', '6')[1].years} on the intermediate point. Each step is paid on your pay step date if the Annex 23 standards are met. Wales and Northern Ireland use the same timings; Scotland publishes three points for band 6 with progression normally automatic.` },
    { q: 'Is a band 6 nurse a higher rate taxpayer?', a: `No, outside London. Income tax is charged on pay after the pension contribution, and even the top point of ${h.m(h.PAY.afcPay('england', '6', 2))} leaves taxable pay of about ${h.m(h.PAY.afcPay('england', '6', 2) * (1 - h.PEN.tier('nhsEW', 48117).rate))}, below the ${h.m(h.P.tax.personalAllowance + h.P.tax.ruk.bands[0].upTo!)} at which 40 % starts. With an inner London supplement the top point does cross it.` },
    { q: 'What does a band 6 nurse earn per hour?', a: `NHS Employers sets the 2026/27 hourly rates for band 6 at ${h.m2(h.PAY.afcHourly('6', 0))}, ${h.m2(h.PAY.afcHourly('6', 1))} and ${h.m2(h.PAY.afcHourly('6', 2))} for the three points. Unsocial hours on weekday nights and Saturdays add ${h.pc(h.PAY.unsocialRates('6')[0], 0)} to the hourly rate, Sundays and public holidays ${h.pc(h.PAY.unsocialRates('6')[1], 0)}; overtime is paid at time and a half.` },
  ],
  body: (h) => {
    const p = h.PAY.afcPoints('england', '6');
    const steps = [[0, 1], [1, 2]].map(([i, j]) => { const g = p[j].pay - p[i].pay, n = (h.nhsNet('england', p[j].pay).net - h.nhsNet('england', p[i].pay).net); return [`${h.PAY.stepLabel('england', '6', i)} to ${h.PAY.stepLabel('england', '6', j).toLowerCase()}`, h.m(g), h.m(n), h.pc(n / g, 0)]; });
    const top = p[2].pay + h.PAY.hcas(p[2].pay, 'inner'), r = h.nhsNet('england', top);
    return `<h2>Band 6 take-home, England 2026/27</h2>
${h.bandNetTable('england', '6')}
<h2>What each step is worth after deductions</h2>
${h.table(['Step', 'Gross rise', 'Take-home rise a year', 'Share kept'], steps, 'Band 6, England, full time, outside London. Worked out by the engine of this site.', ['l', 'r', 'r', 'r'])}
<p>Because the pension rate does not change inside band 6, each extra pound of salary loses ${h.pc(h.PEN.tier('nhsEW', p[0].pay).rate)} to the pension, 20 % of the remainder to income tax and 8 % to National Insurance. The share kept is the same at both steps, a little over three fifths. Compare band 5, where the top step crosses a tier line and the share kept falls.</p>
<h2>Band 6 in London</h2>
<p>The High Cost Area Supplement is 20 % of basic pay in inner London, 15 % in outer London and 5 % in the fringe, within the minimum and maximum set in Annex 9 of the handbook. At the top of band 6 the inner London percentage would exceed the maximum, so the supplement is capped at ${h.m(h.P.afc.england.hcas.inner.max)} and pay becomes ${h.m(top)}. That is above ${h.m(52778)}, so the pension rate rises to ${h.pc(r.pensionRate)} on the whole amount. Taxable pay after the pension is ${h.m(r.taxable + h.TAX.personalAllowance(top - r.pension))}, so a slice is taxed at 40 %; take-home is ${h.m(r.monthly)} a month. The ${h.a('nhs-london-weighting-hcas', 'HCAS page')} shows every band and area.</p>
<h2>The pension a band 6 career builds</h2>
<p>The NHS Pension Scheme 2015 adds 1/54th of each year's pensionable pay to your pension account. At the entry point of band 6 that is ${h.m(p[0].pay / 54)} a year of pension; at the top point ${h.m(p[2].pay / 54)}. Each April the balance is revalued by inflation plus 1.5 %, so a year worked now keeps its value against prices and grows a little on top. Ten years spent at the top of band 6 would build about ${h.m(h.PEN.project({ scheme: 'nhsEW', pay: p[2].pay, age: 50, retireAge: 60 }).pension)} a year of pension in today's money, before any lump sum. The ${h.a('nhs-pension-calculator', 'NHS pension calculator')} projects this to your own State Pension age, with any pension you have already built up.</p>
<h2>Moving from band 5 or to band 7</h2>
<p>A band 5 nurse at the top point, ${h.m(h.PAY.afcPay('england', '5', 2))}, who is appointed to a band 6 post starts at ${h.m(p[0].pay)}, a gross rise of ${h.m(p[0].pay - h.PAY.afcPay('england', '5', 2))}. From band 6 the next grade, band 7, starts at ${h.m(h.PAY.afcPay('england', '7', 0))}, above the top of band 6 by ${h.m(h.PAY.afcPay('england', '7', 0) - p[2].pay)}. The ${h.a('nhs-band-7-salary', 'band 7 page')} explains why that move costs a little more in tax than earlier ones.</p>`;
  },
});
