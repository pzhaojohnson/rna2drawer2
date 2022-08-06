import * as SVG from '@svgdotjs/svg.js';
import { ColorValuesWrapper } from 'Values/svg/ColorValuesWrapper';
import { colorsAreEqual } from 'Draw/svg/colorsAreEqual';

import * as React from 'react';

import { ColorPicker } from 'Forms/inputs/color/ColorPicker';
import { CloseEvent } from 'Forms/inputs/color/ColorPicker';

export type ColorAttributeName = (
  'fill'
  | 'stroke'
);

export type EditEvent = {
  /**
   * The new color that the attribute was or will be set to.
   */
  newValue: SVG.Color;

  /**
   * The previous color for the attribute.
   *
   * Is undefined if not all elements had the same color for the
   * attribute.
   */
  oldValue: SVG.Color | undefined;
};

export type Props = {
  /**
   * The elements to edit.
   */
  elements?: SVG.Element[];

  /**
   * The name of the attribute to edit.
   */
  attributeName?: ColorAttributeName;

  /**
   * Called immediately after changing the attribute for the elements.
   */
  onEdit?: (event: EditEvent) => void;

  /**
   * Called immediately before changing the attribute for the elements.
   */
  onBeforeEdit?: (event: EditEvent) => void;
};

/**
 * This component assumes that the specified attribute for the elements
 * has color values.
 */
export class ColorAttributePicker extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  /**
   * The current color that the attribute is set to for the elements.
   */
  get oldValue(): SVG.Color | undefined {
    if (!this.props.elements || !this.props.attributeName) {
      return undefined;
    }

    let attributeName = this.props.attributeName;

    let values = new ColorValuesWrapper(
      this.props.elements.map(ele => ele.attr(attributeName))
    );

    return values.commonValue;
  }

  render() {
    return (
      <ColorPicker
        value={this.oldValue}
        onClose={this.handleClose}
        disableAlpha={true}
      />
    );
  }

  handleClose(event: CloseEvent) {
    if (!this.props.elements || !this.props.attributeName) {
      return;
    } else if (!event.target.value) {
      return;
    }

    let newValue = event.target.value.color;
    let oldValue = this.oldValue;

    if (oldValue && colorsAreEqual(newValue, oldValue)) {
      return;
    }

    let editEvent = { newValue, oldValue };
    if (this.props.onBeforeEdit) {
      this.props.onBeforeEdit(editEvent);
    }
    let attributeName = this.props.attributeName;
    let newValueHexCode = newValue.toHex();
    this.props.elements.forEach(ele => {
      ele.attr(attributeName, newValueHexCode);
    });
    if (this.props.onEdit) {
      this.props.onEdit(editEvent);
    }
  }
}
