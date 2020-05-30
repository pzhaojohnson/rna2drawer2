import { StrictDrawingInterface as StrictDrawing } from '../StrictDrawingInterface';
import {
  appendStructure,
  Structure,
} from './appendStructure';
import PerBaseStrictLayoutProps from '../layout/singleseq/strict/PerBaseStrictLayoutProps';
import { BaseInterface as Base } from '../BaseInterface';
import { radiateStems } from '../layout/singleseq/strict/radiateStems';
import splitSecondaryAndTertiaryPairs from '../../parse/splitSecondaryAndTertiaryPairs';

function _appendPerBaseLayoutProps(sd: StrictDrawing, structure: Structure) {
  let seq = sd.drawing.getSequenceById(structure.id);
  if (seq.length == 0) {
    return;
  }
  let b1 = seq.getBaseAtPosition(1);
  let start = sd.drawing.overallPositionOfBase(b1);
  let perBaseProps = sd.perBaseLayoutProps();
  if (!perBaseProps) {
    perBaseProps = [];
  }
  while (perBaseProps.length < start - 1) {
    perBaseProps.push(new PerBaseStrictLayoutProps());
  }
  seq.forEachBase((b: Base, p: number) => {
    let op = start + p - 1;
    perBaseProps[op - 1] = new PerBaseStrictLayoutProps();
  });
  sd.setPerBaseLayoutProps(perBaseProps);
}

function _radiateStructure(sd: StrictDrawing, structure: Structure) {
  let secondaryPartners = structure.secondaryPartners;
  if (!secondaryPartners) {
    return;
  }
  let split = splitSecondaryAndTertiaryPairs(secondaryPartners);
  secondaryPartners = split.secondaryPartners;
  let stretches3 = radiateStems(secondaryPartners);
  let seq = sd.drawing.getSequenceById(structure.id);
  if (seq.length == 0) {
    return;
  }
  let b1 = seq.getBaseAtPosition(1);
  let start = sd.drawing.overallPositionOfBase(b1);
  let perBaseProps = sd.perBaseLayoutProps();
  seq.forEachBase((b: Base, p: number) => {
    let op = start + p - 1;
    perBaseProps[op - 1].stretch3 = stretches3[p - 1];
  });
  sd.setPerBaseLayoutProps(perBaseProps);
}

/**
 * Returns true if the structure was successfully appended.
 */
export function appendStructureToStrictDrawing(sd: StrictDrawing, structure: Structure): boolean {
  let wasEmpty = sd.isEmpty();
  let appended = appendStructure(sd.drawing, structure);
  if (!appended) {
    return false;
  }
  _appendPerBaseLayoutProps(sd, structure);
  _radiateStructure(sd, structure);
  sd.applyLayout();
  if (wasEmpty) {
    sd.drawing.centerView();
  }
  return true;
}

export default appendStructureToStrictDrawing;

export {
  Structure,
};
