import * as React from 'react';
import { useState } from 'react';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import errorMessageStyles from 'Forms/ErrorMessage.css';
import { AppInterface as App } from 'AppInterface';
import { PrimaryBondInterface } from 'Draw/bonds/straight/PrimaryBondInterface';
import { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';
import { round } from 'Math/round';

export type Props = {
  app: App;

  // the primary bonds to edit
  primaryBonds: PrimaryBondInterface[];
}

// returns undefined for an empty primary bonds array
// or if not all primary bonds have the same stroke width
function currStrokeWidth(primaryBonds: PrimaryBondInterface[]): number | undefined {
  let sws = new Set<number>();
  primaryBonds.forEach(pb => {
    let sw = pb.line.attr('stroke-width');
    if (typeof sw == 'number') {
      sws.add(round(sw, 2));
    }
  });
  if (sws.size == 1) {
    return sws.values().next().value;
  }
}

function valueIsValid(value: string): boolean {
  let n = Number.parseFloat(value);
  return Number.isFinite(n) && n >= 0;
}

function valueIsBlank(value: string): boolean {
  return value.trim().length == 0;
}

function setStrokeWidthsIfShould(props: Props, value: string) {
  if (valueIsValid(value)) {
    let sw = Number.parseFloat(value);
    if (sw != currStrokeWidth(props.primaryBonds)) {
      props.app.pushUndo();
      props.primaryBonds.forEach(pb => {
        pb.line.attr({ 'stroke-width': sw });
      });
      PrimaryBond.recommendedDefaults.line['stroke-width'] = sw;
      props.app.drawingChangedNotByInteraction();
    }
  }
}

export function StrokeWidthField(props: Props) {
  let sw = currStrokeWidth(props.primaryBonds);
  let [value, setValue] = useState(typeof sw == 'number' ? sw.toString() : '');
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
        <input
          type='text'
          className={textFieldStyles.input}
          value={value}
          onChange={event => setValue(event.target.value)}
          onBlur={() => setStrokeWidthsIfShould(props, value)}
          onKeyUp={event => {
            if (event.key.toLowerCase() == 'enter') {
              setStrokeWidthsIfShould(props, value);
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
      {valueIsValid(value) || valueIsBlank(value) ? null : (
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
