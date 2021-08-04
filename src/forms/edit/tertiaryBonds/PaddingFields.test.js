import App from '../../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { addTertiaryBond } from 'Draw/bonds/curved/add';
import {
  getPadding1s,
  getPadding2s,
  PaddingField1,
  PaddingField2,
} from './PaddingFields';
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
let tb4 = addTertiaryBond(drawing, b4, b1);

describe('getPaddings1 and getPaddings2 functions', () => {
  it('return trimmed paddings', () => {
    tb1.basePadding1 = 1.87991;
    tb1.basePadding2 = 9.01225872;
    tb2.basePadding1 = 5;
    tb2.basePadding2 = 8;
    tb3.basePadding1 = 5.288;
    tb3.basePadding2 = 12.882;
    expect(getPadding1s([tb1, tb2, tb3])).toStrictEqual([1.88, 5, 5.29]);
    expect(getPadding2s([tb1, tb2, tb3])).toStrictEqual([9.01, 8, 12.88]);
  });
});

describe('padding fields', () => {
  it('render when no tertiary bonds are selected', () => {
    let props = {
      getTertiaryBonds: () => [],
      pushUndo: jest.fn(),
      changed: jest.fn(),
    };
    act(() => {
      render(<PaddingField1 {...props} />, container);
    });
    act(() => {
      render(<PaddingField2 {...props} />, container);
    });
  });

  it('render when some tertiary bonds are selected', () => {
    let props = {
      getTertiaryBonds: () => [tb1, tb2, tb4],
      pushUndo: jest.fn(),
      changed: jest.fn(),
    };
    act(() => {
      render(<PaddingField1 {...props} />, container);
    });
    act(() => {
      render(<PaddingField2 {...props} />, container);
    });
  });
});
