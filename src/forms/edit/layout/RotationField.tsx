import * as React from 'react';
import NumberField from '../../fields/text/NumberField';
import App from '../../../App';
import normalizeAngle from '../../../draw/normalizeAngle';
import degreesAreClose from './degreesAreClose';

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
          let generalProps = app.strictDrawing.generalLayoutProps();
          let currRotation = generalProps.rotation * 360 / (2 * Math.PI);
          if (!degreesAreClose(r, currRotation, 2)) {
            app.pushUndo();
            r *= (2 * Math.PI) / 360;
            r = normalizeAngle(r);
            generalProps.rotation = r;
            app.strictDrawing.setGeneralLayoutProps(generalProps);
            app.strictDrawing.applyLayout();
            app.drawingChangedNotByInteraction();
          }
        }}
        minLabelWidth={'64px'}
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
