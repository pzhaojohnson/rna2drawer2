import { Partners } from './Partners';

export function areValid(partners: Partners): boolean {
  let valid = true;
  partners.forEach((q, i) => {
    let p = i + 1;
    if (typeof q == 'number') {
      let pairIsValid = (
        Number.isInteger(q)
        && partners[q - 1] == p
        && p != q
      );
      if (!pairIsValid) {
        valid = false;
      }
    }
  });
  return valid;
}
