import * as React from 'react';
import Menu from './Menu';
import createFileDropdownForApp from './file/createFileDropdownForApp';
import createModeDropdownForApp from './mode/createModeDropdownForApp';
import createEditDropdownForApp from './edit/createEditDropdownForApp';
import createExportDropdownForApp from './export/createExportDropdownForApp';
import App from '../App';

function createMenuForApp(app: App): React.ReactElement {
  return (
    <Menu
      fileDropdown={createFileDropdownForApp(app)}
      modeDropdown={createModeDropdownForApp(app)}
      editDropdown={createEditDropdownForApp(app)}
      exportDropdown={createExportDropdownForApp(app)}
    />
  );
}

export default createMenuForApp;
