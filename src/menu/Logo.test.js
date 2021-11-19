import App from '../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import { Logo } from './Logo';

import { HomePage } from '../forms/home/HomePage';

jest.mock('Utilities/openNewTab');
import { openNewTab } from 'Utilities/openNewTab';

let app = null;

let container = null;

beforeEach(() => {
  app = new App(() => NodeSVG());

  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  app = null;

  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it('renders', () => {
  act(() => {
    render(<Logo app={app} />, container);
  });
});

describe('onClick callback', () => {
  openNewTab.mockImplementation(() => {});

  it('opens home page when drawing is empty', () => {
    let spy = jest.spyOn(app, 'renderForm');
    let l = Logo({ app: app });
    let c = spy.mock.calls.length;
    expect(app.strictDrawing.isEmpty()).toBeTruthy();
    l.props.onClick();
    expect(spy.mock.calls[c][0]().type).toBe(HomePage);
    expect(openNewTab).not.toHaveBeenCalled();
  });

  it('opens new tab when drawing is not empty', () => {
    app.strictDrawing.appendSequence('asdf', 'asdf');
    let spy = jest.spyOn(app, 'renderForm');
    let l = Logo({ app: app });
    expect(app.strictDrawing.isEmpty()).toBeFalsy();
    l.props.onClick();
    expect(spy).not.toHaveBeenCalled();
    expect(openNewTab).toHaveBeenCalled();
  });
});
