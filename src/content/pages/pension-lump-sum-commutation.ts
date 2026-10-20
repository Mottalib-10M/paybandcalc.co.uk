import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'pension-lump-sum-commutation',
  group: 'pensions',
  order: 74,
  tool: { kind: 'mini:lump', props: { scheme: 1, pension: 15000, lump: 40000 } },
  related: ['teachers-pension-calculator', 'nhs-pension-calculator', 'teachers-pension-contributions', 'nhs-pension-contributions'],
  sources: ['nhsbsa_lump', 'tp_lump', 'tp_updates', 'nhsbsa_2015'],
  slug: 'pension-lump-sum-commutation',
  nav: 'Pension lump sum',
  card: 'Exchange NHS or teachers’ pension for a tax-free lump sum at 12 to 1: what you get and what you give up.',
  title: 'Pension Lump Sum Commutation: NHS and Teachers at 12 to 1',
  description: 'Pension lump sum commutation for NHS and teachers: £12 of tax-free cash for each £1 a year of pension given up, the teachers’ maximum and the break-even.',
  h1: 'Exchanging pension for a lump sum: NHS and teachers',
  intro: 'Enter the yearly pension you expect and the lump sum you want. The calculator shows the pension left and how many years of payments the lump sum equals.',
  resume: (h) => {
    const c = h.PEN.commute('tps', 15000, 1e9);
    return `Neither the NHS Pension Scheme 2015 nor the career average Teachers' Pension Scheme pays an automatic lump sum. Instead, both let you give up part of your yearly pension at retirement in exchange for a one-off tax-free payment, known as commutation. The rate is the same in both: NHSBSA and Teachers' Pensions each state that every £1 a year of pension given up pays £${h.num(h.P.pension.tps.commutation)} of lump sum. Teachers' Pensions sets a maximum lump sum of 30/7 of the annual pension before commutation, so a teacher with a pension of ${h.m(15000)} a year could take up to ${h.m(c.lumpSum)}, leaving ${h.m(c.pension)} a year. NHSBSA describes the same 12 to 1 rate for the 2015 scheme; this site does not show an NHS maximum because it did not find one stated in a figure it can cite, so the NHS limit is left to your own statement. The trade-off is simple to measure: the pension given up would have been paid for life and increased with prices every year, so twelve years of payments, before increases, equal the lump sum.`;
  },
  faqs: (h) => [
    { q: 'Is commuting pension for a lump sum a good deal?', a: 'It depends on how long you live and what you do with the cash. At 12 to 1, the lump sum equals twelve years of the pension given up, before yearly increases. If you draw the pension for much longer, giving it up costs more than the lump sum is worth; if you need cash or have debts to clear, a lump sum can still make sense.' },
    { q: 'Is the NHS or teachers’ pension lump sum tax-free?', a: 'A lump sum taken by commutation within the scheme limits is paid tax-free, which is one reason many members take some. The pension that remains is taxed as income every year through PAYE. The lump sum allowance rules of HMRC can limit tax-free cash for very large pensions; this site does not model them.' },
    { q: 'Can I take a lump sum and keep my full pension?', a: 'Not in the career average schemes. Any lump sum comes from giving up pension at the 12 to 1 rate. Members with older final salary service in the 1995 NHS section or the teachers’ final salary arrangements may have an automatic lump sum for that service; it is shown on the benefit statement.' },
  ],
  body: (h) => {
    const sizes = [10000, 15000, 20000, 30000];
    const rows = sizes.map((p) => { const c = h.PEN.commute('tps', p, 1e9); return [h.m(p), h.m(c.lumpSum), h.m(c.pension), h.m(c.givenUp)]; });
    const opt = [0, 0.25, 0.5, 1].map((f) => { const c = h.PEN.commute('tps', 20000, h.PEN.commute('tps', 20000, 1e9).lumpSum * f); return [h.pc(f, 0), h.m(c.lumpSum), h.m(c.pension), h.m(c.pension / 12)]; });
    return `<h2>Teachers’ maximum lump sum by pension size</h2>
${h.table(['Pension a year', 'Maximum lump sum', 'Pension left', 'Pension given up'], rows, 'Teachers’ Pension Scheme career average: maximum = 30/7 of the pension, at £12 per £1. Worked out by the engine of this site.', ['r', 'r', 'r', 'r'])}
<h2>Taking part of the maximum</h2>
${h.table(['Share of maximum', 'Lump sum', 'Pension left a year', 'A month'], opt, `Pension of ${h.m(20000)} a year before commutation.`, ['l', 'r', 'r', 'r'])}
<h2>The break-even</h2>
<p>The lump sum equals twelve years of the pension given up at today's value. Because the pension that remains is increased every year with prices, while the lump sum is fixed, the real break-even comes a little later than twelve years after retirement. Against that, the lump sum is tax-free and the pension is taxed, so a basic rate taxpayer receives only 80 % of each pound of pension, which brings the break-even further away again. For someone retiring at 67, the question is whether they expect to draw their pension past their late seventies or early eighties.</p>
<h2>How to decide</h2>
<p>Decide close to retirement, when the figures are known, and not on the basis of an estimate made decades earlier. Your scheme gives you a retirement quote with the maximum lump sum and the pension left at each choice. Pension increases each year in line with the Pensions Increase figure, ${h.pc(h.P.pension.tps.pensionsIncrease2026)} for teachers in April 2026, protect the income against inflation, which a cash sum does not do by itself. The ${h.a('teachers-pension-calculator', 'teachers’ pension calculator')} and the ${h.a('nhs-pension-calculator', 'NHS pension calculator')} both include a lump sum option.</p>
<h2>Commutation and the tax on the remaining pension</h2>
<p>The pension left after commutation is taxable income, added to any State Pension and other income in the year. Once you also receive the State Pension, it can use up most of your Personal Allowance, so the scheme pension is then taxed at the basic rate from almost the first pound. Before State Pension age, the allowance covers the first part of the scheme pension instead. That makes the tax-free lump sum relatively more valuable than the gross figures suggest. If your pension would cross the higher rate threshold, taking a larger lump sum can keep the remaining income below it. Your tax position at retirement is personal, so use the retirement quote to compare options before you choose.</p>`;
  },
});
