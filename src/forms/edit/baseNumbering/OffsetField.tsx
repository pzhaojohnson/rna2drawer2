import * as React from 'react';
import { useState } from 'react';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import errorMessageStyles from 'Forms/ErrorMessage.css';
import { AppInterface as App } from 'AppInterface';
import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { atIndex } from 'Array/at';
import { orientBaseNumberings } from 'Draw/bases/number/orient';

// returns undefined if there are no sequences in the drawing
// and assumes numbering offsets are the same for all sequences
function currOffset(drawing: Drawing): number | undefined {
  let seq = atIndex(drawing.sequences, 0);
  if (seq) {
    return seq.numberingOffset;
  }
}

function valueIsValid(value: string): boolean {
  let n = Number.parseFloat(value);
  return Number.isFinite(n) && Number.isInteger(n);
}

function setOffsetIfShould(app: App, value: string) {
  if (valueIsValid(value)) {
    let n = Number.parseFloat(value);
    if (n != currOffset(app.strictDrawing.drawing)) {
      app.pushUndo();
      app.strictDrawing.drawing.sequences.forEach(seq => {
        seq.numberingOffset = n;
      });
      orientBaseNumberings(app.strictDrawing.drawing);
      app.drawingChangedNotByInteraction();
    }
  }
}

export type Props = {
  app: App;
}

export function OffsetField(props: Props) {
  let o = currOffset(props.app.strictDrawing.drawing);
  let [value, setValue] = useState(typeof o == 'number' ? o.toString() : '');
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
        <input
          type='text'
          className={textFieldStyles.input}
          value={value}
          onChange={event => setValue(event.target.value)}
          onBlur={() => setOffsetIfShould(props.app, value)}
          onKeyUp={event => {
            if (event.key.toLowerCase() == 'enter') {
              setOffsetIfShould(props.app, value);
            }
          }}
          style={{ width: '36px' }}
        />
        <p
          className={`${textFieldStyles.label} unselectable`}
          style={{ marginLeft: '8px' }}
        >
          Offset
        </p>
      </div>
      {valueIsValid(value) ? null : (
        <p
          key={Math.random()}
          className={`${errorMessageStyles.errorMessage} ${errorMessageStyles.fadesIn} unselectable`}
          style={{ marginTop: '3px' }}
        >
          Must be an integer.
        </p>
      )}
    </div>
  );
}
