import App from '../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import React from 'react';
import { HomeButton } from './HomeButton';

jest.mock('Utilities/openNewTab');
import { openNewTab } from 'Utilities/openNewTab';

import { HomePage } from '../../forms/home/HomePage';

let app = null;

beforeEach(() => {
  app = new App(() => NodeSVG());
});

describe('onClick callback', () => {
  openNewTab.mockImplementation(() => {});

  it('when drawing is empty', () => {
    let spy = jest.spyOn(app, 'renderForm');
    let b = HomeButton({ app: app });
    let c = spy.mock.calls.length;
    expect(app.strictDrawing.isEmpty()).toBeTruthy();
    b.props.onClick();
    expect(spy.mock.calls[c][0]().type).toBe(HomePage);
    expect(openNewTab).not.toHaveBeenCalled();
  });

  it('when drawing is not empty', () => {
    app.strictDrawing.appendSequence('asdf', 'asdf');
    let spy = jest.spyOn(app, 'renderForm');
    let b = HomeButton({ app: app });
    expect(app.strictDrawing.isEmpty()).toBeFalsy();
    b.props.onClick();
    expect(spy).not.toHaveBeenCalled();
    expect(openNewTab).toHaveBeenCalled();
  });
});
