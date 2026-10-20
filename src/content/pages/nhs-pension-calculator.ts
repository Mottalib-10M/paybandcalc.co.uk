import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'nhs-pension-calculator',
  group: 'pensions',
  order: 70,
  tool: { kind: 'pension', props: { scheme: 'nhsEW', pay: 39959, age: 35 } },
  related: ['nhs-pension-contributions', 'pension-lump-sum-commutation', 'teachers-pension-calculator', 'nhs-london-weighting-hcas'],
  sources: ['nhsbsa_2015', 'nhsbsa_lump', 'nhsbsa_tiers', 'pspa_s10', 'gov_spa'],
  slug: 'nhs-pension-calculator',
  nav: 'NHS pension calculator',
  card: 'Estimate the 2015 scheme pension at your normal pension age, in today’s money, from your band and age.',
  title: 'NHS Pension Calculator 2026: 2015 Scheme Estimate at 67',
  description: 'NHS pension calculator 2026: estimate the 2015 scheme pension at your normal pension age in today’s money, from your pay and age, with a lump sum option.',
  h1: 'NHS pension calculator: the 2015 scheme',
  intro: 'Enter your pensionable pay, age and State Pension age. The estimate builds the career average pension year by year to your normal pension age, in today’s money.',
  resume: (h) => {
    const S = h.P.pension.nhsEW, pay = h.PAY.afcPay('england', '6', 0), pr = h.PEN.project({ scheme: 'nhsEW', pay, age: 30, retireAge: 67 });
    return `The NHS Pension Scheme 2015 for England and Wales is a career average (CARE) scheme. NHSBSA explains that each scheme year adds a pension of one fifty-fourth of that year's pensionable pay, and that while you are an active member the pension built so far is revalued every 1 April by CPI inflation plus ${h.pc(S.realRevaluation)}. In April 2026 the revaluation was ${h.pc(S.revaluationApril2026)}. Because the revaluation beats inflation by ${h.pc(S.realRevaluation)} a year, the pension can be projected in today's money by adding ${h.pc(S.realRevaluation)} a year to each slice. A band 6 at entry earning ${h.m(pay)} from age 30, with pay flat in real terms, would build about ${h.m(pr.pension)} a year by 67 in today's money, before any lump sum. The normal pension age of the 2015 scheme is your State Pension age, or 65 if that is higher, under section 10 of the Public Service Pensions Act 2013. Each £1 of yearly pension can be exchanged for £12 of tax-free lump sum. The estimate is not your statement: use your NHSBSA Total Reward Statement for your own figure.`;
  },
  faqs: (h) => [
    { q: 'How is the NHS 2015 pension calculated?', a: `Each year you add 1/${h.num(h.P.pension.nhsEW.accrual)} of your pensionable pay to your pension account. While you remain in NHS employment, the total is increased every April by CPI plus ${h.pc(h.P.pension.nhsEW.realRevaluation)}. At normal pension age the account is your yearly pension, paid for life and increased with prices. Pensionable pay includes basic pay, HCAS and unsocial hours payments, but not overtime.` },
    { q: 'What is my NHS normal pension age?', a: 'In the 2015 scheme it equals your State Pension age, with a floor of 65, as set by the Public Service Pensions Act 2013. If your State Pension age is 67, your normal pension age is 67. You can take the pension earlier, with a reduction for early payment that this calculator does not model, or later with an increase.' },
    { q: 'Does the calculator include the 1995 or 2008 sections?', a: 'No. It projects the 2015 scheme only, which every active member has been in for service since April 2022. If you have earlier service in the 1995 or 2008 sections, that pension is worked out on different rules and appears separately on your Total Reward Statement. Add it to the result here for a full picture.' },
  ],
  body: (h) => {
    const cases = ([['Band 3 entry', h.PAY.afcPay('england', '3', 0)], ['Band 5 top', h.PAY.afcPay('england', '5', 2)], ['Band 6 top', h.PAY.afcPay('england', '6', 2)], ['Band 7 top', h.PAY.afcPay('england', '7', 2)], ['Band 8a top', h.PAY.afcPay('england', '8a', 2)]] as Array<[string, number]>);
    const rows = cases.map(([l, p]) => [l, h.m(p), ...[25, 35, 45].map((a) => h.m(h.PEN.project({ scheme: 'nhsEW', pay: p, age: a, retireAge: 67 }).pension))]);
    const yr = h.PEN.project({ scheme: 'nhsEW', pay: h.PAY.afcPay('england', '6', 0), age: 30, retireAge: 67 }).rows.filter((_, i) => i % 9 === 0).map((r) => [String(r.age), h.m(r.pay), h.m(r.added), h.m(r.total)]);
    return `<h2>Pension at 67 by band and starting age</h2>
${h.table(['Post', 'Pensionable pay', 'From age 25', 'From age 35', 'From age 45'], rows, 'NHS Pension Scheme 2015, England 2026/27 pay held flat in real terms to age 67, 1/54th accrual, CPI + 1.5 % revaluation, today’s money, no lump sum. Worked out by the engine of this site.', ['l', 'r', 'r', 'r', 'r'])}
<h2>How a pension builds, year by year</h2>
${h.table(['Age', 'Pay', 'Pension added that year', 'Pension built so far'], yr, 'Band 6 entry from age 30, pay flat in real terms. Each line shows the account after that year’s addition, in today’s money.', ['l', 'r', 'r', 'r'])}
<p>The early years count for more than their size suggests: a slice added at 30 is revalued at ${h.pc(h.P.pension.nhsEW.realRevaluation)} above inflation for 37 years, so by 67 it is worth about ${h.pc(Math.pow(1 + h.P.pension.nhsEW.realRevaluation, 37) - 1, 0)} more in real terms than when it was added.</p>
<h2>What the estimate leaves out</h2>
<p>It assumes you stay in NHS employment to normal pension age. If you leave, the pension stops growing at CPI plus ${h.pc(h.P.pension.nhsEW.realRevaluation)} and is increased by prices only. Early retirement reductions, the annual allowance tax charge and ill-health pensions are not modelled, because their factors were not found in a published form this site can cite. Pay growth above inflation can be added in the options, for example to reflect pay steps and promotion. Pensions in payment are increased by CPI each year, which keeps the figure in today's money.</p>
<h2>What to put in pensionable pay</h2>
<p>Use your basic pay, plus the High Cost Area Supplement and unsocial hours payments if you receive them, because both are pensionable under the NHS handbook. Leave out overtime. For part-time staff, enter the pay actually earned. The ${h.a('nhs-pension-contributions', 'contributions page')} shows what you pay for the pension each month, and the ${h.a('pension-lump-sum-commutation', 'lump sum page')} the trade between lump sum and pension.</p>
<h2>Reading the result</h2>
<p>The headline is a yearly pension from your normal pension age, in today's prices, so it can be compared directly with what you earn now. Thirty years at the same real pay add thirty fifty-fourths of that pay, before revaluation, so a long career can build a pension above half of final pay. The line for the pension already built up uses the figure you enter from your statement and revalues it at the same rate as new service. The line for the years to come assumes your pensionable pay stays where it is in real terms, unless you add growth. If you take a lump sum, the pension left is shown in the headline and the lump sum below it; the pension given up does not come back. State Pension is separate and is paid on top.</p>`;
  },
});
