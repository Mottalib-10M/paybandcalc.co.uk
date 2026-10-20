import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'nhs-part-time-pay',
  group: 'nhs',
  order: 36,
  tool: { kind: 'mini:part-time' },
  related: ['nhs-overtime-pay', 'nhs-pension-contributions', 'part-time-teacher-pay', 'nhs-take-home-pay'],
  sources: ['nhse_afc', 'nhse_handbook', 'nhsbsa_tiers', 'hmrc_rates'],
  slug: 'nhs-part-time-pay',
  nav: 'Part-time pay',
  card: 'Pro rata salary for any contracted hours, the lower pension tier it can bring, and the take-home.',
  title: 'NHS Part-Time Pay 2026/27: Pro Rata Salary and Take-Home',
  description: 'NHS part-time pay 2026/27: pro rata salary for your contracted hours out of 37.5, the pension tier set on actual pay, and take-home a month for each band.',
  h1: 'NHS part-time pay in 2026/27: pro rata salary and take-home',
  intro: 'Enter your band, step and contracted hours a week. The salary is scaled from the full-time 37.5 hours, and the pension tier is set on the pay you actually earn.',
  resume: (h) => {
    const g = h.PAY.afcPay('england', '6', 0), half = g * 22.5 / 37.5, a = h.nhsNet('england', g), b = h.nhsNet('england', half);
    return `A part-time Agenda for Change post is paid the full-time salary of its band and point, scaled by the share of the standard 37.5 hour week in the contract. A band 6 at entry on 22.5 hours a week is paid ${h.pc(22.5 / 37.5, 0)} of ${h.m(g)}, which is ${h.m(half)} a year in England in 2026/27. Three things then change more than in proportion. NHS pension contributions are set on actual annual pensionable pay, so the tier can fall: here from ${h.pc(a.pensionRate)} to ${h.pc(b.pensionRate)}. The Personal Allowance and the National Insurance threshold are not scaled, so a larger share of part-time pay is free of tax and NI. And a student loan may stop altogether below its threshold. The result is that the band 6 on 22.5 hours takes home ${h.m(b.monthly)} a month, ${h.pc(b.net / a.net, 0)} of the full-time ${h.m(a.monthly)}, not ${h.pc(22.5 / 37.5, 0)}. Extra hours up to 37.5 are paid at plain time and are pensionable.`;
  },
  faqs: (h) => [
    { q: 'How is NHS part-time pay worked out?', a: 'Divide your contracted hours by 37.5 and multiply the full-time annual salary for your band and point by the result. Hourly pay is the same as full time: NHS Employers publishes it for each point. Unsocial hours payments, the London supplement and pay progression all apply to part-time staff on the same basis as to full-time staff.' },
    { q: 'Do part-time NHS staff pay a lower pension rate?', a: `Often. NHSBSA bases the tier on actual annual pensionable pay, not on the whole-time equivalent. A band 5 at entry on 0.6 of full time earns ${h.m(h.PAY.afcPay('england', '5', 0) * 0.6)}, which falls in the ${h.pc(h.PEN.tier('nhsEW', h.PAY.afcPay('england', '5', 0) * 0.6).rate)} tier rather than the ${h.pc(h.PEN.tier('nhsEW', h.PAY.afcPay('england', '5', 0)).rate)} of a full-time post.` },
    { q: 'Are extra hours pensionable for part-time NHS staff?', a: 'Yes, up to the whole-time equivalent. NHSBSA explains that additional hours worked by part-time staff up to full-time hours are automatically pensionable, after a change to the 2015 scheme regulations that also corrected the treatment of hours worked between 2015 and 2024. Hours beyond 37.5 a week are overtime and are not pensionable for anyone.' },
  ],
  body: (h) => {
    const hours = [15, 22.5, 30, 37.5];
    const rows = (['3', '5', '6', '7'] as const).map((b) => [`Band ${b} entry`, ...hours.map((x) => h.m(h.nhsNet('england', h.PAY.afcPay('england', b, 0) * x / 37.5).monthly))]);
    return `<h2>Take-home a month by contracted hours</h2>
${h.table(['Post', '15 hours', '22.5 hours', '30 hours', '37.5 hours'], rows, 'England 2026/27, entry point, outside London, NHS pension at the tier for the pay actually earned, no student loan. Worked out by the engine of this site.', ['l', 'r', 'r', 'r', 'r'])}
<h2>Why take-home falls less than pay</h2>
<p>Income tax and National Insurance have fixed annual thresholds: the Personal Allowance of ${h.m(h.P.tax.personalAllowance)} and the primary threshold of ${h.m(h.P.tax.ni.primaryThreshold)}. A part-time salary keeps the whole of both, so the first ${h.m(h.P.tax.personalAllowance)} of pay is free of tax however small the contract. On 15 hours a week at band 3, pay of ${h.m(h.PAY.afcPay('england', '3', 0) * 15 / 37.5)} is barely above the allowance and almost all of it is kept after the ${h.pc(h.PEN.tier('nhsEW', h.PAY.afcPay('england', '3', 0) * 15 / 37.5).rate)} pension contribution. The same mechanism works for the pension tiers, which also move with actual pay.</p>
<h2>Two part-time posts</h2>
<p>Some staff hold two part-time NHS posts. For income tax the two salaries are added together over the year, so the Personal Allowance is only given once. How the pension tier is set for two posts depends on your employers and NHSBSA, so check your payslips. The calculator treats one post at a time; for a rough figure on two posts, add the gross pay and use the take-home calculator on the total.</p>
<h2>Part-time hours in other nations</h2>
<p>Part-time pay in Scotland, Wales and Northern Ireland is the same share of each nation's own annual scale. The full calculator takes the share of full-time hours you enter, applies it to the annual figure of the nation you choose, and then applies that nation's pension tiers and, for Scotland, the Scottish income tax bands to the pay actually earned. For a Scottish post, enter the share of a full-time week shown in your contract rather than a number of hours, since the mini calculator above uses the 37.5 hour week of England.</p>
<h2>Moving from full time to part time</h2>
<p>Reducing hours lowers the pension built each year, since pension accrues at 1/54th of the pay actually earned. Ten years at 22.5 hours instead of 37.5 builds two fifths less pension for those years; the years already built are not affected and keep being revalued. The ${h.a('nhs-pension-calculator', 'pension calculator')} accepts any pensionable pay, so enter the part-time figure to see the effect, and the full-time figure to compare the two over the years left to your State Pension age.</p>`;
  },
});
