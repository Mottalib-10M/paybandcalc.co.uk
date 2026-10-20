import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'nhs-pension-contributions',
  group: 'pensions',
  order: 71,
  tool: { kind: 'mini:contrib', props: { scheme: 0, pay: 39959 } },
  related: ['nhs-pension-calculator', 'nhs-part-time-pay', 'nhs-take-home-pay', 'teachers-pension-contributions'],
  sources: ['nhsbsa_tiers', 'sppa_nhs_tiers', 'hsc_tiers', 'gov_relief'],
  slug: 'nhs-pension-contributions',
  nav: 'NHS pension contributions',
  card: 'The contribution tiers from April 2026 for England and Wales, Scotland and Northern Ireland, and the cost after tax relief.',
  title: 'NHS Pension Contributions 2026/27: Tiers and Cost After Tax',
  description: 'NHS pension contributions 2026/27: the tier tables from 1 April 2026 for England and Wales, Scotland and Northern Ireland, and the real cost after tax relief.',
  h1: 'NHS pension contribution tiers for 2026/27',
  intro: 'Choose your scheme and enter your pensionable pay. The calculator finds your tier, the yearly contribution and what it really costs once income tax relief is counted.',
  resume: (h) => {
    const T = h.PEN.tierTable('nhsEW'), b5 = h.PAY.afcPay('england', '5', 0), t = h.PEN.tier('nhsEW', b5);
    return `NHS pension contributions are tiered: your pensionable pay places you in one tier, and that tier's rate applies to all of your pensionable pay, not only the slice above a boundary. From 1 April 2026 the NHS Pension Scheme for England and Wales has ${h.num(T.length)} tiers, from ${h.pc(T[0].rate)} on pay up to ${h.m(T[0].upTo!)} to ${h.pc(T.at(-1)!.rate)} on pay above ${h.m(T.at(-2)!.upTo!)}, as published by NHSBSA. Scotland and Northern Ireland run their own schemes with their own tables, published by the SPPA and the HSC Pension Service. The tier is set on actual annual pensionable pay, so part-time staff are placed by what they really earn. A band 5 at entry in England, on ${h.m(b5)}, pays ${h.pc(t.rate)}, which is ${h.m(b5 * t.rate)} a year. The contribution is taken before income tax under the net pay arrangement, so a basic rate taxpayer saves 20 % of it in tax and a higher rate taxpayer 40 %. National Insurance gets no such relief. Pensionable pay includes basic pay, HCAS and unsocial hours payments.`;
  },
  faqs: (h) => [
    { q: 'Why did my NHS pension rate go up when I got a pay rise?', a: 'Because your pay crossed a tier boundary. The rate of the new tier applies to all of your pensionable pay, so a small rise that takes you over a line can cost more in contributions than it adds in pay that year. The extra contribution buys no extra pension directly: the pension is always 1/54 of pay.' },
    { q: 'Is the NHS pension tier based on full-time or actual pay?', a: 'Actual pay, because the tier is set on what you actually earn in a year, not on the full-time equivalent. A post on three fifths of full-time hours can sit one or two tiers lower than the same post worked full time. Your employer reviews the tier when your pay changes, so a change of hours can move you between tiers.' },
    { q: 'How much tax relief do I get on NHS pension contributions?', a: 'Relief at your top rate of income tax, automatically. Contributions come off before tax is worked out, so a basic rate taxpayer pays 80p for each £1 that goes into the scheme and a higher rate taxpayer 60p. In Scotland the relief follows the Scottish rates, from 19 % to 48 %. There is no relief on National Insurance.' },
  ],
  body: (h) => {
    const tab = (s: 'nhsEW' | 'nhsScot' | 'hscNI') => h.PEN.tierTable(s).map((t, i) => [String(i + 1), t.upTo === null ? `${h.m(t.from)} and above` : `${h.m(t.from)} to ${h.m(t.upTo)}`, h.pc(t.rate)]);
    const cases = (['3', '5', '6', '7', '8a'] as const).map((b) => { const p = h.PAY.afcPay('england', b, 0), c = h.PEN.contribution('nhsEW', p), relief = h.TAX.incomeTax(p).tax - h.TAX.incomeTax(p - c).tax; return [`Band ${b} entry`, h.m(p), h.pc(h.PEN.tier('nhsEW', p).rate), h.m(c / 12), h.m((c - relief) / 12)]; });
    return `<h2>England and Wales, from 1 April 2026</h2>
${h.table(['Tier', 'Pensionable pay a year', 'Rate'], tab('nhsEW'), 'NHS Pension Scheme, NHSBSA. Rate on all pensionable pay.', ['l', 'r', 'r'])}
<h2>Scotland, from 1 April 2026</h2>
${h.table(['Tier', 'Pensionable pay a year', 'Rate'], tab('nhsScot'), 'NHS Superannuation Scheme (Scotland), SPPA circular 2026/03.', ['l', 'r', 'r'])}
<h2>Northern Ireland, from 1 April 2026</h2>
${h.table(['Tier', 'Pensionable pay a year', 'Rate'], tab('hscNI'), 'HSC Pension Scheme, HSC Pension Service.', ['l', 'r', 'r'])}
<h2>What it costs each month, England</h2>
${h.table(['Post', 'Pay', 'Rate', 'Contribution a month', 'Cost after tax relief'], cases, 'England 2026/27, full time, outside London. Tax relief worked out on 2026/27 rUK rates by the engine of this site.', ['l', 'r', 'r', 'r', 'r'])}
<p>The three tables are close but not the same: the boundaries and rates differ slightly between the schemes, so staff in different nations on the same pay can pay different rates. The NHS pension built each year is the same fraction of pay whatever tier you are in, which is why the higher tiers pay more for the same accrual.</p>
<h2>What counts as pensionable pay</h2>
<p>Basic salary, the High Cost Area Supplement and unsocial hours payments are pensionable under the NHS handbook. Overtime beyond full-time hours is not. Additional hours worked by part-time staff up to full time are pensionable, as NHSBSA explains. The ${h.a('nhs-pension-calculator', 'pension calculator')} turns your pensionable pay into a pension estimate.</p>
<h2>The cliff edges</h2>
<p>Because the rate of a tier applies to all pay, each boundary is a small cliff. A band 5 or band 6 whose pay step carries them just over a boundary pays the higher rate on everything, so the first pounds above the line cost a great deal in contributions. The effect is temporary in the sense that further pay rises then carry no new jump until the next boundary, and the pension built is unaffected: one fifty-fourth of pay whatever the rate. When you plan extra hours or a move to a higher band, look at where the boundaries fall in the table for your nation.</p>
<h2>Reading the tables</h2>
<p>Each table gives the lower and upper limit of each tier in pounds of pensionable pay a year, and the rate. Limits are applied to your annual pay, worked out by your employer from your contract. The contribution appears on your payslip as a single deduction each month, before income tax. The real cost column in the England table shows that a contribution of a given size costs a basic rate taxpayer four fifths of its face value. If you pay a student loan, it is calculated on pay before the pension, so the loan repayment does not fall when the contribution rises.</p>`;
  },
});
