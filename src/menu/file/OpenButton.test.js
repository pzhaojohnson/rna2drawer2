import App from '../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { OpenButton } from './OpenButton';

jest.mock('Utilities/openNewTab');
import { openNewTab } from 'Utilities/openNewTab';

import { OpenRna2drawer } from '../../forms/open/OpenRna2drawer';

let app = null;

beforeEach(() => {
  app = new App(() => NodeSVG());
});

describe('onClick callback', () => {
  openNewTab.mockImplementation(() => {});

  it('when drawing is empty', () => {
    let spy = jest.spyOn(app, 'renderForm');
    let b = OpenButton({ app: app });
    let c = spy.mock.calls.length;
    expect(app.strictDrawing.isEmpty()).toBeTruthy();
    b.props.onClick();
    expect(spy.mock.calls[c][0]().type).toBe(OpenRna2drawer);
    expect(openNewTab).not.toHaveBeenCalled();
  });

  it('when drawing is not empty', () => {
    app.strictDrawing.appendSequence('asdf', 'qwer');
    let spy = jest.spyOn(app, 'renderForm');
    let b = OpenButton({ app: app });
    expect(app.strictDrawing.isEmpty()).toBeFalsy();
    expect(openNewTab).not.toHaveBeenCalled();
    b.props.onClick();
    expect(openNewTab).toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalled();
  });
});

it('is enabled when drawing is empty', () => {
  expect(app.strictDrawing.isEmpty()).toBeTruthy();
  let b = OpenButton({ app: app });
  expect(b.props.disabled).toBeFalsy();
});

it('is disabled when drawing is not empty', () => {
  app.strictDrawing.appendSequence('asdf', 'asdf');
  expect(app.strictDrawing.isEmpty()).toBeFalsy();
  let b = OpenButton({ app: app });
  expect(b.props.disabled).toBeTruthy();
});
