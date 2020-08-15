import createMenuForApp from './createMenuForApp';

jest.mock('./file/createFileDropdownForApp');
import createFileDropdownForApp from './file/createFileDropdownForApp';

jest.mock('./mode/createModeDropdownForApp');
import createModeDropdownForApp from './mode/createModeDropdownForApp';

jest.mock('./edit/createEditDropdownForApp');
import createEditDropdownForApp from './edit/createEditDropdownForApp';

jest.mock('./export/createExportDropdownForApp');
import createExportDropdownForApp from './export/createExportDropdownForApp';

jest.mock('./settings/SettingsDropdown');
import SettingsDropdown from './settings/SettingsDropdown';

describe('createMenuForApp function', () => {
  createFileDropdownForApp.mockImplementation(() => 'FileDropdown');
  createModeDropdownForApp.mockImplementation(() => 'ModeDropdown');
  createEditDropdownForApp.mockImplementation(() => 'EditDropdown');
  createExportDropdownForApp.mockImplementation(() => 'ExportDropdown');
  SettingsDropdown.mockImplementation(() => 'SettingsDropdown');
  let app = jest.fn();
  let menu = createMenuForApp(app);
  
  it('passes dropdowns to menu component', () => {
    expect(menu.props.fileDropdown).toBe('FileDropdown');
    expect(menu.props.modeDropdown).toBe('ModeDropdown');
    expect(menu.props.editDropdown).toBe('EditDropdown');
    expect(menu.props.exportDropdown).toBe('ExportDropdown');
    expect(menu.props.settingsDropdown).toBe('SettingsDropdown');
  });
});
