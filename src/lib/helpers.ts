/** Writing helpers handed to every page: links, numbers from the engines, tables, sources. */
import { route, ROUTES } from '../i18n/routes';
import { P, type SourceKey } from './engine/params';
import * as PAY from './engine/pay';
import * as TAX from './engine/tax';
import * as PEN from './engine/pension';
import * as NET from './engine/net';
import { formatMoney, formatNumber, formatPercent, displayDate } from './format';

const esc = (s: string | number) => String(s).replace(/&(?!(?:[a-z]+|#\d+);)/g, '&amp;').replace(/</g, '&lt;');
export function table(headers: string[], rows: Array<Array<string | number>>, caption?: string, align: Array<'l' | 'r'> = []) {
  const al = (i: number) => (align[i] === 'r' ? 'text-right' : 'text-left');
  return `<div class="not-prose my-6 overflow-x-auto"><table class="journal w-full text-sm">${caption ? `<caption class="mb-2 text-left text-sm text-navy-600">${caption}</caption>` : ''}<thead><tr>${headers.map((h, i) => `<th scope="col" class="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-navy-700 ${al(i)}">${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => `<td class="tabular-nums border-b border-navy-100 px-3 py-2 text-navy-800 ${al(i)}">${typeof c === 'number' ? esc(formatNumber(c, 0)) : c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

/** Scheme a nation's NHS staff and teachers belong to. */
export const nhsScheme = (n: PAY.Nation): PEN.Scheme => (n === 'scotland' ? 'nhsScot' : n === 'ni' ? 'hscNI' : 'nhsEW');
export const teacherScheme = (n: PAY.Nation): PEN.Scheme => (n === 'scotland' ? 'stps' : n === 'ni' ? 'nitps' : 'tps');
export const taxNation = (n: PAY.Nation): TAX.TaxNation => (n === 'scotland' ? 'scotland' : 'ruk');

export function helpers(strict = false) {
  const m = (n: number) => formatMoney(Math.round(n), 0);
  const m2 = (n: number) => formatMoney(n, 2);
  const pc = (x: number, d?: number) => { const v = Math.round(x * 10000) / 100; return formatPercent(x, d ?? (Number.isInteger(v) ? 0 : Number.isInteger(+(v * 10).toFixed(6)) ? 1 : 2)); };
  const a = (id: string, text: string) => {
    if (!ROUTES.some((r) => r.id === id)) { if (strict) throw new Error(`Unknown page id in a link: ${id}`); return text; }
    return `<a href="${route(id, 'en')}">${text}</a>`;
  };
  /** Take-home of an NHS salary in a nation (pension in that nation's scheme). */
  const nhsNet = (n: PAY.Nation, gross: number, pensionable = gross, loans: TAX.LoanPlan[] = []) => NET.takeHome({ gross, pensionable, scheme: nhsScheme(n), nation: taxNation(n), loans });
  const teacherNet = (n: PAY.Nation, gross: number, loans: TAX.LoanPlan[] = []) => NET.takeHome({ gross, scheme: teacherScheme(n), nation: taxNation(n), loans });
  return {
    P, PAY, TAX, PEN, NET, nhsNet, teacherNet,
    /** Link to another page of the site by id. */
    a,
    /** £32,073 (rounded to the pound). */
    m,
    /** £16.40 (pence kept). */
    m2,
    num: (n: number) => formatNumber(n, 0),
    /** 8.3 %, 12 % (decimals only when needed). */
    pc,
    /** “12 February 2026” from an ISO date. */
    date: (iso: string) => displayDate(iso, 'en-GB'),
    table,
    /** Table of every step of an Agenda for Change band in a nation: gross, pension, tax, NI, take-home. */
    bandNetTable: (n: PAY.Nation, band: PAY.Band, caption?: string) => {
      const rows = PAY.afcPoints(n, band).map((p, i) => { const r = nhsNet(n, p.pay);
        return [PAY.stepLabel(n, band, i), m(p.pay), `${m(r.pension)} (${pc(r.pensionRate)})`, m(r.tax), m(r.ni), m(r.net), m(r.monthly)]; });
      return table(['Step', 'Basic pay', 'Pension', 'Income tax', 'NI', 'Take-home a year', 'A month'], rows, caption ?? `Band ${band}, ${PAY.NATION_LABEL[n]}, ${P.afc[n].year}: full time, no student loan, pension in the scheme. Worked out by the engine of this site.`, ['l', 'r', 'r', 'r', 'r', 'r', 'r']);
    },
    /** Link to an official source of the parameter file. */
    src: (key: SourceKey, text?: string) => { const s = P.sources[key]; return `<a href="${s.url}" target="_blank" rel="nofollow noopener noreferrer">${text ?? s.label.en}</a>`; },
    /** Boxed note. */
    box: (title: string, html: string, kind: 'info' | 'tip' | 'warning' | 'example' = 'info') => `<div class="callout callout-${kind}"><span class="callout-title">${title}</span>${html}</div>`,
  };
}
export type Helpers = ReturnType<typeof helpers>;
