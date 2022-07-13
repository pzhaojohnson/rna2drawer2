import type { Partners } from 'Partners/Partners';
import { partnerOf } from 'Partners/Partners';

import { areValid } from 'Partners/areValid';

import { isUnpaired } from 'Partners/isPaired';
import { isPaired } from 'Partners/isPaired';
import { arePaired } from 'Partners/isPaired';

import { areUnstructured } from 'Partners/areUnstructured';

import { pair } from 'Partners/edit';
import { unpair } from 'Partners/edit';

import { PairWrapper } from 'Partners/pairs/PairWrapper';
import { pairsInPartners } from 'Partners/pairs/pairsInPartners';

import { StemWrapper } from 'Partners/stems/StemWrapper';
import { stemsInPartners } from 'Partners/stems/stemsInPartners';

import { LinkerWrapper } from 'Partners/linkers/LinkerWrapper';
import { linkersInPartners } from 'Partners/linkers/linkersInPartners';

import { containingLinker } from 'Partners/linkers/containingLinker';

export type ContainingLinkerMethodArgs = { position: number };

export class PartnersWrapper {
  /**
   * The wrapped partners.
   */
  readonly partners: Partners;

  constructor(partners: Partners | PartnersWrapper) {
    this.partners = partners instanceof PartnersWrapper ? partners.partners : partners;
  }

  areValid() {
    return areValid(this.partners);
  }

  partnerOf(p: number) {
    return partnerOf(this.partners, p);
  }

  isUnpaired(p: number) {
    return isUnpaired(this.partners, p);
  }

  isPaired(p: number) {
    return isPaired(this.partners, p);
  }

  arePaired(p: number, q: number) {
    return arePaired(this.partners, p, q);
  }

  areUnstructured() {
    return areUnstructured(this.partners);
  }

  get length() {
    return this.partners.length;
  }

  pair(p: number, q: number) {
    pair(this.partners, p, q);
  }

  unpair(p: number) {
    unpair(this.partners, p);
  }

  pairs(): PairWrapper[] {
    let pairs = pairsInPartners(this.partners);
    return pairs.map(pair => new PairWrapper(pair));
  }

  stems(): StemWrapper[] {
    let stems = stemsInPartners(this.partners);
    return stems.map(stem => new StemWrapper(stem));
  }

  linkers(): LinkerWrapper[] {
    let linkers = linkersInPartners(this.partners);
    return linkers.map(linker => new LinkerWrapper(linker));
  }

  containingLinker(args: ContainingLinkerMethodArgs): LinkerWrapper | undefined {
    let linker = containingLinker(this.partners, args);
    return linker ? new LinkerWrapper(linker) : undefined;
  }
}

export {
  PartnersWrapper as Partners,
};
