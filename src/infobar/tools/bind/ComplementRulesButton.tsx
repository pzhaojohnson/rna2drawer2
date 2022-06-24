import type { App } from 'App';

import * as React from 'react';
import styles from './ComplementRulesButton.css';

import { ComplementRulesForm } from 'Forms/settings/complements/ComplementRulesForm';
import { v4 as uuidv4 } from 'uuid';

export type Props = {

  // a reference to the whole app
  app: App;
};

const complementRulesFormKey = uuidv4();

export function ComplementRulesButton(props: Props) {
  return (
    <p
      className={styles.complementRulesButton}
      onClick={() => {
        props.app.formContainer.renderForm(formProps => (
          <ComplementRulesForm {...formProps} app={props.app} />
        ), { key: complementRulesFormKey });
      }}
    >
      Options
    </p>
  );
}
