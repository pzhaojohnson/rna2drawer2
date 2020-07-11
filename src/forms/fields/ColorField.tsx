import * as React from 'react';
import { CirclePicker, ColorResult } from 'react-color';

export const PRESET_COLORS = [
  '#4D4D4D', '#999999', '#E6E6E6', '#F44E3B', '#FE9200', '#FCDC00', '#DBDF00', '#A4DD00', '#68CCCA', '#73D8FF', '#AEA1FF', '#FDA1FF',
  '#333333', '#808080', '#CCCCCC', '#D33115', '#E27300', '#FCC400', '#B0BC00', '#68BC00', '#16A5A5', '#009CE0', '#7B64FF', '#FA28FF',
  '#000000', '#666666', '#B3B3B3', '#9F0500', '#C45100', '#FB9E00', '#808900', '#194D33', '#0C797D', '#0062B1', '#653294', '#AB149E',
];

interface Props {
  name: string;
  initialValue?: string;
  set: (v: string) => void;
}

export class ColorField extends React.Component {
  static customColors: string[];

  props!: Props;
  state: {
    showPicker: boolean;
  }
  
  constructor(props: Props) {
    super(props);

    let initialValue = this.props.initialValue ? this.props.initialValue.toUpperCase() : undefined;
    if (initialValue && !PRESET_COLORS.includes(initialValue)) {
      ColorField.customColors = ColorField.customColors.filter(c => c != initialValue);
      ColorField.customColors.unshift(initialValue);
    }

    this.state = {
      showPicker: false,
    };
  }

  render(): React.ReactElement {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
        {this.label()}
        {this.state.showPicker ? this.picker() : this.currentColorDisplay()}
      </div>
    );
  }

  label(): React.ReactElement {
    return (
      <p
        className={'unselectable-text'}
        onClick={() => this.state.showPicker ? this.togglePicker() : undefined}
        style={{
          marginRight: '8px',
          fontSize: '12px',
          color: this.state.showPicker ? 'blue' : 'black',
          cursor: this.state.showPicker ? 'pointer' : 'auto',
        }}
      >
        {this.state.showPicker ? <b>{this.props.name + ':'}</b> : this.props.name + ':'}
      </p>
    );
  }

  currentColorDisplay(): React.ReactElement {
    return (
      <div
        onClick={() => this.togglePicker()}
        style={{
          width: '16px',
          height: '16px',
          borderRadius: '8px',
          backgroundColor: this.props.initialValue ?? '#000000',
          cursor: 'pointer',
        }}
      ></div>
    );
  }

  togglePicker() {
    this.setState({ showPicker: !this.state.showPicker });
  }

  picker(): React.ReactElement {
    return (
      <CirclePicker
        colors={PRESET_COLORS.concat(ColorField.customColors)}
        width={'222px'}
        circleSize={12}
        circleSpacing={6}
        color={this.props.initialValue ?? '#000000'}
        onChangeComplete={(color, event) => this.onChangeComplete(color, event)}
      />
    );
  }

  onChangeComplete(color: ColorResult, event: React.ChangeEvent) {
    let hex = color.hex;
    if (hex.length == 4) {
      hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    hex = hex.toLowerCase();
    this.props.set(hex);
  }
}

ColorField.customColors = [];

export default ColorField;
