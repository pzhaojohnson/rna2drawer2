import * as React from 'react';
import { useState } from 'react';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import errorMessageStyles from 'Forms/ErrorMessage.css';
import { AppInterface as App } from 'AppInterface';
import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { BaseNumbering } from 'Draw/bases/number/BaseNumbering';
import { round } from 'Math/round';

// returns undefined if there are no base numberings in the drawing
// and assumes all base paddings are the same
function currBasePadding(drawing: Drawing): number | undefined {
  let bp = drawing.bases().find(b => b.numbering)?.numbering?.basePadding;
  if (typeof bp == 'number') {
    return round(bp, 2);
  }
}

function valueIsValid(value: string): boolean {
  let n = Number.parseFloat(value);
  return Number.isFinite(n) && n >= 0;
}

function setBasePaddingIfShould(app: App, value: string) {
  if (valueIsValid(value)) {
    let n = Number.parseFloat(value);
    if (n != currBasePadding(app.strictDrawing.drawing)) {
      app.pushUndo();
      app.strictDrawing.drawing.bases().forEach(b => {
        if (b.numbering) {
          b.numbering.basePadding = n;
        }
      });
      BaseNumbering.recommendedDefaults.basePadding = n;
      app.refresh();
    }
  }
}

export type Props = {
  app: App;
}

export function BasePaddingField(props: Props) {
  let bp = currBasePadding(props.app.strictDrawing.drawing);
  let [value, setValue] = useState(typeof bp == 'number' ? bp.toString() : '');
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
        <input
          type='text'
          className={textFieldStyles.input}
          value={value}
          onChange={event => setValue(event.target.value)}
          onBlur={() => setBasePaddingIfShould(props.app, value)}
          onKeyUp={event => {
            if (event.key.toLowerCase() == 'enter') {
              setBasePaddingIfShould(props.app, value);
            }
          }}
          style={{ width: '36px' }}
        />
        <p
          className={`${textFieldStyles.label} unselectable`}
          style={{ marginLeft: '8px' }}
        >
          Base Padding
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
