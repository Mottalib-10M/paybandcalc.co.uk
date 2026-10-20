/**
 * Engine tests. Published figures first (the HCAS example of NHS Employers, the tier tables of the
 * schemes, the Teachers' Pensions maximum lump sum rule), then the edges of each rule: the £100,000
 * taper, the Scottish bands, NI at the upper earnings limit, student loan thresholds, the CARE
 * projection and the commutation at 12 to 1.
 */
import { describe, it, expect } from 'vitest';
import { personalAllowance, incomeTax, nationalInsurance, studentLoan } from '../src/lib/engine/tax';
import { afcPay, hcas, BANDS, NATIONS, afcPoints, yearsToTop, stepLabel, teacherEngland, teacherScotland, teacherWales, teacherNI, unqualifiedEngland, afcHourly, unsocialRates } from '../src/lib/engine/pay';
import { tier, contribution, project, commute, maxLumpSum, normalPensionAge, SCHEMES, tierTable } from '../src/lib/engine/pension';
import { takeHome } from '../src/lib/engine/net';
import { P } from '../src/lib/engine/params';

const r2 = (x: number) => Math.round(x * 100) / 100;

describe('Agenda for Change pay', () => {
  it('NHS Employers: band 5 entry in inner London is £38,488 (higher of basic + 20 % and the minimum)', () => {
    const c = P.afc.england.hcasCheck;
    const b = afcPay('england', c.band as '5', c.step);
    expect(b + hcas(b, 'inner')).toBe(c.total);
    expect(34592 + hcas(34592, 'inner')).toBe(41511);
    expect(32073 + hcas(32073, 'outer')).toBe(36943);
  });
  it('HCAS respects the minimum and maximum', () => {
    expect(hcas(25272, 'inner')).toBe(P.afc.england.hcas.inner.min);
    expect(hcas(129783, 'inner')).toBe(P.afc.england.hcas.inner.max);
    expect(hcas(40000, 'outer')).toBe(6000);
    expect(hcas(40000, 'none')).toBe(0);
  });
  it('every nation has every band, rising steps', () => {
    for (const n of NATIONS) for (const b of BANDS) {
      const pts = afcPoints(n, b);
      expect(pts.length, `${n} ${b}`).toBeGreaterThan(0);
      for (let i = 1; i < pts.length; i++) expect(pts[i].pay).toBeGreaterThanOrEqual(pts[i - 1].pay);
    }
  });
  it('England band 5 reaches the top after 4 years; band 6 after 5', () => {
    expect(yearsToTop('england', '5')).toBe(4);
    expect(yearsToTop('england', '6')).toBe(5);
    expect(yearsToTop('scotland', '6')).toBeNull();
    expect(stepLabel('england', '5', 1)).toBe('Intermediate');
    expect(stepLabel('scotland', '5', 2)).toBe('Point 3');
  });
  it('a step past the top returns the top; hourly and unsocial rates follow the band', () => {
    expect(afcPay('england', '7', 9)).toBe(56515);
    expect(afcHourly('5', 0)).toBe(16.4);
    expect(unsocialRates('2')).toEqual([0.41, 0.83]);
    expect(unsocialRates('8c')).toEqual([0.3, 0.6]);
  });
});

describe('Teachers pay', () => {
  it('STRB 36th report: M1 £34,069 outside London, U3 £64,684 in inner London (September 2026)', () => {
    expect(teacherEngland('M1')).toBe(34069);
    expect(teacherEngland('U3', 3)).toBe(64684);
    expect(teacherEngland('M6', 0, 'sep2027')).toBe(48349);
    expect(unqualifiedEngland(1)).toBe(23732);
  });
  it('the September 2026 award is 3.5 % on M2 (rounded up to the pound)', () => {
    expect(Math.round(teacherEngland('M2', 0, 'sep2027') / teacherEngland('M2') * 1000) / 1000).toBe(1.03);
  });
  it('Scotland, Wales and Northern Ireland scales', () => {
    expect(teacherScotland(0)).toBe(36159);
    expect(teacherScotland(5)).toBe(54453);
    expect(teacherWales('M2')).toBe(33731);
    expect(teacherNI('U3')).toBe(50876);
  });
});

describe('Income tax 2026/27', () => {
  it('Personal Allowance taper: nothing left at £125,140', () => {
    expect(personalAllowance(100000)).toBe(12570);
    expect(personalAllowance(110000)).toBe(7570);
    expect(personalAllowance(125140)).toBe(0);
  });
  it('rest of the UK: £30,000 pays £3,486; £60,000 pays £11,432', () => {
    expect(r2(incomeTax(30000).tax)).toBe(3486);
    expect(r2(incomeTax(60000).tax)).toBe(37700 * 0.2 + (60000 - 12570 - 37700) * 0.4);
    expect(r2(incomeTax(60000).tax)).toBe(11432);
  });
  it('Scotland: £30,000 pays £3,451.07 across the starter, basic and intermediate bands', () => {
    expect(r2(incomeTax(30000, 'scotland').tax)).toBe(3451.07);
    expect(incomeTax(30000, 'scotland').marginal).toBe(0.21);
    expect(incomeTax(50000, 'scotland').marginal).toBe(0.42);
  });
  it('no tax below the allowance', () => { expect(incomeTax(12000).tax).toBe(0); });
});

