import * as React from 'react';
import { useState } from 'react';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import errorMessageStyles from 'Forms/ErrorMessage.css';
import { AppInterface as App } from 'AppInterface';
import { StrictDrawingInterface as StrictDrawing } from 'Draw/StrictDrawingInterface';
import { round } from 'Math/round';

export type Props = {
  app: App;
}

function currBaseSpacing(strictDrawing: StrictDrawing): number {
  return round(
    strictDrawing.generalLayoutProps().basePairBondLength,
    2,
  );
}

function valueIsValid(value: string): boolean {
  let n = Number.parseFloat(value);
  return Number.isFinite(n) && n >= 0;
}

function valueIsBlank(value: string): boolean {
  return value.trim().length == 0;
}

function setBaseSpacingIfShould(props: Props, value: string) {
  if (valueIsValid(value)) {
    let bs = Number.parseFloat(value);
    if (bs != currBaseSpacing(props.app.strictDrawing)) {
      props.app.pushUndo();
      let generalLayoutProps = props.app.strictDrawing.generalLayoutProps();
      generalLayoutProps.basePairBondLength = bs;
      props.app.strictDrawing.setGeneralLayoutProps(generalLayoutProps);
      props.app.strictDrawing.updateLayout();
      props.app.drawingChangedNotByInteraction();
    }
  }
}

export function BaseSpacingField(props: Props) {
  let [value, setValue] = useState(currBaseSpacing(props.app.strictDrawing).toString());
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
        <input
          type='text'
          className={textFieldStyles.input}
          value={value}
          onChange={event => setValue(event.target.value)}
          onBlur={() => setBaseSpacingIfShould(props, value)}
          onKeyUp={event => {
            if (event.key.toLowerCase() == 'enter') {
              setBaseSpacingIfShould(props, value);
            }
          }}
          style={{ width: '32px' }}
        />
        <p
          className={`${textFieldStyles.label} unselectable`}
          style={{ marginLeft: '8px' }}
        >
          Base Spacing
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
