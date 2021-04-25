export type Partners = (number | null | undefined)[];

export function initializePartners(length=0): Partners {
  let partners: Partners = [];
  for (let i = 0; i < length; i++) {
    partners.push(null);
  }
  return partners;
}
