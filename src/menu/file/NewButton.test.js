import App from '../../App';
import NodeSVG from '../../draw/NodeSVG';
import React from 'react';
import { NewButton } from './NewButton';

jest.mock('../openNewTab');
import openNewTab from '../openNewTab';

import { CreateNewDrawing } from '../../forms/new/CreateNewDrawing';

let app = null;

beforeEach(() => {
  app = new App(() => NodeSVG());
});

describe('onClick callback', () => {
  openNewTab.mockImplementation(() => {});

  it('when drawing is empty', () => {
    let spy = jest.spyOn(app, 'renderForm');
    let b = NewButton({ app: app });
    let c = spy.mock.calls.length;
    expect(app.strictDrawing.isEmpty()).toBeTruthy();
    b.props.onClick();
    expect(spy.mock.calls[c][0]().type).toBe(CreateNewDrawing);
    expect(openNewTab).not.toHaveBeenCalled();
  });

  it('when drawing is not empty', () => {
    app.strictDrawing.appendSequence('asdf', 'asdf');
    let spy = jest.spyOn(app, 'renderForm');
    let b = NewButton({ app: app });
    expect(app.strictDrawing.isEmpty()).toBeFalsy();
    b.props.onClick();
    expect(spy).not.toHaveBeenCalled();
    expect(openNewTab).toHaveBeenCalled();
  });
});
