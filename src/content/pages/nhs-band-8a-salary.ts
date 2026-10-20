import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'nhs-band-8a-salary',
  group: 'bands',
  order: 16,
  tool: { kind: 'nhs', props: { band: '8a' } },
  related: ['nhs-band-7-salary', 'nhs-band-8b-salary', 'nhs-london-weighting-hcas', 'nhs-pension-calculator'],
  sources: ['nhse_afc', 'nhsbsa_tiers', 'hmrc_rates', 'nhse_handbook'],
  slug: 'nhs-band-8a-salary',
  nav: 'Band 8a',
  card: 'The first band paid wholly in the higher rate zone, the capped London supplement and the 10.7 % pension tier.',
  title: 'NHS Band 8a Salary 2026/27: Take-Home Pay and London HCAS',
  description: 'NHS band 8a salary in 2026/27: £57,528, £60,417 and £64,750 in England. Take-home pay a month at each point, with the London supplement capped at its maximum.',
  h1: 'NHS band 8a salary in 2026/27: take-home at each point',
  intro: 'Band 8a is the first of the four senior bands, for service managers, consultant therapists and lead practitioners among others. The calculator opens on its entry point.',
  resume: (h) => {
    const p = h.PAY.afcPoints('england', '8a'), a = h.nhsNet('england', p[0].pay), c = h.nhsNet('england', p[2].pay);
    return `Band 8a pays ${h.m(p[0].pay)} at entry, ${h.m(p[1].pay)} after ${p[0].years} years and ${h.m(p[2].pay)} at the top after ${p[1].years} more, in England from 1 April 2026 on the NHS Employers scale. At every point, part of the salary is taxed at 40 % and part of it bears National Insurance at only 2 %, so a pound of gross rise is worth noticeably less than at band 6. All three points sit in the NHS pension tier from ${h.m(52779)} to ${h.m(67668)}, charged at ${h.pc(a.pensionRate)} of the whole salary. Take-home pay is ${h.m(a.monthly)} a month at entry and ${h.m(c.monthly)} at the top point, full time and outside London. In London the supplement no longer grows with pay: 20 % of an 8a salary is above the inner London maximum of ${h.m(h.P.afc.england.hcas.inner.max)}, so every 8a post in inner London receives exactly that amount. The table and tool give the figures for each point and area.`;
  },
  faqs: (h) => [
    { q: 'What does a band 8a manager take home a month?', a: `Between ${h.m(h.nhsNet('england', h.PAY.afcPay('england', '8a', 0)).monthly)} and ${h.m(h.nhsNet('england', h.PAY.afcPay('england', '8a', 2)).monthly)} a month in England in 2026/27, full time, outside London, after the ${h.pc(h.PEN.tier('nhsEW', 60000).rate)} pension contribution, income tax and National Insurance. A student loan, salary sacrifice or a tax code other than the standard one would change the figure; enter a loan under More in the calculator.` },
    { q: 'Why is the London supplement the same at every band 8a point?', a: `Annex 9 of the NHS terms and conditions handbook sets HCAS as a percentage of basic pay between a minimum and a maximum. For band 8a the percentage is above the maximum in every area: ${h.m(h.P.afc.england.hcas.inner.max)} inner, ${h.m(h.P.afc.england.hcas.outer.max)} outer and ${h.m(h.P.afc.england.hcas.fringe.max)} fringe. So a London 8a post earns the same supplement at entry as at the top.` },
    { q: 'How much NHS pension does a year at band 8a buy?', a: `One year at the entry point adds ${h.m(h.PAY.afcPay('england', '8a', 0) / 54)} a year to your 2015 scheme pension, and one at the top point ${h.m(h.PAY.afcPay('england', '8a', 2) / 54)}, both payable from your normal pension age and revalued by CPI plus 1.5 % every April until you leave or retire. With a London supplement the figure is higher, since HCAS is pensionable.` },
  ],
  body: (h) => {
    const p = h.PAY.afcPoints('england', '8a');
    const areas = (['none', 'fringe', 'outer', 'inner'] as const).map((a) => { const g = p[0].pay + h.PAY.hcas(p[0].pay, a), r = h.nhsNet('england', g); return [h.PAY.HCAS_LABEL[a], h.m(h.PAY.hcas(p[0].pay, a)), h.m(g), h.pc(r.pensionRate), h.m(r.monthly)]; });
    const step = h.nhsNet('england', p[1].pay).net - h.nhsNet('england', p[0].pay).net;
    return `<h2>Band 8a take-home, England 2026/27</h2>
${h.bandNetTable('england', '8a')}
<h2>Band 8a entry point in each London area</h2>
${h.table(['Area', 'HCAS', 'Pay', 'Pension rate', 'Take-home a month'], areas, 'Band 8a entry point, England 2026/27, full time, no student loan. Worked out by the engine of this site.', ['l', 'r', 'r', 'r', 'r'])}
<p>In inner London the capped supplement lifts an entry salary to ${h.m(p[0].pay + h.P.afc.england.hcas.inner.max)}, which crosses the pension line at ${h.m(67668)} and moves the contribution rate to ${h.pc(h.PEN.tier('nhsEW', p[0].pay + h.P.afc.england.hcas.inner.max).rate)}. That is why the inner London row keeps less of the supplement than the outer London row does.</p>
<h2>What a step is worth at band 8a</h2>
<p>The first step, ${h.m(p[1].pay - p[0].pay)} gross, adds ${h.m(step)} a year to take-home, about ${h.pc(step / (p[1].pay - p[0].pay), 0)} of the rise. The rest goes in the ${h.pc(h.PEN.tier('nhsEW', p[1].pay).rate)} pension contribution, income tax at 40 % and National Insurance at 2 %. The pension part comes back later as income: each extra pound of pensionable pay adds 1/54th of a pound to the yearly pension.</p>
<p>The same arithmetic means that the gap between band 7 and band 8a in take-home is smaller than the gap in salary. A band 7 at the top point who moves to the entry point of 8a gains ${h.m(p[0].pay - h.PAY.afcPay('england', '7', 2))} gross a year, almost all of it taxed at 40 %. The pension rate stays at ${h.pc(h.PEN.tier('nhsEW', p[0].pay).rate)}, which helps: there is no tier cliff to pay for on this move.</p>
<h2>Hours, overtime and on-call at band 8a</h2>
<p>Section 3 of the handbook limits paid overtime at time and a half to staff in bands 1 to 7, so extra hours at band 8a are a matter for local arrangements with your employer, and nothing for them is added by the calculator on this page. Unsocial hours payments do apply to bands 4 to 9 at time plus ${h.pc(h.PAY.unsocialRates('8a')[0], 0)} or ${h.pc(h.PAY.unsocialRates('8a')[1], 0)}, on the 8a hourly rate of ${h.m2(h.PAY.afcHourly('8a', 0))} at entry, but many 8a posts are worked in standard hours and never use them. On-call arrangements are set locally under Annex 29 of the handbook and are not included here.</p>
<h2>Band 8a in Scotland, Wales and Northern Ireland</h2>
<p>Scotland has two points for 8a: ${h.m(h.PAY.afcPay('scotland', '8a', 0))} and ${h.m(h.PAY.afcPay('scotland', '8a', 1))}. Both are taxed at 42 % above the Scottish higher rate threshold, and the Scottish pension tiers charge ${h.pc(h.PEN.tier('nhsScot', h.PAY.afcPay('scotland', '8a', 0)).rate)} at this pay. Wales pays ${h.m(h.PAY.afcPay('wales', '8a', 0))} to ${h.m(h.PAY.afcPay('wales', '8a', 2))}. Northern Ireland, on its ${h.P.afc.ni.year} scale until the next circular, pays ${h.m(h.PAY.afcPay('ni', '8a', 0))} to ${h.m(h.PAY.afcPay('ni', '8a', 2))}, with the HSC scheme at ${h.pc(h.PEN.tier('hscNI', h.PAY.afcPay('ni', '8a', 0)).rate)}.</p>`;
  },
});
