import * as React from 'react';
import NumberField from '../../fields/text/NumberField';
import App from '../../../App';
import normalizeAngle from '../../../draw/normalizeAngle';
import anglesAreClose from '../../../draw/anglesAreClose';

interface Props {
  currRotation: number;
  setRotation: (r: number) => void;
  minLabelWidth?: string;
}

export class RotationField extends React.Component {
  props!: Props;

  static create(app: App): React.ReactElement {
    let currRotation = app.strictDrawing.generalLayoutProps().rotation;
    currRotation = normalizeAngle(currRotation);
    currRotation *= 360 / (2 * Math.PI);
    currRotation = Number.parseFloat(currRotation.toFixed(2));
    return (
      <RotationField
        currRotation={currRotation}
        setRotation={(r: number) => {
          r *= (2 * Math.PI) / 360;
          r = normalizeAngle(r);
          let generalProps = app.strictDrawing.generalLayoutProps();
          let currRotation = generalProps.rotation;
          if (!anglesAreClose(r, currRotation)) {
            app.pushUndo();
            generalProps.rotation = r;
            app.strictDrawing.setGeneralLayoutProps(generalProps);
            app.drawingChangedNotByInteraction();
          }
        }}
      />
    );
  }

  render(): React.ReactElement {
    return (
      <NumberField
        name={'Rotation'}
        initialValue={this.props.currRotation}
        set={(r: number) => this.props.setRotation(r)}
        minLabelWidth={this.props.minLabelWidth}
      />
    );
  }
}

export default RotationField;
