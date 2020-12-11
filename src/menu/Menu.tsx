import * as React from 'react';
import { AppInterface as App } from '../AppInterface';
import { Logo } from './Logo';
import { FileDropdown } from './file/FileDropdown';
import { ModeDropdown } from './mode/ModeDropdown';
import { EditDropdown } from './edit/EditDropdown';
import { ExportDropdown } from './export/ExportDropdown';
import { SettingsDropdown } from './settings/SettingsDropdown';

interface Props {
  app: App;
}

export function Menu(props: Props) {
  return (
    <div
      style={{
        borderWidth: '0px 0px 1px 0px',
        borderStyle: 'solid',
        borderColor: 'rgba(0,0,0,0.125)',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
      }}
    >
      <Logo app={props.app} />
      <FileDropdown app={props.app} />
      <ModeDropdown app={props.app} />
      <EditDropdown app={props.app} />
      <ExportDropdown app={props.app} />
      <SettingsDropdown app={props.app} />
    </div>
  );
}
