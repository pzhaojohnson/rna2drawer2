import type { App } from 'App';

import * as React from 'react';
import styles from './ShowComplementsToggle.css';

function Check() {
  return (
    <svg
      className={styles.check}
      width="10.5px"
      height="10.5px"
      viewBox="0 0 96 96"
      xmlns="http://www.w3.org/2000/svg"
      overflow="hidden"
    >
      <path
        d="M86.1 15.8 34.9 64.2 10.3 39 1.8 47.1 34.5 80.7 43.1 72.7 94.2 24.2Z"
        stroke="#121213"
        strokeWidth="2.75"
        fill="#121213"
      />
    </svg>
  );
}

export type Props = {

  // a reference to the whole app
  app: App;
};

export function ShowComplementsToggle(props: Props) {
  let bindingTool = props.app.strictDrawingInteraction.bindingTool;

  return (
    <div
      className={`
        ${styles.showComplementsToggle}
        ${bindingTool.showComplements ? styles.toggled : styles.untoggled}
      `}
      onClick={() => {
        bindingTool.showComplements = !bindingTool.showComplements;
        props.app.refresh();
      }}
    >
      <p className={styles.text} >
        Show Complements
      </p>
      <div className={styles.spacer} />
      <Check />
    </div>
  );
}
