/**
 * Main teacher tool: salary of a pay point in England (four pay areas, September 2026 or 2027),
 * Scotland (SNCT, from 1 August 2026), Wales and Northern Ireland (latest published scales), plus an
 * allowance, part-time share, pension in the nation's teachers' scheme, tax, NI and student loan.
 * Hydration (RECETTE §17.5): first render = props defaults, link parameters applied in an effect.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Ledger from './Ledger';
import Actions from './Actions';
import { NATION_OPTS, LOAN_OPTS, TAX_OPTS, YESNO, loansOf } from './options';
import { teacherEngland, unqualifiedEngland, teacherScotland, teacherWales, teacherNI, EN_POINTS, WALES_POINTS, TEACHER_AREA_LABEL, NATION_LABEL, NATIONS, type Nation, type EnPoint, type TeacherArea, type EnYear } from '../../lib/engine/pay';
import { takeHome } from '../../lib/engine/net';
import { SCHEME_SHORT, type Scheme } from '../../lib/engine/pension';
import { P } from '../../lib/engine/params';
import { formatMoney, formatPercent, displayDate } from '../../lib/format';
import { readParams, num, str, updateURL } from '../../lib/url-state';

interface Props { nation?: Nation; point?: string; area?: number; year?: EnYear; allowance?: number; fte?: number; loan?: string; methodHref: string; idPrefix?: string }
const m = (n: number) => formatMoney(Math.round(n), 0);
const scheme = (n: Nation): Scheme => (n === 'scotland' ? 'stps' : n === 'ni' ? 'nitps' : 'tps');
const SCOT = ['Probationer', 'Point 1', 'Point 2', 'Point 3', 'Point 4', 'Point 5'];

function pointsFor(n: Nation): Array<{ value: string; label: string }> {
  if (n === 'england') return [...EN_POINTS.map((p) => ({ value: p, label: p })), ...[1, 2, 3, 4, 5, 6].map((i) => ({ value: `Q${i}`, label: `Unqualified ${i}` }))];
  if (n === 'scotland') return SCOT.map((l, i) => ({ value: `S${i}`, label: l }));
  return WALES_POINTS.map((p) => ({ value: p, label: p }));
}
function salary(n: Nation, point: string, area: TeacherArea, year: EnYear): number {
  if (n === 'england') return point.startsWith('Q') ? unqualifiedEngland(Number(point.slice(1)), area, year) : teacherEngland(point as EnPoint, area, year);
  if (n === 'scotland') return teacherScotland(Number(point.slice(1)));
  return n === 'wales' ? teacherWales(point as (typeof WALES_POINTS)[number]) : teacherNI(point as (typeof WALES_POINTS)[number]);
}
const firstPoint = (n: Nation) => (n === 'england' ? 'M1' : n === 'scotland' ? 'S1' : 'M2');

export default function TeacherPayCalc({ nation: n0 = 'england', point: p0 = 'M1', area: a0 = 0, year: y0 = 'sep2026', allowance: al0 = 0, fte: f0 = 100, loan: l0 = 'none', methodHref, idPrefix = 'tch' }: Props) {
  const [nation, setNation] = useState<Nation>(n0);
  const [point, setPoint] = useState(p0);
  const [area, setArea] = useState<TeacherArea>(a0 as TeacherArea);
  const [year, setYear] = useState<EnYear>(y0);
  const [allow, setAllow] = useState(al0);
  const [fte, setFte] = useState(f0);
  const [loan, setLoan] = useState(l0);
  const [tax, setTax] = useState(n0 === 'scotland' ? 'scotland' : 'ruk');
  const [inScheme, setInScheme] = useState('yes');

  useEffect(() => {
    const u = readParams(window.location.search);
    if (!u.toString()) return;
    const n = str(u, 'n', n0) as Nation; const nn = NATIONS.includes(n) ? n : n0; setNation(nn);
    const p = str(u, 'p', p0); setPoint(pointsFor(nn).some((o) => o.value === p) ? p : firstPoint(nn));
    const a = num(u, 'area', a0); setArea((a >= 0 && a <= 3 ? Math.round(a) : 0) as TeacherArea);
    setYear(str(u, 'y', y0) === 'sep2027' ? 'sep2027' : 'sep2026'); setAllow(num(u, 'tlr', al0)); setFte(num(u, 'fte', f0));
    setLoan(str(u, 'loan', l0)); setTax(str(u, 'tax', nn === 'scotland' ? 'scotland' : 'ruk') === 'scotland' ? 'scotland' : 'ruk'); setInScheme(str(u, 'pen', 'yes') === 'no' ? 'no' : 'yes');
  }, []);
  useEffect(() => { updateURL({ n: nation, p: point, area: area || undefined, y: year === 'sep2026' ? undefined : year, tlr: allow || undefined, fte: fte === 100 ? undefined : fte, loan: loan === 'none' ? undefined : loan, tax, pen: inScheme === 'no' ? 'no' : undefined }); }, [nation, point, area, year, allow, fte, loan, tax, inScheme]);

  const opts = pointsFor(nation);
  const pt = opts.some((o) => o.value === point) ? point : firstPoint(nation);
  const yr: EnYear = year;
  const share = Math.max(0, Math.min(fte, 100)) / 100;
  const base = salary(nation, pt, area, yr) * share;
  const gross = base + allow * share;
  const sch = scheme(nation);
  const r = useMemo(() => takeHome({ gross, scheme: inScheme === 'yes' ? sch : 'none', nation: tax === 'scotland' ? 'scotland' : 'ruk', loans: loansOf(loan) }), [gross, sch, inScheme, tax, loan]);
  const id = (x: string) => `${idPrefix}-${x}`;
  const T = P.teachers;
  const label = nation === 'england' ? (yr === 'sep2026' ? 'from 1 September 2026' : 'from 1 September 2027') : nation === 'scotland' ? `from ${displayDate(T.scotland.effective, 'en-GB')}` : `from ${displayDate((nation === 'wales' ? T.wales : T.ni).effective, 'en-GB')}`;
  const notes: string[] = [];
  if (nation === 'wales') notes.push(`Wales: a ${formatPercent(T.wales.next.award, 1)} award from ${displayDate(T.wales.next.backdated, 'en-GB')} was announced on ${displayDate(T.wales.next.announced, 'en-GB')}; the new scale is still to come in the revised Pay and Conditions Document, so this is the September 2025 scale.`);
  if (nation === 'ni') notes.push('Northern Ireland: the September 2026 scale had not been published on 20 October 2026, so this is the scale from 1 September 2025.');
  const onNation = (v: string) => { const n = v as Nation; setNation(n); setPoint(firstPoint(n)); setTax(n === 'scotland' ? 'scotland' : 'ruk'); };

  return (
    <div data-chrome className="rechner border border-navy-300 bg-white p-4 sm:p-5">
      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,26rem)]">
        <form className="grid content-start gap-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
            <SelectField id={id('point')} label="Pay point" value={pt} onChange={setPoint} options={opts} />
            <SelectField id={id('nation')} label="Where you teach" value={nation} onChange={onNation} options={NATION_OPTS} />
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
            <SelectField id={id('area')} label="Pay area" value={String(area)} onChange={(v) => setArea(Number(v) as TeacherArea)} options={TEACHER_AREA_LABEL.map((l, i) => ({ value: String(i), label: l }))} help={nation === 'england' ? 'London and fringe have their own scales' : 'England only'} />
            <SelectField id={id('year')} label="Scale" value={year} onChange={(v) => setYear(v as EnYear)} options={[{ value: 'sep2026', label: 'September 2026' }, { value: 'sep2027', label: 'September 2027' }]} help={nation === 'england' ? 'Both awards are already accepted' : 'England only'} />
          </div>
          <details className="group border-t border-navy-200 pt-3">
            <summary className="cursor-pointer text-sm font-medium text-accent-700">More: TLR or SEN allowance, hours, student loan, pension</summary>
            <div className="mt-3 grid gap-4">
              <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
                <NumberField id={id('tlr')} label="Allowances a year (TLR, SEN)" value={allow} onChange={setAllow} unit="£" max={100000} help="Full-time value" />
                <NumberField id={id('fte')} label="Share of a full-time timetable" value={fte} onChange={setFte} unit="%" max={100} help="100 % = full time" />
              </div>
              <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
                <SelectField id={id('loan')} label="Student loan" value={loan} onChange={setLoan} options={LOAN_OPTS} />
                <SelectField id={id('tax')} label="Where you pay income tax" value={tax} onChange={setTax} options={TAX_OPTS} />
              </div>
              <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
                <SelectField id={id('pen')} label="In the pension scheme" value={inScheme} onChange={setInScheme} options={YESNO} help={SCHEME_SHORT[sch]} />
              </div>
            </div>
          </details>
        </form>
        <Ledger label={`Take-home pay a month, ${opts.find((o) => o.value === pt)?.label}`} value={m(r.monthly)} sub={`${m(r.net)} a year · ${NATION_LABEL[nation]}, scale ${label}`}
          rows={[
            ['Salary', m(base)],
            ...(allow > 0 ? [['Allowances', m(allow * share)] as [string, string]] : []),
            [`Pension (${formatPercent(r.pensionRate, 1)} tier)`, `− ${m(r.pension)}`],
            ['Income tax', `− ${m(r.tax)}`],
            ['National Insurance', `− ${m(r.ni)}`],
            ...(r.loan > 0 ? [['Student loan', `− ${m(r.loan)}`] as [string, string]] : []),
          ]}
          total={['Take-home a year', m(r.net)]} notes={notes} />
      </div>
      <div aria-hidden="true" className="fixed inset-x-0 bottom-0 z-40 border-t border-navy-300 bg-white/95 px-4 py-2 text-sm text-navy-900 shadow-[0_-2px_6px_rgba(0,0,0,0.06)] lg:hidden print:hidden">{opts.find((o) => o.value === pt)?.label}, {m(gross)}: <strong className="tabular-nums">{m(r.monthly)}</strong> a month take-home</div>
      <Actions methodHref={methodHref} note="Scales from the School Teachers’ Pay and Conditions Document 2026, the SNCT tables and the Welsh and NI documents; tax from HMRC 2026/27." />
    </div>
  );
}