describe('National Insurance and student loans', () => {
  it('8 % to £50,270 then 2 %', () => {
    expect(r2(nationalInsurance(30000))).toBe(1394.4);
    expect(r2(nationalInsurance(60000))).toBe(r2((50270 - 12570) * 0.08 + (60000 - 50270) * 0.02));
    expect(nationalInsurance(12000)).toBe(0);
  });
  it('Plan 2 at 9 % above £29,385; postgraduate at 6 % above £21,000', () => {
    expect(r2(studentLoan(39385, 'plan2'))).toBe(900);
    expect(r2(studentLoan(31000, 'postgrad'))).toBe(600);
    expect(studentLoan(20000, 'plan5')).toBe(0);
  });
});

describe('Pension contribution tiers from 1 April 2026', () => {
  it('NHSBSA: £28,854 is in the 6.5 % tier, £28,855 in the 8.3 % tier', () => {
    expect(tier('nhsEW', 28854).rate).toBe(0.065);
    expect(tier('nhsEW', 28855).rate).toBe(0.083);
    expect(tier('nhsEW', 200000).rate).toBe(0.125);
  });
  it('the rate applies to the whole pay', () => {
    expect(r2(contribution('nhsEW', 32073))).toBe(r2(32073 * 0.083));
  });
  it('Teachers Pensions: £36,198.99 at 7.4 %, £36,199 at 8.9 %', () => {
    expect(tier('tps', 36198.99).rate).toBe(0.074);
    expect(tier('tps', 36199).rate).toBe(0.089);
    expect(tier('nitps', 104414).rate).toBe(0.1206);
    expect(tier('stps', 36195).rate).toBe(0.0735);
    expect(tier('nhsScot', 59370).rate).toBe(0.116);
    expect(tier('hscNI', 30000).rate).toBe(0.085);
  });
  it('every scheme has a table that starts at 0 and ends open', () => {
    for (const s of SCHEMES) { const t = tierTable(s); expect(t[0].from).toBe(0); expect(t[t.length - 1].upTo).toBeNull(); }
  });
});

describe('Career average projection', () => {
  it('one year in the NHS scheme adds 1/54th of pay', () => {
    expect(r2(project({ scheme: 'nhsEW', pay: 54000, age: 66, retireAge: 67 }).pension)).toBe(1000);
  });
  it('two years: the first is revalued by 1.5 % in real terms', () => {
    expect(r2(project({ scheme: 'nhsEW', pay: 54000, age: 65, retireAge: 67 }).pension)).toBe(2015);
  });
  it('TPS uses 1/57th and 1.6 %, and existing pension is revalued too', () => {
    const p = project({ scheme: 'tps', pay: 57000, age: 65, retireAge: 67, existing: 1000 });
    expect(r2(p.pension)).toBe(r2((1000 + 1000) * 1.016 + 1000));
    expect(r2(p.fromExisting)).toBe(1016);
  });
  it('commutation at 12 to 1; TPS maximum lump sum is pension x 30/7', () => {
    const c = commute('tps', 7000, 100000);
    expect(r2(c.lumpSum)).toBe(30000);
    expect(r2(c.pension)).toBe(4500);
    expect(maxLumpSum('nhsEW', 7000)).toBeNull();
    expect(r2(commute('nhsEW', 7000, 12000).pension)).toBe(6000);
  });
  it('normal pension age is State Pension age, never under 65', () => {
    expect(normalPensionAge(67)).toBe(67);
    expect(normalPensionAge(60)).toBe(65);
  });
});

describe('Take-home pay', () => {
  it('pension comes off before tax but not before National Insurance', () => {
    const r = takeHome({ gross: 32073, scheme: 'nhsEW' });
    expect(r2(r.pension)).toBe(r2(32073 * 0.083));
    expect(r2(r.tax)).toBe(r2(incomeTax(32073 - 32073 * 0.083).tax));
    expect(r2(r.ni)).toBe(r2(nationalInsurance(32073)));
    expect(r2(r.net)).toBe(r2(32073 - r.pension - r.tax - r.ni));
  });
  it('student loans on pay before pension', () => {
    const r = takeHome({ gross: 40000, scheme: 'tps', loans: ['plan2'] });
    expect(r2(r.loan)).toBe(r2((40000 - 29385) * 0.09));
  });
});
