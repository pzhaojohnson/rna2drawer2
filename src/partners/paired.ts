import { Partners, partnerOf } from './Partners';

export function isPaired(partners: Partners, p: number): boolean {
  return typeof partnerOf(partners, p) == 'number';
}

export function isUnpaired(partners: Partners, p: number): boolean {
  return !isPaired(partners, p);
}

export function arePaired(partners: Partners, p: number, q: number): boolean {
  return partnerOf(partners, p) == q;
}

export function areUnstructured(partners: Partners): boolean {
  let unstructured = true;
  partners.forEach(q => {
    if (typeof q == 'number') {
      unstructured = false;
    }
  });
  return unstructured;
}
