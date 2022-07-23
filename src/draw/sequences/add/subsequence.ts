import type { Drawing } from 'Draw/Drawing';
import type { Sequence } from 'Draw/sequences/Sequence';
import { Base } from 'Draw/bases/Base';
import { setValues as setBaseValues } from 'Draw/bases/values';
import { addPrimaryBond } from 'Draw/bonds/straight/add';
import { removePrimaryBondById } from 'Draw/bonds/straight/remove';
import { atPosition } from 'Array/at';
import { numberingOffset } from 'Draw/sequences/numberingOffset';
import { numberingIncrement } from 'Draw/sequences/numberingIncrement';
import { numberingAnchor } from 'Draw/sequences/numberingAnchor';
import { updateBaseNumberings } from 'Draw/sequences/updateBaseNumberings';
import { orientBaseNumberings } from 'Draw/bases/numberings/orient';

export type SubsequenceProps = {

  // the sequence to insert the subsequence into
  parent: Sequence;

  // a base will be created for each character
  characters: string;

  // the start position for the subsequence
  // (the position to insert the subsequence at)
  start: number;
}

// removes the primary bond between the base curently at the start position
// for the subsequence and the base at the immediately upstream position
// if there is such a primary bond
function breakStrand(drawing: Drawing, props: SubsequenceProps) {
  let b1 = atPosition(props.parent.bases, props.start - 1);
  let b2 = atPosition(props.parent.bases, props.start);
  let pb = drawing.primaryBonds.find(
    pb => b1 && pb.binds(b1) && b2 && pb.binds(b2)
  );
  if (pb) {
    removePrimaryBondById(drawing, pb.id);
  }
}

// inserts the bases themselves into the parent sequence
function insertBases(drawing: Drawing, props: SubsequenceProps) {
  let bs: Base[] = [];
  for (let i = 0; i < props.characters.length; i++) {
    let c = props.characters.charAt(i);

    // creates text without a tspan
    // (makes the SVG document a bit neater)
    let t = drawing.svg.text(() => {});
    t.plain(c);

    let b = new Base(t);
    setBaseValues(b, Base.recommendedDefaults);
    bs.push(b);
  }
  props.parent.bases.splice(props.start - 1, 0, ...bs);
}

// adds the necessary primary bonds to make the strand of the parent sequence
// continuous after the bases of the subsequence have been inserted
function repairStrand(drawing: Drawing, props: SubsequenceProps) {
  for (let p1 = props.start - 1; p1 <= props.start + props.characters.length - 1; p1++) {
    let b1 = atPosition(props.parent.bases, p1);
    let b2 = atPosition(props.parent.bases, p1 + 1);
    if (b1 && b2) {
      addPrimaryBond(drawing, b1, b2);
    }
  }
}

export function insertSubsequence(drawing: Drawing, props: SubsequenceProps) {
  let no = numberingOffset(props.parent);
  let ni = numberingIncrement(props.parent);
  let na = numberingAnchor(props.parent);

  breakStrand(drawing, props);
  insertBases(drawing, props);
  repairStrand(drawing, props);

  if (no != undefined && ni != undefined && na != undefined) {
    let numbering = { offset: no, increment: ni, anchor: na };
    updateBaseNumberings(props.parent, numbering);
  }
  orientBaseNumberings(drawing);
}
