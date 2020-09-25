import { addMousemoveListener } from './addMousemoveListener';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';

it('addMousemoveListener function', () => {
  let listeners = [jest.fn(), jest.fn(), jest.fn()];
  // can bind multiple listeners
  listeners.forEach(f => addMousemoveListener(f));
  act(() => fireEvent.mouseMove(window, {
    screenX: 10,
    screenY: 18,
    bubbles: true,
  }));
  // does not call with nonfinite movement
  listeners.forEach(f => {
    expect(f).not.toHaveBeenCalled();
  });
  act(() => fireEvent.mouseMove(window, {
    screenX: 35,
    screenY: 64,
    bubbles: true,
  }));
  listeners.forEach(f => {
    let c = f.mock.calls[0];
    expect(c[0].toString().includes('MouseEvent')).toBeTruthy(); // passes mouse event
    expect(c[1]).toStrictEqual({ x: 35 - 10, y: 64 - 18 });
  });
  act(() => fireEvent.mouseMove(window, {
    screenX: 112,
    screenY: 21,
    bubbles: true,
  }));
  listeners.forEach(f => {
    let c = f.mock.calls[1];
    expect(c[0].toString().includes('MouseEvent')).toBeTruthy(); // passes mouse event
    expect(c[1]).toStrictEqual({ x: 112 - 35, y: 21 - 64 });
  });
});
