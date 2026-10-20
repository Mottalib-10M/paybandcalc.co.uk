/**
 * Income tax, National Insurance and student loan repayments for 2026/27 (HMRC, Rates and thresholds
 * for employers 2026 to 2027). Annual figures: a salary paid evenly over the tax year.
 */
import { P } from './params';

export type TaxNation = 'ruk' | 'scotland';
export type LoanPlan = 'plan1' | 'plan2' | 'plan4' | 'plan5' | 'postgrad';
const T = P.tax;

/** Personal Allowance after the taper: £1 lost for every £2 of income above £100,000. */
export function personalAllowance(income: number): number {
  const over = Math.max(0, income - T.taperThreshold);
  return Math.max(0, T.personalAllowance - Math.floor(over / 2));
}

export interface TaxBandSlice { rate: number; amount: number; tax: number }
export interface IncomeTax { allowance: number; taxable: number; tax: number; slices: TaxBandSlice[]; marginal: number }

/** Income tax on taxable pay (pay after pension contributions taken under the net pay arrangement). */
export function incomeTax(income: number, nation: TaxNation = 'ruk'): IncomeTax {
  const allowance = personalAllowance(income);
  const taxable = Math.max(0, income - allowance);
  const bands = nation === 'scotland' ? T.scotland.bands : T.ruk.bands;
  let prev = 0, tax = 0, marginal = 0;
  const slices: TaxBandSlice[] = [];
  for (const b of bands) {
    const top = b.upTo ?? Infinity;
    const amount = Math.max(0, Math.min(taxable, top) - prev);
    if (amount > 0) { slices.push({ rate: b.rate, amount, tax: amount * b.rate }); tax += amount * b.rate; marginal = b.rate; }
    prev = top;
    if (taxable <= top) break;
  }
  return { allowance, taxable, tax, slices, marginal };
}

/** Class 1 employee National Insurance on earnings (pension contributions do not reduce it). */
export function nationalInsurance(earnings: number): number {
  const n = T.ni;
  const main = Math.max(0, Math.min(earnings, n.upperEarningsLimit) - n.primaryThreshold) * n.mainRate;
  const upper = Math.max(0, earnings - n.upperEarningsLimit) * n.upperRate;
  return main + upper;
}

/** Student loan repayment for one plan, on earnings before pension. */
export function studentLoan(earnings: number, plan: LoanPlan): number {
  const s = T.studentLoans[plan];
  return Math.max(0, earnings - s.threshold) * s.rate;
}

export const LOAN_LABEL: Record<LoanPlan, string> = { plan1: 'Plan 1', plan2: 'Plan 2', plan4: 'Plan 4 (Scotland)', plan5: 'Plan 5', postgrad: 'Postgraduate loan' };
