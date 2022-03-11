import { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';

export function isSecondaryBond(v: unknown): v is SecondaryBond {
  return v instanceof SecondaryBond;
}
