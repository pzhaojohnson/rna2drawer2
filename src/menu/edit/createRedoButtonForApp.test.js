import createRedoButtonForApp from './createRedoButtonForApp';

let app = {
  redo: () => {},
  canRedo: () => false,
};

it('passes key, text and key binding', () => {
  let b = createRedoButtonForApp(app);
  expect(b.key).toBeTruthy();
  expect(b.props.text).toBe('Redo');
  expect(b.props.keyBinding).toBe('Ctrl+Shift+Z');
});

it('onClick callback', () => {
  app.redo = jest.fn();
  let b = createRedoButtonForApp(app);
  b.props.onClick();
  expect(app.redo.mock.calls.length).toBe(1);
});

describe('disabled prop', () => {
  it('when can redo', () => {
    app.canRedo = () => true;
    let b = createRedoButtonForApp(app);
    expect(b.props.disabled).toBeFalsy();
  });

  it('when cannot redo', () => {
    app.canRedo = () => false;
    let b = createRedoButtonForApp(app);
    expect(b.props.disabled).toBeTruthy();
  });
});
