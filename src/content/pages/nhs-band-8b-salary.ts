import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'nhs-band-8b-salary',
  group: 'bands',
  order: 17,
  tool: { kind: 'nhs', props: { band: '8b' } },
  related: ['nhs-band-8a-salary', 'nhs-band-8c-salary', 'nhs-pension-contributions', 'scottish-tax-nhs-teachers'],
  sources: ['nhse_afc', 'nhsbsa_tiers', 'hmrc_rates', 'scot_afc', 'sppa_nhs_tiers'],
  slug: 'nhs-band-8b-salary',
  nav: 'Band 8b',
  card: 'The step where the pension rate jumps to 12.5 % of the whole salary, and what it does to take-home.',
  title: 'NHS Band 8b Salary 2026/27: Take-Home and the 12.5 % Tier',
  description: 'NHS band 8b salary in 2026/27: £66,582 to £77,368 in England. The monthly take-home at each point and the pension tier that takes 12.5 % from the first step on.',
  h1: 'NHS band 8b salary: take-home and the top pension tier',
  intro: 'Band 8b covers heads of service, senior managers and consultant practitioners. Its first step crosses into the highest NHS pension tier; the calculator shows what that means each month.',
  resume: (h) => {
    const p = h.PAY.afcPoints('england', '8b'), a = h.nhsNet('england', p[0].pay), b = h.nhsNet('england', p[1].pay), c = h.nhsNet('england', p[2].pay);
    return `Band 8b in England pays ${h.m(p[0].pay)}, ${h.m(p[1].pay)} and ${h.m(p[2].pay)} in 2026/27, with ${p[0].years} years then ${p[1].years} years between the points, according to the NHS Employers scale. The entry point is in the pension tier charged at ${h.pc(a.pensionRate)}; the intermediate and top points are above ${h.m(67668)}, in the highest tier, ${h.pc(b.pensionRate)} of the whole salary. The first step therefore raises the contribution by ${h.m(b.pension - a.pension)} a year on a gross rise of ${h.m(p[1].pay - p[0].pay)}, and take-home moves only from ${h.m(a.monthly)} to ${h.m(b.monthly)} a month. The second step, with no tier change, adds ${h.m(c.monthly - b.monthly)} a month on its own. The pension bought is larger at each point all the same: 1/54th of pay a year, revalued above inflation every April. Scotland has two points for 8b, ${h.m(h.PAY.afcPay('scotland', '8b', 0))} and ${h.m(h.PAY.afcPay('scotland', '8b', 1))}, taxed at 42 % above the Scottish higher rate threshold; once the pension is taken off, neither point reaches the 45 % advanced rate.`;
  },
  faqs: (h) => [
    { q: 'Is it worth taking the first band 8b pay step?', a: `It is not a choice: the step is paid on your pay step date when the standards are met. It still raises take-home, by ${h.m(h.nhsNet('england', h.PAY.afcPay('england', '8b', 1)).monthly - h.nhsNet('england', h.PAY.afcPay('england', '8b', 0)).monthly)} a month, even though the higher pension tier takes a larger share. And the extra contribution buys pension: about ${h.m((h.PAY.afcPay('england', '8b', 1) - h.PAY.afcPay('england', '8b', 0)) / 54)} more a year for each year at the new point.` },
    { q: 'Which band 8b salaries are taxed at 45 % in Scotland?', a: `The Scottish advanced rate of 45 % applies to taxable income above ${h.m(h.P.tax.scotland.bands[3].upTo!)} beyond the Personal Allowance, about ${h.m(h.P.tax.personalAllowance + h.P.tax.scotland.bands[3].upTo!)} of income. Taxable income is pay after the pension. Neither Scottish 8b point gets there: the top one, ${h.m(h.PAY.afcPay('scotland', '8b', 1))}, less its ${h.pc(h.PEN.tier('nhsScot', h.PAY.afcPay('scotland', '8b', 1)).rate)} contribution, stays below. The line is first crossed at the entry point of band 8c.` },
    { q: 'What is the highest NHS pension contribution rate?', a: `In England and Wales, ${h.pc(h.PEN.tier('nhsEW', 100000).rate)} on actual pensionable pay of ${h.m(67669)} or more from 1 April 2026. Scotland's top tier is ${h.pc(h.PEN.tier('nhsScot', 100000).rate)} above ${h.m(83026)}, and Northern Ireland's HSC scheme charges ${h.pc(h.PEN.tier('hscNI', 100000).rate)} above ${h.m(67668)}. In each scheme the rate applies to the whole of your pay, and tax relief reduces its real cost.` },
  ],
  body: (h) => {
    const p = h.PAY.afcPoints('england', '8b');
    const near = [66000, 67668, 67669, 69000].map((g) => { const r = h.nhsNet('england', g); return [h.m(g), h.pc(r.pensionRate), h.m(r.pension), h.m(r.net)]; });
    return `<h2>Band 8b take-home, England 2026/27</h2>
${h.bandNetTable('england', '8b')}
<h2>Around the 12.5 % line</h2>
<p>NHSBSA sets the tiers on actual annual pensionable pay, and the rate for your tier applies to every pound. That makes the line at ${h.m(67668)} a small cliff: one pound more moves the whole salary into the top rate. The table shows the contribution and the take-home a year around it.</p>
${h.table(['Pensionable pay', 'Rate', 'Contribution', 'Take-home a year'], near, 'England and Wales NHS scheme from 1 April 2026, full time, no loan. Worked out by the engine of this site.', ['r', 'r', 'r', 'r'])}
<p>Just above the line, take-home is lower than just below it. Nobody on band 8b sits there, since the points are ${h.m(p[0].pay)} and ${h.m(p[1].pay)}, but it matters for staff whose pensionable pay includes a London supplement, unsocial hours or a recruitment and retention premium. NHSBSA bases the tier on actual annual pensionable pay, so a change in that pay during the year can move you from one tier to another.</p>
<h2>Band 8b in the other nations</h2>
<p>In Scotland the tier lines are different. The SPPA circular 2026/03 gives nine tiers, with ${h.pc(h.PEN.tier('nhsScot', 70000).rate)} from ${h.m(59370)} to ${h.m(83026)} and ${h.pc(h.PEN.tier('nhsScot', 90000).rate)} above. Both Scottish 8b points are in the ${h.pc(h.PEN.tier('nhsScot', 70000).rate)} tier. Wales pays ${h.m(h.PAY.afcPay('wales', '8b', 0))} to ${h.m(h.PAY.afcPay('wales', '8b', 2))} with the England and Wales tiers, so its first step crosses the same line. Northern Ireland's ${h.P.afc.ni.year} scale, ${h.m(h.PAY.afcPay('ni', '8b', 0))} to ${h.m(h.PAY.afcPay('ni', '8b', 2))}, meets the HSC top tier of ${h.pc(h.PEN.tier('hscNI', 70000).rate)} at the same step.</p>
<h2>Band 8b and the pension at retirement</h2>
<p>The highest tier is also the tier where the pension bought each year is largest. At the top of band 8b a year of membership adds ${h.m(p[2].pay / 54)} a year of pension in today's money, against a contribution of ${h.m(h.PEN.contribution('nhsEW', p[2].pay))} that costs rather less after 40 % tax relief. For a member with twenty years to State Pension age that single year's pension is revalued twenty times at 1.5 % above inflation before it is paid. The ${h.a('nhs-pension-calculator', 'pension calculator')} adds the years together and shows the effect of exchanging part of the pension for a lump sum at £12 for each £1 given up.</p>
<h2>Higher rate tax at band 8b</h2>
<p>Outside Scotland, every 8b point has most of its taxable pay in the 40 % band, which ends at ${h.m(h.P.tax.ruk.bands[1].upTo!)}; none reaches the ${h.m(h.P.tax.taperThreshold)} at which the Personal Allowance starts to shrink. The marginal deduction on a pound of 8b pay at the intermediate point is the pension rate, 40 % of the rest in tax, and 2 % in National Insurance: a little over half goes before the money reaches you, but one pound in eight is going into your own pension.</p>`;
  },
});
