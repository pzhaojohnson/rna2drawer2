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
// or if not all primary bonds have the same base padding
function currBasePadding(primaryBonds: PrimaryBondInterface[]): number | undefined {
  let bps = new Set<number>();
  primaryBonds.forEach(pb => {
    bps.add(round(pb.basePadding1, 1));
    bps.add(round(pb.basePadding2, 1));
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
    if (bp != currBasePadding(props.primaryBonds)) {
      props.app.pushUndo();
      props.primaryBonds.forEach(pb => {
        pb.basePadding1 = bp;
        pb.basePadding2 = bp;
      });
      PrimaryBond.recommendedDefaults.basePadding1 = bp;
      PrimaryBond.recommendedDefaults.basePadding2 = bp;
      props.app.drawingChangedNotByInteraction();
    }
  }
}

export function BasePaddingField(props: Props) {
  let bp = currBasePadding(props.primaryBonds);
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
          style={{ width: '36px' }}
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
