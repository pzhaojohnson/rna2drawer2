import * as React from 'react';
import styles from './AppIcon.css';
import appIcon from './appIcon.svg';
import type { App } from 'App';
import { WelcomePage } from 'Forms/welcome/WelcomePage';
import { openNewTab } from 'Utilities/openNewTab';

export type Props = {
  app: App;
}

export function AppIcon(props: Props) {
  return (
    <img
      className={styles.appIcon}
      src={appIcon}
      alt='Icon'
      onClick={() => {
        if (props.app.strictDrawing.isEmpty()) {
          props.app.formContainer.renderForm(() => (
            <WelcomePage app={props.app} />
          ));
        } else {
          openNewTab();
        }
      }}
    />
  );
}
