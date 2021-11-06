// returns true if the string only contains whitespace characters
// (or is empty)
export function isBlank(s: string): boolean {
  return s.trim().length == 0;
}
