export type Nullish = null | undefined;

export function isNullish(v: unknown): v is Nullish {
  return v === null || v === undefined;
}
