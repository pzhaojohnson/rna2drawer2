import type { Partners } from 'Partners/Partners';
import { partnerOf } from 'Partners/Partners';

export class PartnersWrapper {
  /**
   * The wrapped partners.
   */
  readonly partners: Partners;

  constructor(partners: Partners | PartnersWrapper) {
    this.partners = partners instanceof PartnersWrapper ? partners.partners : partners;
  }

  partnerOf(p: number) {
    return partnerOf(this.partners, p);
  }
}

export {
  PartnersWrapper as Partners,
};
