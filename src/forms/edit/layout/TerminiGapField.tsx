import * as React from 'react';
import { useState } from 'react';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import errorMessageStyles from 'Forms/ErrorMessage.css';
import { AppInterface as App } from 'AppInterface';

function valueIsValid(value: string): boolean {
  let n = Number.parseFloat(value);
  return Number.isFinite(n) && n >= 0;
}

function setTerminiGapIfShould(app: App, value: string) {
  if (valueIsValid(value)) {
    let n = Number.parseFloat(value);
    let generalLayoutProps = app.strictDrawing.generalLayoutProps();
    if (n != generalLayoutProps.terminiGap) {
      app.pushUndo();
      generalLayoutProps.terminiGap = n;
      app.strictDrawing.setGeneralLayoutProps(generalLayoutProps);
      app.strictDrawing.updateLayout();
      app.drawingChangedNotByInteraction();
    }
  }
}

export type Props = {
  app: App;
}

export function TerminiGapField(props: Props) {
  let [value, setValue] = useState(props.app.strictDrawing.generalLayoutProps().terminiGap.toString());
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
        <input
          type='text'
          className={textFieldStyles.input}
          value={value}
          onChange={event => setValue(event.target.value)}
          onBlur={() => setTerminiGapIfShould(props.app, value)}
          onKeyUp={event => {
            if (event.key.toLowerCase() == 'enter') {
              setTerminiGapIfShould(props.app, value);
            }
          }}
          style={{ width: '36px' }}
        />
        <p
          className={`${textFieldStyles.label} unselectable`}
          style={{ marginLeft: '8px' }}
        >
          Termini Gap
        </p>
      </div>
      {valueIsValid(value) ? null : (
        <p
          key={Math.random()}
          className={`${errorMessageStyles.errorMessage} ${errorMessageStyles.fadesIn}`}
          style={{ marginTop: '3px' }}
        >
          Must be a nonnegative number.
        </p>
      )}
    </div>
  );
}
