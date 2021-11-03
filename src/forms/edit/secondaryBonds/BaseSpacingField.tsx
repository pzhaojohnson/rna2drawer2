import * as React from 'react';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import { AppInterface as App } from 'AppInterface';
import { round } from 'Math/round';

export type Props = {
  app: App;
}

type Value = string;

type State = {
  value: Value;
}

function isBlank(v: Value): boolean {
  return v.trim().length == 0;
}

function constrainBaseSpacing(bs: number): number {
  if (!Number.isFinite(bs)) {
    return 0;
  } else if (bs < 0) {
    return 0;
  } else {
    return bs;
  }
}

export class BaseSpacingField extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    let generalLayoutProps = props.app.strictDrawing.generalLayoutProps();
    let bs = generalLayoutProps.basePairBondLength;
    bs = round(bs, 2);

    this.state = {
      value: bs.toString(),
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
          Base Spacing
        </p>
      </div>
    );
  }

  submit() {
    if (!isBlank(this.state.value)) {
      let bs = Number.parseFloat(this.state.value);
      if (Number.isFinite(bs)) {
        let generalLayoutProps = this.props.app.strictDrawing.generalLayoutProps();
        if (bs != generalLayoutProps.basePairBondLength) {
          this.props.app.pushUndo();
          bs = constrainBaseSpacing(bs);
          bs = round(bs, 2);
          generalLayoutProps.basePairBondLength = bs;
          this.props.app.strictDrawing.setGeneralLayoutProps(generalLayoutProps);
          this.props.app.strictDrawing.updateLayout();
          this.props.app.drawingChangedNotByInteraction();
        }
      }
    }
  }
}
