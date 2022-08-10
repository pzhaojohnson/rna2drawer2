export function isNumber(v: unknown): v is number {
  return typeof v == 'number';
}
