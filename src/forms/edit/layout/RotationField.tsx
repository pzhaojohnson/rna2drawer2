import * as React from 'react';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import { AppInterface as App } from 'AppInterface';
import { radiansToDegrees, degreesToRadians } from 'Math/angles/degrees';
import { normalizeAngle } from 'Math/angles/normalize';
import { anglesAreClose } from 'Math/angles/close';
import { round } from 'Math/round';

export type Props = {
  app: App;
}

type Value = string;

type State = {
  value: Value;
}

const precision = 2;

function isBlank(v: Value): boolean {
  return v.trim().length == 0;
}

export class RotationField extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    let generalLayoutProps = props.app.strictDrawing.generalLayoutProps();
    let radians = generalLayoutProps.rotation;
    radians = normalizeAngle(radians, 0);
    let degrees = radiansToDegrees(radians);
    degrees = round(degrees, precision);

    this.state = {
      value: degrees.toString(),
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
            this.props.app.drawingChangedNotByInteraction();
          }}
          onKeyUp={event => {
            if (event.key.toLowerCase() == 'enter') {
              this.submit();
              this.props.app.drawingChangedNotByInteraction();
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
        let generalLayoutProps = this.props.app.strictDrawing.generalLayoutProps();
        if (!anglesAreClose(radians, generalLayoutProps.rotation, precision)) {
          this.props.app.pushUndo();
          radians = normalizeAngle(radians, 0);
          radians = round(radians, precision);
          generalLayoutProps.rotation = radians;
          this.props.app.strictDrawing.setGeneralLayoutProps(generalLayoutProps);
          this.props.app.strictDrawing.updateLayout();
          this.props.app.drawingChangedNotByInteraction();
        }
      }
    }
  }
}
