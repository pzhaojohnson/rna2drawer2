import createFileDropdownForApp from './createFileDropdownForApp';

jest.mock('./createNewButtonForApp');
import createNewButtonForApp from './createNewButtonForApp';

jest.mock('./createOpenRna2drawerButtonForApp');
import createOpenRna2drawerButtonForApp from './createOpenRna2drawerButtonForApp';

jest.mock('./createSaveButtonForApp');
import createSaveButtonForApp from './createSaveButtonForApp';

describe('createFileDropdownForApp function', () => {
  createNewButtonForApp.mockImplementation(() => 'NewButton');
  createOpenRna2drawerButtonForApp.mockImplementation(() => 'OpenRna2drawerButton');
  createSaveButtonForApp.mockImplementation(() => 'SaveButton');
  let app = jest.fn();
  let fd = createFileDropdownForApp(app);

  it('passes top button', () => {
    let tb = fd.props.topButton;
    expect(tb.props.text).toBe('File');
  });

  it('passes app to create button functions', () => {
    expect(createNewButtonForApp.mock.calls[0][0]).toBe(app);
    expect(createOpenRna2drawerButtonForApp.mock.calls[0][0]).toBe(app);
    expect(createSaveButtonForApp.mock.calls[0][0]).toBe(app);
  });

  it('passes dropped elements', () => {
    let des = fd.props.droppedElements;
    expect(des[0]).toBe('NewButton');
    expect(des[1]).toBe('OpenRna2drawerButton');
    expect(des[2]).toBe('SaveButton');
  });
});
