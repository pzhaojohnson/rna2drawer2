export function areClose(n1: number, n2: number, places=3): boolean {
  n1 = Number.parseFloat(n1.toFixed(places));
  n2 = Number.parseFloat(n2.toFixed(places));
  return n1 == n2;
}
