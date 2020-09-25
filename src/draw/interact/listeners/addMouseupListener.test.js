import { addMouseupListener } from './addMouseupListener';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';

it('addMouseupListener function', () => {
  let listeners = [jest.fn(), jest.fn(), jest.fn()];
  // can bind multiple listeners
  listeners.forEach(f => addMouseupListener(f));
  listeners.forEach(f => {
    expect(f).not.toHaveBeenCalled();
  });
  act(() => fireEvent.mouseUp(window, { bubbles: true }));
  listeners.forEach(f => {
    let c = f.mock.calls[0];
    // is called with mouse event
    expect(c[0].toString().includes('MouseEvent')).toBeTruthy();
  });
  act(() => fireEvent.mouseUp(window, { bubbles: true }));
  listeners.forEach(f => {
    let c = f.mock.calls[1];
    // is called with mouse event
    expect(c[0].toString().includes('MouseEvent')).toBeTruthy();
  });
});
