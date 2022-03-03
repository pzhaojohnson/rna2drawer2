import { StrictLayoutSpecification } from './StrictLayoutSpecification';
import { traverseOutermostLoopDownstream } from 'Partners/traverseLoopDownstream';
import { atPosition } from 'Array/at';

// does not account for the bonds of base-pairs in calculating the length
// of the outermost loop, though this is usually fine practically speaking
// when determining how much to rotate the layout of the drawing
function lengthOfOutermostLoop(spec: StrictLayoutSpecification): number {
  let length = 0;

  let traversed = traverseOutermostLoopDownstream(spec.partners);
  traversed.positions.forEach(p => {
    length += 1;
    let props = atPosition(spec.perBasePropsArray, p);
    if (props) {
      length += props.stretch3;
    }
  });

  return length;
}

// rotates the specified strict layout clockwise normalizing the specified amount
// with regards to the length of the outermost loop
export function rotateClockwise(spec: StrictLayoutSpecification, amount: number) {
  let outermostLoopLength = lengthOfOutermostLoop(spec);
  spec.generalProps.rotation += 2 * Math.PI * (amount / outermostLoopLength);
}

// rotates the specified strict layout counter clockwise normalizing the specified amount
// with regards to the length of the outermost loop
export function rotateCounterClockwise(spec: StrictLayoutSpecification, amount: number) {
  let outermostLoopLength = lengthOfOutermostLoop(spec);
  spec.generalProps.rotation -= 2 * Math.PI * (amount / outermostLoopLength);
}
