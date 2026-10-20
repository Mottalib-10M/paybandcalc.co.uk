import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'nhs-band-4-salary',
  group: 'bands',
  order: 12,
  tool: { kind: 'nhs', props: { band: '4' } },
  related: ['nhs-band-5-salary', 'nhs-pension-contributions', 'nhs-london-weighting-hcas', 'nhs-band-3-salary'],
  sources: ['nhse_afc', 'nhsbsa_tiers', 'hmrc_rates', 'nhse_handbook'],
  slug: 'nhs-band-4-salary',
  nav: 'Band 4',
  card: 'Assistant practitioners and nursing associates: the three-year step and the pension tier it crosses.',
  title: 'NHS Band 4 Salary 2026/27: Pay Points and Take-Home Pay',
  description: 'NHS band 4 salary in 2026/27: £28,392 rising to £31,157 after three years in England. Take-home pay a month and the pension tier change at the top point.',
  h1: 'NHS band 4 salary in 2026/27, step by step',
  intro: 'Band 4 covers assistant practitioners and senior administrative posts among others. The calculator opens on the entry point in England; change the step, the nation or the London area.',
  resume: (h) => {
    const p = h.PAY.afcPoints('england', '4'), a = h.nhsNet('england', p[0].pay), b = h.nhsNet('england', p[1].pay);
    return `In England band 4 pays ${h.m(p[0].pay)} at entry and ${h.m(p[1].pay)} at the top point, reached after ${p[0].years} years, under the NHS Employers scale for 2026/27. Take-home pay is ${h.m(a.monthly)} a month at entry and ${h.m(b.monthly)} at the top, full time, after tax, National Insurance and the NHS pension. The top point is the first salary in Agenda for Change to cross a line in the pension table: above ${h.m(28854)} the contribution rate rises from ${h.pc(a.pensionRate)} to ${h.pc(b.pensionRate)} of the whole salary, not only of the part above the line. So the three-year step of ${h.m(p[1].pay - p[0].pay)} gross adds only ${h.m(b.monthly - a.monthly)} a month to take-home. That is the price of a bigger pension: the tier rate buys the same 1/54th of pay a year as before, but on a higher salary. Wales and Scotland pay more for band 4; the tables below give their figures.`;
  },
  faqs: (h) => [
    { q: 'Why does band 4 take three years to reach the top?', a: `The 2026/27 scale of NHS Employers sets the time from entry to the top point for each band. Bands 2 and 3 move after two years; band 4 waits ${h.PAY.afcPoints('england', '4')[0].years} years. The longer wait reflects the larger gap between the points, ${h.m(h.PAY.afcPay('england', '4', 1) - h.PAY.afcPay('england', '4', 0))}, and the same rule applies in Wales and Northern Ireland.` },
    { q: 'What is the band 4 hourly rate in 2026/27?', a: `NHS Employers gives ${h.m2(h.PAY.afcHourly('4', 0))} an hour at entry and ${h.m2(h.PAY.afcHourly('4', 1))} at the top point in England, for the standard 37.5 hour week. Those are the rates used for overtime and unsocial hours: a weekday night hour at entry is paid ${h.m2(h.PAY.afcHourly('4', 0) * (1 + h.PAY.unsocialRates('4')[0]))} in total.` },
    { q: 'Can a pay rise at band 4 leave me worse off each month?', a: `Not at this pay. Crossing a pension tier does raise the rate on your whole salary, but the gross rise at band 4 is larger than the extra contribution. Moving from ${h.m(h.PAY.afcPay('england', '4', 0))} to ${h.m(h.PAY.afcPay('england', '4', 1))} still leaves you ${h.m(h.nhsNet('england', h.PAY.afcPay('england', '4', 1)).monthly - h.nhsNet('england', h.PAY.afcPay('england', '4', 0)).monthly)} a month better off, and the pension grows faster.` },
  ],
  body: (h) => {
    const p = h.PAY.afcPoints('england', '4');
    const inner = h.PAY.hcas(p[0].pay, 'inner'), outer = h.PAY.hcas(p[0].pay, 'outer');
    return `<h2>Band 4 take-home, England 2026/27</h2>
${h.bandNetTable('england', '4')}
<h2>The pension tier at the top of band 4</h2>
<p>NHS pension contributions in England and Wales are set in six tiers on actual annual pensionable pay. The second tier runs to ${h.m(28854)} at ${h.pc(h.PEN.tier('nhsEW', 28000).rate)}; the third, to ${h.m(35155)}, is ${h.pc(h.PEN.tier('nhsEW', 30000).rate)}. The rate applies to all of your pay, so the move from entry to top costs an extra ${h.m(h.PEN.contribution('nhsEW', p[1].pay) - h.PEN.contribution('nhsEW', p[0].pay))} a year in contributions. Since contributions are taken before income tax, a basic rate taxpayer gets 20 % of that back through lower tax. The ${h.a('nhs-pension-contributions', 'contributions page')} has the full table and the net cost after relief.</p>
<p>In London the tier is decided on pay including the High Cost Area Supplement, because HCAS is pensionable under section 4 of the NHS terms and conditions handbook. A band 4 entry post in inner London pays ${h.m(p[0].pay + inner)} with a supplement of ${h.m(inner)}, which puts it in the ${h.pc(h.PEN.tier('nhsEW', p[0].pay + inner).rate)} tier from day one. In outer London the supplement is ${h.m(outer)}.</p>
<h2>Band 4 outside England</h2>
<p>Wales pays ${h.m(h.PAY.afcPay('wales', '4', 0))} rising to ${h.m(h.PAY.afcPay('wales', '4', 1))} after three years under its pay letter of 12 February 2026. Scotland pays ${h.m(h.PAY.afcPay('scotland', '4', 0))} and ${h.m(h.PAY.afcPay('scotland', '4', 1))}; the Scottish NHS scheme has nine tiers rather than six, and band 4 at the top point pays ${h.pc(h.PEN.tier('nhsScot', h.PAY.afcPay('scotland', '4', 1)).rate)}. In Northern Ireland the latest circular, for ${h.P.afc.ni.year}, pays ${h.m(h.PAY.afcPay('ni', '4', 0))} to ${h.m(h.PAY.afcPay('ni', '4', 1))}; the HSC scheme charges ${h.pc(h.PEN.tier('hscNI', h.PAY.afcPay('ni', '4', 1)).rate)} at the top point.</p>
<h2>From band 4 to band 5</h2>
<p>The step up to band 5 is the largest jump in the lower half of the scale: the entry point of band 5 is ${h.m(h.PAY.afcPay('england', '5', 0))}, ${h.m(h.PAY.afcPay('england', '5', 0) - p[1].pay)} more than the top of band 4. Because both salaries are in the same pension tier, the whole rise is taxed at the basic rate and the same 8 % National Insurance, so take-home goes up by ${h.m(h.nhsNet('england', h.PAY.afcPay('england', '5', 0)).monthly - h.nhsNet('england', p[1].pay).monthly)} a month. The ${h.a('nhs-band-5-salary', 'band 5 page')} sets out the three points that follow and how long each takes.</p>
<h2>Shifts and overtime at band 4</h2>
<p>From band 4 upwards, unsocial hours are paid at time plus ${h.pc(h.PAY.unsocialRates('4')[0], 0)} on Saturdays and weekday nights and time plus ${h.pc(h.PAY.unsocialRates('4')[1], 0)} on Sundays and public holidays, on the hourly rate of ${h.m2(h.PAY.afcHourly('4', 0))} at entry. Band 4 staff are also within the overtime rules of section 3, which cover bands 1 to 7: time and a half beyond 37.5 hours a week, double time on a public holiday.</p>`;
  },
});
