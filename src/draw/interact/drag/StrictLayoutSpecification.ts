import { StrictDrawingInterface as StrictDrawing } from 'Draw/strict/StrictDrawingInterface';
import { Partners } from 'Partners/Partners';
import { GeneralStrictLayoutProps } from 'Draw/strict/layout/GeneralStrictLayoutProps';
import { PerBaseStrictLayoutProps } from 'Draw/strict/layout/PerBaseStrictLayoutProps';

export type StrictLayoutSpecification = {
  partners: Partners;
  generalProps: GeneralStrictLayoutProps;
  perBasePropsArray: PerBaseStrictLayoutProps[];
};

// returns the layout specification for the strict drawing
export function layoutSpecification(strictDrawing: StrictDrawing): StrictLayoutSpecification {
  return {
    partners: strictDrawing.layoutPartners(),
    generalProps: strictDrawing.generalLayoutProps.deepCopy(),
    perBasePropsArray: strictDrawing.perBaseLayoutProps(),
  };
}
