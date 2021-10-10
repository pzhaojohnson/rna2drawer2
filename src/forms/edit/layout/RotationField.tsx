import * as React from 'react';
import { useState } from 'react';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import errorMessageStyles from 'Forms/ErrorMessage.css';
import { AppInterface as App } from 'AppInterface';
import { radiansToDegrees, degreesToRadians } from 'Math/angles/degrees';
import { anglesAreClose } from 'Math/angles/close';
import { normalizeAngle } from 'Math/angles/normalize';
import { round } from 'Math/round';

function valueIsValid(value: string): boolean {
  let n = Number.parseFloat(value);
  return Number.isFinite(n);
}

function setRotationIfShould(app: App, value: string) {
  if (valueIsValid(value)) {
    let radians = degreesToRadians(Number.parseFloat(value));
    let generalLayoutProps = app.strictDrawing.generalLayoutProps();
    if (!anglesAreClose(radians, generalLayoutProps.rotation, 2)) {
      app.pushUndo();
      generalLayoutProps.rotation = normalizeAngle(radians, 0);
      app.strictDrawing.setGeneralLayoutProps(generalLayoutProps);
      app.strictDrawing.updateLayout();
      app.drawingChangedNotByInteraction();
    }
  }
}

export type Props = {
  app: App;
}

export function RotationField(props: Props) {
  let radians = props.app.strictDrawing.generalLayoutProps().rotation;
  let degrees = radiansToDegrees(radians);
  degrees = round(degrees, 2);
  let [value, setValue] = useState(degrees.toString());
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
        <input
          type='text'
          className={textFieldStyles.input}
          value={value}
          onChange={event => setValue(event.target.value)}
          onBlur={() => setRotationIfShould(props.app, value)}
          onKeyUp={event => {
            if (event.key.toLowerCase() == 'enter') {
              setRotationIfShould(props.app, value);
            }
          }}
          style={{ width: '36px' }}
        />
        <p
          className={`${textFieldStyles.label} unselectable`}
          style={{ marginLeft: '8px' }}
        >
          Rotation
        </p>
      </div>
      {valueIsValid(value) ? null : (
        <p
          key={Math.random()}
          className={`${errorMessageStyles.errorMessage} ${errorMessageStyles.fadesIn} unselectable`}
          style={{ marginTop: '3px' }}
        >
          Must be a number.
        </p>
      )}
    </div>
  );
}
