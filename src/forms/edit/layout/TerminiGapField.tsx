import * as React from 'react';
import NonnegativeNumberField from '../../fields/text/NonnegativeNumberField';
import App from '../../../App';
import areClose from '../../../draw/areClose';

interface Props {
  currTerminiGap: number;
  setTerminiGap: (tg: number) => void;
  minLabelWidth?: string;
}

export class TerminiGapField extends React.Component {
  props!: Props;

  static create(app: App): React.ReactElement {
    let currTerminiGap = app.strictDrawing.generalLayoutProps().terminiGap;
    currTerminiGap = Number.parseFloat(currTerminiGap.toFixed(2));
    return (
      <TerminiGapField
        currTerminiGap={currTerminiGap}
        setTerminiGap={(tg: number) => {
          let generalProps = app.strictDrawing.generalLayoutProps();
          if (!areClose(tg, generalProps.terminiGap, 2)) {
            app.pushUndo();
            generalProps.terminiGap = tg;
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
      <NonnegativeNumberField
        name={'Termini Gap'}
        initialValue={this.props.currTerminiGap}
        set={(n: number) => this.props.setTerminiGap(n)}
        minLabelWidth={this.props.minLabelWidth}
      />
    );
  }
}

export default TerminiGapField;
