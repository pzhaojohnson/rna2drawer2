import * as React from 'react';
import { useState } from 'react';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import errorMessageStyles from 'Forms/ErrorMessage.css';
import { AppInterface as App } from 'AppInterface';
import { SecondaryBondInterface, secondaryBondTypes } from 'Draw/bonds/straight/SecondaryBondInterface';
import { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';
import { round } from 'Math/round';

export type Props = {
  app: App;

  // the secondary bonds to edit
  secondaryBonds: SecondaryBondInterface[];
}

// returns undefined for an empty secondary bonds array
// or if not all secondary bonds have the same stroke width
function currStrokeWidth(secondaryBonds: SecondaryBondInterface[]): number | undefined {
  let sws = new Set<number>();
  secondaryBonds.forEach(sb => {
    let sw = sb.line.attr('stroke-width');
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
    if (sw != currStrokeWidth(props.secondaryBonds)) {
      props.app.pushUndo();
      props.secondaryBonds.forEach(sb => {
        sb.line.attr({ 'stroke-width': sw });
      });
      secondaryBondTypes.forEach(t => {
        SecondaryBond.recommendedDefaults[t].line['stroke-width'] = sw;
      });
      props.app.drawingChangedNotByInteraction();
    }
  }
}

export function StrokeWidthField(props: Props) {
  let sw = currStrokeWidth(props.secondaryBonds);
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
          style={{ width: '32px' }}
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
