import type { App } from 'App';

import { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';
import { secondaryBondTypes } from 'Draw/bonds/straight/SecondaryBond';

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

function filterAUT(secondaryBonds: SecondaryBond[]) {
  return secondaryBonds.filter(sb => sb.type == 'AUT');
}

function filterGC(secondaryBonds: SecondaryBond[]) {
  return secondaryBonds.filter(sb => sb.type == 'GC');
}

function filterGUT(secondaryBonds: SecondaryBond[]) {
  return secondaryBonds.filter(sb => sb.type == 'GUT');
}

function filterOther(secondaryBonds: SecondaryBond[]) {
  return secondaryBonds.filter(sb => sb.type == 'other');
}

/**
 * Returns the stroke-dasharray values of the secondary bond line
 * elements.
 */
function strokeDasharrayValuesOf
(
  secondaryBonds: SecondaryBond[],
): StrokeDasharrayValue[]
{
  return secondaryBonds.map(sb => sb.line.attr('stroke-dasharray'));
}

/**
 * Returns the stroke-dasharray values of the secondary bond line
 * elements that are strings.
 */
function stringStrokeDasharrayValuesOf
(
  secondaryBonds: SecondaryBond[],
): StringStrokeDasharrayValue[]
{
  return strokeDasharrayValuesOf(secondaryBonds).filter(isString);
}

// cached value
let lastDefaultDashedValue: StringStrokeDasharrayValue = '3 1';

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;

  /**
   * The secondary bonds to edit.
   */
  secondaryBonds: SecondaryBond[];
};

export class StrokeDasharrayField extends React.Component<Props> {
  /**
   * Values cached in response to a before edit event.
   */
  _oldValues: {
    'AUT'?: Set<StrokeDasharrayValue>,
    'GC'?: Set<StrokeDasharrayValue>,
    'GUT'?: Set<StrokeDasharrayValue>,
    'other'?: Set<StrokeDasharrayValue>,
  };

  constructor(props: Props) {
    super(props);

    this._oldValues = {};
  }

  /**
   * The default value for the stroke-dasharray attributes of the
   * secondary bond line elements.
   *
   * Is based on the recommended default values for the types of
   * secondary bonds present.
   *
   * Is undefined if the recommended default values for the types of
   * secondary bonds present are not all the same.
   */
  get defaultValue(): StringStrokeDasharrayValue | undefined {
    let types = this.props.secondaryBonds.map(sb => sb.type);

    let recommendedDefaultValues = types.map(t => (
      SecondaryBond.recommendedDefaults[t].line['stroke-dasharray']
    ));

    // remove nullish values
    recommendedDefaultValues = recommendedDefaultValues.filter(isString);

    let recommendedDefaultValuesSet = new Set(recommendedDefaultValues);

    return recommendedDefaultValuesSet.size == 1 ? (
      recommendedDefaultValues[0]
    ) : (
      undefined
    );
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
    let secondaryBonds = this.props.secondaryBonds;

    this._oldValues = {
      'AUT': new Set(strokeDasharrayValuesOf(filterAUT(secondaryBonds))),
      'GC': new Set(strokeDasharrayValuesOf(filterGC(secondaryBonds))),
      'GUT': new Set(strokeDasharrayValuesOf(filterGUT(secondaryBonds))),
      'other': new Set(strokeDasharrayValuesOf(filterOther(secondaryBonds))),
    };

    this.props.app.pushUndo();
  }

  handleEdit() {
    let secondaryBonds = this.props.secondaryBonds;

    // ignore nullish values
    let newValues = {
      'AUT': stringStrokeDasharrayValuesOf(filterAUT(secondaryBonds)),
      'GC': stringStrokeDasharrayValuesOf(filterGC(secondaryBonds)),
      'GUT': stringStrokeDasharrayValuesOf(filterGUT(secondaryBonds)),
      'other': stringStrokeDasharrayValuesOf(filterOther(secondaryBonds)),
    };

    // remove old values
    secondaryBondTypes.forEach(t => {
      newValues[t] = newValues[t].filter(v => !this._oldValues[t]?.has(v));
    });

    let recommendedDefaults = SecondaryBond.recommendedDefaults;
    secondaryBondTypes.forEach(t => {
      if (newValues[t].length > 0) {
        recommendedDefaults[t].line['stroke-dasharray'] = newValues[t][0];
      }
    });

    this.props.app.refresh(); // refresh after updating all values
  }

  render() {
    let defaultDashedValue = this.defaultDashedValue;
    lastDefaultDashedValue = defaultDashedValue; // cache

    return (
      <_StrokeDasharrayField
        label='Dashed'
        elements={this.props.secondaryBonds.map(sb => sb.line)}
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
