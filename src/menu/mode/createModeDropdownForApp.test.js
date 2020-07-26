import createModeDropdownForApp from './createModeDropdownForApp';

jest.mock('./createPivotButtonForApp');
import createPivotButtonForApp from './createPivotButtonForApp';

jest.mock('./createExpandButtonForApp');
import createExpandButtonForApp from './createExpandButtonForApp';

jest.mock('./createFoldButtonForApp');
import createFoldButtonForApp from './createFoldButtonForApp';

import DroppedSeparator from '../DroppedSeparator';

let app = {
  strictDrawing: {
    isEmpty: () => true,
  },
};

describe('passes top button', () => {
  it('with text', () => {
    let md = createModeDropdownForApp(app);
    let tb = md.props.topButton;
    expect(tb.props.text).toBe('Mode');
  });

  it('when drawing is empty', () => {
    app.strictDrawing.isEmpty = () => true;
    let md = createModeDropdownForApp(app);
    let tb = md.props.topButton;
    expect(tb.props.disabled).toBeTruthy();
  });

  it('when drawing is not empty', () => {
    app.strictDrawing.isEmpty = () => false;
    let md = createModeDropdownForApp(app);
    let tb = md.props.topButton;
    expect(tb.props.disabled).toBeFalsy();
  });
});

describe('passes dropped elements', () => {
  createPivotButtonForApp.mockImplementation(() => 'PivotButton');
  createExpandButtonForApp.mockImplementation(() => 'ExpandButton');
  createFoldButtonForApp.mockImplementation(() => 'FoldButton');
  
  it('when drawing is empty', () => {
    app.strictDrawing.isEmpty = () => true;
    let md = createModeDropdownForApp(app);
    let des = md.props.droppedElements;
    expect(des.length).toBe(0);
  });

  describe('when drawing is not empty', () => {
    app.strictDrawing.isEmpty = () => false;
    let md = createModeDropdownForApp(app);

    it('passes app to create button functions', () => {
      expect(createPivotButtonForApp.mock.calls[0][0]).toBe(app);
      expect(createExpandButtonForApp.mock.calls[0][0]).toBe(app);
      expect(createFoldButtonForApp.mock.calls[0][0]).toBe(app);
    });

    it('passes buttons', () => {
      let des = md.props.droppedElements;
      expect(des[0]).toBe('PivotButton');
      expect(des[1]).toBe('ExpandButton');
      expect(des[2].type).toBe(DroppedSeparator);
      expect(des[3]).toBe('FoldButton');
    });
  });
});
