export function isBold(fontWeight: string | number): boolean {
  if (typeof fontWeight == 'number') {
    return fontWeight >= 700;
  } else {
    return fontWeight == 'bold';
  }
}
