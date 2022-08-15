import type { App } from 'App';

import type { Bond } from 'Forms/edit/bonds/strung/Bond';
import type { StrungElement } from 'Draw/bonds/strung/StrungElement';

import { createStrungText } from 'Draw/bonds/strung/create';
import { createStrungCircle } from 'Draw/bonds/strung/create';
import { createStrungTriangle } from 'Draw/bonds/strung/create';
import { createStrungRectangle } from 'Draw/bonds/strung/create';

import { curveOfBond } from 'Draw/bonds/strung/curveOfBond';
import { curveLengthOfBond } from 'Draw/bonds/strung/curveLengthOfBond';

import { addStrungElementToBond } from 'Draw/bonds/strung/addToBond';
import { removeStrungElementFromBond } from 'Draw/bonds/strung/addToBond';

import * as React from 'react';
import styles from './TypeSelect.css';

import { atIndex } from 'Array/at';

const strungElementTypes = [
  'StrungText',
  'StrungCircle',
  'StrungTriangle',
  'StrungRectangle',
] as const;

type StrungElementType = typeof strungElementTypes[number];

/**
 * Returns undefined if the provided curve for the strung element to be
 * strung on is falsy.
 */
function createStrungElement(args: {
  type: StrungElementType,
  curve: ReturnType<typeof curveOfBond>,
  curveLength: ReturnType<typeof curveLengthOfBond>,
}) {
  let curve = args.curve;
  let curveLength = args.curveLength;

  if (!curve) {
    // need a curve for the strung element to be strung on
    return undefined;
  }

  if (args.type == 'StrungText') {
    // give "W" text by default
    return createStrungText({ text: 'W', curve, curveLength });
  } else if (args.type == 'StrungCircle') {
    return createStrungCircle({ curve, curveLength });
  } else if (args.type == 'StrungTriangle') {
    return createStrungTriangle({ curve, curveLength });
  } else {
    return createStrungRectangle({ curve, curveLength });
  }
}

function replaceStrungElement(args: {
  /**
   * The bond possessing the strung element to replace.
   */
  bond: Bond,

  /**
   * The index of the strung element to replace in the strung elements
   * array of the bond.
   */
  strungElementIndex: number,

  /**
   * The type of strung element to replace the strung element with.
   */
  newStrungElementType: StrungElementType
}) {
  let strungElement: StrungElement | undefined;
  strungElement = atIndex(args.bond.strungElements, args.strungElementIndex);
  if (strungElement) {
    removeStrungElementFromBond({ bond: args.bond, strungElement });
  }

  let newStrungElement = createStrungElement({
    type: args.newStrungElementType,
    curve: curveOfBond(args.bond),
    curveLength: curveLengthOfBond(args.bond),
  });

  if (newStrungElement) {
    addStrungElementToBond({
      bond: args.bond,
      index: args.strungElementIndex,
      strungElement: newStrungElement,
    });
  }
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
   * The index that each of the strung elements is at in the strung
   * elements array of the bond that possesses it.
   */
  strungElementsIndex: number;
};

type TypeButtonProps = Props & { type: StrungElementType };

class TypeButton extends React.Component<TypeButtonProps> {
  isToggled(): boolean {
    let strungElements = this.props.strungElements;
    return strungElements.every(ele => ele.type == this.props.type);
  }

  get className(): string {
    let isToggled = this.isToggled();
    return `
      ${styles.typeButton}
      ${isToggled ? styles.toggledTypeButton : styles.untoggledTypeButton}
    `;
  }

  get textContent(): string {
    if (this.props.type == 'StrungText') {
      return 'Text';
    } else if (this.props.type == 'StrungCircle') {
      return 'Circle';
    } else if (this.props.type == 'StrungTriangle') {
      return 'Triangle';
    } else {
      return 'Rectangle';
    }
  }

  render() {
    return (
      <button className={this.className} onClick={() => this.handleClick()} >
        {this.textContent}
      </button>
    );
  }

  handleClick() {
    if (this.isToggled()) {
      return;
    }

    this.props.app.pushUndo();
    this.props.bonds.forEach(bond => {
      replaceStrungElement({
        bond,
        strungElementIndex: this.props.strungElementsIndex,
        newStrungElementType: this.props.type,
      });
    });
    this.props.app.refresh();
  }
}

export function TypeSelect(props: Props) {
  return (
    <div className={styles.typeSelect} >
      {strungElementTypes.map((t, i) => (
        <TypeButton key={i} type={t} {...props} />
      ))}
    </div>
  );
}
