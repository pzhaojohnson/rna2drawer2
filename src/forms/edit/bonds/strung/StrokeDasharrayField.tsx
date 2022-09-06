import type { App } from 'App';

import * as SVG from '@svgdotjs/svg.js';

import { strokeDasharrayValueEqualsNone as equalsNone } from 'Values/svg/strokeDasharrayValueEqualsNone';

import type { StrungCircle } from 'Draw/bonds/strung/StrungElement';
import type { StrungTriangle } from 'Draw/bonds/strung/StrungElement';
import type { StrungRectangle } from 'Draw/bonds/strung/StrungElement';

import { svgElementOfStrungElement } from 'Forms/edit/bonds/strung/svgElementOfStrungElement';

import * as React from 'react';

// the underlying component
import { StrokeDasharrayField as _StrokeDasharrayField } from 'Forms/edit/svg/StrokeDasharrayField';

import { isString } from 'Values/isString';

/**
 * A value that the stroke-dasharray attribute of an SVG element can
 * have.
 */
type StrokeDasharrayValue = unknown;

/**
 * A value that the stroke-dasharray attribute of an SVG element can
 * have that is a string.
 */
type StringStrokeDasharrayValue = string;

/**
 * Returns the values that the stroke-dasharray attributes of the SVG
 * elements have.
 */
function strokeDasharrayValuesOf
(
  svgElements: SVG.Element[],
): StrokeDasharrayValue[]
{
  return svgElements.map(ele => ele.attr('stroke-dasharray'));
}

/**
 * Returns the values that the stroke-dasharray attributes of the SVG
 * elements have that are strings.
 */
function stringStrokeDasharrayValuesOf
(
  svgElements: SVG.Element[],
): StringStrokeDasharrayValue[]
{
  return strokeDasharrayValuesOf(svgElements).filter(isString);
}

/**
 * Should be updated on edit and persist between mountings and
 * unmountings.
 */
let defaultDashedValue = '3 1';

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;

  /**
   * The strung elements to edit.
   */
  strungElements: (
    StrungCircle
    | StrungTriangle
    | StrungRectangle
  )[];
};

export class StrokeDasharrayField extends React.Component<Props> {
  /**
   * Values cached in response to a before edit event.
   */
  _oldValues?: Set<StrokeDasharrayValue>;

  handleBeforeEdit() {
    let svgElements = this.props.strungElements.map(svgElementOfStrungElement);
    this._oldValues = new Set(strokeDasharrayValuesOf(svgElements));

    this.props.app.pushUndo();
  }

  handleEdit() {
    let svgElements = this.props.strungElements.map(svgElementOfStrungElement);
    // ignore nullish values
    let newValues = stringStrokeDasharrayValuesOf(svgElements);
    // remove old values
    newValues = newValues.filter(v => !this._oldValues?.has(v));

    if (newValues.length > 0 && !equalsNone(newValues[0])) {
      defaultDashedValue = newValues[0]; // update
    }

    this._oldValues = undefined; // reset

    this.props.app.refresh();
  }

  render() {
    let svgElements = this.props.strungElements.map(svgElementOfStrungElement);

    return (
      <_StrokeDasharrayField
        label='Dashed Line'
        elements={svgElements}
        defaultDashedValue={defaultDashedValue}
        onBeforeEdit={() => this.handleBeforeEdit()}
        onEdit={() => this.handleEdit()}
        style={{
          marginTop: '8px',
          minHeight: '22px',
          alignSelf: 'start',
        }}
      />
    );
  }
}
