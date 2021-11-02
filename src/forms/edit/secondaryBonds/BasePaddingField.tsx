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
// or if not all secondary bonds have the same base padding
function currBasePadding(secondaryBonds: SecondaryBondInterface[]): number | undefined {
  let bps = new Set<number>();
  secondaryBonds.forEach(sb => {
    bps.add(round(sb.basePadding1, 1));
    bps.add(round(sb.basePadding2, 1));
  });
  if (bps.size == 1) {
    return bps.values().next().value;
  }
}

function valueIsValid(value: string): boolean {
  let n = Number.parseFloat(value);
  return Number.isFinite(n) && n >= 0;
}

function valueIsBlank(value: string): boolean {
  return value.trim().length == 0;
}

function setBasePaddingsIfShould(props: Props, value: string) {
  if (valueIsValid(value)) {
    let bp = Number.parseFloat(value);
    if (bp != currBasePadding(props.secondaryBonds)) {
      props.app.pushUndo();
      props.secondaryBonds.forEach(sb => {
        sb.basePadding1 = bp;
        sb.basePadding2 = bp;
      });
      secondaryBondTypes.forEach(t => {
        SecondaryBond.recommendedDefaults[t].basePadding1 = bp;
        SecondaryBond.recommendedDefaults[t].basePadding2 = bp;
      });
      props.app.drawingChangedNotByInteraction();
    }
  }
}

export function BasePaddingField(props: Props) {
  let bp = currBasePadding(props.secondaryBonds);
  let [value, setValue] = useState(typeof bp == 'number' ? bp.toString() : '');
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
        <input
          type='text'
          className={textFieldStyles.input}
          value={value}
          onChange={event => setValue(event.target.value)}
          onBlur={() => setBasePaddingsIfShould(props, value)}
          onKeyUp={event => {
            if (event.key.toLowerCase() == 'enter') {
              setBasePaddingsIfShould(props, value);
            }
          }}
          style={{ width: '32px' }}
        />
        <p
          className={`${textFieldStyles.label} unselectable`}
          style={{ marginLeft: '8px' }}
        >
          Base Padding
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
