import { StrictDrawingInterface as StrictDrawing } from 'Draw/strict/StrictDrawingInterface';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import { unpair } from 'Draw/strict/unpair';
import { removeBases as removeBasesFromDrawing } from 'Draw/sequences/remove/bases';

function removePerBaseLayoutProps(strictDrawing: StrictDrawing, bs: Base[]) {
  let perBaseLayoutProps = strictDrawing.perBaseLayoutProps();
  let seq = strictDrawing.layoutSequence();
  let basesToPositions = seq.basesToPositions();
  bs.forEach(b => {
    let p = basesToPositions.get(b);
    if (typeof p == 'number') { // should always be
      perBaseLayoutProps.splice(p - 1, 1);
    }
  });
  strictDrawing.setPerBaseLayoutProps(perBaseLayoutProps);
}

export function removeBases(strictDrawing: StrictDrawing, bs: Base[]) {
  unpair(strictDrawing, bs);
  removePerBaseLayoutProps(strictDrawing, bs);
  removeBasesFromDrawing(strictDrawing.drawing, bs);
  strictDrawing.updateLayout();
}
