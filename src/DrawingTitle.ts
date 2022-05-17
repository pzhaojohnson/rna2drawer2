import type { Drawing } from 'Draw/Drawing';
import type { StrictDrawing } from 'Draw/strict/StrictDrawing';
import { isBlank } from 'Parse/isBlank';

export type Options = {

  // the drawing being titled
  drawing: Drawing | StrictDrawing;
};

/**
 * A title for a drawing with specified and unspecified values.
 */
export class DrawingTitle {
  readonly options: Options;

  _specifiedValue?: string;

  constructor(options: Options) {
    this.options = options;
  }

  get drawing() {
    return this.options.drawing;
  }

  get specifiedValue(): string | undefined {
    return this._specifiedValue;
  }

  /**
   * What the title of the drawing would automatically be
   * if no title were specified.
   *
   * Returns the sequence IDs of the drawing joined by commas
   * or the string "Drawing" if the title would otherwise be blank.
   */
  get unspecifiedValue(): string {
    let sequencesIds = this.drawing.sequences.map(sequence => sequence.id);
    let v = sequencesIds.join(', ');
    return isBlank(v) ? 'Drawing' : v;
  }

  /**
   * Returns the specified value if there is one.
   * and returns the unspecified value otherwise.
   */
  get value(): string {
    if (this._specifiedValue != undefined) {
      return this._specifiedValue;
    } else {
      return this.unspecifiedValue;
    }
  }

  /**
   * Use to specify a value.
   */
  set value(v: string) {
    this._specifiedValue = v;
  }

  /**
   * Causes any prior specified value to be forgotten.
   */
  unspecify() {
    this._specifiedValue = undefined;
  }
}
