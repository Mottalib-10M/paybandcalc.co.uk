import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'nhs-take-home-pay',
  group: 'takehome',
  order: 80,
  tool: { kind: 'nhs', props: { band: '5' } },
  related: ['agenda-for-change-pay-scales', 'nhs-pension-contributions', 'student-loan-nhs-teachers', 'nhs-london-weighting-hcas'],
  sources: ['nhse_afc', 'nhsbsa_tiers', 'hmrc_rates', 'gov_relief'],
  slug: 'nhs-take-home-pay',
  nav: 'NHS take-home pay',
  card: 'Net monthly pay for any band, step, nation and London area, after pension, tax, NI and student loan.',
  title: 'NHS Take-Home Pay 2026/27: Net Pay for Every Band and Step',
  description: 'NHS take-home pay 2026/27: net monthly pay for every Agenda for Change band and step in all four nations, after pension, income tax, NI and student loan.',
  h1: 'NHS take-home pay calculator for 2026/27',
  intro: 'Choose nation, band, step and London area, then add hours and any student loan. The result is what reaches your bank account each month.',
  resume: (h) => {
    const g = h.PAY.afcPay('england', '5', 0), r = h.nhsNet('england', g), g6 = h.PAY.afcPay('england', '6', 2), r6 = h.nhsNet('england', g6);
    return `Take-home pay for NHS staff on Agenda for Change is basic pay, plus any London supplement and unsocial hours payments, minus four deductions in a fixed order. First the NHS pension contribution, at the rate of your tier, comes off before tax. Income tax is then charged on what is left above the Personal Allowance, at UK rates or, for Scottish taxpayers, at the six Scottish rates. National Insurance is charged at 8 % on pay between ${h.m(h.P.tax.ni.primaryThreshold)} and ${h.m(h.P.tax.ni.upperEarningsLimit)} a year and 2 % above, on pay before the pension. A student loan takes 9 % above its threshold, also on pay before the pension. In England in 2026/27, a band 5 at entry earning ${h.m(g)} pays ${h.m(r.pension)} in pension, ${h.m(r.tax)} in tax and ${h.m(r.ni)} in NI, and takes home ${h.m(r.monthly)} a month. At the top of band 6, ${h.m(g6)}, take-home is ${h.m(r6.monthly)} a month. The calculator works the same sum for any band, step, nation, area and pattern of hours.`;
  },
  faqs: (h) => [
    { q: 'What is the take-home pay of a band 5 nurse?', a: `In England in 2026/27, band 5 runs from ${h.m(h.PAY.afcPay('england', '5', 0))} to ${h.m(h.PAY.afcPay('england', '5', 2))}. Full time with no student loan, that is about ${h.m(h.nhsNet('england', h.PAY.afcPay('england', '5', 0)).monthly)} to ${h.m(h.nhsNet('england', h.PAY.afcPay('england', '5', 2)).monthly)} a month after pension, tax and NI. Inner London adds the HCAS; unsocial hours add more for shift workers.` },
    { q: 'Why is my first NHS payslip different from the calculator?', a: 'Common reasons are an emergency tax code before HMRC has your details, a part month if you started mid-month, variable pay such as unsocial hours, or arrears of a pay award. The calculator shows a normal full month on the standard tax code. Your payslip lists each deduction, so compare them line by line.' },
    { q: 'Does salary sacrifice change my NHS take-home?', a: 'Yes, if your employer runs schemes such as cycle to work or a lease car: the amount sacrificed comes off gross pay before tax and NI. The calculator does not model them. Note that NHSBSA says pension contributions themselves cannot be paid by salary sacrifice; they always come off through the net pay arrangement.' },
  ],
  body: (h) => {
    const rows = h.PAY.BANDS.map((b) => { const pts = h.PAY.afcPoints('england', b); const a = pts[0].pay, z = pts.at(-1)!.pay; return [`Band ${b}`, h.m(a), h.m(h.nhsNet('england', a).monthly), h.m(z), h.m(h.nhsNet('england', z).monthly)]; });
    const nat = h.PAY.NATIONS.map((n) => { const g = h.PAY.afcPay(n, '6', 0), r = h.nhsNet(n, g); return [h.PAY.NATION_LABEL[n], h.m(g), h.pc(r.pensionRate), h.m(r.tax), h.m(r.monthly)]; });
    return `<h2>Every band in England, first and last point</h2>
${h.table(['Band', 'Entry pay', 'Take-home a month', 'Top pay', 'Take-home a month'], rows, 'England 2026/27, full time, outside London, NHS Pension Scheme tier, no student loan. Worked out by the engine of this site.', ['l', 'r', 'r', 'r', 'r'])}
<h2>Band 6 entry in each nation</h2>
${h.table(['Nation', 'Pay', 'Pension rate', 'Income tax a year', 'Take-home a month'], nat, `Each nation’s own scale, tax and NHS pension scheme. Northern Ireland on the ${h.P.afc.ni.year} scale, the 2026/27 award still to come.`, ['l', 'r', 'r', 'r', 'r'])}
<h2>The order of deductions matters</h2>
<p>Because the pension comes off before income tax but not before NI or a student loan, the same contribution costs less in tax terms than it appears and the NI and loan lines do not move when the pension rate changes. A higher rate taxpayer at band 8a and above gets 40 % relief on the contribution. Above ${h.m(h.P.tax.taperThreshold)}, the Personal Allowance is withdrawn by £1 for each £2 of income, and the pension contribution reduces the income used for that test, which matters at band 9.</p>
<h2>London and shift work</h2>
<p>The High Cost Area Supplement is added to basic pay before every deduction and is pensionable, so it raises the pension contribution and can move you into a higher tier. Unsocial hours payments work the same way. The calculator includes both; the ${h.a('nhs-london-weighting-hcas', 'HCAS page')} and the ${h.a('nhs-unsocial-hours-pay', 'unsocial hours page')} explain the rules.</p>
<h2>Part-time and extra hours</h2>
<p>Set your hours a week and the calculator scales pay from 37.5 hours and sets the pension tier on the actual pay. Overtime is not in the calculator; use the ${h.a('nhs-overtime-pay', 'overtime page')} for it.</p>
<h2>Checking the result against your payslip</h2>
<p>Divide your annual basic pay by twelve and compare it with the basic pay line; add the HCAS line if you work in London. The pension line should be your tier rate times pensionable pay for the month. Income tax depends on your tax code: the calculator assumes the standard 1257L code, so a different code, for example one that collects tax on a benefit or an underpayment from an earlier year, changes the tax line. National Insurance on a standard month is 8 % of pay above the monthly primary threshold. If the lines match and the total still differs, the difference is usually a one-off item such as arrears, a salary sacrifice scheme or a deduction for a union or lottery that payroll takes after tax.</p>
<h2>Using the result</h2>
<p>The take-home figure is the amount you can budget with in a normal month. For a decision such as a move to a higher band, the extra take-home is the right measure rather than the gross rise, because tax, NI and the pension each take a share. The ${h.a('nhs-pay-progression', 'pay progression page')} shows that gain step by step.</p>`;
  },
});
