import App from '../../../App';
import NodeSVG from '../../../draw/NodeSVG';
import {
  getColorsAndOpacities,
  areSameColorAndOpacity,
  areAllSameColorAndOpacity,
  hasFill,
  StrokeField,
} from './StrokeField';
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
let tb1 = drawing.addTertiaryBond(b1, b2);
let tb2 = drawing.addTertiaryBond(b3, b4);
let tb3 = drawing.addTertiaryBond(b4, b2);
let tb4 = drawing.addTertiaryBond(b4, b1);

it('getColorsAndOpacities function', () => {
  let tbs = [tb1, tb2, tb3, tb4];
  let cos = [
    { color: '#5561ab', opacity: 0.21 },
    { color: '#05a1ab', opacity: 0.6 },
    { color: '#89bbbb', opacity: 0.09 },
    { color: '#563a22', opacity: 0.72 },
  ];
  tbs.forEach((tb, i) => {
    tb.path.attr({ 'stroke': cos[i].color });
    tb.path.attr({ 'stroke-opacity': cos[i].opacity });
  });
  expect(getColorsAndOpacities(tbs)).toStrictEqual(cos);
});

describe('areSameColorAndOpacity function', () => {
  it('falsy first argument', () => {
    expect(areSameColorAndOpacity(
      undefined,
      { color: '#123456', opacity: 0.2 },
    )).toBeFalsy();
  });

  it('falsy second argument', () => {
    expect(areSameColorAndOpacity(
      { color: '#abcdef', opacity: 0.5 },
      undefined,
    )).toBeFalsy();
  });

  it('are the same', () => {
    // different color capitalizations
    expect(areSameColorAndOpacity(
      { color: '#BC33FF', opacity: 0.89 },
      { color: '#BC33ff', opacity: 0.89 },
    )).toBeTruthy();
  });

  it('different color', () => {
    expect(areSameColorAndOpacity(
      { color: '#BC23FF', opacity: 0.89 },
      { color: '#BC33ff', opacity: 0.89 },
    )).toBeFalsy();
  });

  it('different opacity', () => {
    expect(areSameColorAndOpacity(
      { color: '#BC33FF', opacity: 0.89 },
      { color: '#BC33ff', opacity: 0.88 },
    )).toBeFalsy();
  });
});

describe('areAllSameColorAndOpacity function', () => {
  it('are all same', () => {
    // colors have different capitalizations
    expect(areAllSameColorAndOpacity([
      { color: '#AAbc45', opacity: 0.18 },
      { color: '#aaBC45', opacity: 0.18 },
      { color: '#aabc45', opacity: 0.18 },
    ])).toBeTruthy();
  });

  it('one has different color', () => {
    expect(areAllSameColorAndOpacity([
      { color: '#aa1256', opacity: 0.51 },
      { color: '#aa1256', opacity: 0.51 },
      { color: '#aa1356', opacity: 0.51 },
      { color: '#aa1256', opacity: 0.51 },
    ])).toBeFalsy();
  });

  it('one has different opacity', () => {
    expect(areAllSameColorAndOpacity([
      { color: '#aa1256', opacity: 0.51 },
      { color: '#aa1256', opacity: 0.52 },
      { color: '#aa1256', opacity: 0.51 },
      { color: '#aa1256', opacity: 0.51 },
    ])).toBeFalsy();
  });
});

it('hasFill function', () => {
  tb1.fill = '#abcdef'; // has fill
  expect(hasFill(tb1)).toBeTruthy();
  tb1.fill = ''; // falsy fill
  expect(hasFill(tb1)).toBeFalsy();
  tb1.fill = 'none'; // fill is none
  expect(hasFill(tb1)).toBeFalsy();
});

describe('field', () => {
  it('renders when no tertiary bonds are selected', () => {
    act(() => {
      render(
        <StrokeField
          getTertiaryBonds={() => []}
          pushUndo={jest.fn()}
          changed={jest.fn()}
        />,
        container,
      );
    });
  });

  it('renders when some tertiary bonds are selected', () => {
    act(() => {
      render(
        <StrokeField
          getTertiaryBonds={() => [tb1, tb2]}
          pushUndo={jest.fn()}
          changed={jest.fn()}
        />,
        container,
      );
    });
  });
});
