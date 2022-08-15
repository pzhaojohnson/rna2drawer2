import type { App } from 'App';

import type { Bond } from 'Forms/edit/bonds/strung/Bond';
import type { StrungElement } from 'Draw/bonds/strung/StrungElement';

import { repositionStrungElementAtIndex } from 'Forms/edit/bonds/strung/repositionStrungElementAtIndex';

import * as React from 'react';

import { NumberPropertyInput } from 'Forms/edit/objects/NumberPropertyInput';
import { EditEvent } from 'Forms/edit/objects/NumberPropertyInput';

import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;

  /**
   * The strung elements to edit.
   */
  strungElements: StrungElement[];

  /**
   * The bonds possessing the strung elements.
   */
  bonds: Bond[];

  /**
   * The index that the strung elements are at in the strung elements
   * arrays of the bonds possessing the strung elements.
   */
  strungElementsIndex: number;

  style?: React.CSSProperties;
};

class DisplacementFromCurveXField extends React.Component<Props> {
  onBeforeEdit(event: EditEvent) {
    this.props.app.pushUndo();
  }

  onEdit(event: EditEvent) {
    this.props.bonds.forEach(bond => {
      repositionStrungElementAtIndex({
        bond,
        index: this.props.strungElementsIndex,
      });
    });

    this.props.app.refresh();
  }

  render() {
    let strungElements = this.props.strungElements;

    return (
      <FieldLabel style={this.props.style} >
        <NumberPropertyInput
          objects={strungElements.map(ele => ele.displacementFromCurve)}
          propertyName='x'
          places={2}
          onBeforeEdit={event => this.onBeforeEdit(event)}
          onEdit={event => this.onEdit(event)}
        />
        <span style={{ marginLeft: '8px' }} >
          X
        </span>
      </FieldLabel>
    );
  }
}

class DisplacementFromCurveYField extends React.Component<Props> {
  onBeforeEdit(event: EditEvent) {
    this.props.app.pushUndo();
  }

  onEdit(event: EditEvent) {
    this.props.bonds.forEach(bond => {
      repositionStrungElementAtIndex({
        bond,
        index: this.props.strungElementsIndex,
      });
    });

    this.props.app.refresh();
  }

  render() {
    let strungElements = this.props.strungElements;

    return (
      <FieldLabel style={this.props.style} >
        <NumberPropertyInput
          objects={strungElements.map(ele => ele.displacementFromCurve)}
          propertyName='y'
          places={2}
          onBeforeEdit={event => this.onBeforeEdit(event)}
          onEdit={event => this.onEdit(event)}
        />
        <span style={{ marginLeft: '8px' }} >
          Y
        </span>
      </FieldLabel>
    );
  }
}

export class DisplacementFromCurveField extends React.Component<Props> {
  render() {
    let style = {
      display: 'flex', alignItems: 'center',
      ...this.props.style,
    };

    return (
      <div style={style} >
        <div>
          <DisplacementFromCurveXField {...this.props} />
          <div style={{ height: '6px' }} />
          <DisplacementFromCurveYField {...this.props} />
        </div>
        <FieldLabel style={{ marginLeft: '8px' }} >
          Displacement From Curve
        </FieldLabel>
      </div>
    );
  }
}
