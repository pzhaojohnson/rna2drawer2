import createUndoButtonForApp from './createUndoButtonForApp';

let app = {
  undo: () => {},
  canUndo: () => false,
};

it('passes key, text and key binding', () => {
  let b = createUndoButtonForApp(app);
  expect(b.key).toBeTruthy();
  expect(b.props.text).toBe('Undo');
  expect(b.props.keyBinding).toBe('Ctrl+Z');
});

it('onClick callback', () => {
  app.undo = jest.fn();
  let b = createUndoButtonForApp(app);
  b.props.onClick();
  expect(app.undo.mock.calls.length).toBe(1);
});

describe('disabled prop', () => {
  it('when can undo', () => {
    app.canUndo = () => true;
    let b = createUndoButtonForApp(app);
    expect(b.props.disabled).toBeFalsy();
  });

  it('when cannot undo', () => {
    app.canUndo = () => false;
    let b = createUndoButtonForApp(app);
    expect(b.props.disabled).toBeTruthy();
  });
});
