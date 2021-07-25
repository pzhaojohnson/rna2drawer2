import App from '../../../App';
import NodeSVG from '../../../draw/NodeSVG';
import { addTertiaryBond } from 'Draw/bonds/curved/add';
import {
  getStrokeWidths,
  StrokeWidthField,
} from './StrokeWidthField';
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

it('getStrokeWidths function', () => {
  let tbs = [tb1, tb2, tb3, tb4];
  let sws = [5.678, 1.22, 3, 1.09];
  tbs.forEach((tb, i) => tb.path.attr({ 'stroke-width': sws[i] }));
  expect(getStrokeWidths(tbs)).toStrictEqual(sws);
});

describe('field', () => {
  it('renders when no tertiary bonds are selected', () => {
    act(() => {
      render(
        <StrokeWidthField
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
        <StrokeWidthField
          getTertiaryBonds={() => [tb1, tb2]}
          pushUndo={jest.fn()}
          changed={jest.fn()}
        />,
        container,
      );
    });
  });
});
