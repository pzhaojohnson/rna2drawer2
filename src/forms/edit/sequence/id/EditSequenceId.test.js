import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import EditSequenceId from './EditSequenceId';
import App from '../../../../App';
import NodeSVG from '../../../../draw/NodeSVG';
import SequenceIdField from './SequenceIdField';
const uuidv1 = require('uuid/v1');

let container = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe('create static method', () => {
  it('creates with sequence ID field', () => {
    let app = new App(() => NodeSVG());
    let ele = EditSequenceId.create(app);
    expect(ele.props.sequenceIdField.toString()).toBe(SequenceIdField.create(app).toString());
  });

  it('passed close callback removes the form', () => {
    let app = new App(() => NodeSVG());
    let spy = jest.spyOn(app, 'unmountCurrForm');
    let ele = EditSequenceId.create(app);
    expect(spy).not.toHaveBeenCalled();
    ele.props.close();
    expect(spy).toHaveBeenCalled();
  });
});

it('passes close callback', () => {
  let close = jest.fn();
  let comp = new EditSequenceId({ close: close });
  let ele = comp.render();
  expect(close).not.toHaveBeenCalled();
  ele.props.close();
  expect(close).toHaveBeenCalled();
});

it('renders sequence ID field', () => {
  let id = uuidv1();
  expect(container.textContent.includes(id)).toBeFalsy();
  act(() => {
    render(<EditSequenceId sequenceIdField={id} />, container);
  });
  expect(container.textContent.includes(id)).toBeTruthy();
});
