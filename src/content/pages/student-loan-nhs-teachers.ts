import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'student-loan-nhs-teachers',
  group: 'takehome',
  order: 83,
  tool: { kind: 'mini:loan', props: { pay: 34000, plan: 3 } },
  related: ['nhs-take-home-pay', 'teacher-take-home-pay', 'ect-teacher-salary', 'nhs-band-5-salary'],
  sources: ['hmrc_rates', 'gov_relief'],
  slug: 'student-loan-nhs-teachers',
  nav: 'Student loan repayments',
  card: 'Plan 1, 2, 4, 5 and postgraduate thresholds for 2026/27 and what each takes from NHS and teaching pay.',
  title: 'Student Loan Repayments 2026/27 on NHS and Teacher Pay',
  description: 'Student loan repayments 2026/27 on NHS and teacher pay: Plan 1, 2, 4, 5 and postgraduate thresholds, the monthly deduction on each band or point, and take-home.',
  h1: 'Student loan repayments on NHS and teaching pay',
  intro: 'Enter your salary before pension and choose your loan. The calculator shows the yearly and monthly repayment taken through payroll.',
  resume: (h) => {
    const L = h.P.tax.studentLoans, g = h.PAY.teacherEngland('M1'), b5 = h.PAY.afcPay('england', '5', 0);
    return `Student loan repayments are taken through payroll at a fixed rate on pay above a yearly threshold, using the HMRC rates for 2026/27. Plan 1 repays 9 % above ${h.m(L.plan1.threshold)}, Plan 2 9 % above ${h.m(L.plan2.threshold)}, Plan 4, the Scottish plan, 9 % above ${h.m(L.plan4.threshold)}, Plan 5 9 % above ${h.m(L.plan5.threshold)}, and the postgraduate loan 6 % above ${h.m(L.postgrad.threshold)}. A postgraduate loan is repaid alongside an undergraduate plan, not instead. Repayments are worked out on pay before the pension contribution, like National Insurance, so a higher pension tier does not reduce them. Plan 5 has the lowest undergraduate threshold, so a teacher on M1 outside London, ${h.m(g)}, repays ${h.m(h.TAX.studentLoan(g, 'plan5') / 12)} a month on Plan 5 and ${h.m(h.TAX.studentLoan(g, 'plan2') / 12)} on Plan 2. A band 5 at entry in England, ${h.m(b5)}, repays ${h.m(h.TAX.studentLoan(b5, 'plan5') / 12)} a month on Plan 5. Which plan you have depends on where and when your course started; your payslip or your loan account shows it.`;
  },
  faqs: (h) => [
    { q: 'Is my student loan worked out before or after my pension?', a: 'Before. Payroll calculates student loan repayments on earnings before the NHS or teachers’ pension contribution is taken, the same as National Insurance. Only income tax is charged after the pension. So the repayment depends on your gross pay, and a part-time salary or a pay rise moves it, but a higher pension rate does not.' },
    { q: 'Do I repay a student loan on unsocial hours or overtime?', a: 'Yes. Repayments are taken on all earnings in the pay period above the threshold for that period, including unsocial hours payments, overtime, the London supplement and allowances. Because the threshold is applied each pay period, a month with heavy overtime can repay more than the yearly calculation suggests, and a quiet month less.' },
    { q: 'Can I have two student loans deducted at once?', a: 'Yes, an undergraduate plan and a postgraduate loan are collected together, at 9 % and 6 % above their own thresholds, so a teacher or nurse with both repays 15 % on pay above the higher of the two thresholds. Your payslip shows each loan on a separate line, with its own plan type.' },
  ],
  body: (h) => {
    const posts = ([['NHS band 5 entry', h.PAY.afcPay('england', '5', 0)], ['NHS band 6 top', h.PAY.afcPay('england', '6', 2)], ['Teacher M1', h.PAY.teacherEngland('M1')], ['Teacher M6', h.PAY.teacherEngland('M6')], ['Teacher U3', h.PAY.teacherEngland('U3')]] as Array<[string, number]>);
    const rows = posts.map(([l, g]) => [l, h.m(g), ...(['plan1', 'plan2', 'plan4', 'plan5'] as const).map((p) => h.m(h.TAX.studentLoan(g, p) / 12)), h.m(h.TAX.studentLoan(g, 'postgrad') / 12)]);
    const L = h.P.tax.studentLoans;
    return `<h2>Monthly repayment by post and plan</h2>
${h.table(['Post', 'Pay', 'Plan 1', 'Plan 2', 'Plan 4', 'Plan 5', 'Postgraduate'], rows, 'England 2026/27 scales, full time, outside London. HMRC thresholds and rates for 2026 to 2027. Worked out by the engine of this site.', ['l', 'r', 'r', 'r', 'r', 'r', 'r'])}
<h2>The thresholds for 2026/27</h2>
${h.table(['Loan', 'Yearly threshold', 'Monthly threshold', 'Rate'], (['plan1', 'plan2', 'plan4', 'plan5', 'postgrad'] as const).map((p) => [h.TAX.LOAN_LABEL[p], h.m(L[p].threshold), h.m2(L[p].threshold / 12), h.pc(L[p].rate, 0)]), 'HMRC, rates and thresholds for employers 2026 to 2027.', ['l', 'r', 'r', 'r'])}
<h2>What the loan does to take-home</h2>
<p>A repayment is a deduction from take-home like any other, but it is not a tax: once the loan and its interest are repaid, or the plan's write-off date passes, it stops. For take-home planning, treat it as 9 % of every pound above your threshold. On a band 6 at the top of the band in England, that is ${h.m(h.TAX.studentLoan(h.PAY.afcPay('england', '6', 2), 'plan2') / 12)} a month on Plan 2 and ${h.m(h.TAX.studentLoan(h.PAY.afcPay('england', '6', 2), 'plan5') / 12)} on Plan 5, a gap that comes only from the different thresholds, since the rate is the same. A pay step or an award therefore keeps less while you are repaying, because the loan takes 9p of each extra pound on top of tax, NI and the pension.</p>
<h2>Part-time work and the threshold</h2>
<p>Thresholds are not pro-rated. A part-time nurse or teacher whose actual pay falls below the threshold repays nothing in that period. Because payroll checks each pay period, a part-time post with variable hours can repay in some months and not others. The ${h.a('nhs-take-home-pay', 'NHS take-home calculator')} and the ${h.a('teacher-take-home-pay', 'teacher take-home calculator')} both include the loan options.</p>
<h2>Arrears and one-off payments</h2>
<p>Pay award arrears, paid in one month, raise that month's pay well above the monthly threshold, so the loan takes 9 % of the whole arrears payment on top of tax and NI. The same happens with a backdated pay step. The repayment counts against your loan balance like any other, so it is not lost, but it makes the arrears month smaller than you might expect. Check the loan line in that month before assuming payroll made a mistake, and compare it with 9 % of the pay above the monthly threshold.</p>
<h2>Which plan is shown on your payslip</h2>
<p>Payroll applies the plan type that the Student Loans Company or HMRC notifies, shown on the payslip as a plan number. If you think the plan is wrong, for example a Plan 2 deduction when you expected Plan 5, contact the Student Loans Company rather than payroll, because your employer only applies the notice it receives. Over-deductions can be refunded once the account is corrected.</p>`;
  },
});
