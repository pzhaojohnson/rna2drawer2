import type { App } from 'App';

import { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';

import { strokeDasharrayValueEqualsNone as equalsNone } from 'Values/svg/strokeDasharrayValueEqualsNone';

import * as React from 'react';

// the underlying component
import { StrokeDasharrayField as _StrokeDasharrayField } from 'Forms/edit/svg/StrokeDasharrayField';
import { EditEvent } from 'Forms/edit/svg/StrokeDasharrayField';

import { isNullish } from 'Values/isNullish';
import { ValuesWrapper } from 'Values/ValuesWrapper';

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
  get defaultDashedValue(): StringStrokeDasharrayValue {
    let types = this.props.secondaryBonds.map(sb => sb.type);

    let defaultValues = new ValuesWrapper(types.map(
      t => SecondaryBond.recommendedDefaults[t].line['stroke-dasharray']
    ));

    let commonDefaultValue = defaultValues.commonValue;

    return isNullish(commonDefaultValue) ? (
      lastNewDashedValue
    ) : equalsNone(commonDefaultValue) ? (
      lastNewDashedValue
    ) : (
      commonDefaultValue
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
