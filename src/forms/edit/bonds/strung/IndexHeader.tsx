import type { Bond } from 'Forms/edit/bonds/strung/Bond';
import type { StrungElement } from 'Draw/bonds/strung/StrungElement';

import * as React from 'react';
import styles from './IndexHeader.css';

function RightBracket() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg" version="1.1"
      width="10px" height="10px"
    >
      <path
        d="M 1 1 L 5 5 L 1 9"
        stroke="#141418" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function DownBracket() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg" version="1.1"
      width="10px" height="10px"
    >
      <path
        d="M 1 3 L 5 7 L 9 3"
        stroke="#141418" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export type Props = {
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
   * array of the bond possessing it.
   */
  strungElementsIndex: number;

  /**
   * Direction of the bracket at the beginning of the header.
   *
   * (A right bracket is meant to indicate that the fields to edit the
   * strung elements are collapsed, while a down bracket is meant to
   * indicate that the fields are being shown.)
   */
  bracketDirection: 'right' | 'down';

  onClick?: () => void;

  style?: React.CSSProperties;
};

export function IndexHeader(props: Props) {
  return (
    <div
      className={styles.indexHeader}
      onClick={props.onClick}
      style={props.style}
    >
      {props.bracketDirection == 'right' ? <RightBracket /> : <DownBracket />}
      <p className={styles.text} >
        Strung Element #{props.strungElementsIndex + 1}
      </p>
    </div>
  );
}
