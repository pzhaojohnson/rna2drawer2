import createEditDropdownForApp from './createEditDropdownForApp';

jest.mock('./createUndoButtonForApp');
import createUndoButtonForApp from './createUndoButtonForApp';

jest.mock('./createRedoButtonForApp');
import createRedoButtonForApp from './createRedoButtonForApp';

jest.mock('./createCapitalizeButtonForApp');
import createCapitalizeButtonForApp from './createCapitalizeButtonForApp';

jest.mock('./createDecapitalizeButtonForApp');
import createDecapitalizeButtonForApp from './createDecapitalizeButtonForApp';

jest.mock('./createTsToUsButtonForApp');
import createTsToUsButtonForApp from './createTsToUsButtonForApp';

jest.mock('./createUsToTsButtonForApp');
import createUsToTsButtonForApp from './createUsToTsButtonForApp';

jest.mock('./createFlatOutermostLoopButtonForApp');
import createFlatOutermostLoopButtonForApp from './createFlatOutermostLoopButtonForApp';

jest.mock('./createRoundOutermostLoopButtonForApp');
import createRoundOutermostLoopButtonForApp from './createRoundOutermostLoopButtonForApp';

jest.mock('./createEditSequenceIdButtonForApp');
import createEditSequenceIdButtonForApp from './createEditSequenceIdButtonForApp';

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
    createCapitalizeButtonForApp.mockImplementation(() => 'CapitalizeButton');
    createDecapitalizeButtonForApp.mockImplementation(() => 'DecapitalizeButton');
    createTsToUsButtonForApp.mockImplementation(() => 'TsToUsButton');
    createUsToTsButtonForApp.mockImplementation(() => 'UsToTsButton');
    createFlatOutermostLoopButtonForApp.mockImplementation(() => 'FlatOutermostLoopButton');
    createRoundOutermostLoopButtonForApp.mockImplementation(() => 'RoundOutermostLoopButton');
    createEditSequenceIdButtonForApp.mockImplementation(() => 'EditSequenceIdButton');
    createEditLayoutButtonForApp.mockImplementation(() => 'EditLayoutButton');
    app.strictDrawing.isEmpty = () => false;
    let ed = createEditDropdownForApp(app);

    it('passes app to create button functions', () => {
      expect(createUndoButtonForApp.mock.calls[0][0]).toBe(app);
      expect(createRedoButtonForApp.mock.calls[0][0]).toBe(app);
      expect(createCapitalizeButtonForApp.mock.calls[0][0]).toBe(app);
      expect(createDecapitalizeButtonForApp.mock.calls[0][0]).toBe(app);
      expect(createTsToUsButtonForApp.mock.calls[0][0]).toBe(app);
      expect(createUsToTsButtonForApp.mock.calls[0][0]).toBe(app);
      expect(createFlatOutermostLoopButtonForApp.mock.calls[0][0]).toBe(app);
      expect(createRoundOutermostLoopButtonForApp.mock.calls[0][0]).toBe(app);
      expect(createEditSequenceIdButtonForApp.mock.calls[0][0]).toBe(app);
      expect(createEditLayoutButtonForApp.mock.calls[0][0]).toBe(app);
    });

    it('passes buttons and separators', () => {
      let des = ed.props.droppedElements;
      expect(des[0]).toBe('UndoButton');
      expect(des[1]).toBe('RedoButton');
      expect(des[2].type).toBe(DroppedSeparator);
      expect(des[3]).toBe('CapitalizeButton');
      expect(des[4]).toBe('DecapitalizeButton');
      expect(des[5]).toBe('TsToUsButton');
      expect(des[6]).toBe('UsToTsButton');
      expect(des[7].type).toBe(DroppedSeparator);
      expect(des[8]).toBe('FlatOutermostLoopButton');
      expect(des[9]).toBe('RoundOutermostLoopButton');
      expect(des[10].type).toBe(DroppedSeparator);
      expect(des[11]).toBe('EditSequenceIdButton');
      expect(des[12]).toBe('EditLayoutButton');
    });
  });
});
