import { AppInterface as App } from 'AppInterface';

import * as React from 'react';
import styles from './ComplementRulesButton.css';

import { ComplementRules } from 'Forms/settings/complements/ComplementRules';
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
          <ComplementRules {...formProps} app={props.app} />
        ), { key: complementRulesFormKey });
      }}
    >
      Complement Rules...
    </p>
  );
}
