import * as SVG from '@svgdotjs/svg.js';
import { fontWeightValueToNumber } from 'Draw/svg/fontWeightValueToNumber';

import { NumbersWrapper } from 'Values/NumbersWrapper';

import * as React from 'react';

export type Nullish = null | undefined;

export type EditEvent = {
  /**
   * The new font weight value for the elements.
   */
  newValue: number;

  /**
   * The previous font weight value for the elements.
   *
   * Is nullish if not all elements had the same font weight previously.
   */
  oldValue: number | Nullish;
};

export type Props = {
  /**
   * The elements to edit.
   */
  elements?: SVG.Element[];

  /**
   * Called immediately after changing the font weights of the elements.
   */
  onEdit?: (event: EditEvent) => void;

  /**
   * Called immediately before changing the font weights of the
   * elements.
   */
  onBeforeEdit?: (event: EditEvent) => void;

  style?: React.CSSProperties;
};

/**
 * Currently is just a checkbox that controls whether or not the font
 * weight is bold.
 */
export class FontWeightInput extends React.Component<Props> {
  /**
   * The current font weight of the elements.
   *
   * Is nullish if not all elements have the same font weight.
   */
  get oldValue(): number | Nullish {
    if (!this.props.elements) {
      return undefined;
    }

    let values = this.props.elements.map(ele => ele.attr('font-weight'));
    let numbers = new NumbersWrapper(values.map(fontWeightValueToNumber));
    return numbers.commonValue;
  }

  render() {
    return (
      <input
        type='checkbox'
        checked={this.oldValue == 700}
        onChange={event => this.handleChange(event)}
        style={this.props.style}
      />
    );
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!this.props.elements) {
      return;
    }

    let newValue = event.target.checked ? 700 : 400;
    let oldValue = this.oldValue;

    let editEvent = { newValue, oldValue };
    if (this.props.onBeforeEdit) {
      this.props.onBeforeEdit(editEvent);
    }
    this.props.elements.forEach(ele => {
      ele.attr('font-weight', newValue);
    });
    if (this.props.onEdit) {
      this.props.onEdit(editEvent);
    }
  }
}
