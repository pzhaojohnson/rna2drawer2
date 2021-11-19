import { AppInterface as App } from '../AppInterface';
import * as React from 'react';
import styles from './Logo.css';
import logo from '../icons/logo.svg';
import { HomePage } from '../forms/home/HomePage';
import { openNewTab } from 'Utilities/openNewTab';

interface Props {
  app: App;
}

export function Logo(props: Props): React.ReactElement {
  return (
    <img
      className={styles.spinsOnHover}
      src={logo}
      alt={'Logo'}
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
