import type { App } from 'App';

import * as Zoom from 'Draw/zoom';

import * as React from 'react';

import styles from './ZoomInput.css';

import { isNullish } from 'Values/isNullish';

import { round } from 'Math/round';

import { measureTextWidth } from 'Utilities/measureTextWidth';

type Drawing = typeof App.prototype.drawing;

class DrawingWrapper {
  /**
   * The wrapped drawing.
   */
  readonly drawing: Drawing;

  constructor(drawing: Drawing) {
    this.drawing = drawing;
  }

  get zoom() {
    return Zoom.zoom(this.drawing.drawing);
  }

  /**
   * Does nothing if the provided value is nullish or nonfinite.
   */
  set zoom(zoom: ReturnType<typeof Zoom.zoom>) {
    if (isNullish(zoom) || !Number.isFinite(zoom)) {
      return;
    }

    Zoom.setZoom(this.drawing.drawing, zoom);
  }
}

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;
}

type State = {
  value: string;
}

export class ZoomInput extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    let drawing = new DrawingWrapper(props.app.drawing);
    let zoom = drawing.zoom;

    let value = ''; // default value

    if (typeof zoom == 'number' && Number.isFinite(zoom)) {
      let zoomPercentage = 100 * zoom;
      zoomPercentage = round(zoomPercentage, 0);
      value = zoomPercentage + '%';
    }

    this.state = { value };
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
        className={styles.zoomInput}
        value={this.state.value}
        onChange={event => {
          this.setState({ value: event.target.value });
        }}
        onFocus={event => {
          event.target.select();
        }}
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
          width: Math.ceil(width) + 'px',
          fontFamily,
          fontSize,
          fontStyle,
          fontWeight,
        }}
      />
    );
  }

  submit() {
    let zoomPercentage = Number.parseFloat(this.state.value);

    if (!Number.isFinite(zoomPercentage)) {
      return;
    }

    zoomPercentage = round(zoomPercentage, 0);

    // check after rounding
    if (zoomPercentage <= 0) {
      return;
    }

    // set zoom
    let drawing = new DrawingWrapper(this.props.app.drawing);
    let zoom = zoomPercentage / 100;
    zoom = round(zoom, 2);
    drawing.zoom = zoom;
  }
}
