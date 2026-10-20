/**
 * Take-home pay: pension contribution taken before income tax (net pay arrangement), then income tax,
 * National Insurance and student loans on the pay before pension.
 */
import { incomeTax, nationalInsurance, studentLoan, type TaxNation, type LoanPlan } from './tax';
import { contribution, tier, type Scheme } from './pension';

export interface NetInput { gross: number; pensionable?: number; scheme?: Scheme | 'none'; nation?: TaxNation; loans?: LoanPlan[] }
export interface NetResult { gross: number; pension: number; pensionRate: number; tax: number; ni: number; loan: number; net: number; monthly: number; marginal: number; taxable: number }

export function takeHome(i: NetInput): NetResult {
  const gross = Math.max(0, i.gross);
  const pensionable = i.pensionable ?? gross;
  const sch = i.scheme ?? 'none';
  const pension = sch === 'none' ? 0 : contribution(sch, pensionable);
  const pensionRate = sch === 'none' ? 0 : tier(sch, pensionable).rate;
  const t = incomeTax(gross - pension, i.nation ?? 'ruk');
  const ni = nationalInsurance(gross);
  const loan = (i.loans ?? []).reduce((s, p) => s + studentLoan(gross, p), 0);
  const net = gross - pension - t.tax - ni - loan;
  return { gross, pension, pensionRate, tax: t.tax, ni, loan, net, monthly: net / 12, marginal: t.marginal, taxable: t.taxable };
}
