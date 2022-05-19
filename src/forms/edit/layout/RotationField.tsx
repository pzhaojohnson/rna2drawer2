import type { App } from 'App';

import * as React from 'react';
import textFieldStyles from 'Forms/inputs/text/TextField.css';

import { radiansToDegrees } from 'Math/angles/degrees';
import { degreesToRadians } from 'Math/angles/degrees';
import { normalizeAngle } from 'Math/angles/normalize';
import { anglesAreClose } from 'Math/angles/close';
import { round } from 'Math/round';

import { isBlank } from 'Parse/isBlank';

export type Props = {
  app: App; // a reference to the whole app
}

type State = {
  value: string;
}

export class RotationField extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    let generalLayoutProps = props.app.strictDrawing.generalLayoutProps;
    let radians = generalLayoutProps.rotation;
    radians = normalizeAngle(radians, 0);
    let degrees = radiansToDegrees(radians);
    degrees = round(degrees, 2);

    this.state = {
      value: degrees + '\xB0',
    };
  }

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
        <input
          type='text'
          className={textFieldStyles.input}
          value={this.state.value}
          onChange={event => this.setState({ value: event.target.value })}
          onBlur={() => {
            this.submit();
            this.props.app.refresh();
          }}
          onKeyUp={event => {
            if (event.key.toLowerCase() == 'enter') {
              this.submit();
              this.props.app.refresh();
            }
          }}
          style={{ width: '32px' }}
        />
        <p
          className={`${textFieldStyles.label} unselectable`}
          style={{ marginLeft: '8px' }}
        >
          Rotation
        </p>
      </div>
    );
  }

  submit() {
    if (!isBlank(this.state.value)) {
      let degrees = Number.parseFloat(this.state.value);
      if (Number.isFinite(degrees)) {
        let radians = degreesToRadians(degrees);
        let generalLayoutProps = this.props.app.strictDrawing.generalLayoutProps;
        if (!anglesAreClose(radians, generalLayoutProps.rotation, 6)) {
          this.props.app.pushUndo();
          radians = normalizeAngle(radians, 0);
          radians = round(radians, 6);
          generalLayoutProps.rotation = radians;
          this.props.app.strictDrawing.updateLayout();
          this.props.app.refresh();
        }
      }
    }
  }
}
