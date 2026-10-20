/** Result panel shared by the full calculators: the headline figure, then the lines of the sum. */
import type { ReactNode } from 'react';
interface Props { label: string; value: string; unit?: string; sub?: string; rows: Array<[string, string]>; total?: [string, string]; notes?: string[]; children?: ReactNode }
export default function Ledger({ label, value, unit, sub, rows, total, notes = [], children }: Props) {
  return (
    <div data-resultat aria-live="polite" className="self-start border-l-4 border-accent-500 bg-accent-50 p-4">
      <p className="text-sm font-medium text-navy-700">{label}</p>
      <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{value}{unit && <span className="ml-1 text-base font-medium text-navy-700">{unit}</span>}</p>
      {sub && <p className="mt-1 text-sm text-navy-800">{sub}</p>}
      <table className="ledger mt-3 w-full text-sm"><tbody>
        {rows.map(([l, x]) => <tr key={l}><td className="pr-2 text-navy-700">{l}</td><td className="tabular-nums text-right text-navy-900">{x}</td></tr>)}
        {total && <tr className="total"><td>{total[0]}</td><td className="tabular-nums text-right">{total[1]}</td></tr>}
      </tbody></table>
      {children}
      {notes.map((n) => <p key={n} className="mt-2 text-xs text-navy-700">{n}</p>)}
    </div>
  );
}
