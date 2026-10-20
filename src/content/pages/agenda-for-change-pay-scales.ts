import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'agenda-for-change-pay-scales',
  group: 'nhs',
  order: 30,
  tool: { kind: 'nhs', props: { band: '6' } },
  related: ['nhs-pay-rise-2026', 'nhs-pay-progression', 'nhs-scotland-pay-scales', 'nhs-take-home-pay'],
  sources: ['nhse_afc', 'nhse_handbook', 'scot_afc', 'wales_afc', 'ni_afc'],
  slug: 'agenda-for-change-pay-scales',
  nav: 'Agenda for Change pay scales',
  card: 'Every band and point in England for 2026/27, with the years between points and the hourly rates.',
  title: 'Agenda for Change Pay Scales 2026/27: Every Band and Step',
  description: 'Agenda for Change pay scales 2026/27: every band and pay point in England from 1 April 2026, the years between steps, hourly rates and take-home for each step.',
  h1: 'Agenda for Change pay scales 2026/27',
  intro: 'The full 2026/27 scale for England, read from the NHS Employers circular, with the take-home of any point in the calculator. The other nations have their own pages.',
  resume: (h) => {
    const E = h.P.afc.england;
    return `The Agenda for Change pay scales for 2026/27 took effect in England on 1 April 2026, after the government accepted a ${h.pc(E.award)} award, and NHS Employers published them on ${h.date(E.published)}. Band 2 pays ${h.m(h.PAY.afcPay('england', '2'))} at a single point. Bands 3 and 4 have two points, two and three years apart. Bands 5 to 9 have three: entry, intermediate and top, with two years at entry and two or three at the intermediate point. The scale ends at ${h.m(h.PAY.afcPay('england', '9', 2))} at the top of band 9. Band 1 is closed to new entrants and pays the same as band 2. Each step is paid on your pay step date when the standards of Annex 23 of the handbook are met; the award itself applies to everyone from 1 April. Staff in and around London add a High Cost Area Supplement of 5 to 20 % of basic pay, within a minimum and a maximum. Scotland, Wales and Northern Ireland set separate scales.`;
  },
  faqs: (h) => [
    { q: 'When were the 2026/27 Agenda for Change pay scales published?', a: `NHS Employers published the England scale on ${h.date(h.P.afc.england.published)}, effective from 1 April 2026, after the government's response to the NHS Pay Review Body. The Welsh pay letter AfC(W) 02/2026 followed on the same day. Scotland's figures come from its two-year deal, and Northern Ireland had not issued its 2026/27 circular by 20 October 2026.` },
    { q: 'How many years does it take to reach the top of an Agenda for Change band?', a: `In England it depends on the band: none for band 2, two years for band 3, three for band 4, four for band 5 and five for bands 6 to 9. Each wait is set in the published scale as the years until eligible for pay progression at each point, and the step is paid only when the progression standards are met.` },
    { q: 'What are the Agenda for Change hourly rates in 2026/27?', a: `NHS Employers publishes hourly rates alongside the annual ones for a 37.5 hour week. They range from ${h.m2(h.PAY.afcHourly('2', 0))} for band 2 to ${h.m2(h.PAY.afcHourly('9', 2))} at the top of band 9; band 5 starts at ${h.m2(h.PAY.afcHourly('5', 0))}. These are the rates used for overtime, unsocial hours and part-time pay.` },
    { q: 'Is the High Cost Area Supplement part of the pay scale?', a: `It is paid on top of the scale, to staff working in inner London, outer London and the fringe zones defined in Annex 8 of the handbook. NHS Employers publishes tables that include it: band 5 entry becomes ${h.m(h.PAY.afcPay('england', '5', 0) + h.PAY.hcas(h.PAY.afcPay('england', '5', 0), 'inner'))} in inner London. The supplement is pensionable.` },
  ],
  body: (h) => {
    const rows = h.PAY.BANDS.map((b) => { const pts = h.PAY.afcPoints('england', b); const cell = (i: number) => pts[i] ? h.m(pts[i].pay) : ''; return [`Band ${b}`, cell(0), pts.length === 3 ? cell(1) : '', cell(pts.length - 1), String(h.PAY.yearsToTop('england', b))]; });
    const hr = h.PAY.BANDS.map((b) => { const r = (h.P.afc.england.hourly as Record<string, number[]>)[b]; return [`Band ${b}`, h.m2(r[0]), r.length === 3 ? h.m2(r[1]) : '', h.m2(r[r.length - 1])]; });
    const net = h.PAY.BANDS.map((b) => { const pts = h.PAY.afcPoints('england', b); return [`Band ${b}`, h.m(h.nhsNet('england', pts[0].pay).monthly), h.m(h.nhsNet('england', pts[pts.length - 1].pay).monthly)]; });
    return `<h2>The 2026/27 scale, England</h2>
${h.table(['Band', 'Entry', 'Intermediate', 'Top', 'Years to top'], rows, 'Annual basic pay from 1 April 2026, NHS Employers, Pay scales for 2026/27. Band 2 has a single figure; bands 3 and 4 have an entry and a top point.', ['l', 'r', 'r', 'r', 'r'])}
<p>Pay inside a band moves in a few large steps rather than many small increments. Each step is paid on the pay step date, which is set by the date you started in the band, not by the date of the award. In England the step is conditional on the standards of paragraph 19 of Annex 23: an appraisal completed in the last twelve months, no formal capability process, no live disciplinary sanction, statutory and mandatory training completed and, for line managers, appraisals done for their staff. The ${h.a('nhs-pay-progression', 'pay progression page')} works out what each step is worth in take-home pay.</p>
<p>Band 1 is closed to new entrants; staff still on it are paid ${h.m(h.P.afc.england.band1Closed)}, the same as band 2. At the other end, the top points of bands 8c, 8d and 9 carry a share of 5 or 10 % that becomes re-earnable each year, twelve months after it is reached.</p>
<h2>Hourly rates</h2>
${h.table(['Band', 'Entry', 'Intermediate', 'Top'], hr, 'Hourly rates from 1 April 2026 for a 37.5 hour week, as published by NHS Employers.', ['l', 'r', 'r', 'r'])}
<h2>What each band takes home</h2>
${h.table(['Band', 'Entry, a month', 'Top, a month'], net, 'Take-home a month, England, full time, outside London, NHS pension at the tier for that pay, no student loan. Worked out by the engine of this site.', ['l', 'r', 'r'])}
<p>The gap between gross and take-home widens as you go up the scale. The pension rate rises through six tiers, from ${h.pc(h.PEN.tier('nhsEW', 20000).rate)} to ${h.pc(h.PEN.tier('nhsEW', 90000).rate)}; income tax moves to 40 % from band 7 upwards; and above ${h.m(h.P.tax.taperThreshold)} of income after pension the Personal Allowance is withdrawn. National Insurance works the other way, falling from 8 % to 2 % above ${h.m(h.P.tax.ni.upperEarningsLimit)}. Each band has its own page with the detail, from ${h.a('nhs-band-2-salary', 'band 2')} to ${h.a('nhs-band-9-salary', 'band 9')}.</p>
<h2>Who sets the scales</h2>
<p>Agenda for Change covers NHS staff other than doctors and dentists, who are paid under separate contracts. The NHS Pay Review Body recommends an award each year; each government decides, and the NHS Staff Council's handbook carries the result. England's figures are published by NHS Employers, Scotland's by the Scottish Government, Wales's in a Welsh Government pay letter and Northern Ireland's in a Department of Health circular. The ${h.a('nhs-scotland-pay-scales', 'Scotland')}, ${h.a('nhs-wales-pay-scales', 'Wales')} and ${h.a('nhs-northern-ireland-pay-scales', 'Northern Ireland')} pages give their scales. When a new circular appears, this site reads it, updates the parameter file and the date at the foot of every page, and the calculators use the new figures from that day.</p>`;
  },
});
