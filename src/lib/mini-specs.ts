/**
 * Mini-calculators, one per subject (RECETTE §9.3). Each one calls the tested engines of `lib/engine/`
 * (pay, tax, pension, net); none computes pay or tax on its own. A page sets its defaults through the
 * `props` of its ToolDef (same ids as the inputs). Choice inputs carry a number: an index in a list.
 */
import type { MiniSpec } from './mini-types';
import { P } from './engine/params';
import * as PAY from './engine/pay';
import * as TAX from './engine/tax';
import * as PEN from './engine/pension';
import { takeHome } from './engine/net';
import { formatMoney as fm, formatPercent, formatNumber } from './format';

const m = (n: number) => fm(Math.round(n), 0);
const m2 = (n: number) => fm(n, 2);
const pc = (x: number, d = 1) => formatPercent(x, d);
const BAND_OPTS = PAY.BANDS.map((b, i) => ({ value: String(i), label: `Band ${b}` }));
const band = (v: number): PAY.Band => PAY.BANDS[Math.max(0, Math.min(Math.round(v), PAY.BANDS.length - 1))];
const STEP_OPTS = [{ value: '0', label: 'Entry (point 1)' }, { value: '1', label: 'Second point' }, { value: '2', label: 'Top of a three-point band' }];
const NATION_OPTS = PAY.NATIONS.map((n, i) => ({ value: String(i), label: PAY.NATION_LABEL[n] }));
const nation = (v: number): PAY.Nation => PAY.NATIONS[Math.max(0, Math.min(Math.round(v), 3))];
const AREAS: PAY.HcasArea[] = ['none', 'fringe', 'outer', 'inner'];
const AREA_OPTS = AREAS.map((a, i) => ({ value: String(i), label: PAY.HCAS_LABEL[a] }));
const T_AREA_OPTS = PAY.TEACHER_AREA_LABEL.map((l, i) => ({ value: String(i), label: l }));
const tArea = (v: number) => Math.max(0, Math.min(Math.round(v), 3)) as PAY.TeacherArea;
const EN_OPTS = PAY.EN_POINTS.map((p, i) => ({ value: String(i), label: p }));
const enPoint = (v: number): PAY.EnPoint => PAY.EN_POINTS[Math.max(0, Math.min(Math.round(v), PAY.EN_POINTS.length - 1))];
const SCHEME_OPTS = PEN.SCHEMES.map((s, i) => ({ value: String(i), label: PEN.SCHEME_SHORT[s] }));
const scheme = (v: number): PEN.Scheme => PEN.SCHEMES[Math.max(0, Math.min(Math.round(v), PEN.SCHEMES.length - 1))];
const LOANS: TAX.LoanPlan[] = ['plan1', 'plan2', 'plan4', 'plan5', 'postgrad'];
const LOAN_OPTS = LOANS.map((p, i) => ({ value: String(i), label: TAX.LOAN_LABEL[p] }));
const nhsScheme = (n: PAY.Nation): PEN.Scheme => (n === 'scotland' ? 'nhsScot' : n === 'ni' ? 'hscNI' : 'nhsEW');
const taxOf = (s: PEN.Scheme): TAX.TaxNation => (s === 'nhsScot' || s === 'stps' ? 'scotland' : 'ruk');
const money = (id: string, label: string, def: number, help?: string, max = 1_000_000) => ({ id, label, def, unit: '£', max, help });
/** Take-home of an England NHS salary with the NHS scheme. */
const nhsNet = (gross: number, n: PAY.Nation = 'england') => takeHome({ gross, scheme: nhsScheme(n), nation: n === 'scotland' ? 'scotland' : 'ruk' });
const tpsNet = (gross: number) => takeHome({ gross, scheme: 'tps', nation: 'ruk' });
const step = (n: PAY.Nation, b: PAY.Band, v: number) => Math.max(0, Math.min(Math.round(v), PAY.stepCount(n, b) - 1));

