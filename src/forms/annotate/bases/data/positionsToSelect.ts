import { DrawingInterface as Drawing } from "../../../../draw/DrawingInterface";

interface Inputs {
  startPosition: number;
  data: number[];
  dataRange: {
    min: number;
    max: number;
  }
}

/**
 * This function requires that there is only one sequence in the drawing.
 */
export function positionsToSelect(drawing: Drawing, inputs: Inputs): number[] | string {
  if (drawing.numSequences > 1) {
    return 'Drawing has multiple sequences.';
  }
  let seq = drawing.getSequenceAtIndex(0);
  if (!seq) {
    return 'Drawing has no bases.';
  }
  let sp = inputs.startPosition - seq.numberingOffset;
  if (sp < 1 || sp > seq.length) {
    return 'Start position is out of range.';
  }
  if (inputs.data.length == 0) {
    return 'No data entered.';
  }
  if (inputs.data.length > seq.length - sp + 1) {
    return 'Data exceeds number of bases.';
  }
  if (inputs.dataRange.min > inputs.dataRange.max) {
    return 'Min of data to select cannot be greater than max.';
  }
  let ps = [] as number[];
  inputs.data.forEach((v, i) => {
    let p = sp + i;
    if (v >= inputs.dataRange.min && v <= inputs.dataRange.max) {
      ps.push(p);
    }
  });
  return ps;
}
