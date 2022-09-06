import type { App } from 'App';

import { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';

import { strokeDasharrayValueEqualsNone as equalsNone } from 'Values/svg/strokeDasharrayValueEqualsNone';

import * as React from 'react';

// the underlying component
import { StrokeDasharrayField as _StrokeDasharrayField } from 'Forms/edit/svg/StrokeDasharrayField';

import { isNullish } from 'Values/isNullish';
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
 * The most recent default dashed value.
 */
let lastDefaultDashedValue: StringStrokeDasharrayValue = '3 1';

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;

  /**
   * The primary bonds to edit.
   */
  primaryBonds: PrimaryBond[];
};

export class StrokeDasharrayField extends React.Component<Props> {
  /**
   * Values cached in reponse to a before edit event.
   */
  _oldValues?: Set<StrokeDasharrayValue>;

  /**
   * The stroke-dasharray values of the primary bond line elements.
   */
  get values(): StrokeDasharrayValue[] {
    let primaryBonds = this.props.primaryBonds;
    return primaryBonds.map(pb => pb.line.attr('stroke-dasharray'));
  }

  /**
   * The stroke-dasharray values of the primary bond line elements that
   * are strings.
   */
  get stringValues(): StringStrokeDasharrayValue[] {
    return this.values.filter(isString);
  }

  /**
   * The default value for the stroke-dasharray attribute of the primary
   * bond line elements.
   */
  get defaultValue(): StringStrokeDasharrayValue | undefined {
    return PrimaryBond.recommendedDefaults.line['stroke-dasharray'];
  }

  get defaultDashedValue(): StringStrokeDasharrayValue {
    let defaultValue = this.defaultValue;

    return !isNullish(defaultValue) && !equalsNone(defaultValue) ? (
      defaultValue
    ) : (
      lastDefaultDashedValue
    );
  }

  handleBeforeEdit() {
    this._oldValues = new Set(this.values);

    this.props.app.pushUndo();
  }

  handleEdit() {
    // ignore nullish values
    let newValues = this.stringValues;
    // remove old values
    newValues = newValues.filter(v => !this._oldValues?.has(v));

    if (newValues.length > 0) {
      PrimaryBond.recommendedDefaults.line['stroke-dasharray'] = newValues[0];
    }

    this._oldValues = undefined; // reset

    this.props.app.refresh(); // refresh after updating all values
  }

  render() {
    let defaultDashedValue = this.defaultDashedValue;
    lastDefaultDashedValue = defaultDashedValue; // cache

    return (
      <_StrokeDasharrayField
        label='Dashed'
        elements={this.props.primaryBonds.map(pb => pb.line)}
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
