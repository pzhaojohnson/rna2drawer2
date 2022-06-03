import type { App } from 'App';
import { Base } from 'Draw/bases/Base';
import { numberingOffset } from 'Draw/sequences/numberingOffset';

import { isBlank } from 'Parse/isBlank';
import { splitDataNonempty } from './splitDataNonempty';

export type Args = {
  app: App; // a reference to the whole app

  // the data to select bases by
  // (a list of numbers separated by whitespace, commas or semicolons)
  data: string;

  // the start position of the data (given as a string)
  // in the overall layout sequence of the strict drawing of the app
  startPosition: string;

  // the minimum and maximum values (given as strings) of the range of data
  // (inclusive) to select bases in
  // (bases with data values in the specified range will be selected
  // and may then be edited by the user)
  min: string;
  max: string;
};

export function selectBasesWithValuesInRange(args: Args): void | never {
  let strictDrawing = args.app.strictDrawing;

  if (isBlank(args.data)) {
    throw new Error('No data entered.');
  } else if (isBlank(args.startPosition)) {
    throw new Error('Specify a start position.');
  } else if (isBlank(args.min)) {
    throw new Error('Specify a minimum value to select.');
  } else if (isBlank(args.max)) {
    throw new Error('Specify a maximum value to select.');
  }

  let data = splitDataNonempty(args.data).map(v => Number.parseFloat(v));
  let startPosition = Number.parseFloat(args.startPosition);
  let min = Number.parseFloat(args.min);
  let max = Number.parseFloat(args.max);

  if (data.some(v => !Number.isFinite(v))) {
    throw new Error('All data values must be numbers.');
  } else if (!Number.isFinite(startPosition)) {
    throw new Error('Start position must be a number.');
  } else if (!Number.isFinite(min)) {
    throw new Error('Minimum value to select must be a number.');
  } else if (!Number.isFinite(max)) {
    throw new Error('Maximum value to select must be a number.');
  }

  if (!Number.isInteger(startPosition)) {
    throw new Error('Start position must be an integer.');
  }

  if (strictDrawing.bases().length == 0) {
    throw new Error('Drawing has no bases.');
  }

  let seq = strictDrawing.layoutSequence();

  // account for any numbering offset
  let no = numberingOffset(seq) ?? 0;
  startPosition -= no;

  if (startPosition < 1 || startPosition > seq.length) {
    throw new Error('Start position is out of range.');
  } else if (startPosition + data.length - 1 > seq.length) {
    throw new Error('Data go beyond the end of the sequence.');
  }

  let positions: number[] = [];
  data.forEach((v, i) => {
    if (v >= min && v <= max) {
      positions.push(startPosition + i);
    }
  });

  if (positions.length == 0) {
    throw new Error('No data values in the entered range.');
  }

  // all positions should be in the sequence range given the checks above
  let bases = positions.map(p => seq.atPosition(p)).filter(
    (b): b is Base => b instanceof Base
  );

  let drawingInteraction = args.app.strictDrawingInteraction;
  drawingInteraction.currentTool = drawingInteraction.editingTool; // switch to editing tool
  drawingInteraction.editingTool.editingType = Base; // set to edit bases
  drawingInteraction.editingTool.select(bases); // select the bases
  drawingInteraction.editingTool.renderForm(); // render the editing form
}
