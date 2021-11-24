import * as React from 'react';
import { AppInterface as App } from 'AppInterface';
import { zoom, setZoom } from 'Draw/zoom';
import { round } from 'Math/round';

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
          margin: '0px',
          border: 'none',
          padding: '0px',
          width: (this.state.value.length + 1) + 'ch',
          fontFamily: "'Open Sans', sans-serif",
          fontSize: '12px',
          fontStyle: 'normal',
          fontWeight: 500,
          color: 'rgba(0, 0, 0, 0.95)',
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
