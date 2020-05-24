import createMenuForApp from './createMenuForApp';

jest.mock('./file/createFileDropdownForApp');
import createFileDropdownForApp from './file/createFileDropdownForApp';

jest.mock('./mode/createModeDropdownForApp');
import createModeDropdownForApp from './mode/createModeDropdownForApp';

jest.mock('./createEditDropdownForApp');
import createEditDropdownForApp from './createEditDropdownForApp';

jest.mock('./createExportDropdownForApp');
import createExportDropdownForApp from './createExportDropdownForApp';

describe('createMenuForApp function', () => {
  createFileDropdownForApp.mockImplementation(() => 'FileDropdown');
  createModeDropdownForApp.mockImplementation(() => 'ModeDropdown');
  createEditDropdownForApp.mockImplementation(() => 'EditDropdown');
  createExportDropdownForApp.mockImplementation(() => 'ExportDropdown');
  let app = jest.fn();
  let menu = createMenuForApp(app);
  
  it('passes app to create dropdown functions', () => {
    expect(createFileDropdownForApp.mock.calls[0][0]).toBe(app);
    expect(createModeDropdownForApp.mock.calls[0][0]).toBe(app);
    expect(createEditDropdownForApp.mock.calls[0][0]).toBe(app);
    expect(createExportDropdownForApp.mock.calls[0][0]).toBe(app);
  });

  it('passes dropdowns to menu component', () => {
    expect(menu.props.fileDropdown).toBe('FileDropdown');
    expect(menu.props.modeDropdown).toBe('ModeDropdown');
    expect(menu.props.editDropdown).toBe('EditDropdown');
    expect(menu.props.exportDropdown).toBe('ExportDropdown');
  });
});
