import { AppInterface as App } from '../../../../AppInterface';
import { StrictDrawingInterface as StrictDrawing } from '../../../../draw/StrictDrawingInterface';
import { DrawingInterface as Drawing } from '../../../../draw/DrawingInterface';
import { BaseInterface as Base } from '../../../../draw/BaseInterface';
import { stemOfPosition } from '../../../../parse/stemOfPosition';
import { copyStemProps } from '../../../../draw/layout/singleseq/strict/stemProps';
import {
  PrimaryBondInterface as PrimaryBond,
  SecondaryBondInterface as SecondaryBond,
} from '../../../../draw/StraightBondInterface';
import { TertiaryBondInterface as TertiaryBond } from '../../../../draw/QuadraticBezierBondInterface';

interface SubsequenceRange {
  position5: number;
  position3: number;
}

function transferStemProps(strictDrawing: StrictDrawing, r: SubsequenceRange) {
  let partners = strictDrawing.layoutPartners();
  let st = stemOfPosition(r.position3 + 1, partners);
  if (st) {
    let perBaseProps = strictDrawing.perBaseLayoutProps();
    copyStemProps;
    perBaseProps[r.position3 - 1].flipStem = false;
    strictDrawing.setPerBaseLayoutProps(perBaseProps);
  }
}

function removeBondsWithBases(drawing: Drawing, bs: Base[]) {
  let baseIds = new Set<string>();
  bs.forEach(b => baseIds.add(b.id));
  let bonds = [] as (PrimaryBond | SecondaryBond | TertiaryBond)[];
  drawing.forEachPrimaryBond(pb => bonds.push(pb));
  drawing.forEachSecondaryBond(sb => bonds.push(sb));
  drawing.forEachTertiaryBond(tb => bonds.push(tb));
  let toRemove = [] as (PrimaryBond | SecondaryBond | TertiaryBond)[];
  bonds.forEach(b => {
    if (baseIds.has(b.base1.id) || baseIds.has(b.base2.id)) {
      toRemove.push(b);
    }
  });
  toRemove.forEach(b => {
    drawing.removeSecondaryBondById(b.id);
  });
}

function addPrimaryBond(drawing: Drawing, b1?: Base, b2?: Base) {
  if (b1 && b2) {
    drawing.addPrimaryBond(b1, b2);
  }
}

interface Inputs {
  fromPosition: number;
  throughPosition: number;
}

/**
 * Returns an error message as a string for invalid inputs.
 */
export function removeSubsequence(app: App, inputs: Inputs): string | undefined {
  let strictDrawing = app.strictDrawing;
  let drawing = strictDrawing.drawing;
  if (drawing.numSequences == 0) {
    return 'Drawing has no sequences.';
  } else if (drawing.numSequences > 1) {
    return 'Drawing has multiple sequences.';
  }
  let seq = drawing.getSequenceAtIndex(0);
  if (seq) {
    let r = {
      position5: inputs.fromPosition - seq.numberingOffset,
      position3: inputs.throughPosition - seq.numberingOffset,
    };
    if (seq.positionOutOfRange(r.position5)) {
      return 'From position is out of range.';
    } else if (seq.positionOutOfRange(r.position3)) {
      return 'Through position is out of range.';
    }
    transferStemProps(strictDrawing, r);
    removeBondsWithBases(drawing, seq.getBasesInRange(r.position5, r.position3));
    // remove bases in range
    addPrimaryBond(drawing, seq.getBaseAtPosition(r.position5 - 1), seq.getBaseAtPosition(r.position5));
  }
  return undefined;
}
