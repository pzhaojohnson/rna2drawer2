import type { Partners } from 'Partners/Partners';

export function unstructuredPartners(length=0): Partners {
  let partners: Partners = [];
  for (let i = 0; i < length; i++) {
    partners.push(null);
  }
  return partners;
}
