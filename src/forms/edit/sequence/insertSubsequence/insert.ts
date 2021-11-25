import { StrictDrawingInterface as StrictDrawing } from 'Draw/strict/StrictDrawingInterface';
import { parseSequence } from '../../../../parse/parseSequence';
import { PerBaseStrictLayoutProps as PerBaseProps } from 'Draw/strict/layout/PerBaseStrictLayoutProps';
import { willInsertAt } from 'Draw/strict/layout/stemProps';
import { insertSubsequence } from 'Draw/sequences/add/subsequence';
import { containingUnpairedRegion } from 'Partners/containing';
import { evenOutStretch } from 'Draw/strict/layout/stretch';

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
  let ur5 = containingUnpairedRegion(partners, insertPosition);
  if (ur5) {
    evenOutStretch(perBaseProps, ur5);
  }
  let ur3 = containingUnpairedRegion(partners, insertPosition + subsequence.length - 1);
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
    let insertPosition = inputs.insertPosition - seq.numberingOffset;
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
      let insertPosition = inputs.insertPosition - seq.numberingOffset;
      let subsequence = parseSubsequence(inputs);
      transferStemProps(strictDrawing, insertPosition);
      insertSubsequence(strictDrawing.drawing, {
        parent: seq,
        characters: subsequence,
        start: insertPosition,
      });
      insertPerBaseProps(strictDrawing, insertPosition, subsequence);
      evenOutStretches(strictDrawing, insertPosition, subsequence);
      strictDrawing.updateLayout();
    }
  }
}
