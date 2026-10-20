/**
 * Member contribution tiers of six public service schemes (rates from 1 April 2026), and the career
 * average (CARE) projection of the NHS Pension Scheme 2015 and the Teachers' Pension Scheme, in
 * today's money: each year adds 1/54th or 1/57th of pensionable pay, revalued every April by the
 * scheme's margin above CPI (1.5 % or 1.6 %). Retirement at normal pension age, so no reduction.
 */
import { P } from './params';

export type Scheme = 'nhsEW' | 'nhsScot' | 'hscNI' | 'tps' | 'stps' | 'nitps';
export type CareScheme = 'nhsEW' | 'tps';
export const SCHEMES: Scheme[] = ['nhsEW', 'nhsScot', 'hscNI', 'tps', 'stps', 'nitps'];
export const SCHEME_SHORT: Record<Scheme, string> = { nhsEW: 'NHS (England and Wales)', nhsScot: 'NHS Scotland', hscNI: 'HSC (Northern Ireland)', tps: 'Teachers (England and Wales)', stps: 'Teachers (Scotland)', nitps: 'Teachers (Northern Ireland)' };
interface Tier { upTo: number | null; rate: number }
const tiers = (s: Scheme): Tier[] => P.pension[s].tiers as Tier[];

export interface TierResult { index: number; rate: number; from: number; upTo: number | null; count: number }
/** The tier of a whole pensionable pay; the rate applies to all of it, not to the slice above a line. */
export function tier(s: Scheme, pay: number): TierResult {
  const t = tiers(s);
  let from = 0;
  for (let i = 0; i < t.length; i++) {
    const top = t[i].upTo;
    if (top === null || pay <= top) return { index: i, rate: t[i].rate, from, upTo: top, count: t.length };
    from = Math.floor(top) + 1;
  }
  const last = t[t.length - 1];
  return { index: t.length - 1, rate: last.rate, from, upTo: null, count: t.length };
}
export const contribution = (s: Scheme, pay: number) => pay * tier(s, pay).rate;
export const tierTable = (s: Scheme) => tiers(s).map((x, i, a) => ({ from: i === 0 ? 0 : Math.floor(a[i - 1].upTo!) + 1, upTo: x.upTo === null ? null : Math.floor(x.upTo), rate: x.rate }));

export interface ProjectInput { scheme: CareScheme; pay: number; age: number; retireAge: number; realPayGrowth?: number; existing?: number }
export interface ProjectYear { age: number; pay: number; added: number; total: number }
export interface Projection { years: number; pension: number; fromExisting: number; fromFuture: number; firstYear: number; rows: ProjectYear[] }

/** Pension at the retirement age, in today's money. `existing` is CARE pension already built up. */
export function project(i: ProjectInput): Projection {
  const S = P.pension[i.scheme];
  const r = S.realRevaluation, g = i.realPayGrowth ?? 0;
  const years = Math.max(0, Math.floor(i.retireAge - i.age));
  let total = i.existing ?? 0, pay = i.pay;
  let existing = i.existing ?? 0;
  const rows: ProjectYear[] = [];
  for (let y = 0; y < years; y++) {
    if (y > 0) { total *= 1 + r; existing *= 1 + r; }
    const added = pay / S.accrual;
    total += added;
    rows.push({ age: Math.floor(i.age) + y, pay, added, total });
    pay *= 1 + g;
  }
  return { years, pension: total, fromExisting: existing, fromFuture: total - existing, firstYear: i.pay / S.accrual, rows };
}

/** Pension left after exchanging part of it for a lump sum: £1 a year gives up for every £12. */
export function commute(scheme: CareScheme, pension: number, lumpSum: number) {
  const c = P.pension[scheme].commutation;
  const max = maxLumpSum(scheme, pension);
  const l = Math.max(0, Math.min(lumpSum, max ?? Infinity, pension * c));
  return { lumpSum: l, pension: pension - l / c, givenUp: l / c, max };
}
/** Teachers' Pensions factsheet: maximum lump sum = annual pension x 30 / 7. Not published by NHSBSA. */
export function maxLumpSum(scheme: CareScheme, pension: number): number | null {
  return scheme === 'tps' ? pension * P.pension.tps.maxLumpSumFactor : null;
}
/** Normal pension age: State Pension age, or 65 if that is higher (Public Service Pensions Act 2013, s.10). */
export const normalPensionAge = (statePensionAge: number) => Math.max(P.pension.npaMin, statePensionAge);
