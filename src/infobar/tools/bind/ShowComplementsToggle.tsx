import type { App } from 'App';

import * as React from 'react';
import styles from './ShowComplementsToggle.css';

export type Props = {

  // a reference to the whole app
  app: App;
};

export function ShowComplementsToggle(props: Props) {
  let bindingTool = props.app.strictDrawingInteraction.bindingTool;

  let toggledClassName = styles.toggledShowComplementsToggle;
  let untoggledClassName = styles.untoggledShowComplementsToggle;

  return (
    <p
      className={`
        ${styles.showComplementsToggle}
        ${bindingTool.showComplements ? toggledClassName : untoggledClassName}
      `}
      onClick={() => {
        bindingTool.showComplements = !bindingTool.showComplements;
        props.app.refresh();
      }}
    >
      Show Complements
    </p>
  );
}
