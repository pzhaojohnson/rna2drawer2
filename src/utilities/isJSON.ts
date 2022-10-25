/**
 * Returns false if the JSON.parse method would throw for the given
 * string and returns true otherwise.
 */
export function isJSON(s: string): boolean {
  try {
    JSON.parse(s);
    return true;
  } catch {
    return false;
  }
}
