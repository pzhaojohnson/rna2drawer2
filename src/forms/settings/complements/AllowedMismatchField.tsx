import * as React from 'react';
import { useState } from 'react';
import { AppInterface as App } from 'AppInterface';
import { round } from 'Math/round';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import errorMessageStyles from 'Forms/ErrorMessage.css';

function allowedMismatchPercentage(app: App): string {
  let n = 100 * app.strictDrawingInteraction.foldingMode.allowedMismatch;
  n = round(n, 2);
  return n.toString();
}

function valueIsValid(value: string): boolean {
  let n = Number.parseFloat(value);
  return Number.isFinite(n) && n >= 0 && n <= 100;
}

function setAllowedMismatchPercentageIfShould(app: App, value: string) {
  if (valueIsValid(value) && value != allowedMismatchPercentage(app)) {
    app.strictDrawingInteraction.foldingMode.allowedMismatch = Number.parseFloat(value) / 100;
    app.renderPeripherals();
  }
}

export type Props = {
  app: App;
}

export function AllowedMismatchField(props: Props) {
  let [value, setValue] = useState(allowedMismatchPercentage(props.app));
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
        <input
          type='text'
          className={textFieldStyles.input}
          value={value}
          onChange={event => setValue(event.target.value)}
          onBlur={() => setAllowedMismatchPercentageIfShould(props.app, value)}
          onKeyUp={event => {
            if (event.key.toLowerCase() == 'enter') {
              setAllowedMismatchPercentageIfShould(props.app, value);
            }
          }}
          spellCheck='false'
          style={{ width: '28px', textAlign: 'left', display: 'inline-block' }}
        />
        <p
          className={`${textFieldStyles.label} unselectable`}
          style={{ marginLeft: '6px' }}
        >
          % Mismatch Allowed
        </p>
      </div>
      {valueIsValid(value) ? null : (
        <p
          key={Math.random()}
          className={`${errorMessageStyles.errorMessage} ${errorMessageStyles.fadesIn} unselectable`}
          style={{ marginTop: '3px' }}
        >
          Must be between 0% and 100%.
        </p>
      )}
    </div>
  );
}
