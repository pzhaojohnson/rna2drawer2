import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { ColorField, PRESET_COLORS } from './ColorField';

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

function getComponent() {
  return container.childNodes[0];
}

function getLabel() {
  return getComponent().childNodes[0];
}

function getCurrentColorDisplay() {
  return getComponent().childNodes[1].childNodes[0];
}

function getPicker() {
  return getComponent().childNodes[1].childNodes[1];
}

it('max number of recent colors is positive', () => {
  expect(ColorField.recentColors.maxLength).toBeGreaterThan(0);
});

it('displays name in label', () => {
  act(() => {
    render(<ColorField name={'asdf qwer'} />, container);
  });
  expect(getLabel().textContent).toBe('asdf qwer:');
});

describe('adding initial value to recent colors', () => {
  it('is added when provided', () => {
    act(() => {
      render(<ColorField
        name={'asdf'}
        initialValue={{ color: '#11bbfa', opacity: 1 }}
      />, container);
    });
    expect(ColorField.recentColors.slice(-1)[0]).toBe('#11bbfa');
  });

  it('is not added when is one of the preset colors', () => {
    let prev = ColorField.recentColors.slice();
    act(() => {
      render(<ColorField
        name={'asdf'}
        initialValue={{ color: PRESET_COLORS.toArray()[1], opacity: 1 }}
      />, container);
    });
    // are unchanged
    expect(ColorField.recentColors.slice().toString()).toBe(prev.toString());
  });
});

describe('current color display', () => {
  it('shows current color and opacity if provided', () => {
    act(() => {
      render(<ColorField
        initialValue={{ color: '#aa1123', opacity: 0.56 }}
      />, container);
    });
    let style = window.getComputedStyle(getCurrentColorDisplay().childNodes[0]);
    expect(style.background).toBe('rgba(170, 17, 35, 0.56)');
  });

  it('is completely transparent by default', () => {
    act(() => {
      render(<ColorField />, container);
    });
    let style = window.getComputedStyle(getCurrentColorDisplay().childNodes[0]);
    expect(style.background).toBe('rgba(255, 255, 255, 0)');
  });

  it('clicking on it toggles the picker', () => {
    act(() => {
      render(<ColorField />, container);
    });
    expect(getPicker()).toBeFalsy(); // picker not shown
    act(() => getCurrentColorDisplay().dispatchEvent(new Event('click', { bubbles: true })));
    expect(getPicker()).toBeTruthy(); // picker is shown
    act(() => getCurrentColorDisplay().dispatchEvent(new Event('click', { bubbles: true })));
    expect(getPicker()).toBeFalsy(); // picker is no longer shown
  });

  it('is updated when color changes', () => {
    let comp = new ColorField({ initialValue: { color: '#aabb23', opacity: 0.48 } });
    let ele = comp.currentColorDisplay().props.children;
    expect(ele.props.style.background).toBe('rgba(170,187,35,0.48)');
    comp.state.value = { color: '#4455aa', opacity: 0.11 };
    ele = comp.currentColorDisplay().props.children;
    expect(ele.props.style.background).toBe('rgba(68,85,170,0.11)');
    comp.state.value = { color: '#123456', opacity: 0.91 };
    ele = comp.currentColorDisplay().props.children;
    expect(ele.props.style.background).toBe('rgba(18,52,86,0.91)');
  });
});

