import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'nhs-pay-rise-2026',
  group: 'nhs',
  order: 31,
  tool: { kind: 'mini:award' },
  related: ['agenda-for-change-pay-scales', 'nhs-scotland-pay-scales', 'nhs-northern-ireland-pay-scales', 'teacher-pay-rise-2026-2027'],
  sources: ['nhse_afc', 'scot_afc', 'wales_stmt', 'ni_minister', 'ni_afc'],
  slug: 'nhs-pay-rise-2026',
  nav: 'NHS pay rise 2026/27',
  card: 'The award in each nation, what is already paid, what is still to come and what a rise is worth after tax.',
  title: 'NHS Pay Rise 2026/27: Award by Nation and Your Take-Home',
  description: 'NHS pay rise 2026/27: 3.3 % in England from April 2026, Welsh and Scottish scales, Northern Ireland still to come. Test what an award adds to your monthly pay.',
  h1: 'NHS pay rise 2026/27 in each nation',
  intro: 'The 2026/27 award for Agenda for Change staff differs by nation, and in Northern Ireland it has not been paid yet. The calculator shows what an award adds to your take-home pay.',
  resume: (h) => {
    const E = h.P.afc.england, S = h.P.afc.scotland, N = h.P.afc.ni.next;
    const b5 = h.PAY.afcPay('england', '5', 0);
    return `For 2026/27, Agenda for Change staff in England received a ${h.pc(E.award)} pay award from 1 April 2026, set out in the scale NHS Employers published on ${h.date(E.published)}. Wales applied its own scale from the same date through pay letter AfC(W) 02/2026, with a higher floor for the lowest bands. Scotland is in the second year of a two-year deal: ${h.pc(S.award)} from 1 April 2026, after ${h.pc(S.previousAward)} in 2025/26, with a guarantee of at least one point above CPI inflation. Northern Ireland is the exception: the Health Minister committed on ${h.date(N.statement)} to the ${h.pc(N.committedAward)} awarded in England, but on 20 October 2026 no pay circular had been issued, so staff were still paid on the ${h.P.afc.ni.year} scale. In take-home terms, a rise is always worth less than its headline: on the band 5 entry salary of ${h.m(b5)}, about ${h.pc((h.nhsNet('england', b5 * 1.01).net - h.nhsNet('england', b5).net) / (b5 * 0.01), 0)} of each extra pound reaches the bank account.`;
  },
  faqs: (h) => [
    { q: 'Has the 2026/27 NHS pay rise been paid in Northern Ireland?', a: `Not on 20 October 2026. The Minister's statement of ${h.date(h.P.afc.ni.next.statement)} committed to pay parity with England, a ${h.pc(h.P.afc.ni.next.committedAward)} award, but the Department of Health's ${h.P.afc.ni.next.year} Agenda for Change circular had not been published. Until it is, this site shows the ${h.P.afc.ni.year} scale of circular HSC (AfC) 06/2025 and marks 2026/27 as still to come.` },
    { q: 'Why did Scottish NHS staff get more than 3.75 % last year?', a: `The two-year Scottish deal promised at least one percentage point above CPI inflation. CPI averaged 3.4 % in 2025, so the 2025/26 rise was raised from 4.25 % to ${h.pc(h.P.afc.scotland.previousAward)}, according to the gov.scot pay page updated on ${h.date(h.P.afc.scotland.updated)}. The 2026/27 rise is ${h.pc(h.P.afc.scotland.award)} from 1 April 2026.` },
    { q: 'Is the 2027/28 NHS pay award known yet?', a: 'No. The award for 2027/28 depends on the next report of the NHS Pay Review Body and each government’s response, and no figure had been published on 20 October 2026. The calculator on this page lets you test any percentage against your band and step, but the result is your assumption, not an announced figure.' },
  ],
  body: (h) => {
    const rows = (['2', '3', '5', '8a', '9'] as const).map((b) => { const now = h.PAY.afcPay('scotland', b, 0), was = (h.P.afc.scotland.previous as Record<string, number[]>)[b][0]; return [`Band ${b}, point 1`, h.m(was), h.m(now), h.m(now - was), h.m(h.nhsNet('scotland', now).monthly - h.nhsNet('scotland', was).monthly)]; });
    return `<h2>The 2026/27 award, nation by nation</h2>
${h.table(['Nation', 'Award or scale', 'From', 'Source'], [['England', h.pc(h.P.afc.england.award), h.date(h.P.afc.england.effective), 'NHS Employers, ' + h.date(h.P.afc.england.published)], ['Wales', 'Welsh scale, pay letter AfC(W) 02/2026', h.date(h.P.afc.wales.effective), 'Welsh Government, ' + h.date(h.P.afc.wales.published)], ['Scotland', h.pc(h.P.afc.scotland.award), h.date(h.P.afc.scotland.effective), 'gov.scot, updated ' + h.date(h.P.afc.scotland.updated)], ['Northern Ireland', 'Still to come (' + h.pc(h.P.afc.ni.next.committedAward) + ' committed)', 'not yet set', 'Minister’s statement, ' + h.date(h.P.afc.ni.next.statement)]], 'Agenda for Change awards for 2026/27 as published on 20 October 2026.', ['l', 'l', 'l', 'l'])}
<h2>Scotland: the rise in pounds</h2>
<p>gov.scot publishes both years side by side, which lets the rise be measured exactly rather than estimated.</p>
${h.table(['Point', '2025/26', '2026/27', 'Rise a year', 'Take-home rise a month'], rows, 'NHS Scotland Agenda for Change, first point of selected bands. Take-home for both years worked out on 2026/27 tax and pension rules.', ['l', 'r', 'r', 'r', 'r'])}
<h2>England and Wales: same date, different figures</h2>
<p>England and Wales both applied their 2026/27 scales from 1 April 2026, but the Welsh scale is not the English one with a different name. Wales sets the bottom of the scale at ${h.m(h.PAY.afcPay('wales', '2'))} for band 2 and the entry point of band 3, against ${h.m(h.PAY.afcPay('england', '2'))} and ${h.m(h.PAY.afcPay('england', '3', 0))} in England. Higher up the gap narrows but remains: band 5 starts at ${h.m(h.PAY.afcPay('wales', '5', 0))} in Wales and ${h.m(h.PAY.afcPay('england', '5', 0))} in England, band 9 tops out at ${h.m(h.PAY.afcPay('wales', '9', 2))} and ${h.m(h.PAY.afcPay('england', '9', 2))}. The Welsh Government's written statement of ${h.date(h.P.afc.wales.published)} responded to the same pay review body report as England.</p>
<h2>The award and the pay step are separate</h2>
<p>The yearly award changes the value of every point on 1 April. A pay step moves you from one point to the next on your own pay step date, if the standards are met. In a year when both happen, the two rises add up, and the take-home effect can be larger than either alone; when the step also carries pay over a pension tier line, part of the gain goes in the higher contribution rate. The ${h.a('nhs-pay-progression', 'pay progression page')} measures a step on its own.</p>
<h2>Why a pay rise is smaller in your pocket</h2>
<p>An award raises gross pay by its headline percentage, but four deductions take their share of the extra pound. The NHS pension takes the tier rate, which can itself rise if the award carries pay over a tier line. Income tax takes 20 %, 40 % or more of what is left. National Insurance takes 8 % below ${h.m(h.P.tax.ni.upperEarningsLimit)} and 2 % above, with no relief for the pension. A student loan takes 9 % above its threshold. For most band 5 and 6 staff, roughly three fifths of an award reaches the bank; from band 8a to 8d, about half; and on the slice of band 9 pay where the Personal Allowance is being withdrawn, about a third.</p>
<p>Use the calculator above with your nation, band and step. The award field is a test value: it is set to a round figure by default and is not a forecast. For the actual pay in each nation and band today, use the ${h.a('nhs-take-home-pay', 'take-home calculator')}.</p>`;
  },
});
