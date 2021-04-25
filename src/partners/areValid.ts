import { Partners } from './Partners';

export function areValid(partners: Partners): boolean {
  for (let p = 1; p <= partners.length; p++) {
    let q = partners[p - 1];
    if (typeof q == 'number') {
      let pairIsValid = (
        Number.isInteger(q)
        && partners[q - 1] == p
      );
      if (!pairIsValid) {
        return false;
      }
    }
  }
  return true;
}
