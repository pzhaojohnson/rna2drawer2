import * as React from 'react';
import styles from './Menu.css';
import { AppInterface as App } from 'AppInterface';
import { AppIcon } from './AppIcon';
import { FileDropdown } from './file/FileDropdown';
import { ModeDropdown } from './mode/ModeDropdown';
import { EditDropdown } from './edit/EditDropdown';
import { ExportDropdown } from './export/ExportDropdown';
import { SettingsDropdown } from './settings/SettingsDropdown';
import { AskBeforeLeavingToggle } from 'Menu/preferences/AskBeforeLeavingToggle';

export type Props = {
  app: App;
}

export function Menu(props: Props) {
  return (
    <div className={styles.menu} >
      <AppIcon app={props.app} />
      <FileDropdown app={props.app} />
      <ModeDropdown app={props.app} />
      <EditDropdown app={props.app} />
      <ExportDropdown app={props.app} />
      <SettingsDropdown app={props.app} />
      <div style={{ flexGrow: 1 }} />
      {props.app.strictDrawing.isEmpty() ? null : (
        <div style={{ marginRight: '8px' }} >
          <AskBeforeLeavingToggle app={props.app} />
        </div>
      )}
    </div>
  );
}
