import * as React from 'react';
import styles from './AppIcon.css';
import appIcon from './appIcon.svg';
import { AppInterface as App } from 'AppInterface';
import { HomePage } from 'Forms/home/HomePage';
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
            <HomePage app={props.app} />
          ));
        } else {
          openNewTab();
        }
      }}
    />
  );
}
