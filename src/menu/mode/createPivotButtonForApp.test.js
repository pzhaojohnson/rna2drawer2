import createPivotButtonForApp from './createPivotButtonForApp';

let app = {
  strictDrawingInteraction: {
    pivoting: () => true,
    startPivoting: () => {},
  },
};

it('passes a key', () => {
  let pb = createPivotButtonForApp(app);
  expect(pb.key).toBeTruthy();
});

it('passes text', () => {
  let pb = createPivotButtonForApp(app);
  expect(pb.props.text).toBe('Pivot Stems');
});

it('when already pivoting', () => {
  app.strictDrawingInteraction.pivoting = () => true;
  app.strictDrawingInteraction.startPivoting = jest.fn();
  let pb = createPivotButtonForApp(app);
  pb.props.onClick();
  expect(app.strictDrawingInteraction.startPivoting.mock.calls.length).toBe(0);
  expect(pb.props.disabled).toBeTruthy();
  expect(pb.props.checked).toBeTruthy();
});

it('when not already pivoting', () => {
  app.strictDrawingInteraction.pivoting = () => false;
  app.strictDrawingInteraction.startPivoting = jest.fn();
  let pb = createPivotButtonForApp(app);
  pb.props.onClick();
  expect(app.strictDrawingInteraction.startPivoting.mock.calls.length).toBe(1);
  expect(pb.props.disabled).toBeFalsy();
  expect(pb.props.checked).toBeFalsy();
});
