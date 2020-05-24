import createSaveButtonForApp from './createSaveButtonForApp';

import DroppedButton from '../DroppedButton';

let app = {
  strictDrawing: {
    isEmpty: () => true,
  },
  save: jest.fn(),
};

it('returns a dropped button', () => {
  let sb = createSaveButtonForApp(app);
  expect(sb.type).toBe(DroppedButton);
});

it('passes a key', () => {
  let sb = createSaveButtonForApp(app);
  expect(sb.key).toBeTruthy();
});

it('onClick callback', () => {
  let sb = createSaveButtonForApp(app);
  let c = app.save.mock.calls.length;
  sb.props.onClick();
  expect(app.save.mock.calls.length).toBe(c + 1);
});

it('when drawing is empty', () => {
  app.strictDrawing.isEmpty = () => true;
  let sb = createSaveButtonForApp(app);
  expect(sb.props.disabled).toBeTruthy();
});

it('when drawing is not empty', () => {
  app.strictDrawing.isEmpty = () => false;
  let sb = createSaveButtonForApp(app);
  expect(sb.props.disabled).toBeFalsy();
});
