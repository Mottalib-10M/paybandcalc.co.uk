/**
 * Pension estimate: NHS Pension Scheme 2015 or Teachers' Pension Scheme, career average, from today's
 * pensionable pay to normal pension age, in today's money (revaluation above CPI only), with pension
 * already built up and an optional lump sum at 12 to 1. Engine: lib/engine/pension.ts (tested).
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Ledger from './Ledger';
import Actions from './Actions';
import { project, commute, contribution, tier, normalPensionAge, type CareScheme } from '../../lib/engine/pension';
import { P } from '../../lib/engine/params';
import { formatMoney, formatPercent } from '../../lib/format';
import { readParams, num, str, updateURL } from '../../lib/url-state';

interface Props { scheme?: CareScheme; pay?: number; age?: number; spa?: number; growth?: number; existing?: number; lump?: number; methodHref: string; idPrefix?: string }
const m = (n: number) => formatMoney(Math.round(n), 0);
const OPTS = [{ value: 'nhsEW', label: 'NHS Pension Scheme 2015 (England, Wales)' }, { value: 'tps', label: "Teachers' Pension Scheme (England, Wales)" }];

export default function PensionCalc({ scheme: s0 = 'nhsEW', pay: p0 = 39959, age: a0 = 35, spa: sp0 = 67, growth: g0 = 0, existing: e0 = 0, lump: l0 = 0, methodHref, idPrefix = 'pen' }: Props) {
  const [scheme, setScheme] = useState<CareScheme>(s0);
  const [pay, setPay] = useState(p0);
  const [age, setAge] = useState(a0);
  const [spa, setSpa] = useState(sp0);
  const [growth, setGrowth] = useState(g0);
  const [existing, setExisting] = useState(e0);
  const [lump, setLump] = useState(l0);

  useEffect(() => {
    const u = readParams(window.location.search);
    if (!u.toString()) return;
    setScheme(str(u, 'sch', s0) === 'tps' ? 'tps' : 'nhsEW'); setPay(num(u, 'pay', p0)); setAge(num(u, 'age', a0)); setSpa(num(u, 'spa', sp0));
    setGrowth(num(u, 'g', g0)); setExisting(num(u, 'ex', e0)); setLump(num(u, 'lump', l0));
  }, []);
  useEffect(() => { updateURL({ sch: scheme, pay, age, spa, g: growth || undefined, ex: existing || undefined, lump: lump || undefined }); }, [scheme, pay, age, spa, growth, existing, lump]);

  const npa = normalPensionAge(spa);
  const pr = useMemo(() => project({ scheme, pay, age, retireAge: npa, realPayGrowth: growth / 100, existing }), [scheme, pay, age, npa, growth, existing]);
  const c = commute(scheme, pr.pension, lump);
  const S = P.pension[scheme];
  const id = (x: string) => `${idPrefix}-${x}`;
  const notes = [`Normal pension age ${npa}: your State Pension age, or 65 if that is higher. Retiring earlier reduces the pension; that reduction is not modelled.`,
    `In today's money: each year's pension is revalued by ${formatPercent(S.realRevaluation, 1)} above inflation (CPI + ${formatPercent(S.realRevaluation, 1)}), so prices are left out.`];
  if (scheme === 'tps' && c.max !== null && lump > c.max) notes.push(`The lump sum is capped at ${m(c.max)}, the Teachers' Pensions maximum (annual pension × 30 / 7).`);

  return (
    <div data-chrome className="rechner border border-navy-300 bg-white p-4 sm:p-5">
      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,26rem)]">
        <form className="grid content-start gap-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
            <NumberField id={id('pay')} label="Pensionable pay a year" value={pay} onChange={setPay} unit="£" max={500000} help="Basic pay, plus HCAS and unsocial hours for NHS staff" />
            <NumberField id={id('age')} label="Your age now" value={age} onChange={setAge} unit="yrs" max={75} />
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
            <SelectField id={id('sch')} label="Scheme" value={scheme} onChange={(v) => setScheme(v as CareScheme)} options={OPTS} />
            <NumberField id={id('spa')} label="Your State Pension age" value={spa} onChange={setSpa} unit="yrs" max={75} help="Check yours on GOV.UK" />
          </div>
          <details className="group border-t border-navy-200 pt-3">
            <summary className="cursor-pointer text-sm font-medium text-accent-700">More: pension built up, pay growth, lump sum</summary>
            <div className="mt-3 grid gap-4">
              <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
                <NumberField id={id('ex')} label="Career average pension already built up" value={existing} onChange={setExisting} unit="£" max={200000} help="From your annual benefit statement, a year" />
                <NumberField id={id('g')} label="Pay growth above inflation" value={growth} onChange={setGrowth} unit="%" max={10} decimals={1} help="Promotions and steps; 0 = flat in real terms" />
              </div>
              <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 sm:gap-y-0">
                <NumberField id={id('lump')} label="Lump sum you would take" value={lump} onChange={setLump} unit="£" max={2000000} help="£1 a year of pension given up per £12" />
              </div>
            </div>
          </details>
        </form>
        <Ledger label={`Pension a year from age ${npa}, today's money`} value={m(c.pension)} sub={`${m(c.pension / 12)} a month${c.lumpSum > 0 ? ` and a lump sum of ${m(c.lumpSum)}` : ''}`}
          rows={[
            ['Years to normal pension age', String(pr.years)],
            ['Pension added this year', m(pr.firstYear)],
            ['From the pension already built up', m(pr.fromExisting)],
            ['From the years to come', m(pr.fromFuture)],
            ...(c.lumpSum > 0 ? [['Pension given up for the lump sum', `− ${m(c.givenUp)}`] as [string, string]] : []),
            [`Your contribution this year (${formatPercent(tier(scheme, pay).rate, 1)})`, m(contribution(scheme, pay))],
          ]}
          total={['Pension a year before any lump sum', m(pr.pension)]} notes={notes} />
      </div>
      <div aria-hidden="true" className="fixed inset-x-0 bottom-0 z-40 border-t border-navy-300 bg-white/95 px-4 py-2 text-sm text-navy-900 shadow-[0_-2px_6px_rgba(0,0,0,0.06)] lg:hidden print:hidden">Pension from {npa}: <strong className="tabular-nums">{m(c.pension)}</strong> a year in today's money</div>
      <Actions methodHref={methodHref} note={`Accrual 1/${S.accrual}, revaluation CPI + ${formatPercent(S.realRevaluation, 1)}, lump sum 12 to 1.`} />
    </div>
  );
}
