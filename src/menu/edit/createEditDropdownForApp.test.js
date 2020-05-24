import createEditDropdownForApp from './createEditDropdownForApp';

jest.mock('./createUndoButtonForApp');
import createUndoButtonForApp from './createUndoButtonForApp';

jest.mock('./createRedoButtonForApp');
import createRedoButtonForApp from './createRedoButtonForApp';

jest.mock('./createFlatOutermostLoopButtonForApp');
import createFlatOutermostLoopButtonForApp from './createFlatOutermostLoopButtonForApp';

jest.mock('./createRoundOutermostLoopButtonForApp');
import createRoundOutermostLoopButtonForApp from './createRoundOutermostLoopButtonForApp';

jest.mock('./createEditLayoutButtonForApp');
import createEditLayoutButtonForApp from './createEditLayoutButtonForApp';

import DroppedSeparator from '../DroppedSeparator';

let app = {
  strictDrawing: {
    isEmpty: () => true,
  },
};

describe('passes top button', () => {
  it('passes text', () => {
    let ed = createEditDropdownForApp(app);
    let tb = ed.props.topButton;
    expect(tb.props.text).toBe('Edit');
  });

  describe('disabled prop', () => {
    it('when drawing is empty', () => {
      app.strictDrawing.isEmpty = () => true;
      let ed = createEditDropdownForApp(app);
      let tb = ed.props.topButton;
      expect(tb.props.disabled).toBeTruthy();
    });

    it('when drawing is not empty', () => {
      app.strictDrawing.isEmpty = () => false;
      let ed = createEditDropdownForApp(app);
      let tb = ed.props.topButton;
      expect(tb.props.disabled).toBeFalsy();
    });
  });
});

describe('passes dropped elements', () => {
  it('when drawing is empty', () => {
    app.strictDrawing.isEmpty = () => true;
    let ed = createEditDropdownForApp(app);
    let des = ed.props.droppedElements;
    expect(des.length).toBe(0);
  });

  describe('when drawing is not empty', () => {
    createUndoButtonForApp.mockImplementation(() => 'UndoButton');
    createRedoButtonForApp.mockImplementation(() => 'RedoButton');
    createFlatOutermostLoopButtonForApp.mockImplementation(() => 'FlatOutermostLoopButton');
    createRoundOutermostLoopButtonForApp.mockImplementation(() => 'RoundOutermostLoopButton');
    createEditLayoutButtonForApp.mockImplementation(() => 'EditLayoutButton');
    app.strictDrawing.isEmpty = () => false;
    let ed = createEditDropdownForApp(app);

    it('passes app to create button functions', () => {
      expect(createUndoButtonForApp.mock.calls[0][0]).toBe(app);
      expect(createRedoButtonForApp.mock.calls[0][0]).toBe(app);
      expect(createFlatOutermostLoopButtonForApp.mock.calls[0][0]).toBe(app);
      expect(createRoundOutermostLoopButtonForApp.mock.calls[0][0]).toBe(app);
      expect(createEditLayoutButtonForApp.mock.calls[0][0]).toBe(app);
    });

    it('passes buttons and separators', () => {
      let des = ed.props.droppedElements;
      expect(des[0]).toBe('UndoButton');
      expect(des[1]).toBe('RedoButton');
      expect(des[2].type).toBe(DroppedSeparator);
      expect(des[3]).toBe('FlatOutermostLoopButton');
      expect(des[4]).toBe('RoundOutermostLoopButton');
      expect(des[5].type).toBe(DroppedSeparator);
      expect(des[6]).toBe('EditLayoutButton');
    });
  });
});
