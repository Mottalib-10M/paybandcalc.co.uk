import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'nhs-london-weighting-hcas',
  group: 'nhs',
  order: 32,
  tool: { kind: 'mini:hcas' },
  related: ['agenda-for-change-pay-scales', 'london-teacher-pay', 'nhs-band-5-salary', 'nhs-band-8a-salary'],
  sources: ['nhse_afc', 'nhse_handbook', 'nhsbsa_tiers', 'hmrc_rates'],
  slug: 'nhs-london-weighting-hcas',
  nav: 'London weighting (HCAS)',
  card: 'Inner, outer and fringe supplements for 2026/27: the percentage, the floor and the cap for every band.',
  title: 'NHS London Weighting 2026/27: HCAS by Band and Pay Area',
  description: 'NHS London weighting 2026/27: the High Cost Area Supplement is 20 %, 15 % or 5 % of basic pay, with a minimum and maximum. See yours by band and its net value.',
  h1: 'NHS London weighting in 2026/27: the High Cost Area Supplement',
  intro: 'Choose your band, step and area: the supplement, the rule that sets it and the extra take-home each month appear at once.',
  resume: (h) => {
    const H = h.P.afc.england.hcas;
    return `NHS staff in London and the surrounding fringe are paid a High Cost Area Supplement on top of basic pay, under section 4 and Annex 9 of the NHS terms and conditions handbook. From 1 April 2026 it is ${h.pc(H.inner.rate, 0)} of basic salary in inner London, with a minimum of ${h.m(H.inner.min)} and a maximum of ${h.m(H.inner.max)}; ${h.pc(H.outer.rate, 0)} in outer London, from ${h.m(H.outer.min)} to ${h.m(H.outer.max)}; and ${h.pc(H.fringe.rate, 0)} in the fringe, from ${h.m(H.fringe.min)} to ${h.m(H.fringe.max)}. The minimum decides the supplement for low bands and the maximum for senior ones, so only the middle of the scale actually gets the percentage. NHS Employers' tables round the result up to the next pound: band 5 entry in inner London is ${h.m(h.PAY.afcPay('england', '5', 0) + h.PAY.hcas(h.PAY.afcPay('england', '5', 0), 'inner'))}. The supplement is pensionable and taxed like salary, but it is not used to work out overtime or unsocial hours, and it is paid in England only.`;
  },
  faqs: (h) => [
    { q: 'Which areas count as inner London for the NHS supplement?', a: 'Annex 8 of the handbook defines the zones by the 2005 primary care trust boundaries. Inner London covers the former PCTs of Hammersmith and Fulham, Kensington and Chelsea, Westminster, Camden, Islington, City and Hackney, Tower Hamlets, Lambeth, Lewisham, Southwark and Wandsworth. Outer London and the fringe are listed in the same annex; your employer applies the zone of your workplace.' },
    { q: 'Is NHS London weighting pensionable?', a: `Yes. Paragraph 4.2 of the handbook states that high cost area supplements are pensionable. They count towards the pay that decides your contribution tier, so a London supplement can move you into a higher tier: band 5 entry in inner London, ${h.m(h.PAY.afcPay('england', '5', 0) + h.PAY.hcas(h.PAY.afcPay('england', '5', 0), 'inner'))}, pays ${h.pc(h.PEN.tier('nhsEW', 38488).rate)} rather than ${h.pc(h.PEN.tier('nhsEW', h.PAY.afcPay('england', '5', 0)).rate)}. It also builds pension at 1/54th a year.` },
    { q: 'Do part-time NHS staff in London get the full supplement?', a: 'The handbook expresses the supplement as a share of basic pay with a minimum and maximum, and part-time basic pay is pro rata, so the supplement follows your hours. The calculators on this site apply the full-time supplement scaled by your share of full-time hours. Check your payslip if your employer applies the minimum differently.' },
  ],
  body: (h) => {
    const rows = h.PAY.BANDS.map((b) => { const pts = h.PAY.afcPoints('england', b); const e = pts[0].pay, t = pts[pts.length - 1].pay; return [`Band ${b}`, h.m(h.PAY.hcas(e, 'inner')), h.m(h.PAY.hcas(t, 'inner')), h.m(h.PAY.hcas(e, 'outer')), h.m(h.PAY.hcas(t, 'outer')), h.m(h.PAY.hcas(e, 'fringe')), h.m(h.PAY.hcas(t, 'fringe'))]; });
    const H = h.P.afc.england.hcas;
    const floor = (x: typeof H.inner) => x.min / x.rate, cap = (x: typeof H.inner) => x.max / x.rate;
    return `<h2>The supplement for every band, 2026/27</h2>
${h.table(['Band', 'Inner, entry', 'Inner, top', 'Outer, entry', 'Outer, top', 'Fringe, entry', 'Fringe, top'], rows, 'High Cost Area Supplement a year from 1 April 2026, full time. Worked out from the Annex 9 rule and checked against the NHS Employers tables.', ['l', 'r', 'r', 'r', 'r', 'r', 'r'])}
<h2>Where the percentage applies</h2>
<p>The percentage only decides the supplement for basic pay between two points. In inner London, 20 % of basic pay is below the minimum until pay reaches ${h.m(floor(H.inner))} and above the maximum from ${h.m(cap(H.inner))}. In outer London the range is ${h.m(floor(H.outer))} to ${h.m(cap(H.outer))}; in the fringe, ${h.m(floor(H.fringe))} to ${h.m(cap(H.fringe))}. That is why a band 2 healthcare assistant and a band 4 assistant practitioner in inner London get exactly the same ${h.m(H.inner.min)}, and why every point from band 8a upwards gets the same ${h.m(H.inner.max)}.</p>
<p>The result is a supplement worth far more, relative to pay, at the bottom of the scale. ${h.m(H.inner.min)} is ${h.pc(H.inner.min / h.PAY.afcPay('england', '2'), 0)} of a band 2 salary but ${h.pc(H.inner.max / h.PAY.afcPay('england', '9', 2), 0)} of the top of band 9.</p>
<h2>What the supplement adds to take-home</h2>
<p>The supplement is added to basic pay before every deduction. It is taxed at your marginal rate, bears National Insurance, and counts as pensionable pay, which can move you into the next contribution tier. For a band 6 at entry in outer London, the supplement of ${h.m(h.PAY.hcas(h.PAY.afcPay('england', '6', 0), 'outer'))} adds ${h.m((h.nhsNet('england', h.PAY.afcPay('england', '6', 0) + h.PAY.hcas(h.PAY.afcPay('england', '6', 0), 'outer')).net - h.nhsNet('england', h.PAY.afcPay('england', '6', 0)).net) / 12)} a month to take-home. The mini calculator above gives the figure for any band, step and area, and the ${h.a('nhs-take-home-pay', 'full calculator')} combines it with hours, loans and Scottish tax.</p>
<h2>Comparing a post inside and outside London</h2>
<p>NHS Employers publishes its London tables with the supplement already included, as the higher of basic pay plus the percentage and basic pay plus the minimum. To compare a London post with one elsewhere, take the supplement off, or put it on the other side. A band 7 at entry earns ${h.m(h.PAY.afcPay('england', '7', 0))} outside London and ${h.m(h.PAY.afcPay('england', '7', 0) + h.PAY.hcas(h.PAY.afcPay('england', '7', 0), 'inner'))} in inner London; after the pension, income tax at 40 % on the slice above the higher rate line and National Insurance, the monthly difference is ${h.m(h.nhsNet('england', h.PAY.afcPay('england', '7', 0) + h.PAY.hcas(h.PAY.afcPay('england', '7', 0), 'inner')).monthly - h.nhsNet('england', h.PAY.afcPay('england', '7', 0)).monthly)}, against a gross gap of ${h.m(h.PAY.hcas(h.PAY.afcPay('england', '7', 0), 'inner') / 12)} a month.</p>
<h2>Teachers in London</h2>
<p>Teachers are paid differently: instead of a supplement, the school teachers' pay scale has four separate columns for the rest of England, the fringe, outer London and inner London. The ${h.a('london-teacher-pay', 'London teacher pay page')} sets the two systems side by side, with the take-home of each London teacher pay point and of the NHS bands nearest to it.</p>`;
  },
});
