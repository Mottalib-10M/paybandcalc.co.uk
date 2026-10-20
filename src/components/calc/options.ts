/** Choice lists shared by the calculators. */
import { BANDS, NATIONS, NATION_LABEL, HCAS_LABEL, type HcasArea } from '../../lib/engine/pay';
import { LOAN_LABEL, type LoanPlan } from '../../lib/engine/tax';
export const NATION_OPTS = NATIONS.map((n) => ({ value: n, label: NATION_LABEL[n] }));
export const BAND_OPTS = BANDS.map((b) => ({ value: b, label: `Band ${b}` }));
export const AREA_OPTS = (['none', 'fringe', 'outer', 'inner'] as HcasArea[]).map((a) => ({ value: a, label: HCAS_LABEL[a] }));
export const LOAN_OPTS = [{ value: 'none', label: 'No student loan' }, ...(Object.keys(LOAN_LABEL) as LoanPlan[]).map((p) => ({ value: p, label: LOAN_LABEL[p] }))];
export const TAX_OPTS = [{ value: 'ruk', label: 'England, Wales or N. Ireland' }, { value: 'scotland', label: 'Scotland' }];
export const YESNO = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No (opted out)' }];
export const loansOf = (v: string): LoanPlan[] => (v === 'none' ? [] : [v as LoanPlan]);
