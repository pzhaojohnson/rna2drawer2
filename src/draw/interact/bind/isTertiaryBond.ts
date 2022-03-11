import { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';

export function isTertiaryBond(v: unknown): v is TertiaryBond {
  return v instanceof TertiaryBond;
}
