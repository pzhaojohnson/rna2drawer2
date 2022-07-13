import type { Partners } from 'Partners/Partners';
import type { Linker } from 'Partners/linkers/Linker';
import { containingUnpairedRegion } from 'Partners/containing';

export type Args = { position: number };

export function containingLinker(partners: Partners, args: Args): Linker | undefined {
  return containingUnpairedRegion(partners, args.position);
}