const SPECS: Record<string, MiniSpec> = {
  hcas: {
    title: 'Your High Cost Area Supplement in 2026/27', cta: 'Full take-home pay with HCAS', ctaPage: 'nhs-take-home-pay',
    inputs: [{ id: 'band', label: 'Band', def: 3, options: BAND_OPTS }, { id: 'step', label: 'Pay step', def: 0, options: STEP_OPTS }, { id: 'area', label: 'Area', def: 3, options: AREA_OPTS }],
    run: (v) => { const b = band(v.band), s = step('england', b, v.step), basic = PAY.afcPay('england', b, s), a = AREAS[Math.round(v.area)] ?? 'inner';
      const h = PAY.hcas(basic, a); const without = nhsNet(basic), withH = nhsNet(basic + h);
      const rule = a === 'none' ? 'none' : P.afc.england.hcas[a];
      return { head: ['HCAS a year', m(h)], rows: [['Basic pay', m(basic)], ['Basic pay with HCAS', m(basic + h)], ['Rule for this area', rule === 'none' ? 'no supplement' : `${pc(rule.rate, 0)}, ${m(rule.min)} to ${m(rule.max)}`], ['Extra take-home a month', m((withH.net - without.net) / 12)]],
        note: h > 0 && rule !== 'none' && (h === rule.min || h === rule.max) ? `Your supplement is set by the ${h === rule.min ? 'minimum' : 'maximum'}, not by the percentage.` : undefined }; },
  },
  progression: {
    title: 'What your next pay step is worth', cta: 'Take-home pay at every step', ctaPage: 'agenda-for-change-pay-scales',
    inputs: [{ id: 'band', label: 'Band', def: 3, options: BAND_OPTS }, { id: 'step', label: 'Where you are now', def: 0, options: STEP_OPTS }],
    run: (v) => { const b = band(v.band), pts = PAY.afcPoints('england', b), s = step('england', b, v.step); const now = pts[s].pay;
      if (s === pts.length - 1) return { head: ['Next step', 'none: top of band'], rows: [['Your pay now', m(now)], ['Years from entry to top', String(PAY.yearsToTop('england', b))], ['Take-home a month', m(nhsNet(now).monthly)]], note: 'At the top of a band, pay only moves with the annual award or a move to a higher band.' };
      const next = pts[s + 1].pay;
      return { head: ['Rise at your next step', m(next - now)], rows: [['Your pay now', m(now)], [`After ${pts[s].years} years at this step`, m(next)], ['Extra take-home a month', m(nhsNet(next).monthly - nhsNet(now).monthly)], ['Top of the band', m(pts[pts.length - 1].pay)]] }; },
  },
  unsocial: {
    title: 'Unsocial hours pay for a month of shifts', cta: 'Add it to your take-home pay', ctaPage: 'nhs-take-home-pay',
    inputs: [{ id: 'band', label: 'Band', def: 3, options: BAND_OPTS }, { id: 'step', label: 'Pay step', def: 0, options: STEP_OPTS }, { id: 'nights', label: 'Hours on Saturdays or weekday nights a month', def: 24, unit: 'h', max: 300 }, { id: 'sundays', label: 'Hours on Sundays or public holidays a month', def: 12, unit: 'h', max: 300 }],
    run: (v) => { const b = band(v.band), s = step('england', b, v.step), hr = PAY.afcHourly(b, s), [r1, r2] = PAY.unsocialRates(b);
      const x = v.nights * hr * r1 + v.sundays * hr * r2;
      return { head: ['Unsocial hours pay a month', m2(x)], rows: [['Your basic hourly rate', m2(hr)], ['Saturday and weekday nights', `time plus ${pc(r1, 0)}`], ['Sundays and public holidays', `time plus ${pc(r2, 0)}`], ['Over 12 such months, gross', m(x * 12)]],
        note: 'Paid on top of the hours themselves, which your basic salary already covers. It is pensionable.' }; },
  },
  overtime: {
    title: 'Overtime pay for bands 1 to 7', cta: 'Your full take-home pay', ctaPage: 'nhs-take-home-pay',
    inputs: [{ id: 'band', label: 'Band', def: 3, options: BAND_OPTS.slice(0, 6) }, { id: 'step', label: 'Pay step', def: 0, options: STEP_OPTS }, { id: 'hours', label: 'Overtime hours a month', def: 10, unit: 'h', max: 200 }, { id: 'ph', label: 'Of which on public holidays', def: 0, unit: 'h', max: 200 }],
    run: (v) => { const b = band(Math.min(v.band, 5)), s = step('england', b, v.step), hr = PAY.afcHourly(b, s), O = P.unsocial.overtime;
      const ph = Math.min(v.ph, v.hours), x = (v.hours - ph) * hr * O.rate + ph * hr * O.publicHoliday;
      return { head: ['Overtime pay a month', m2(x)], rows: [['Your basic hourly rate', m2(hr)], ['Time and a half', m2(hr * O.rate)], ['Double time, public holidays', m2(hr * O.publicHoliday)], ['Hours paid', formatNumber(v.hours, 0)]],
        note: `Overtime starts above ${formatNumber(O.weeklyHours, 1)} hours in a week. Part-time staff are paid plain time until then.` }; },
  },
  'part-time': {
    title: 'Part-time NHS pay and take-home', cta: 'Every option in the full calculator', ctaPage: 'nhs-take-home-pay',
    inputs: [{ id: 'band', label: 'Band', def: 3, options: BAND_OPTS }, { id: 'step', label: 'Pay step', def: 0, options: STEP_OPTS }, { id: 'hours', label: 'Contracted hours a week', def: 22.5, unit: 'h', max: 37.5, decimals: 1 }],
    run: (v) => { const b = band(v.band), s = step('england', b, v.step), ft = PAY.afcPay('england', b, s), share = Math.min(v.hours, P.afc.england.hours) / P.afc.england.hours;
      const g = ft * share, r = nhsNet(g), f = nhsNet(ft);
      return { head: ['Take-home a month', m(r.monthly)], rows: [['Full-time salary', m(ft)], [`Your salary (${pc(share, 0)})`, m(g)], [`Pension tier on actual pay`, pc(r.pensionRate)], ['Full-time take-home a month', m(f.monthly)]],
        note: 'Your tier is set on the pay you actually earn, so a part-time post can fall into a lower contribution rate.' }; },
  },
  award: {
    title: 'What a pay award would add to your take-home', cta: 'Your pay today, step by step', ctaPage: 'agenda-for-change-pay-scales',
    inputs: [{ id: 'nation', label: 'Where you work', def: 0, options: NATION_OPTS }, { id: 'band', label: 'Band', def: 3, options: BAND_OPTS }, { id: 'step', label: 'Pay step', def: 0, options: STEP_OPTS }, { id: 'award', label: 'Award you want to test', def: 3, unit: '%', max: 20, decimals: 1, help: 'Your own assumption' }],
    run: (v) => { const n = nation(v.nation), b = band(v.band), s = step(n, b, v.step), now = PAY.afcPay(n, b, s), next = now * (1 + v.award / 100);
      const a = nhsNet(now, n), c = nhsNet(next, n);
      return { head: ['Extra take-home a month', m(c.monthly - a.monthly)], rows: [[`Pay now (${P.afc[n].year})`, m(now)], [`With ${pc(v.award / 100)}`, m(next)], ['Gross rise a year', m(next - now)], ['Share kept after deductions', pc(next > now ? (c.net - a.net) / (next - now) : 0, 0)]],
        note: 'A test of your own figure: the next award is not decided until the government responds to the pay review body.' }; },
  },
  contrib: {
    title: 'Your pension contribution rate from April 2026', cta: 'What the pension will pay', ctaPage: 'nhs-pension-calculator',
    inputs: [{ id: 'scheme', label: 'Scheme', def: 0, options: SCHEME_OPTS }, money('pay', 'Pensionable pay a year', 39959)],
    run: (v) => { const s = scheme(v.scheme), t = PEN.tier(s, v.pay), c = v.pay * t.rate, tn = taxOf(s);
      const relief = TAX.incomeTax(v.pay, tn).tax - TAX.incomeTax(v.pay - c, tn).tax;
      return { head: ['Contribution a year', m(c)], rows: [['Your tier', `${t.index + 1} of ${t.count}: ${pc(t.rate)}`], ['Tier range', `${m(t.from)} to ${t.upTo === null ? 'no limit' : m(Math.floor(t.upTo))}`], ['A month', m(c / 12)], ['Cost after income tax relief', m(c - relief)]] }; },
  },
  lump: {
    title: 'Pension exchanged for a lump sum', cta: 'Estimate the pension first', ctaPage: 'teachers-pension-calculator',
    inputs: [{ id: 'scheme', label: 'Scheme', def: 1, options: [{ value: '0', label: 'NHS Pension Scheme 2015' }, { value: '1', label: "Teachers' Pension Scheme" }] }, money('pension', 'Annual pension at retirement', 15000), money('lump', 'Lump sum you want', 40000, undefined, 5_000_000)],
    run: (v) => { const s: PEN.CareScheme = Math.round(v.scheme) === 1 ? 'tps' : 'nhsEW'; const c = PEN.commute(s, v.pension, v.lump);
      return { head: ['Pension left a year', m(c.pension)], rows: [['Lump sum paid', m(c.lumpSum)], ['Pension given up', m(c.givenUp)], ['Maximum lump sum', c.max === null ? 'set by your statement' : m(c.max)], ['Years of payments to repay it', c.givenUp > 0 ? formatNumber(c.lumpSum / c.givenUp, 0) : 'n/a']],
        note: 'Each £1 of yearly pension given up pays £12 at once. The pension left still rises with prices every year.' }; },
  },
  'scot-tax': {
    title: 'Scottish income tax against the rest of the UK', cta: 'Take-home pay in NHS Scotland', ctaPage: 'nhs-scotland-pay-scales',
    inputs: [money('pay', 'Taxable pay after pension', 40000)],
    run: (v) => { const s = TAX.incomeTax(v.pay, 'scotland'), r = TAX.incomeTax(v.pay, 'ruk');
      return { head: [s.tax >= r.tax ? 'Extra tax in Scotland a year' : 'Less tax in Scotland a year', m(Math.abs(s.tax - r.tax))], rows: [['Income tax in Scotland', m(s.tax)], ['Income tax elsewhere in the UK', m(r.tax)], ['Your top Scottish rate', pc(s.marginal, 0)], ['Your top rate elsewhere', pc(r.marginal, 0)]] }; },
  },
  loan: {
    title: 'Student loan repayment on NHS or teaching pay', cta: 'Take-home pay with the loan', ctaPage: 'nhs-take-home-pay',
    inputs: [money('pay', 'Salary before pension', 35000), { id: 'plan', label: 'Loan', def: 1, options: LOAN_OPTS }],
    run: (v) => { const p = LOANS[Math.round(v.plan)] ?? 'plan2', s = P.tax.studentLoans[p], x = TAX.studentLoan(v.pay, p);
      return { head: ['Repayment a year', m(x)], rows: [['A month', m(x / 12)], ['Threshold', `${m(s.threshold)} a year`], ['Rate above it', pc(s.rate, 0)], ['Pay above the threshold', m(Math.max(0, v.pay - s.threshold))]],
        note: 'Repayments are worked out on pay before your pension contribution, like National Insurance.' }; },
  },
  compare: {
    title: 'NHS band against teacher pay point, take-home', cta: 'Teacher take-home in detail', ctaPage: 'teacher-take-home-pay',
    inputs: [{ id: 'band', label: 'NHS band', def: 3, options: BAND_OPTS }, { id: 'step', label: 'NHS step', def: 0, options: STEP_OPTS }, { id: 'point', label: 'Teacher pay point', def: 0, options: EN_OPTS }],
    run: (v) => { const b = band(v.band), s = step('england', b, v.step), nhs = PAY.afcPay('england', b, s), tch = PAY.teacherEngland(enPoint(v.point));
      const a = nhsNet(nhs), c = tpsNet(tch);
      return { head: ['Difference a month (NHS minus teacher)', m(a.monthly - c.monthly)], rows: [[`Band ${b} gross / take-home a month`, `${m(nhs)} / ${m(a.monthly)}`], [`${enPoint(v.point)} gross / take-home a month`, `${m(tch)} / ${m(c.monthly)}`], ['NHS pension rate', pc(a.pensionRate)], ['Teachers pension rate', pc(c.pensionRate)]],
        note: 'England outside London: NHS pay from 1 April 2026, teacher pay from 1 September 2026.' }; },
  },
  head: {
    title: 'Head teacher pay range by school group', cta: 'Leadership take-home pay', ctaPage: 'teacher-take-home-pay',
    inputs: [{ id: 'group', label: 'School group', def: 2, options: [1, 2, 3, 4, 5, 6, 7, 8].map((g, i) => ({ value: String(i), label: `Group ${g}` })) }, { id: 'area', label: 'Pay area', def: 0, options: T_AREA_OPTS }],
    run: (v) => { const g = P.teachers.england.sep2026.headGroups[Math.max(0, Math.min(Math.round(v.group), 7))][tArea(v.area)];
      const lo = tpsNet(g[0]), hi = tpsNet(g[1]);
      return { head: ['Pay range', `${m(g[0])} to ${m(g[1])}`], rows: [['Take-home a month at the bottom', m(lo.monthly)], ['Take-home a month at the top', m(hi.monthly)], ['Pension rate at the top', pc(hi.pensionRate)], ['Top rate of income tax', pc(TAX.incomeTax(g[1] - hi.pension).marginal, 0)]],
        note: 'Group ranges from 1 September 2026, School Teachers’ Pay and Conditions Document 2026, Table 2.' }; },
  },
  tlr: {
    title: 'What a TLR or SEN allowance adds to take-home', cta: 'All teacher pay points', ctaPage: 'teacher-take-home-pay',
    inputs: [{ id: 'point', label: 'Pay point', def: 5, options: EN_OPTS }, { id: 'area', label: 'Pay area', def: 0, options: T_AREA_OPTS }, money('tlr', 'Allowance a year', 3651, 'TLR 1, 2, 3 or SEN', 30000)],
    run: (v) => { const base = PAY.teacherEngland(enPoint(v.point), tArea(v.area)), a = tpsNet(base), c = tpsNet(base + v.tlr);
      return { head: ['Extra take-home a month', m(c.monthly - a.monthly)], rows: [['Salary', m(base)], ['With the allowance', m(base + v.tlr)], ['Share kept after deductions', pc(v.tlr > 0 ? (c.net - a.net) / v.tlr : 0, 0)], ['Pension rate with it', pc(c.pensionRate)]] }; },
  },
  'teacher-2027': {
    title: 'Teacher pay from September 2026 to September 2027', cta: 'Every pay point in detail', ctaPage: 'teacher-pay-scales',
    inputs: [{ id: 'point', label: 'Pay point', def: 0, options: EN_OPTS }, { id: 'area', label: 'Pay area', def: 0, options: T_AREA_OPTS }],
    run: (v) => { const p = enPoint(v.point), A = tArea(v.area), a = PAY.teacherEngland(p, A, 'sep2026'), b = PAY.teacherEngland(p, A, 'sep2027');
      return { head: ['Rise from September 2027', m(b - a)], rows: [['From 1 September 2026', m(a)], ['From 1 September 2027', m(b)], ['Take-home a month, 2026', m(tpsNet(a).monthly)], ['Take-home a month, 2027 (2026/27 tax)', m(tpsNet(b).monthly)]] }; },
  },
  'teacher-next': {
    title: 'Your next step on the teacher pay range', cta: 'Full teacher take-home', ctaPage: 'teacher-take-home-pay',
    inputs: [{ id: 'point', label: 'Pay point now', def: 0, options: EN_OPTS }, { id: 'area', label: 'Pay area', def: 0, options: T_AREA_OPTS }],
    run: (v) => { const i = Math.max(0, Math.min(Math.round(v.point), PAY.EN_POINTS.length - 1)), A = tArea(v.area), p = PAY.EN_POINTS[i], now = PAY.teacherEngland(p, A);
      if (i === 5 || i === 8) { const u1 = PAY.teacherEngland('U1', A); return { head: ['Next step', i === 5 ? `U1: ${m(u1 - now)} more` : 'none: top of U3'], rows: [['Your salary', m(now)], ['Take-home a month', m(tpsNet(now).monthly)], ...(i === 5 ? [['Take-home a month at U1', m(tpsNet(u1).monthly)] as [string, string]] : [])], note: i === 5 ? 'M6 is the top of the main pay range; the upper pay range starts at U1.' : 'U3 is the top of the upper pay range.' }; }
      const q = PAY.EN_POINTS[i + 1], nx = PAY.teacherEngland(q, A);
      return { head: [`Rise from ${p} to ${q}`, m(nx - now)], rows: [[`${p} salary`, m(now)], [`${q} salary`, m(nx)], ['Extra take-home a month', m(tpsNet(nx).monthly - tpsNet(now).monthly)]] }; },
  },
  'nhs-scot-rise': {
    title: 'NHS Scotland pay: 2025/26 against 2026/27', cta: 'Take-home pay in Scotland', ctaPage: 'nhs-scotland-pay-scales',
    inputs: [{ id: 'row', label: 'Band and point', def: 6, options: [['2', 0], ['2', 1], ['3', 0], ['3', 1], ['4', 0], ['4', 1], ['5', 0], ['5', 1], ['5', 2], ['8a', 0], ['8a', 1], ['9', 0], ['9', 1]].map(([b, s], i) => ({ value: String(i), label: `Band ${b}, point ${(s as number) + 1}` })) }],
    run: (v) => { const rows: Array<[PAY.Band, number]> = [['2', 0], ['2', 1], ['3', 0], ['3', 1], ['4', 0], ['4', 1], ['5', 0], ['5', 1], ['5', 2], ['8a', 0], ['8a', 1], ['9', 0], ['9', 1]];
      const [b, s] = rows[Math.max(0, Math.min(Math.round(v.row), rows.length - 1))]; const now = PAY.afcPay('scotland', b, s), before = (P.afc.scotland.previous as Record<string, number[]>)[b][s];
      return { head: ['Rise from 1 April 2026', m(now - before)], rows: [['2025/26', m(before)], ['2026/27', m(now)], ['Increase', pc(now / before - 1, 2)], ['Extra take-home a month', m(nhsNet(now, 'scotland').monthly - nhsNet(before, 'scotland').monthly)]],
        note: 'Take-home for both years worked out on the 2026/27 tax and pension rules, to isolate the pay rise.' }; },
  },
};

export function getSpec(kind: string): MiniSpec {
  const s = SPECS[kind];
  if (!s) throw new Error(`Unknown mini-calculator: ${kind}`);
  return s;
}
export const SPEC_IDS = Object.keys(SPECS);
