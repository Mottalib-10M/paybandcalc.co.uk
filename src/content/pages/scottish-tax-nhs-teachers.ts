import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'scottish-tax-nhs-teachers',
  group: 'takehome',
  order: 82,
  tool: { kind: 'mini:scot-tax', props: { pay: 40000 } },
  related: ['nhs-scotland-pay-scales', 'teacher-pay-scotland', 'nhs-take-home-pay', 'teacher-take-home-pay'],
  sources: ['gov_tax', 'hmrc_rates', 'scot_afc', 'snct_21'],
  slug: 'scottish-tax-nhs-teachers',
  nav: 'Scottish income tax',
  card: 'The six Scottish income tax bands for 2026/27 and what they take from NHS and teaching salaries.',
  title: 'Scottish Income Tax 2026/27 for NHS Staff and Teachers',
  description: 'Scottish income tax 2026/27 for NHS staff and teachers: the six bands, what they take from NHS and main grade teacher salaries, and the gap with England.',
  h1: 'Scottish income tax for NHS staff and teachers',
  intro: 'Enter your taxable pay, which is pay after your pension contribution. The calculator compares Scottish income tax with the rest of the UK.',
  resume: (h) => {
    const B = h.P.tax.scotland.bands, PA = h.P.tax.personalAllowance, s = h.nhsNet('scotland', h.PAY.afcPay('scotland', '6', 0));
    return `Scottish taxpayers pay income tax at Scottish rates set by the Scottish Parliament, while the Personal Allowance of ${h.m(PA)} and National Insurance stay the same across the UK. In 2026/27 there are six bands on income above the allowance: ${h.pc(B[0].rate, 0)} on the first ${h.m(B[0].upTo!)}, ${h.pc(B[1].rate, 0)} up to ${h.m(B[1].upTo!)}, ${h.pc(B[2].rate, 0)} intermediate up to ${h.m(B[2].upTo!)}, ${h.pc(B[3].rate, 0)} higher up to ${h.m(B[3].upTo!)}, ${h.pc(B[4].rate, 0)} advanced up to ${h.m(B[4].upTo!)}, and ${h.pc(B[5].rate, 0)} top rate beyond, all measured on taxable income above the allowance. Most NHS and teaching salaries in Scotland fall in the intermediate or higher band once pension is taken off, so they pay more income tax than the same salary in England, although Scottish pay scales are often higher. A band 6 at entry in NHS Scotland pays ${h.m(s.tax)} of income tax a year, at a top rate of ${h.pc(s.marginal, 0)}. Your tax follows where you live, not where you work, and the tax code starts with S.`;
  },
  faqs: (h) => [
    { q: 'At what salary do Scottish NHS staff start paying more tax than in England?', a: 'Scottish tax is slightly lower on small incomes because of the 19 % starter rate, roughly equal around the end of the basic band, and higher from the intermediate band upward. Enter your taxable pay in the calculator to see the exact gap; it uses 2026/27 rates on both sides and treats the Personal Allowance taper identically.' },
    { q: 'Do Scottish teachers get tax relief on pension contributions at 21 %?', a: 'Yes. Teachers’ and NHS pension contributions come off before Scottish income tax, so the relief follows your own top Scottish rate: 21 % in the intermediate band, 42 % in the higher band and 45 % in the advanced band. A contribution that takes income out of a higher band saves tax at that higher rate.' },
    { q: 'Does Scottish income tax affect National Insurance?', a: 'No. National Insurance is a UK tax with the same thresholds and rates everywhere, 8 % between the primary threshold and the upper earnings limit and 2 % above. Scottish rates apply to income tax only. Student loan repayments, also UK-wide, are unaffected too, except that Scottish students repay on Plan 4.' },
  ],
  body: (h) => {
    const nhs = (['4', '5', '6', '7', '8a'] as const).map((b) => { const g = h.PAY.afcPay('scotland', b, 0), r = h.nhsNet('scotland', g), taxable = g - r.pension; return [`NHS band ${b} entry`, h.m(g), h.m(r.tax), h.m(h.TAX.incomeTax(taxable, 'ruk').tax), h.pc(r.marginal, 0)]; });
    const tch = [0, 1, 5].map((i) => { const g = h.P.teachers.scotland.main[i], r = h.teacherNet('scotland', g), taxable = g - r.pension; return [`Teacher main grade point ${i}`, h.m(g), h.m(r.tax), h.m(h.TAX.incomeTax(taxable, 'ruk').tax), h.pc(r.marginal, 0)]; });
    return `<h2>Scottish tax on NHS and teaching pay</h2>
${h.table(['Post', 'Pay', 'Scottish income tax', 'Same taxable pay, rest of UK', 'Top Scottish rate'], [...nhs, ...tch], 'Scottish scales: NHS from 1 April 2026, teachers from 1 August 2026. Tax on pay after the pension contribution of each scheme, 2026/27 rates. Worked out by the engine of this site.', ['l', 'r', 'r', 'r', 'r'])}
<p>The comparison column applies rest-of-UK rates to the same taxable pay, so it isolates the tax difference; the take-home difference between a Scottish and an English post also depends on the scales and the pension schemes.</p>
<h2>How the bands are measured</h2>
<p>The Scottish band limits are amounts of taxable income above the Personal Allowance, not salaries. A salary of ${h.m(h.P.tax.personalAllowance + h.P.tax.scotland.bands[2].upTo!)} after pension sits exactly at the top of the intermediate band. Above ${h.m(h.P.tax.taperThreshold)}, the allowance shrinks by £1 for every £2, as in the rest of the UK, so the band limits start lower in pounds of salary. This site follows that method in every calculation.</p>
<h2>Where the higher rate begins</h2>
<p>The 42 % higher rate starts at ${h.m(h.P.tax.personalAllowance + h.P.tax.scotland.bands[2].upTo!)} of taxable income, well below the ${h.m(h.P.tax.personalAllowance + h.P.tax.ruk.bands[0].upTo!)} at which the 40 % rate starts elsewhere. Band 7 staff and teachers at the top of the main grade are in that gap, which is where the Scottish extra is largest. The ${h.a('nhs-scotland-pay-scales', 'NHS Scotland page')} and the ${h.a('teacher-pay-scotland', 'Scottish teacher page')} turn these figures into monthly take-home.</p>
<h2>Who counts as a Scottish taxpayer</h2>
<p>Scottish income tax depends on where you live for most of the tax year, not on where your employer is. A nurse who lives in Dumfries and works in Carlisle pays Scottish rates on English NHS pay, and a teacher who lives in Berwick and works in the Borders pays the rest-of-UK rates on a Scottish salary. HMRC sets the S prefix on the tax code from the address it holds, so update your address with HMRC when you move. If the code is wrong, the tax on every payslip is wrong, and the difference is collected or refunded later.</p>
<h2>Pension relief in Scotland</h2>
<p>Because NHS and teachers' pension contributions come off before tax, a Scottish taxpayer in the intermediate band saves 21p on each pound contributed, and in the higher band 42p. That makes the same contribution slightly cheaper in Scotland than in England for most salaries in the 21 % band, and noticeably cheaper for those in the 42 % band whose English counterpart would still be on 20 %.</p>`;
  },
});