describe('picker', () => {
  it('can be closed', () => {
    act(() => {
      render(<ColorField set={jest.fn()} />, container);
      // open the picker
      getCurrentColorDisplay().dispatchEvent(new Event('click', { bubbles: true }));
    });
    // div used to close the picker occupies the whole screen
    let closingDiv = getPicker().childNodes[0];
    let style = window.getComputedStyle(closingDiv);
    expect(style.position).toBe('fixed');
    expect(style.top + style.right + style.bottom + style.left).toBe('0px0px0px0px');
    // clicking on the div closes the picker
    act(() => closingDiv.dispatchEvent(new Event('click', { bubbles: true })));
    expect(getPicker()).toBeFalsy(); // picker was closed
  });

  it('displays the current color and opacity when rendered', () => {
    let comp = new ColorField({ initialValue: { color: '#5564ab', opacity: 0.42 } });
    let picker = comp.picker().props.children[1];
    expect(picker.props.color).toStrictEqual({ r: 85, g: 100, b: 171, a: 0.42 });
    comp.state.value = { color: '#bbca22', opacity: 0.19 };
    picker = comp.picker().props.children[1];
    expect(picker.props.color).toStrictEqual({ r: 187, g: 202, b: 34, a: 0.19 });
    comp.state.value = { color: '#ffca33', opacity: 0.66 };
    picker = comp.picker().props.children[1];
    expect(picker.props.color).toStrictEqual({ r: 255, g: 202, b: 51, a: 0.66 });
  });

  it('onChange callback updates the current color and opacity', () => {
    let comp = new ColorField({ initialValue: { color: '#11298a', opacity: 0.2 } });
    let picker = comp.picker().props.children[1];
    let spy = jest.spyOn(comp, 'setState');
    picker.props.onChange({ hex: '#4412bc', rgb: { a: 0.33 } });
    expect(spy.mock.calls[0][0].value).toStrictEqual({ color: '#4412bc', opacity: 0.33 });
    picker.props.onChange({ hex: '#AB11F5', rgb: { a: 0.71 } });
    expect(spy.mock.calls[1][0].value).toStrictEqual({ color: '#ab11f5', opacity: 0.71 }); // decapitalizes letters
    picker.props.onChange({ hex: '#f12', rgb: { a: 0.99 } });
    expect(spy.mock.calls[2][0].value).toStrictEqual({ color: '#ff1122', opacity: 0.99 }); // expands to 7 characters
    picker.props.onChange({ hex: '#A2D', rgb: { a: 0.58 } });
    expect(spy.mock.calls[3][0].value).toStrictEqual({ color: '#aa22dd', opacity: 0.58 }); // expands and decapitalizes
  });

  describe('adding value to recent colors when closed', () => {
    it('adds value when it is not a preset color', () => {
      let comp = new ColorField({
        initialValue: { color: '#123456', opacity: 1 },
        set: jest.fn()
      });
      let closingDiv = comp.picker().props.children[0];
      comp.state.value = { color: '#4455ab', opacity: 0.55 };
      closingDiv.props.onClick();
      expect(ColorField.recentColors.slice(-1)[0]).toBe('#4455ab');
    });

    it('does not add value when it is a preset color', () => {
      let comp = new ColorField({
        initialValue: { color: '#12bbca', opacity: 0.11 },
        set: jest.fn(),
      });
      let closingDiv = comp.picker().props.children[0];
      comp.state.value = { color: PRESET_COLORS.toArray()[2], opacity: 0.1 };
      let prev = ColorField.recentColors.slice();
      closingDiv.props.onClick();
      // are unchanged
      expect(ColorField.recentColors.slice().toString()).toBe(prev.toString());
    });
  });

  it('closing passes the current value to the set callback', () => {
    let set = jest.fn();
    let comp = new ColorField({
      initialValue: { color: '#abcdef', opacity: 0.3 },
      set: set,
    });
    comp.onChange({ hex: '#bbca56', rgb: { a: 0.2 } });
    // the on change callback would otherwise set the current value...
    comp.state.value = { color: '#bbca56', opacity: 0.2 };
    let closingDiv = comp.picker().props.children[0];
    expect(set).not.toHaveBeenCalled();
    closingDiv.props.onClick();
    expect(set.mock.calls[0][0]).toStrictEqual({ color: '#bbca56', opacity: 0.2 });
  });
});

describe('does not call set callback if just opened and closed', () => {
  it('first opening after creation', () => {
    let set = jest.fn();
    let comp = new ColorField({
      initialValue: { color: '#bbcc12', opacity: 0.45 },
      set: set,
    });
    comp.currentColorDisplay().props.onClick(); // open picker
    let closingDiv = comp.picker().props.children[0];
    closingDiv.props.onClick(); // close picker
    expect(set).not.toHaveBeenCalled();
  });

  it('not the first opening', () => {
    let set = jest.fn();
    let comp = new ColorField({
      initialValue: { color: '#acdef1', opacity: 1 },
      set: set,
    });
    comp.currentColorDisplay().props.onClick(); // open for first time
    comp.onChange({ hex: '#111222', rgb: { a: 0.5 } }); // change color
    let closingDiv = comp.picker().props.children[0];
    closingDiv.props.onClick(); // close picker
    expect(set).toHaveBeenCalledTimes(1);
    comp.currentColorDisplay().props.onClick(); // open for second time
    closingDiv = comp.picker().props.children[0];
    closingDiv.props.onClick(); // close without changing
    expect(set).toHaveBeenCalledTimes(1); // was not called again
  });
});
