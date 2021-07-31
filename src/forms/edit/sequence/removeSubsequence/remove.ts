import { StrictDrawingInterface as StrictDrawing } from '../../../../draw/StrictDrawingInterface';
import { SequenceInterface as Sequence } from 'Draw/sequences/SequenceInterface';
import { removeSubsequence } from 'Draw/sequences/remove/subsequence';
import { containingUnpairedRegion } from 'Partners/containing';
import { willRemove } from '../../../../draw/layout/singleseq/strict/stemProps';
import { evenOutStretch } from '../../../../draw/layout/singleseq/strict/stretch';

interface Range {
  start: number;
  end: number;
}

/**
 * Returns a message as a string explaining why cannot remove if cannot remove.
 */
export function cannotRemove(strictDrawing: StrictDrawing, inputs: Range): string | undefined {
  let drawing = strictDrawing.drawing;
  if (drawing.numSequences == 0) {
    return 'Drawing has no sequences.';
  } else if (drawing.numSequences > 1) {
    return 'Drawing has multiple sequences.';
  }
  let seq = drawing.getSequenceAtIndex(0);
  if (seq) {
    let r = reversePositionOffsets(seq, inputs);
    if (r.start > r.end) {
      return 'Start cannot be greater than end.';
    } else if (seq.positionOutOfRange(r.start)) {
      return 'Start is out of range.';
    } else if (seq.positionOutOfRange(r.end)) {
      return 'End is out of range.';
    } else if (r.start == 1 && r.end == seq.length) {
      return 'Cannot remove entire sequence.';
    }
  }
}

function reversePositionOffsets(seq: Sequence, r: Range): Range {
  return {
    start: seq.reversePositionOffset(r.start),
    end: seq.reversePositionOffset(r.end),
  };
}

function transferStemProps(strictDrawing: StrictDrawing, r: Range) {
  let partners = strictDrawing.layoutPartners();
  let perBaseProps = strictDrawing.perBaseLayoutProps();
  willRemove(partners, perBaseProps, r);
  strictDrawing.setPerBaseLayoutProps(perBaseProps);
}

function removePerBaseProps(strictDrawing: StrictDrawing, r: Range) {
  let perBaseProps = strictDrawing.perBaseLayoutProps();
  perBaseProps.splice(r.start - 1, r.end - r.start + 1);
  strictDrawing.setPerBaseLayoutProps(perBaseProps);
}

function evenOutStretches(strictDrawing: StrictDrawing, removedRange: Range) {
  let partners = strictDrawing.layoutPartners();
  let ur = containingUnpairedRegion(partners, removedRange.start);
  if (ur) {
    let perBaseProps = strictDrawing.perBaseLayoutProps();
    evenOutStretch(perBaseProps, ur);
    strictDrawing.setPerBaseLayoutProps(perBaseProps);
  }
}

export function remove(strictDrawing: StrictDrawing, inputs: Range) {
  if (!cannotRemove(strictDrawing, inputs)) {
    let drawing = strictDrawing.drawing;
    let seq = drawing.getSequenceAtIndex(0);
    if (seq) {
      let r = reversePositionOffsets(seq, inputs);
      transferStemProps(strictDrawing, r);
      removePerBaseProps(strictDrawing, r);
      removeSubsequence(strictDrawing.drawing, {
        parent: seq,
        start: r.start,
        end: r.end,
      });
      evenOutStretches(strictDrawing, r);
      strictDrawing.updateLayout();
    }
  }
}
