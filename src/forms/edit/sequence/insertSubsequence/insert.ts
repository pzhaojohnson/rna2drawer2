import { StrictDrawingInterface as StrictDrawing } from '../../../../draw/StrictDrawingInterface';
import { parseSequence } from '../../../../parse/parseSequence';
import { PerBaseStrictLayoutProps as PerBaseProps } from '../../../../draw/layout/singleseq/strict/PerBaseStrictLayoutProps';
import { willInsertAt } from '../../../../draw/layout/singleseq/strict/stemProps';
import { DrawingInterface as Drawing } from '../../../../draw/DrawingInterface';
import { PrimaryBondInterface as PrimaryBond } from '../../../../draw/StraightBondInterface';
import { unpairedRegionOfPosition } from '../../../../parse/unpairedRegionOfPosition';
import { evenOutStretch } from '../../../../draw/layout/singleseq/strict/stretch';

interface Inputs {
  insertPosition: number;
  subsequence: string;
  ignoreNumbers: boolean;
  ignoreNonAugctLetters: boolean;
  ignoreNonAlphanumerics: boolean;
}

export function parseSubsequence(inputs: Inputs): string {
  return parseSequence(
    inputs.subsequence,
    {
      ignoreNumbers: inputs.ignoreNumbers,
      ignoreNonAUGCTLetters: inputs.ignoreNonAugctLetters,
      ignoreNonAlphanumerics: inputs.ignoreNonAlphanumerics,
    },
  );
}

function transferStemProps(strictDrawing: StrictDrawing, insertPosition: number) {
  let partners = strictDrawing.layoutPartners();
  let perBaseProps = strictDrawing.perBaseLayoutProps();
  willInsertAt(partners, perBaseProps, insertPosition);
  strictDrawing.setPerBaseLayoutProps(perBaseProps);
}

function breakStrand(drawing: Drawing, insertPosition: number) {
  let seq = drawing.getSequenceAtIndex(0);
  if (seq) {
    let b5 = seq.getBaseAtPosition(insertPosition - 1);
    let b3 = seq.getBaseAtPosition(insertPosition);
    let toRemove = null as PrimaryBond | null;
    drawing.forEachPrimaryBond(pb => {
      if (b5 && b3) {
        if (pb.contains(b5) && pb.contains(b3)) {
          toRemove = pb;
        }
      }
    });
    if (toRemove) {
      drawing.removePrimaryBondById(toRemove.id);
    }
  }
}

function repairStrand(drawing: Drawing, insertPosition: number, subsequence: string) {
  let seq = drawing.getSequenceAtIndex(0);
  if (seq) {
    for (let p5 = insertPosition - 1; p5 < insertPosition + subsequence.length; p5++) {
      let b5 = seq.getBaseAtPosition(p5);
      let b3 = seq.getBaseAtPosition(p5 + 1);
      if (b5 && b3) {
        drawing.addPrimaryBond(b5, b3);
      }
    }
  }
}

function insertPerBaseProps(strictDraiwng: StrictDrawing, insertPosition: number, subsequence: string) {
  let perBaseProps = strictDraiwng.perBaseLayoutProps();
  let toInsert = [] as PerBaseProps[];
  subsequence.split('').forEach(() => toInsert.push(new PerBaseProps()));
  perBaseProps.splice(insertPosition - 1, 0, ...toInsert);
  strictDraiwng.setPerBaseLayoutProps(perBaseProps);
}

function evenOutStretches(strictDrawing: StrictDrawing, insertPosition: number, subsequence: string) {
  let partners = strictDrawing.layoutPartners();
  let perBaseProps = strictDrawing.perBaseLayoutProps();
  let ur5 = unpairedRegionOfPosition(insertPosition, partners);
  if (ur5) {
    evenOutStretch(perBaseProps, ur5);
  }
  let ur3 = unpairedRegionOfPosition(insertPosition + subsequence.length - 1, partners);
  if (ur3) {
    evenOutStretch(perBaseProps, ur3);
  }
  strictDrawing.setPerBaseLayoutProps(perBaseProps);
}

export function cannotInsert(strictDrawing: StrictDrawing, inputs: Inputs): string | undefined {
  let drawing = strictDrawing.drawing;
  if (drawing.numSequences == 0) {
    return 'Drawing has no sequences.';
  } else if (drawing.numSequences > 1) {
    return 'Drawing has multiple sequences.';
  }
  let seq = drawing.getSequenceAtIndex(0);
  if (seq) {
    let insertPosition = seq.reversePositionOffset(inputs.insertPosition);
    if (insertPosition < 1 || insertPosition > seq.length + 1) {
      return 'Position to insert at is out of range.';
    }
  }
  let subsequence = parseSubsequence(inputs);
  if (subsequence.length == 0) {
    if (inputs.subsequence.trim().length == 0) {
      return 'Subsequence is empty.';
    } else {
      return 'Subsequence has only ignored characters.';
    }
  }
}

export function insert(strictDrawing: StrictDrawing, inputs: Inputs) {
  if (!cannotInsert(strictDrawing, inputs)) {
    let drawing = strictDrawing.drawing;
    let seq = drawing.getSequenceAtIndex(0);
    if (seq) {
      let insertPosition = seq.reversePositionOffset(inputs.insertPosition);
      let subsequence = parseSubsequence(inputs);
      transferStemProps(strictDrawing, insertPosition);
      breakStrand(drawing, insertPosition);
      seq.insertBasesAtPosition(
        drawing.createBases(subsequence),
        insertPosition,
      );
      repairStrand(drawing, insertPosition, subsequence);
      insertPerBaseProps(strictDrawing, insertPosition, subsequence);
      evenOutStretches(strictDrawing, insertPosition, subsequence);
      strictDrawing.updateLayout();
    }
  }
}
