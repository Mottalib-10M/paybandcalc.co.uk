/**
 * Pay scales: Agenda for Change by nation, band and step (with the London HCAS in England), and
 * teachers' pay by nation, point and area. Every amount is read from the parameter file.
 */
import { P } from './params';

export type Nation = 'england' | 'scotland' | 'wales' | 'ni';
export type Band = '2' | '3' | '4' | '5' | '6' | '7' | '8a' | '8b' | '8c' | '8d' | '9';
export const BANDS: Band[] = ['2', '3', '4', '5', '6', '7', '8a', '8b', '8c', '8d', '9'];
export const NATIONS: Nation[] = ['england', 'scotland', 'wales', 'ni'];
export const NATION_LABEL: Record<Nation, string> = { england: 'England', scotland: 'Scotland', wales: 'Wales', ni: 'Northern Ireland' };
export interface Point { pay: number; years: number | null }

export const afcScale = (n: Nation) => P.afc[n];
export function afcPoints(n: Nation, band: Band): Point[] {
  return (P.afc[n].bands as Record<string, Point[]>)[band] ?? [];
}
/** Basic annual pay of a step (0 = entry); a step beyond the top returns the top. */
export function afcPay(n: Nation, band: Band, step = 0): number {
  const pts = afcPoints(n, band);
  return pts[Math.max(0, Math.min(step, pts.length - 1))].pay;
}
export function stepCount(n: Nation, band: Band) { return afcPoints(n, band).length; }
/** Names the pay circulars use: entry, intermediate, top (England, Wales, NI); point 1, 2, 3 (Scotland). */
export function stepLabel(n: Nation, band: Band, step: number): string {
  const k = stepCount(n, band);
  if (n === 'scotland') return `Point ${step + 1}`;
  if (k === 1) return 'Single point';
  if (step === 0) return 'Entry';
  return step === k - 1 ? 'Top' : 'Intermediate';
}
/** Years from entry to the top step (England, Wales, NI: the circulars give them). */
export function yearsToTop(n: Nation, band: Band): number | null {
  if (n === 'scotland') return null;
  return afcPoints(n, band).reduce((s, p) => s + (p.years ?? 0), 0);
}

export type HcasArea = 'none' | 'fringe' | 'outer' | 'inner';
export const HCAS_LABEL: Record<HcasArea, string> = { none: 'Outside London', fringe: 'Fringe', outer: 'Outer London', inner: 'Inner London' };
/** High Cost Area Supplement (England only): a share of basic pay between a minimum and a maximum. */
export function hcas(basic: number, area: HcasArea): number {
  if (area === 'none') return 0;
  const h = P.afc.england.hcas[area];
  // NHS Employers' tables round the percentage up to the next pound (band 5 intermediate, inner: £41,511).
  return Math.min(h.max, Math.max(h.min, Math.ceil(basic * h.rate - 1e-9)));
}

/** Hourly basic rate of an England step, as published by NHS Employers. */
export function afcHourly(band: Band, step: number): number {
  const r = (P.afc.england.hourly as Record<string, number[]>)[band];
  return r[Math.max(0, Math.min(step, r.length - 1))];
}
/** Unsocial hours enhancement for a band: [Saturday and weekday nights, Sunday and public holidays]. */
export function unsocialRates(band: Band): [number, number] {
  const k = band === '2' ? '2' : band === '3' ? '3' : '4';
  return P.unsocial.rates[k as '2' | '3' | '4'] as [number, number];
}

/* ---------------- Teachers ---------------- */
export type TeacherArea = 0 | 1 | 2 | 3;
export const TEACHER_AREA_LABEL = ['Rest of England', 'Fringe', 'Outer London', 'Inner London'];
export type EnYear = 'sep2026' | 'sep2027';
export const EN_POINTS = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'U1', 'U2', 'U3'] as const;
export const UQ_POINTS = ['1', '2', '3', '4', '5', '6'] as const;
export type EnPoint = (typeof EN_POINTS)[number];

/** Classroom teacher salary in England (main and upper pay ranges). */
export function teacherEngland(point: EnPoint, area: TeacherArea = 0, year: EnYear = 'sep2026'): number {
  const y = P.teachers.england[year];
  const row = (y.main as Record<string, number[]>)[point] ?? (y.upper as Record<string, number[]>)[point];
  return row[area];
}
export function unqualifiedEngland(point: number, area: TeacherArea = 0, year: EnYear = 'sep2026'): number {
  return (P.teachers.england[year].unqualified as Record<string, number[]>)[String(point)][area];
}
export const WALES_POINTS = ['M2', 'M3', 'M4', 'M5', 'M6', 'U1', 'U2', 'U3'] as const;
export function teacherWales(point: (typeof WALES_POINTS)[number]): number {
  const w = P.teachers.wales; return (w.main as Record<string, number>)[point] ?? (w.upper as Record<string, number>)[point];
}
export function teacherNI(point: (typeof WALES_POINTS)[number]): number {
  const w = P.teachers.ni; return (w.main as Record<string, number>)[point] ?? (w.upper as Record<string, number>)[point];
}
/** Scottish main grade: point 0 is the probationer year (from 1 August 2026). */
export function teacherScotland(point: number): number {
  const m = P.teachers.scotland.main; return m[Math.max(0, Math.min(point, m.length - 1))];
}
