import type { StrictDrawing } from 'Draw/strict/StrictDrawing';
import {
  insertSubsequence as insertSubsequenceIntoDrawing,
  SubsequenceProps,
} from 'Draw/sequences/add/subsequence';

import { partnerOf } from 'Partners/Partners';
import { containingStem } from 'Partners/containing';

import { atPosition } from 'Array/at';
import {
  PerBaseStrictLayoutProps as PerBaseLayoutProps,
  initializeAtPosition,
} from 'Draw/strict/layout/PerBaseStrictLayoutProps';

import {
  perLoopProps as perLoopLayoutProps,
  setPerLoopProps as setPerLoopLayoutProps,
  resetPerLoopProps as resetPerLoopLayoutProps,
} from 'Draw/strict/layout/PerLoopProps';

import { evenOutLinkers } from 'Draw/strict/evenOutLinkers';

// inserts the specified subsequence into the strict drawing
export function insertSubsequence(strictDrawing: StrictDrawing, props: SubsequenceProps) {
  let prevSeqLength = props.parent.length;
  let prevLayoutPartners = strictDrawing.layoutPartners();

  insertSubsequenceIntoDrawing(strictDrawing.drawing, props);

  if (props.parent.length == prevSeqLength) {
    return; // subsequence was empty
  }

  // get start position of inserted subsequence in the layout sequence
  // (keep in mind that subsequences may be appended or prepended)
  let layoutSequence = strictDrawing.layoutSequence();
  let b = props.parent.atPosition(props.start);
  let p = b ? layoutSequence.positionOf(b) : undefined;

  if (typeof p != 'number') {
    console.error('Unable to find the bases of the inserted subsequence.');
    return;
  }

  let perBaseLayoutProps = strictDrawing.perBaseLayoutProps();

  let q = partnerOf(prevLayoutPartners, p);
  let st = containingStem(prevLayoutPartners, p);
  if (typeof q != 'number' || !st) {
    // position was unpaired
  } else if (p == q) {
    // just in case position was paired with itself
  } else {
    let stemWasSplit = p < q ? st.position5 < p : q < (st.position5 + st.size - 1);
    if (stemWasSplit) {
      // transfer per loop layout props
      let fromPosition = st.position5;
      let toPosition = p < q ? p : q + 1;
      let fromProps = atPosition(perBaseLayoutProps, fromPosition) ?? (
        initializeAtPosition(perBaseLayoutProps, fromPosition)
      );
      let toProps = atPosition(perBaseLayoutProps, toPosition) ?? (
        initializeAtPosition(perBaseLayoutProps, toPosition)
      );
      setPerLoopLayoutProps(toProps, perLoopLayoutProps(fromProps));
      resetPerLoopLayoutProps(fromProps);
    }
  }

  // insert per base layout props
  for (let i = 0; i < props.parent.length - prevSeqLength; i++) {
    perBaseLayoutProps.splice(p - 1, 0, new PerBaseLayoutProps());
  }

  strictDrawing.setPerBaseLayoutProps(perBaseLayoutProps);
  evenOutLinkers(strictDrawing, { updateLayout: false });
  strictDrawing.updateLayout();
}
