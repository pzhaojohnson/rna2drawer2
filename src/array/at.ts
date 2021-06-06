export function atIndex<E>(arr: E[], i: number): E | undefined {
  return arr[i];
}

export function atPosition<E>(arr: E[], p: number): E | undefined {
  return arr[p - 1];
}
