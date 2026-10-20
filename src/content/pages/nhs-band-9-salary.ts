import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'nhs-band-9-salary',
  group: 'bands',
  order: 20,
  tool: { kind: 'nhs', props: { band: '9' } },
  related: ['nhs-band-8d-salary', 'agenda-for-change-pay-scales', 'nhs-pension-calculator', 'scottish-tax-nhs-teachers'],
  sources: ['nhse_afc', 'nhsbsa_tiers', 'hmrc_rates', 'gov_tax', 'scot_afc'],
  slug: 'nhs-band-9-salary',
  nav: 'Band 9',
  card: 'The top of Agenda for Change: £129,783 in England, the tapered allowance and the effective 60 % slice.',
  title: 'NHS Band 9 Salary 2026/27: Take-Home and Lost Allowance',
  description: 'NHS band 9 salary for 2026/27: £112,782 to £129,783 in England. Monthly take-home after tax, NI and the pension, and the Personal Allowance each point loses.',
  h1: 'NHS band 9 salary: take-home at the top of Agenda for Change',
  intro: 'Band 9 is the highest Agenda for Change band, for the most senior non-medical directors and consultants. The calculator shows each point in each nation, with the London supplement in England.',
  resume: (h) => {
    const p = h.PAY.afcPoints('england', '9'), r = p.map((x) => h.nhsNet('england', x.pay)), adj = p.map((x, i) => x.pay - r[i].pension);
    return `Band 9 in England pays ${h.m(p[0].pay)} at entry, ${h.m(p[1].pay)} after ${p[0].years} years and ${h.m(p[2].pay)} at the top, reached ${p[1].years} years later, on the NHS Employers scale for 2026/27. Every point is in the highest NHS pension tier, ${h.pc(r[0].pensionRate)}, and the contribution is taken before income tax. That keeps the entry point's income at ${h.m(adj[0])}, below the ${h.m(h.P.tax.taperThreshold)} line, so it keeps the full Personal Allowance. The intermediate and top points do not: their income after pension is ${h.m(adj[1])} and ${h.m(adj[2])}, and they keep ${h.m(h.TAX.personalAllowance(adj[1]))} and ${h.m(h.TAX.personalAllowance(adj[2]))} of the ${h.m(h.P.tax.personalAllowance)} allowance. Take-home pay runs from ${h.m(r[0].monthly)} to ${h.m(r[2].monthly)} a month, full time and outside London. The top of band 9 is also subject to the re-earnable rule of paragraph 1.11 of the NHS handbook.`;
  },
  faqs: (h) => [
    { q: 'What is the highest Agenda for Change salary in 2026/27?', a: `The top of band 9. In England that is ${h.m(h.PAY.afcPay('england', '9', 2))}, rising to ${h.m(h.PAY.afcPay('england', '9', 2) + h.P.afc.england.hcas.inner.max)} with the inner London supplement. Wales pays ${h.m(h.PAY.afcPay('wales', '9', 2))}, Scotland ${h.m(h.PAY.afcPay('scotland', '9', 1))} at its second point, and Northern Ireland ${h.m(h.PAY.afcPay('ni', '9', 2))} on its ${h.P.afc.ni.year} scale. Medical and dental staff are paid on separate contracts.` },
    { q: 'How much tax does a band 9 director pay at the top point?', a: `Income tax of ${h.m(h.nhsNet('england', h.PAY.afcPay('england', '9', 2)).tax)} a year in England in 2026/27, on pay after the ${h.pc(h.PEN.tier('nhsEW', 129783).rate)} pension contribution, with part of the Personal Allowance withdrawn. National Insurance adds ${h.m(h.nhsNet('england', h.PAY.afcPay('england', '9', 2)).ni)}. In Scotland the same income would pay more, because of the 45 % advanced rate, which applies to most of the taxable pay above the Scottish higher rate band.` },
    { q: 'Do band 9 staff get unsocial hours or overtime?', a: `Unsocial hours payments under section 2 of the handbook apply to bands 4 to 9, at time plus ${h.pc(h.PAY.unsocialRates('9')[0], 0)} or ${h.pc(h.PAY.unsocialRates('9')[1], 0)}, if band 9 work falls in those hours as part of standard hours. Overtime at time and a half is limited by section 3 to bands 1 to 7, so it does not apply to band 9.` },
  ],
  body: (h) => {
    const p = h.PAY.afcPoints('england', '9');
    const nations = (['england', 'scotland', 'wales', 'ni'] as const).map((n) => { const pts = h.PAY.afcPoints(n, '9'), top = pts[pts.length - 1].pay, r = h.nhsNet(n, top); return [h.PAY.NATION_LABEL[n] + (n === 'ni' ? ` (${h.P.afc.ni.year})` : ''), h.m(top), h.m(r.tax), h.pc(r.marginal, 0), h.m(r.monthly)]; });
    const extra = 1000, a = h.nhsNet('england', p[1].pay), b = h.nhsNet('england', p[1].pay + extra);
    return `<h2>Band 9 take-home, England 2026/27</h2>
${h.bandNetTable('england', '9')}
<h2>The top of band 9 in each nation</h2>
${h.table(['Nation', 'Top point', 'Income tax', 'Top tax rate', 'Take-home a month'], nations, 'Top point of band 9, full time, pension in the nation’s scheme, Scottish income tax for Scotland. Worked out by the engine of this site.', ['l', 'r', 'r', 'r', 'r'])}
<p>Scotland's top point, ${h.m(h.PAY.afcPay('scotland', '9', 1))}, pays the most income tax: after the ${h.pc(h.PEN.tier('nhsScot', 133044).rate)} Scottish contribution, income is well into the taper and the slice above ${h.m(h.P.tax.scotland.bands[3].upTo!)} of taxable pay is charged at 45 %. Combined with the lost allowance, the Scottish marginal rate on that slice is higher than the 60 % seen in England.</p>
<h2>What the next £1,000 is worth at band 9</h2>
<p>At the intermediate point, ${h.m(extra)} more pay adds ${h.m(b.net - a.net)} to take-home over the year. The pension takes ${h.pc(b.pensionRate)} of it, income tax takes 40 % of the rest plus 40 % on the £1 of allowance lost for every £2 of income, and National Insurance takes 2 %. It is the steepest part of the tax system for anyone on Agenda for Change pay, and it ends at an income of ${h.m(h.P.tax.ruk.bands[1].upTo!)}, where no allowance is left and the additional rate of 45 % begins. No band 9 salary reaches that point, even in inner London.</p>
<h2>Band 9 in London</h2>
<p>The inner London supplement is capped at ${h.m(h.P.afc.england.hcas.inner.max)}, which is ${h.pc(h.P.afc.england.hcas.inner.max / p[0].pay, 0)} of the entry salary and ${h.pc(h.P.afc.england.hcas.inner.max / p[2].pay, 0)} of the top one, well under the 20 % the rule starts from. With it, the entry point's income after pension rises to ${h.m((p[0].pay + h.P.afc.england.hcas.inner.max) * (1 - h.PEN.tier('nhsEW', p[0].pay).rate))}, so the entry point too begins to lose allowance, and a good part of the supplement is taxed at the effective 60 %. Outer London adds ${h.m(h.P.afc.england.hcas.outer.max)} and the fringe ${h.m(h.P.afc.england.hcas.fringe.max)}, both at their maximum for this band. Choose the area in the calculator to see the take-home with each.</p>
<h2>Re-earnable pay at the top</h2>
<p>Twelve months after reaching ${h.m(p[2].pay)}, 5 % or 10 % of basic salary becomes re-earnable each year under paragraph 1.11 of the handbook. If the standards of Annex 23 are not met, pay can be reduced by that slice from the pay step date and restored after a further year once they are. A 5 % reduction at the top point would cut take-home by ${h.m(h.nhsNet('england', p[2].pay).monthly - h.nhsNet('england', p[2].pay * 0.95).monthly)} a month, less than the gross amount because much of it falls in the tapered slice.</p>
<h2>The pension at band 9</h2>
<p>A year at the top of band 9 adds ${h.m(p[2].pay / 54)} a year to a 2015 scheme pension, the largest addition any Agenda for Change salary can make. The contribution of ${h.m(h.PEN.contribution('nhsEW', p[2].pay))} attracts relief at the marginal rate, which here includes the effect of the taper. Members with long service at this level are those most likely to meet the annual allowance for pension saving, which this site does not model; NHS Pensions reports the growth of your benefits each year.</p>`;
  },
});
