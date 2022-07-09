import type { Linker } from 'Partners/linkers/Linker';

export function linkerContainsPosition(linker: Linker, p: number): boolean {
  return p > linker.boundingPosition5 && p < linker.boundingPosition3;
}
