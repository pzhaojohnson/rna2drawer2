import type { Partners } from 'Partners/Partners';

export class PartnersWrapper {
  /**
   * The wrapped partners.
   */
  readonly partners: Partners;

  constructor(partners: Partners | PartnersWrapper) {
    this.partners = partners instanceof PartnersWrapper ? partners.partners : partners;
  }
}

export {
  PartnersWrapper as Partners,
};
