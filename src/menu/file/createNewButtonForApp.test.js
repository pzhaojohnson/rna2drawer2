import createNewButtonForApp from './createNewButtonForApp';

jest.mock('../openNewTab');
import openNewTab from '../openNewTab';

jest.mock('../../forms/renderCreateNewDrawingInApp');
import renderCreateNewDrawingInApp from '../../forms/renderCreateNewDrawingInApp';

import DroppedButton from '../DroppedButton';

let app = {
  strictDrawing: {
    isEmpty: () => true,
  },
};

it('returns a dropped button', () => {
  let nb = createNewButtonForApp(app);
  expect(nb.type).toBe(DroppedButton);
});

it('passes a key', () => {
  let nb = createNewButtonForApp(app);
  expect(nb.key).toBeTruthy();
});

describe('onClick callback', () => {
  openNewTab.mockImplementation(() => {});
  renderCreateNewDrawingInApp.mockImplementation(() => {});

  it('when drawing is empty', () => {
    jest.clearAllMocks();
    app.strictDrawing.isEmpty = () => true;
    let nb = createNewButtonForApp(app);
    nb.props.onClick();
    expect(openNewTab.mock.calls.length).toBe(0);
    expect(renderCreateNewDrawingInApp.mock.calls.length).toBe(1);
    expect(renderCreateNewDrawingInApp.mock.calls[0][0]).toBe(app);
  });

  it('when drawing is not empty', () => {
    jest.clearAllMocks();
    app.strictDrawing.isEmpty = () => false;
    let nb = createNewButtonForApp(app);
    nb.props.onClick();
    expect(openNewTab.mock.calls.length).toBe(1);
    expect(renderCreateNewDrawingInApp.mock.calls.length).toBe(0);
  });
});
