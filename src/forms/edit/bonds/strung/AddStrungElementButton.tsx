import type { App } from 'App';

import type { Bond } from 'Forms/edit/bonds/strung/Bond';

import { createStrungRectangle } from 'Draw/bonds/strung/create';
import { addStrungElementToBond } from 'Draw/bonds/strung/addToBond';

import { curveOfBond } from 'Draw/bonds/strung/curveOfBond';
import { curveLengthOfBond } from 'Draw/bonds/strung/curveLengthOfBond';

import * as React from 'react';
import styles from './AddStrungElementButton.css';

function PlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg" version="1.1"
      width="10px" height="10px"
    >
      <path d="M 1 5 H 9 M 5 1 V 9" stroke="#060641" strokeWidth="2" />
    </svg>
  );
}

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;

  /**
   * The bonds to edit.
   */
  bonds: Bond[];

  style?: React.CSSProperties;
};

export class AddStrungElementButton extends React.Component<Props> {
  handleClick() {
    this.props.app.pushUndo();

    this.props.bonds.forEach(bond => {
      let curve = curveOfBond(bond);
      let curveLength = curveLengthOfBond(bond);
      if (curve) {
        let strungElement = createStrungRectangle({ curve, curveLength });
        addStrungElementToBond({ bond, strungElement });
      }
    });

    this.props.app.refresh();
  }

  render() {
    return (
      <div
        className={styles.addStrungElementButton}
        onClick={this.handleClick}
        style={this.props.style}
      >
        <PlusIcon />
        <p className={styles.addStrungElementButtonText} >
          Add a Strung Element
        </p>
      </div>
    );
  }
}
