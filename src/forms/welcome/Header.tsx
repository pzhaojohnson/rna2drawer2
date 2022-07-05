import * as React from 'react';
import styles from './Header.css';
import { AppIcon } from './AppIcon';

function AppName() {
  return (
    <p className={styles.appName} >
      RNA2Drawer
    </p>
  );
}

function RightText() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }} >
      <p className={styles.rightText} >
        Developed by Philip Johnson and Anne Simon
      </p>
      <div style={{ height: '4px' }} />
      <p className={styles.rightText} >
        Last Updated on July 6, 2022
      </p>
    </div>
  );
}

function Underline() {
  return (
    <div className={styles.underline} />
  );
}

export function Header() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }} >
      <div style={{
        margin: '0px 64px',
        display: 'flex', flexDirection: 'row', alignItems: 'center',
      }} >
        <AppIcon />
        <div style={{ width: '14px' }} />
        <AppName />
        <div style={{ flexGrow: 1 }} />
        <RightText />
      </div>
      <Underline />
    </div>
  );
}
