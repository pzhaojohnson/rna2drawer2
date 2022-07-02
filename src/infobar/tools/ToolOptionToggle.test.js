import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import { unmountComponentAtNode } from 'react-dom';

import { ToolOptionToggle } from './ToolOptionToggle';

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

describe('ToolOptionToggle component', () => {
  test('isToggled prop', () => {
    act(() => {
      render(<ToolOptionToggle isToggled={true} />, container);
    });
    expect(container.firstChild.className).toMatch('toggled');
    expect(container.firstChild.className).not.toMatch('untoggled');

    act(() => {
      render(<ToolOptionToggle isToggled={false} />, container);
    });
    expect(container.firstChild.className).toMatch('untoggled');
    // toggled matches untoggled...
  });

  describe('event binding', () => {
    test('onClick callback', () => {
      let onClick = jest.fn();
      act(() => {
        render(<ToolOptionToggle onClick={onClick} />, container);
      });
      expect(onClick).not.toHaveBeenCalled();
      Simulate.click(container.firstChild);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    test('onMouseEnter callback', () => {
      let onMouseEnter = jest.fn();
      act(() => {
        render(<ToolOptionToggle onMouseEnter={onMouseEnter} />, container);
      });
      expect(onMouseEnter).not.toHaveBeenCalled();
      Simulate.mouseEnter(container.firstChild);
      expect(onMouseEnter).toHaveBeenCalledTimes(1);
    });

    test('onMouseLeave callback', () => {
      let onMouseLeave = jest.fn();
      act(() => {
        render(<ToolOptionToggle onMouseLeave={onMouseLeave} />, container);
      });
      expect(onMouseLeave).not.toHaveBeenCalled();
      Simulate.mouseLeave(container.firstChild);
      expect(onMouseLeave).toHaveBeenCalledTimes(1);
    });
  });

  it('renders with provided CSS styles', () => {
    act(() => {
      render(
        <ToolOptionToggle style={{ margin: '2px 0px 0px 13.8px' }} />,
        container,
      );
    });
    expect(container.firstChild.style.margin).toBe('2px 0px 0px 13.8px');
  });
});
