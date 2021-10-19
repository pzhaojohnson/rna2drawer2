import * as React from 'react';
import { useState } from 'react';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import errorMessageStyles from 'Forms/ErrorMessage.css';
import { AppInterface as App } from 'AppInterface';
import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { BaseNumbering } from 'Draw/bases/number/BaseNumbering';
import { round } from 'Math/round';

// returns undefined if there are no base numberings in the drawing
// and assumes that all line lengths are the same
function currLineLength(drawing: Drawing): number | undefined {
  let ll = drawing.bases().find(b => b.numbering)?.numbering?.lineLength;
  if (typeof ll == 'number') {
    return round(ll, 2);
  }
}

function valueIsValid(value: string): boolean {
  let n = Number.parseFloat(value);
  return Number.isFinite(n) && n >= 0;
}

function setLineLengthIfShould(app: App, value: string) {
  if (valueIsValid(value)) {
    let n = Number.parseFloat(value);
    if (n != currLineLength(app.strictDrawing.drawing)) {
      app.pushUndo();
      app.strictDrawing.drawing.bases().forEach(b => {
        if (b.numbering) {
          b.numbering.lineLength = n;
        }
      });
      BaseNumbering.recommendedDefaults.lineLength = n;
      app.drawingChangedNotByInteraction();
    }
  }
}

export type Props = {
  app: App;
}

export function LineLengthField(props: Props) {
  let ll = currLineLength(props.app.strictDrawing.drawing);
  let [value, setValue] = useState(typeof ll == 'number' ? ll.toString() : '');
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
        <input
          type='text'
          className={textFieldStyles.input}
          value={value}
          onChange={event => setValue(event.target.value)}
          onBlur={() => setLineLengthIfShould(props.app, value)}
          onKeyUp={event => {
            if (event.key.toLowerCase() == 'enter') {
              setLineLengthIfShould(props.app, value);
            }
          }}
          style={{ width: '36px' }}
        />
        <p
          className={`${textFieldStyles.label} unselectable`}
          style={{ marginLeft: '8px' }}
        >
          Line Length
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
