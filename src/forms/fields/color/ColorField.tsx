import * as React from 'react';
import styles from './ColorField.css';
import { SketchPicker, ColorResult } from 'react-color';
import ColorSet from './ColorSet';
import RecentColorsList from './RecentColorsList';
import * as Svg from '@svgdotjs/svg.js';

export const PRESET_COLORS = new ColorSet([
  '#800000', '#FF0000', '#F5A623', '#FFF000', '#C56200', '#8B572A', '#194D33', '#228B22',
  '#7ED321', '#B8E986', '#FDA1FF', '#BD10E0', '#9013FE', '#4A148C', '#111DD6', '#009CE0',
  '#73D8FF', '#50E3C2', '#000000', '#4A4A4A', '#9B9B9B', '#D3D3D3', '#FFFFFF',
]);

export interface ColorAndOpacity {
  color: string;
  opacity: number;
}

interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

function toRgba(co: ColorAndOpacity): Rgba {
  let c = new Svg.Color(co.color);
  let rgb = c.rgb();
  return { r: rgb.r, g: rgb.g, b: rgb.b, a: co.opacity };
}

function toRgbaString(co: ColorAndOpacity): string {
  let rgba = toRgba(co);
  return 'rgba(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ',' + rgba.a + ')';
}

interface Props {
  name: string;
  initialValue?: ColorAndOpacity;
  set: (v: ColorAndOpacity) => void;
  disableAlpha?: boolean;
}

export class ColorField extends React.Component {
  static recentColors: RecentColorsList;

  props!: Props;
  state: {
    value: ColorAndOpacity;
    showPicker: boolean;
  }
  _changedSinceOpening: boolean;

  constructor(props: Props) {
    super(props);

    if (this.props.initialValue && !PRESET_COLORS.has(this.props.initialValue.color)) {
      ColorField.recentColors.push(this.props.initialValue.color);
    }

    this.state = {
      value: this.props.initialValue ?? { color: '#e5e5e5', opacity: 1 },
      showPicker: false,
    };

    this._changedSinceOpening = false;
  }

  render(): React.ReactElement {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
        {this.label()}
        <div>
          {this.currentColorDisplay()}
          {this.state.showPicker ? this.picker() : null}
        </div>
      </div>
    );
  }

  label(): React.ReactElement {
    return (
      <p
        className={'unselectable-text'}
        style={{ marginRight: '12px', fontSize: '12px' }}
      >
        {this.props.name + ':'}
      </p>
    );
  }

  currentColorDisplay(): React.ReactElement {
    return (
      <div
        className={styles.currentColorDisplay}
        onClick={() => this.togglePicker()}
        style={{
          padding: '4px',
          background: '#ffffff',
          borderRadius: '2px',
          display: 'inline-block',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '12px',
            borderRadius: '2px',
            background: toRgbaString(this.state.value),
          }}
        ></div>
      </div>
    );
  }

  togglePicker() {
    let showPicker = !this.state.showPicker;
    if (showPicker) {
      this._changedSinceOpening = false;
    }
    this.setState({ showPicker: showPicker });
  }

  picker(): React.ReactElement {
    return (
      <div style={{ position: 'absolute', zIndex: 2 }} >
        <div
          onClick={() => this.closePicker()}
          style={{
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
          }}
        ></div>
        <SketchPicker
          presetColors={PRESET_COLORS.toArray().concat(ColorField.recentColors.slice())}
          disableAlpha={this.props.disableAlpha}
          color={toRgba(this.state.value)}
          onChange={color => this.onChange(color)}
        />
      </div>
    );
  }

  onChange(result: ColorResult) {
    this._changedSinceOpening = true;
    let rgb = result.rgb;
    let c = new Svg.Color(rgb.r, rgb.g, rgb.b, 'rgb');
    let hex = c.toHex();
    if (hex.length == 4) {
      hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    this.setState({ value: { color: hex, opacity: result.rgb.a } });
  }

  closePicker() {
    if (!PRESET_COLORS.has(this.state.value.color)) {
      ColorField.recentColors.push(this.state.value.color);
    }
    this.setState({ showPicker: false });
    if (this._changedSinceOpening) {
      this.props.set(this.state.value);
    }
  }
}

// this seems to be the default...
let colorsPerRow = 8;

let maxRecents = (2 * colorsPerRow) + (colorsPerRow - (PRESET_COLORS.size % colorsPerRow));
ColorField.recentColors = new RecentColorsList(maxRecents);

export default ColorField;
