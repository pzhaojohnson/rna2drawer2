import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { render } from '@testing-library/react';
import { EditTertiaryBonds } from './EditTertiaryBonds';
import App from '../../../App';
import NodeSVG from '../../../draw/NodeSVG';
import { addTertiaryBond } from 'Draw/bonds/curved/add';

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

it('renders when no tertiary bonds are selected', () => {
  act(() => {
    render(
      <EditTertiaryBonds
        getTertiaryBonds={() => []}
        pushUndo={jest.fn()}
        changed={jest.fn()}
        close={jest.fn()}
      />,
      container,
    );
  });
});

it('renders when some tertiary bonds are selected', () => {
  let app = new App(() => NodeSVG());
  app.strictDrawing.appendSequence('asdf', 'asdfasdf');
  let drawing = app.strictDrawing.drawing;
  let seq = drawing.getSequenceAtIndex(0);
  let tb1 = addTertiaryBond(drawing, seq.getBaseAtPosition(1), seq.getBaseAtPosition(5));
  let tb2 = addTertiaryBond(drawing, seq.getBaseAtPosition(6), seq.getBaseAtPosition(3));
  act(() => {
    render(
      <EditTertiaryBonds
        getTertiaryBonds={() => [tb1, tb2]}
        pushUndo={jest.fn()}
        changed={jest.fn()}
        close={jest.fn()}
      />,
      container,
    );
  });
});

it('binds close callback', () => {
  let close = jest.fn();
  let ele = EditTertiaryBonds({
    getTertiaryBonds: () => [],
    pushUndo: jest.fn(),
    changed: jest.fn(),
    close: close,
  });
  expect(close).not.toHaveBeenCalled();
  ele.props.close();
  expect(close).toHaveBeenCalled();
});
