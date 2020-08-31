import createOpenRna2drawerButtonForApp from './createOpenRna2drawerButtonForApp';

jest.mock('../openNewTab');
import openNewTab from '../openNewTab';

import { OpenRna2drawer } from '../../forms/open/OpenRna2drawer';

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

  it('when drawing is empty', () => {
    jest.clearAllMocks();
    app.strictDrawing.isEmpty = () => true;
    app.renderForm = jest.fn();
    let orb = createOpenRna2drawerButtonForApp(app);
    orb.props.onClick();
    expect(openNewTab.mock.calls.length).toBe(0);
    expect(app.renderForm.mock.calls[0][0]().type).toBe(OpenRna2drawer);
  });

  it('when drawing is not empty', () => {
    jest.clearAllMocks();
    app.strictDrawing.isEmpty = () => false;
    let orb = createOpenRna2drawerButtonForApp(app);
    orb.props.onClick();
    expect(openNewTab.mock.calls.length).toBe(1);
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
