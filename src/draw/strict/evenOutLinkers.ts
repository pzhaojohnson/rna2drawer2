import type { StrictDrawing } from 'Draw/strict/StrictDrawing';

import type { Partners } from 'Partners/Partners';
import { linkersInPartners } from 'Partners/linkers/linkersInPartners';

import { evenOutStretch } from 'Draw/strict/layout/stretch';

class PartnersWrapper {
  readonly partners: Partners;

  constructor(partners: Partners) {
    this.partners = partners;
  }

  linkers() {
    return linkersInPartners(this.partners);
  }
}

export type Options = {
  /**
   * Whether to update the layout of the drawing in the end.
   * (The layout is updated if left unspecified.)
   */
  updateLayout?: boolean;
};

/**
 * Adjusts the per base layout props of all linkers in the drawing
 * such that bases in all linkers are evenly spaced within each linker.
 */
export function evenOutLinkers(drawing: StrictDrawing, options?: Options) {
  let partners = new PartnersWrapper(drawing.layoutPartners());

  let perBaseLayoutProps = drawing.perBaseLayoutProps();
  partners.linkers().forEach(linker => {
    evenOutStretch(perBaseLayoutProps, linker);
  });
  drawing.setPerBaseLayoutProps(perBaseLayoutProps);

  if (options?.updateLayout ?? true) {
    drawing.updateLayout();
  }
}
