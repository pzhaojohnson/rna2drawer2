// a compare function that can be used when sorting a strings array
export function compareStringsAscending(a: string, b: string): number {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else {
    return 0;
  }
}

export { compareStringsAscending as compareStrings };

export function compareStringsDescending(a: string, b: string): number {
  return -1 * compareStringsAscending(a, b);
}
