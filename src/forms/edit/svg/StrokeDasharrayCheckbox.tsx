import * as SVG from '@svgdotjs/svg.js';
import { strokeDasharrayValueEqualsNone as equalsNone } from 'Values/svg/strokeDasharrayValueEqualsNone';

import * as React from 'react';

/**
 * A value that the stroke-dasharray attribute of an SVG element can
 * have.
 */
export type StrokeDasharrayValue = string;

export type EditEvent = {
  /**
   * The new value assigned to the stroke-dasharray attributes of at
   * least some of the provided SVG elements.
   *
   * Not all of the provided SVG elements may have been edited since
   * this checkbox component will not override preexisting dashed values
   * when checked (i.e., when the new value is also a dashed value).
   */
  newValue: StrokeDasharrayValue;

  /**
   * The SVG elements that were edited.
   *
   * (Is a subset of the provided SVG elements.)
   */
  elements: SVG.Element[];
};

export type Props = {
  id?: string;

  /**
   * The SVG elements to edit.
   */
  elements?: SVG.Element[];

  /**
   * The value that is assigned to the stroke-dasharray attributes of
   * the elements when the checkbox is checked.
   *
   * Preexisting dashed values assigned to the stroke-dasharray
   * attributes of the elements are not overridden (i.e., this value is
   * only assigned to the elements whose stroke-dasharray attributes
   * previously had undashed values.)
   *
   * When left unspecified, the string "3 1" is used in its place.
   */
  defaultDashedValue?: StrokeDasharrayValue;

  /**
   * Called immediately after changing the stroke-dasharray attributes
   * of the elements.
   */
  onEdit?: (event: EditEvent) => void;

  /**
   * Called immediately before changing the stroke-dasharray values of
   * the elements.
   */
  onBeforeEdit?: () => void;

  style?: React.CSSProperties;
};

/**
 * Allows the stroke-dasharray attributes of the provided SVG elements
 * to be toggled between dashed and undashed values.
 */
export class StrokeDasharrayCheckbox extends React.Component<Props> {
  get checked(): boolean {
    if (!this.props.elements || this.props.elements.length == 0) {
      return false;
    }

    let values = this.props.elements.map(ele => ele.attr('stroke-dasharray'));
    return !values.some(equalsNone);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!this.props.elements || this.props.elements.length == 0) {
      return;
    }

    // use the string "3 1" if not provided as a prop
    let defaultDashedValue = this.props.defaultDashedValue ?? '3 1';

    let newValue = event.target.checked ? defaultDashedValue : 'none';
    let editEvent: EditEvent = { newValue, elements: [] };

    if (this.props.onBeforeEdit) {
      this.props.onBeforeEdit();
    }
    this.props.elements.forEach(ele => {
      let oldValue: unknown = ele.attr('stroke-dasharray');
      // don't replace a dashed value with another dashed value
      if (equalsNone(oldValue) || equalsNone(newValue)) {
        ele.attr('stroke-dasharray', newValue);
        editEvent.elements.push(ele);
      }
    });
    if (this.props.onEdit) {
      this.props.onEdit(editEvent);
    }
  }

  render() {
    return (
      <input
        type='checkbox'
        id={this.props.id}
        checked={this.checked}
        onChange={event => this.handleChange(event)}
        style={this.props.style}
      />
    );
  }
}
