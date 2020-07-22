import * as React from 'react';
import { SketchPicker, ColorResult } from 'react-color';
import ColorSet from './ColorSet';
import RecentColorsList from './RecentColorsList';

export const PRESET_COLORS = new ColorSet([
  '#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505', '#BD10E0', '#9013FE',
  '#4A90E2', '#50E3C2', '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF',
]);

interface Props {
  name: string;
  initialValue?: string;
  set: (v: string) => void;
}

export class ColorField extends React.Component {
  static recentColors: RecentColorsList;
  
  props!: Props;
  state: {
    value: string;
    showPicker: boolean;
  }
  
  constructor(props: Props) {
    super(props);

    if (this.props.initialValue && !PRESET_COLORS.has(this.props.initialValue)) {
      ColorField.recentColors.push(this.props.initialValue);
    }

    this.state = {
      value: this.props.initialValue ?? '#000000',
      showPicker: false,
    };
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
        style={{ marginRight: '8px', fontSize: '12px' }}
      >
        {this.props.name + ':'}
      </p>
    );
  }

  currentColorDisplay(): React.ReactElement {
    return (
      <div
        onClick={() => this.togglePicker()}
        style={{
          padding: '5px',
          background: '#ffffff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.2)',
          display: 'inline-block',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '14px',
            borderRadius: '2px',
            background: this.state.value,
          }}
        ></div>
      </div>
    );
  }

  togglePicker() {
    this.setState({ showPicker: !this.state.showPicker });
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
          disableAlpha={true}
          presetColors={PRESET_COLORS.toArray().concat(ColorField.recentColors.slice())}
          color={this.state.value}
          onChange={color => this.onChange(color)}
        />
      </div>
    );
  }

  onChange(result: ColorResult) {
    let hex = result.hex.toLowerCase();
    if (hex.length == 4) {
      hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    this.setState({ value: hex });
  }

  closePicker() {
    if (!PRESET_COLORS.has(this.state.value)) {
      ColorField.recentColors.push(this.state.value);
    }
    this.setState({ showPicker: false });
    this.props.set(this.state.value);
  }
}

// this seems to be the default...
let colorsPerRow = 8;

let maxRecents = colorsPerRow + (colorsPerRow - (PRESET_COLORS.size % colorsPerRow));
ColorField.recentColors = new RecentColorsList(maxRecents);

export default ColorField;
