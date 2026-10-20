/**
 * Main NHS tool: Agenda for Change pay of a band and step in one of the four nations, with the London
 * HCAS (England), part-time hours, then pension in the nation's scheme, income tax (Scotland included),
 * National Insurance and student loan. Every figure comes from lib/engine (tested).
 * Hydration (RECETTE §17.5): first render = props defaults; link parameters applied in an effect, and
 * the address only changes after a real input (url-state.ts).
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Ledger from './Ledger';
import Actions from './Actions';
import { NATION_OPTS, BAND_OPTS, AREA_OPTS, LOAN_OPTS, TAX_OPTS, YESNO, loansOf } from './options';
import { afcPoints, stepLabel, hcas, NATION_LABEL, BANDS, NATIONS, type Nation, type Band, type HcasArea } from '../../lib/engine/pay';
import { takeHome } from '../../lib/engine/net';
import { SCHEME_SHORT, type Scheme } from '../../lib/engine/pension';
import { P } from '../../lib/engine/params';
import { formatMoney, formatPercent, displayDate } from '../../lib/format';
import { readParams, num, str, updateURL } from '../../lib/url-state';

interface Props { nation?: Nation; band?: Band; step?: number; area?: HcasArea; fte?: number; loan?: string; methodHref: string; idPrefix?: string }
const m = (n: number) => formatMoney(Math.round(n), 0);
const scheme = (n: Nation): Scheme => (n === 'scotland' ? 'nhsScot' : n === 'ni' ? 'hscNI' : 'nhsEW');

export default function NhsPayCalc({ nation: n0 = 'england', band: b0 = '5', step: s0 = 0, area: a0 = 'none', fte: f0 = 100, loan: l0 = 'none', methodHref, idPrefix = 'nhs' }: Props) {
  const [nation, setNation] = useState<Nation>(n0);
  const [band, setBand] = useState<Band>(b0);
  const [step, setStep] = useState(s0);
  const [area, setArea] = useState<HcasArea>(a0);
  const [fte, setFte] = useState(f0);
  const [loan, setLoan] = useState(l0);
  const [tax, setTax] = useState(n0 === 'scotland' ? 'scotland' : 'ruk');
  const [inScheme, setInScheme] = useState('yes');

  useEffect(() => {
    const u = readParams(window.location.search);
    if (!u.toString()) return;
    const n = str(u, 'n', n0) as Nation; if (NATIONS.includes(n)) setNation(n);
    const b = str(u, 'b', b0) as Band; if (BANDS.includes(b)) setBand(b);
    setStep(num(u, 's', s0)); setFte(num(u, 'fte', f0));
    const a = str(u, 'hcas', a0); if (['none', 'fringe', 'outer', 'inner'].includes(a)) setArea(a as HcasArea);
    setLoan(str(u, 'loan', l0)); setTax(str(u, 'tax', n === 'scotland' ? 'scotland' : 'ruk') === 'scotland' ? 'scotland' : 'ruk');
    setInScheme(str(u, 'pen', 'yes') === 'no' ? 'no' : 'yes');
  }, []);
  useEffect(() => { updateURL({ n: nation, b: band, s: step || undefined, hcas: area === 'none' ? undefined : area, fte: fte === 100 ? undefined : fte, loan: loan === 'none' ? undefined : loan, tax, pen: inScheme === 'no' ? 'no' : undefined }); }, [nation, band, step, area, fte, loan, tax, inScheme]);

  const pts = afcPoints(nation, band);
  const st = Math.min(step, pts.length - 1);
  const stepOpts = pts.map((p, i) => ({ value: String(i), label: `${stepLabel(nation, band, i)}: ${m(p.pay)}` }));
  const share = Math.max(0, Math.min(fte, 100)) / 100;
  const basic = pts[st].pay * share;
  const supp = nation === 'england' ? hcas(pts[st].pay, area) * share : 0;
  const gross = basic + supp;
  const sch = scheme(nation);
  const r = useMemo(() => takeHome({ gross, scheme: inScheme === 'yes' ? sch : 'none', nation: tax === 'scotland' ? 'scotland' : 'ruk', loans: loansOf(loan) }), [gross, sch, inScheme, tax, loan]);
  const id = (x: string) => `${idPrefix}-${x}`;
  const scale = P.afc[nation];
  const notes: string[] = [];
  if (nation === 'ni') notes.push(`Northern Ireland: the latest pay circular is for ${scale.year}. The ${P.afc.ni.next.year} scale is still to come (${P.afc.ni.next.expected}); the Minister committed to ${formatPercent(P.afc.ni.next.committedAward, 1)} on ${displayDate(P.afc.ni.next.statement, 'en-GB')}.`);
  if (nation !== 'england' && area !== 'none') notes.push('The High Cost Area Supplement is paid in England only, so it is left out here.');
  if (pts[st].years) notes.push(`Next step after ${pts[st].years} years at this point, if you meet the requirements of your appraisal.`);
  const onNation = (v: string) => { const n = v as Nation; setNation(n); setTax(n === 'scotland' ? 'scotland' : 'ruk'); };

  return (
    <div data-chrome className="rechner border border-navy-300 bg-white p-4 sm:p-5">
      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,26rem)]">
        <form className="grid content-start gap-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
            <SelectField id={id('band')} label="Agenda for Change band" value={band} onChange={(v) => { setBand(v as Band); setStep(0); }} options={BAND_OPTS} />
            <SelectField id={id('step')} label="Pay step" value={String(st)} onChange={(v) => setStep(Number(v))} options={stepOpts} />
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
            <SelectField id={id('nation')} label="Where you work" value={nation} onChange={onNation} options={NATION_OPTS} />
            <SelectField id={id('hcas')} label="London area (HCAS)" value={area} onChange={(v) => setArea(v as HcasArea)} options={AREA_OPTS} help={nation === 'england' ? 'Inner, outer London or fringe' : 'England only'} />
          </div>
          <details className="group border-t border-navy-200 pt-3">
            <summary className="cursor-pointer text-sm font-medium text-accent-700">More: hours, student loan, Scottish tax, pension</summary>
            <div className="mt-3 grid gap-4">
              <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
                <NumberField id={id('fte')} label="Share of full-time hours" value={fte} onChange={setFte} unit="%" max={100} help="100 % = full time; 60 % = 22.5 of 37.5 hours" />
                <SelectField id={id('loan')} label="Student loan" value={loan} onChange={setLoan} options={LOAN_OPTS} />
              </div>
              <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
                <SelectField id={id('tax')} label="Where you pay income tax" value={tax} onChange={setTax} options={TAX_OPTS} help="Scottish rates if you live in Scotland" />
                <SelectField id={id('pen')} label="In the pension scheme" value={inScheme} onChange={setInScheme} options={YESNO} help={SCHEME_SHORT[sch]} />
              </div>
            </div>
          </details>
        </form>
        <Ledger label={`Take-home pay a month, band ${band} ${stepLabel(nation, band, st).toLowerCase()}`} value={m(r.monthly)} sub={`${m(r.net)} a year · ${NATION_LABEL[nation]} ${scale.year}`}
          rows={[
            ['Basic pay', m(basic)],
            ...(supp > 0 ? [[`HCAS, ${area === 'inner' ? 'inner London' : area === 'outer' ? 'outer London' : 'fringe'}`, m(supp)] as [string, string]] : []),
            [`Pension (${formatPercent(r.pensionRate, 1)} tier)`, `− ${m(r.pension)}`],
            ['Income tax', `− ${m(r.tax)}`],
            ['National Insurance', `− ${m(r.ni)}`],
            ...(r.loan > 0 ? [['Student loan', `− ${m(r.loan)}`] as [string, string]] : []),
          ]}
          total={['Take-home a year', m(r.net)]} notes={notes} />
      </div>
      <div aria-hidden="true" className="fixed inset-x-0 bottom-0 z-40 border-t border-navy-300 bg-white/95 px-4 py-2 text-sm text-navy-900 shadow-[0_-2px_6px_rgba(0,0,0,0.06)] lg:hidden print:hidden">Band {band}, {m(gross)} gross: <strong className="tabular-nums">{m(r.monthly)}</strong> a month take-home</div>
      <Actions methodHref={methodHref} note={`Scales from the ${scale.year} pay circular of ${NATION_LABEL[nation]}; tax, NI and loans from HMRC 2026/27.`} />
    </div>
  );
}
