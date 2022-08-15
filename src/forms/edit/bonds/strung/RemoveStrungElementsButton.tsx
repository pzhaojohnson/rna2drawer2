import type { App } from 'App';

import type { Bond } from 'Forms/edit/bonds/strung/Bond';
import type { StrungElement } from 'Draw/bonds/strung/StrungElement';

import { removeStrungElementFromBond } from 'Draw/bonds/strung/addToBond';

import { atIndex } from 'Array/at';

import * as React from 'react';
import styles from './RemoveStrungElementsButton.css';

function MinusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg" version="1.1"
      width="10px" height="10px"
    >
      <path d="M 1 5 H 9" stroke="#ac4b4b" strokeWidth="2" />
    </svg>
  );
}

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
   * The index that each strung element is at in the strung elements
   * array of the bond that possesses it.
   */
  strungElementsIndex: number;

  style?: React.CSSProperties;
};

export class RemoveStrungElementsButton extends React.Component<Props> {
  handleClick() {
    this.props.app.pushUndo();

    this.props.bonds.forEach(bond => {
      let strungElement: StrungElement | undefined;
      let strungElementIndex = this.props.strungElementsIndex;
      strungElement = atIndex(bond.strungElements, strungElementIndex);
      if (strungElement) {
        removeStrungElementFromBond({ bond, strungElement });
      }
    });

    this.props.app.refresh();
  }

  render() {
    return (
      <div
        className={styles.removeStrungElementsButton}
        onClick={this.handleClick}
        style={this.props.style}
      >
        <MinusIcon />
        <p className={styles.removeStrungElementsButtonText} >
          Remove
        </p>
      </div>
    );
  }
}
