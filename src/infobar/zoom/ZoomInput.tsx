import * as React from 'react';
import type { App } from 'App';
import { zoom, setZoom } from 'Draw/zoom';
import { round } from 'Math/round';
import { measureTextWidth } from 'Utilities/measureTextWidth';

export type Props = {
  app: App;
}

// a zoom percentage
type Value = string;

type State = {
  value: Value;
}

export class ZoomInput extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    let drawing = props.app.strictDrawing.drawing;
    let z = zoom(drawing);

    let value = '';

    if (typeof z == 'number' && Number.isFinite(z)) {
      let v = 100 * z;
      v = round(v, 0);
      value = v + '%';
    }

    this.state = {
      value: value,
    };
  }

  render() {
    let fontFamily = '"Open Sans", sans-serif';
    let fontSize = '12px';
    let fontStyle = 'normal';
    let fontWeight = '600';

    let width = measureTextWidth({
      text: this.state.value,
      fontFamily, fontSize, fontStyle, fontWeight,
    });

    return (
      <input
        type='text'
        value={this.state.value}
        onChange={event => this.setState({ value: event.target.value })}
        onFocus={event => event.target.select()}
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
        style={{
          margin: '0px 1px', // margins are nonzero by default for Safari
          border: 'none',
          padding: '1px 2px',
          width: Math.ceil(width) + 'px',
          fontFamily,
          fontSize,
          fontStyle,
          fontWeight,
          color: '#28282b',
          textAlign: 'center',
        }}
      />
    );
  }

  submit() {
    let v = Number.parseFloat(this.state.value);

    if (!Number.isFinite(v)) {
      return;
    }

    v = round(v, 0);

    // check after rounding
    if (v <= 0) {
      return;
    }

    // set zoom
    let drawing = this.props.app.strictDrawing.drawing;
    let z = v / 100;
    z = round(z, 2);
    setZoom(drawing, z);
  }
}
