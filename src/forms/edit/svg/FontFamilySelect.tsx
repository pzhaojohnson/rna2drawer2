import * as SVG from '@svgdotjs/svg.js';
import { SVGElementsWrapper } from 'Draw/svg/SVGElementsWrapper';

import * as React from 'react';

// the underlying font family select component
import { FontFamilySelect as _FontFamilySelect } from 'Forms/inputs/font/FontFamilySelect';
import { ChangeEvent } from 'Forms/inputs/font/FontFamilySelect';

export type Nullish = null | undefined;

export type EditEvent = {
  /**
   * The new value that the font family attribute of the elements was or
   * will be set to.
   */
  newValue: string;

  /**
   * The previous value for the font family attribute of the elements.
   *
   * Is nullish if not all elements had the same value for the font
   * family attribute.
   */
  oldValue: string | Nullish;
};

export type Props = {
  /**
   * The elements to edit.
   */
  elements?: SVG.Element[];

  /**
   * Called immediately after changing the font family attribute for the
   * elements.
   */
  onEdit?: (event: EditEvent) => void;

  /**
   * Called immediately before changing the font family attribute for
   * the elements.
   */
  onBeforeEdit?: (event: EditEvent) => void;
};

export class FontFamilySelect extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  /**
   * The current value of the font family attribute for the elements.
   *
   * Is undefined if not all elements have the same value for the font
   * family attribute.
   */
  get oldValue(): string | undefined {
    if (!this.props.elements) {
      return undefined;
    }

    let eles = new SVGElementsWrapper(this.props.elements);
    let oldValue = eles.getAttribute('font-family');
    return typeof oldValue == 'string' ? oldValue : undefined;
  }

  render() {
    return (
      <_FontFamilySelect
        value={this.oldValue}
        onChange={event => this.handleChange(event)}
      />
    );
  }

  handleChange(event: ChangeEvent) {
    if (!this.props.elements) {
      return;
    }

    let newValue = event.target.value;
    let oldValue = this.oldValue;

    if (newValue == oldValue) {
      return;
    }

    let editEvent = { newValue, oldValue };
    if (this.props.onBeforeEdit) {
      this.props.onBeforeEdit(editEvent);
    }
    this.props.elements.forEach(ele => {
      ele.attr('font-family', newValue);
    });
    if (this.props.onEdit) {
      this.props.onEdit(editEvent);
    }
  }
}
