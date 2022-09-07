import type { App } from 'App';

import { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';

import { strokeDasharrayValueEqualsNone as equalsNone } from 'Values/svg/strokeDasharrayValueEqualsNone';

import * as React from 'react';

// the underlying component
import { StrokeDasharrayField as _StrokeDasharrayField } from 'Forms/edit/svg/StrokeDasharrayField';
import { EditEvent } from 'Forms/edit/svg/StrokeDasharrayField';

import { isNullish } from 'Values/isNullish';
import { isString } from 'Values/isString';

/**
 * A value that the stroke-dasharray attribute of an SVG element can
 * have that is a string.
 */
type StringStrokeDasharrayValue = string;

/**
 * To be remembered between mountings and unmountings.
 */
let lastNewDashedValue: StringStrokeDasharrayValue = '3 1';

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
      lastNewDashedValue
    );
  }

  handleBeforeEdit() {
    this.props.app.pushUndo();
  }

  handleEdit(event: EditEvent) {
    let lines = this.props.secondaryBonds.map(sb => sb.line);
    // treat all lines as edited if not specified in edit event object
    let editedLines = new Set('elements' in event ? event.elements : lines);

    let recommendedDefaults = SecondaryBond.recommendedDefaults;
    this.props.secondaryBonds.forEach(sb => {
      if (editedLines.has(sb.line)) {
        recommendedDefaults[sb.type].line['stroke-dasharray'] = event.newValue;
      }
    });

    if (!equalsNone(event.newValue)) {
      lastNewDashedValue = event.newValue;
    }

    this.props.app.refresh(); // refresh after updating all values
  }

  render() {
    return (
      <_StrokeDasharrayField
        label='Dashed'
        elements={this.props.secondaryBonds.map(sb => sb.line)}
        defaultDashedValue={this.defaultDashedValue}
        onBeforeEdit={() => this.handleBeforeEdit()}
        onEdit={event => this.handleEdit(event)}
        style={{
          marginTop: '8px',
          minHeight: '22px',
          alignSelf: 'start',
        }}
      />
    );
  }
}
