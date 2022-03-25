import type { StrictDrawing } from 'Draw/strict/StrictDrawing';
import type { Base } from 'Draw/bases/Base';
import { removeSecondaryBondById } from 'Draw/bonds/straight/remove';

import { unpair as unpairInPartners } from 'Partners/edit';
import { containingStem } from 'Partners/containing';

import { atPosition } from 'Array/at';
import { initializeAtPosition } from 'Draw/strict/layout/PerBaseStrictLayoutProps';

import {
  perLoopProps as perLoopLayoutProps,
  setPerLoopProps as setPerLoopLayoutProps,
  resetPerLoopProps as resetPerLoopLayoutProps,
} from 'Draw/strict/layout/PerLoopProps';
import {
  perStemProps as perStemLayoutProps,
  setPerStemProps as setPerStemLayoutProps,
  resetPerStemProps as resetPerStemLayoutProps,
} from 'Draw/strict/layout/PerStemProps';

export function unpair(strictDrawing: StrictDrawing, bs: Base[]) {
  let drawing = strictDrawing.drawing;

  let seq = strictDrawing.layoutSequence();
  let basesToPositions = seq.basesToPositions();

  let partners = strictDrawing.layoutPartners();

  let perBaseLayoutProps = strictDrawing.perBaseLayoutProps();

  bs.forEach(b => {
    // remove all secondary bonds with the base
    drawing.secondaryBonds.filter(sb => sb.binds(b)).forEach(sb => {
      removeSecondaryBondById(drawing, sb.id);
    });

    let p = basesToPositions.get(b);
    if (typeof p != 'number') {
      console.error(`Unable to find position of base: ${JSON.stringify(b)}.`);
      return; // never expected to happen
    }

    let prevStems = [
      containingStem(partners, p - 1),
      containingStem(partners, p + 1),
    ];
    unpairInPartners(partners, p); // update partners
    let currStems = [
      containingStem(partners, p - 1),
      containingStem(partners, p + 1),
    ];
    [p - 1, p + 1].forEach((_, i) => {
      let prevStem = prevStems[i];
      let currStem = currStems[i];

      // no need to update per base props
      if (!prevStem || !currStem) {
        return;
      } else if (prevStem.position5 == currStem.position5) {
        return;
      }

      let prevProps = atPosition(perBaseLayoutProps, prevStem.position5) ?? (
        initializeAtPosition(perBaseLayoutProps, prevStem.position5)
      );
      let currProps = atPosition(perBaseLayoutProps, currStem.position5) ?? (
        initializeAtPosition(perBaseLayoutProps, currStem.position5)
      );
      let wasSplit = containingStem(partners, prevStem.position5) ? true : false;

      // update per base props
      if (wasSplit) {
        setPerLoopLayoutProps(currProps, perLoopLayoutProps(prevProps));
        resetPerLoopLayoutProps(prevProps);
      } else {
        setPerStemLayoutProps(currProps, perStemLayoutProps(prevProps));
        resetPerStemLayoutProps(prevProps);
      }
    });
  });

  strictDrawing.setPerBaseLayoutProps(perBaseLayoutProps);
  strictDrawing.updateLayout();
}
