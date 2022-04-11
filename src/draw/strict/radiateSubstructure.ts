import type { StrictDrawing } from 'Draw/strict/StrictDrawing';
import { radiateStems } from 'Draw/strict/layout/radiateStems';
import { atPosition } from 'Array/at';
import { initializeAtPosition } from 'Draw/strict/layout/PerBaseStrictLayoutProps';

export type Substructure = {

  // positions in the layout sequence of the strict drawing
  startPosition: number;
  endPosition: number;
};

export type Options = {

  // whether to update the actual layout of the drawing
  // after updating its layout props (which specify its layout)
  // (the layout is updated if this option is left unspecified)
  updateLayout?: boolean;
};

export function radiateSubstructure(strictDrawing: StrictDrawing, substructure: Substructure, options?: Options) {
  let updateLayout = options?.updateLayout ?? true;

  let partners = strictDrawing.layoutPartners();
  let perBaseLayoutProps = strictDrawing.perBaseLayoutProps();
  let stretches3 = radiateStems(partners);

  for (let p = substructure.startPosition; p <= substructure.endPosition; p++) {
    let props = (
      atPosition(perBaseLayoutProps, p)
      ?? initializeAtPosition(perBaseLayoutProps, p)
    );

    let s3 = atPosition(stretches3, p);
    if (s3 != undefined) {
      props.stretch3 = s3;
    }
  }

  strictDrawing.setPerBaseLayoutProps(perBaseLayoutProps);

  if (updateLayout) {
    strictDrawing.updateLayout();
  }
}
