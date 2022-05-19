import type { App } from 'App';

import * as React from 'react';
import { TextInputField } from 'Forms/inputs/text/TextInputField';

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
    degrees = round(degrees, 1);

    this.state = {
      value: degrees + '\xB0',
    };
  }

  render() {
    return (
      <TextInputField
        label='Rotation'
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
        input={{
          style: { width: '6ch' },
        }}
        style={{ alignSelf: 'start' }}
      />
    );
  }

  submit() {
    if (isBlank(this.state.value)) {
      return;
    }

    let degrees = Number.parseFloat(this.state.value);
    if (!Number.isFinite(degrees)) {
      return;
    }

    let radians = degreesToRadians(degrees);

    let strictDrawing = this.props.app.strictDrawing;
    if (anglesAreClose(radians, strictDrawing.generalLayoutProps.rotation, 6)) {
      return;
    }

    this.props.app.pushUndo();
    radians = normalizeAngle(radians, 0);
    radians = round(radians, 6);
    strictDrawing.generalLayoutProps.rotation = radians;
    strictDrawing.updateLayout();
    this.props.app.refresh();
  }
}
