import createFoldButtonForApp from './createFoldButtonForApp';

let app = {
  strictDrawingInteraction: {
    folding: () => false,
    startFolding: () => {},
  },
};

it('passes a key', () => {
  let fb = createFoldButtonForApp(app);
  expect(fb.key).toBeTruthy();
});

it('passes text', () => {
  let fb = createFoldButtonForApp(app);
  expect(fb.props.text).toBe('Modify Base Pairs');
});

it('when already folding', () => {
  app.strictDrawingInteraction.folding = () => true;
  app.strictDrawingInteraction.startFolding = jest.fn();
  let fb = createFoldButtonForApp(app);
  fb.props.onClick();
  expect(app.strictDrawingInteraction.startFolding.mock.calls.length).toBe(0);
  expect(fb.props.disabled).toBeTruthy();
  expect(fb.props.checked).toBeTruthy();
});

it('when not already folding', () => {
  app.strictDrawingInteraction.folding = () => false;
  app.strictDrawingInteraction.startFolding = jest.fn();
  let fb = createFoldButtonForApp(app);
  fb.props.onClick();
  expect(app.strictDrawingInteraction.startFolding.mock.calls.length).toBe(1);
  expect(fb.props.disabled).toBeFalsy();
  expect(fb.props.checked).toBeFalsy();
});
