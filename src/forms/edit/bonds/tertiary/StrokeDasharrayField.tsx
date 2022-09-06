import type { App } from 'App';

import { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';

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

// cached value
let lastDefaultDashedValue: StringStrokeDasharrayValue | undefined = '8 2';

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;

  /**
   * The tertiary bonds to edit.
   */
  tertiaryBonds: TertiaryBond[];
};

export class StrokeDasharrayField extends React.Component<Props> {
  /**
   * Values cached in response to a before edit event.
   */
  _oldValues?: Set<StrokeDasharrayValue>;

  /**
   * The values that the stroke-dasharray attributes of the tertiary
   * bond path elements possess.
   */
  get values(): StrokeDasharrayValue[] {
    let tertiaryBonds = this.props.tertiaryBonds;
    return tertiaryBonds.map(tb => tb.path.attr('stroke-dasharray'));
  }

  /**
   * The values that the stroke-dasharray attributes of the tertiary
   * bond path elements possess that are strings.
   */
  get stringValues(): StringStrokeDasharrayValue[] {
    return this.values.filter(isString);
  }

  get defaultDashedValue(): StringStrokeDasharrayValue | undefined {
    let recommendedDefaultValue = (
      TertiaryBond.recommendedDefaults.path['stroke-dasharray']
    );

    return !equalsNone(recommendedDefaultValue) ? (
      recommendedDefaultValue
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
      TertiaryBond.recommendedDefaults.path['stroke-dasharray'] = newValues[0];
    }

    this._oldValues = undefined; // reset

    // refresh after updating the recommended default value
    this.props.app.refresh();
  }

  render() {
    let defaultDashedValue = this.defaultDashedValue;
    lastDefaultDashedValue = defaultDashedValue; // cache

    return (
      <_StrokeDasharrayField
        label='Dashed'
        elements={this.props.tertiaryBonds.map(tb => tb.path)}
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
