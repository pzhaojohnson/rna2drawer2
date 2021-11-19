import { AppInterface as App } from '../AppInterface';
import * as React from 'react';
import styles from './AppIcon.css';
import icon from './appIcon.svg';
import { HomePage } from '../forms/home/HomePage';
import { openNewTab } from 'Utilities/openNewTab';

interface Props {
  app: App;
}

export function AppIcon(props: Props): React.ReactElement {
  return (
    <img
      className={styles.spinsOnHover}
      src={icon}
      alt='Icon'
      style={{
        height: '18px',
        padding: '4px 8px 4px 8px',
        cursor: 'pointer',
      }}
      onClick={() => {
        if (props.app.strictDrawing.isEmpty()) {
          props.app.renderForm(() => (
            <HomePage app={props.app} />
          ));
        } else {
          openNewTab();
        }
      }}
    />
  );
}
