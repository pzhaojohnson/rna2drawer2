import App from '../../../App';
import NodeSVG from '../../../draw/NodeSVG';
import { addTertiaryBond } from 'Draw/bonds/curved/add';
import {
  isDashed,
  areAllDashed,
  areAllNotDashed,
  DashedField,
} from './DashedField';
import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { render } from '@testing-library/react';

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

let app = new App(() => NodeSVG());
app.strictDrawing.appendSequence('asdf', 'asdfasdfasdfasdfasdf');
let drawing = app.strictDrawing.drawing;
let seq = drawing.getSequenceAtIndex(0);
let b1 = seq.getBaseAtPosition(1);
let b2 = seq.getBaseAtPosition(2);
let b3 = seq.getBaseAtPosition(3);
let b4 = seq.getBaseAtPosition(4);
let tb1 = addTertiaryBond(drawing, b1, b2);
let tb2 = addTertiaryBond(drawing, b3, b4);
let tb3 = addTertiaryBond(drawing, b4, b2);

it('isDashed function', () => {
  tb1.path.attr({ 'stroke-dasharray': '' });
  expect(isDashed(tb1)).toBeFalsy();
  tb1.path.attr({ 'stroke-dasharray': 'none' });
  expect(isDashed(tb1)).toBeFalsy();
  tb1.path.attr({ 'stroke-dasharray': '2 1' });
  expect(isDashed(tb1)).toBeTruthy();
});

describe('areAllDashed function', () => {
  it('are all dashed', () => {
    tb1.path.attr({ 'stroke-dasharray': '2 1' });
    tb2.path.attr({ 'stroke-dasharray': '3 3' });
    tb3.path.attr({ 'stroke-dasharray': '5 1' });
    expect(areAllDashed([tb1, tb2, tb3])).toBeTruthy();
  });

  it('one is not dashed', () => {
    tb1.path.attr({ 'stroke-dasharray': '5 6' });
    tb2.path.attr({ 'stroke-dasharray': '' });
    tb3.path.attr({ 'stroke-dasharray': '1 2' });
    expect(areAllDashed([tb1, tb2, tb3])).toBeFalsy();
  });
});

describe('areAllNotDashed function', () => {
  it('are all not dashed', () => {
    tb1.path.attr({ 'stroke-dasharray': '' });
    tb2.path.attr({ 'stroke-dasharray': 'none' });
    tb3.path.attr({ 'stroke-dasharray': '' });
    expect(areAllNotDashed([tb1, tb2, tb3])).toBeTruthy();
  });

  it('one is dashed', () => {
    tb1.path.attr({ 'stroke-dasharray': '' });
    tb2.path.attr({ 'stroke-dasharray': 'none' });
    tb3.path.attr({ 'stroke-dasharray': '1 5' });
    expect(areAllNotDashed([tb1, tb2, tb3])).toBeFalsy();
  });
});

describe('field', () => {
  it('renders when no tertiary bonds are selected', () => {
    act(() => {
      render(
        <DashedField
          getTertiaryBonds={() => []}
          pushUndo={jest.fn()}
          changed={jest.fn()}
        />,
        container,
      );
    });
  });

  it('renders when tertiary bonds are selected', () => {
    act(() => {
      render(
        <DashedField
          getTertiaryBonds={() => [tb1, tb2]}
          pushUndo={jest.fn()}
          changed={jest.fn()}
        />,
        container,
      );
    });
  });
});
