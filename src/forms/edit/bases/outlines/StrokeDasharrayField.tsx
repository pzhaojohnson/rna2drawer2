import type { App } from 'App';

import { CircleBaseAnnotation as BaseOutline } from 'Draw/bases/annotate/circle/CircleBaseAnnotation';

import { strokeDasharrayValueEqualsNone as equalsNone } from 'Values/svg/strokeDasharrayValueEqualsNone';

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
 * Returns the stroke-dasharray values of the base outline circle
 * elements.
 */
function valuesOf(outlines: BaseOutline[]): StrokeDasharrayValue[] {
  return outlines.map(o => o.circle.attr('stroke-dasharray'));
}

/**
 * Returns the stroke-dasharray values of the base outline circle
 * elements that are strings.
 */
function stringValuesOf
(
  outlines: BaseOutline[],
): StringStrokeDasharrayValue[]
{
  return valuesOf(outlines).filter(isString);
}

// should persist between mountings and unmountings
let defaultDashedValue = '3 1';

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;

  /**
   * The base outlines to edit.
   */
  outlines: BaseOutline[];
};

export class StrokeDasharrayField extends React.Component<Props> {
  /**
   * Values cached in response to a before edit event.
   */
  _oldValues?: Set<StrokeDasharrayValue>;

  handleBeforeEdit() {
    this._oldValues = new Set(valuesOf(this.props.outlines));

    this.props.app.pushUndo();
  }

  handleEdit() {
    // ignore nullish values
    let newValues = stringValuesOf(this.props.outlines);
    // remove old values
    newValues = newValues.filter(v => !this._oldValues?.has(v));

    if (newValues.length > 0 && !equalsNone(newValues[0])) {
      defaultDashedValue = newValues[0]; // cache
    }

    this.props.app.refresh(); // refresh after updating all values
  }

  render() {
    return (
      <_StrokeDasharrayField
        label='Dashed Line'
        elements={this.props.outlines.map(o => o.circle)}
        defaultDashedValue={defaultDashedValue}
        onBeforeEdit={() => this.handleBeforeEdit()}
        onEdit={() => this.handleEdit()}
        style={{
          marginTop: '10px',
          minHeight: '22px',
          alignSelf: 'start',
        }}
      />
    );
  }
}
