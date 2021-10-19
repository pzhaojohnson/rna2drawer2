import * as React from 'react';
import { useState } from 'react';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import errorMessageStyles from 'Forms/ErrorMessage.css';
import { AppInterface as App } from 'AppInterface';
import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { BaseNumbering } from 'Draw/bases/number/BaseNumbering';
import { parseNumber } from 'Parse/svg/number';
import { round } from 'Math/round';

// returns undefined if there are no base numberings in the drawing
// and assumes all line widths are the same
function currLineWidth(drawing: Drawing): number | undefined {
  let b = drawing.bases().find(b => b.numbering);
  if (b && b.numbering) {
    let n = parseNumber(b.numbering.line.attr('stroke-width'));
    if (n) {
      return round(n.convert('px').valueOf(), 2);
    }
  }
}

function valueIsValid(value: string): boolean {
  let n = Number.parseFloat(value);
  return Number.isFinite(n) && n >= 0;
}

function setLineWidthIfShould(app: App, value: string) {
  if (valueIsValid(value)) {
    let n = Number.parseFloat(value);
    if (n != currLineWidth(app.strictDrawing.drawing)) {
      app.pushUndo();
      app.strictDrawing.drawing.bases().forEach(b => {
        if (b.numbering) {
          b.numbering.line.attr({ 'stroke-width': n });
        }
      });
      BaseNumbering.recommendedDefaults.line['stroke-width'] = n;
      app.drawingChangedNotByInteraction();
    }
  }
}

export type Props = {
  app: App;
}

export function LineWidthField(props: Props) {
  let lw = currLineWidth(props.app.strictDrawing.drawing);
  let [value, setValue] = useState(typeof lw == 'number' ? lw.toString() : '');
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
        <input
          type='text'
          className={textFieldStyles.input}
          value={value}
          onChange={event => setValue(event.target.value)}
          onBlur={() => setLineWidthIfShould(props.app, value)}
          onKeyUp={event => {
            if (event.key.toLowerCase() == 'enter') {
              setLineWidthIfShould(props.app, value);
            }
          }}
          style={{ width: '36px' }}
        />
        <p
          className={`${textFieldStyles.label} unselectable`}
          style={{ marginLeft: '8px' }}
        >
          Line Width
        </p>
      </div>
      {valueIsValid(value) ? null : (
        <p
          key={Math.random()}
          className={`${errorMessageStyles.errorMessage} ${errorMessageStyles.fadesIn} unselectable`}
          style={{ marginTop: '3px' }}
        >
          Must be a nonnegative number.
        </p>
      )}
    </div>
  );
}
