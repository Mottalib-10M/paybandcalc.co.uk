/** llms.txt (RECETTE §21): what the site is, where its figures come from, its main pages. Built from the data. */
import type { APIRoute } from 'astro';
import { PAGES } from '../lib/guides';
import { route } from '../i18n/routes';
import { SITE_URL, LAST_UPDATED } from '../data/site-config';
export const GET: APIRoute = () => {
  const lines = [
    '# Pay Band Calc',
    '',
    `> NHS Agenda for Change and school teacher pay in the UK worked out in the browser: the 2026/27 scales of England (NHS Employers, 12 February 2026), Scotland (gov.scot) and Wales (AfC(W) 02/2026), the 2025/26 scale of Northern Ireland (2026/27 still to come), the London High Cost Area Supplement, teachers' pay from the School Teachers' Pay and Conditions Document 2026 (September 2026 and September 2027), SNCT tables for Scotland and the latest Welsh and NI documents. Take-home after income tax (Scottish rates included), National Insurance, tiered pension contributions of six schemes from 1 April 2026 and student loans (HMRC 2026/27). Career average pension estimates for the NHS Pension Scheme 2015 (1/54th, CPI + 1.5 %) and the Teachers' Pension Scheme (1/57th, CPI + 1.6 %). Sources last read ${LAST_UPDATED}. Published by Radif Partners, an independent publisher; not the NHS, not a union, not a pension scheme.`,
    '',
    '## Calculators and guides',
    `- [NHS pay and take-home calculator](${SITE_URL}${route('home', 'en')}): every Agenda for Change band and step in the four nations, with HCAS, pension, tax, NI and student loan.`,
    ...PAGES.map((p) => `- [${p.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.card}`),
    '',
    '## Method',
    `- [How the figures are worked out](${SITE_URL}${route('method', 'en')})`,
    `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
