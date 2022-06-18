import * as React from 'react';
import { TextInputField } from 'Forms/inputs/text/TextInputField';
import type { App } from 'App';
import { round } from 'Math/round';

import { isDot } from 'Draw/bonds/straight/dotify';
import { isSquare } from 'Draw/bonds/straight/dotify';
import { dotify } from 'Draw/bonds/straight/dotify';
import { squarify } from 'Draw/bonds/straight/dotify';

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

    let generalLayoutProps = props.app.strictDrawing.generalLayoutProps;
    let bs = generalLayoutProps.basePairBondLength;
    bs = round(bs, 2);

    this.state = {
      value: bs.toString(),
    };
  }

  render() {
    return (
      <TextInputField
        label='Base Spacing'
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
        style={{ margin: '10px 0 0 10px', alignSelf: 'start' }}
      />
    );
  }

  submit() {
    if (isBlank(this.state.value)) {
      return;
    }

    let bs = Number.parseFloat(this.state.value);
    if (!Number.isFinite(bs)) {
      return;
    }

    let generalLayoutProps = this.props.app.strictDrawing.generalLayoutProps;
    if (bs == generalLayoutProps.basePairBondLength) {
      return;
    }

    this.props.app.pushUndo();

    let secondaryBonds = this.props.app.strictDrawing.drawing.secondaryBonds;
    let dotSecondaryBonds = secondaryBonds.filter(bond => isDot(bond));
    let squareSecondaryBonds = secondaryBonds.filter(bond => isSquare(bond));

    bs = constrainBaseSpacing(bs);
    bs = round(bs, 2);
    generalLayoutProps.basePairBondLength = bs;
    this.props.app.strictDrawing.updateLayout();

    dotSecondaryBonds.forEach(bond => dotify(bond));
    squareSecondaryBonds.forEach(bond => squarify(bond));

    this.props.app.refresh();
  }
}
