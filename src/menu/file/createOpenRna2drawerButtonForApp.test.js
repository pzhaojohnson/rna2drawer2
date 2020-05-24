import createOpenRna2drawerButtonForApp from './createOpenRna2drawerButtonForApp';

jest.mock('../openNewTab');
import openNewTab from '../openNewTab';

jest.mock('../../forms/renderOpenRna2drawerInApp');
import renderOpenRna2drawerInApp from '../../forms/renderOpenRna2drawerInApp';

import DroppedButton from '../DroppedButton';

let app = {
  strictDrawing: {
    isEmpty: () => true,
  },
};

it('returns a dropped button', () => {
  let orb = createOpenRna2drawerButtonForApp(app);
  expect(orb.type).toBe(DroppedButton);
});

it('passes a key', () => {
  let orb = createOpenRna2drawerButtonForApp(app);
  expect(orb.key).toBeTruthy();
});

describe('onClick callback', () => {
  openNewTab.mockImplementation(() => {});
  renderOpenRna2drawerInApp.mockImplementation(() => {});

  it('when drawing is empty', () => {
    jest.clearAllMocks();
    app.strictDrawing.isEmpty = () => true;
    let orb = createOpenRna2drawerButtonForApp(app);
    orb.props.onClick();
    expect(openNewTab.mock.calls.length).toBe(0);
    expect(renderOpenRna2drawerInApp.mock.calls.length).toBe(1);
    expect(renderOpenRna2drawerInApp.mock.calls[0][0]).toBe(app);
  });

  it('when drawing is not empty', () => {
    jest.clearAllMocks();
    app.strictDrawing.isEmpty = () => false;
    let orb = createOpenRna2drawerButtonForApp(app);
    orb.props.onClick();
    expect(openNewTab.mock.calls.length).toBe(1);
    expect(renderOpenRna2drawerInApp.mock.calls.length).toBe(0);
  });
});

it('enabled when drawing is empty', () => {
  app.strictDrawing.isEmpty = () => true;
  let orb = createOpenRna2drawerButtonForApp(app);
  expect(orb.props.disabled).toBeFalsy();
});

it('disabled when drawing is not empty', () => {
  app.strictDrawing.isEmpty = () => false;
  let orb = createOpenRna2drawerButtonForApp(app);
  expect(orb.props.disabled).toBeTruthy();
});
