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
      render(<ColorField name={'asdf'} initialValue={'#11bbfa'} />, container);
    });
    expect(ColorField.recentColors.slice(-1)[0]).toBe('#11bbfa');
  });

  it('is not added when is one of the preset colors', () => {
    let prev = ColorField.recentColors.slice();
    act(() => {
      render(<ColorField name={'asdf'} initialValue={PRESET_COLORS.toArray()[1]} />, container);
    });
    // are unchanged
    expect(ColorField.recentColors.slice().toString()).toBe(prev.toString());
  });
});

describe('current color display', () => {
  it('shows current color if provided', () => {
    act(() => {
      render(<ColorField initialValue={'#aa1123'} />, container);
    });
    let style = window.getComputedStyle(getCurrentColorDisplay().childNodes[0]);
    expect(style.background).toBe('rgb(170, 17, 35)');
  });

  it('shows black by default', () => {
    act(() => {
      render(<ColorField />, container);
    });
    let style = window.getComputedStyle(getCurrentColorDisplay().childNodes[0]);
    expect(style.background).toBe('rgb(0, 0, 0)');
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
    let comp = new ColorField({ initialValue: '#aabb23' });
    let ele = comp.currentColorDisplay().props.children;
    expect(ele.props.style.background).toBe('#aabb23');
    comp.state.value = '#4455aa';
    ele = comp.currentColorDisplay().props.children;
    expect(ele.props.style.background).toBe('#4455aa');
    comp.state.value = '#123456';
    ele = comp.currentColorDisplay().props.children;
    expect(ele.props.style.background).toBe('#123456');
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

  it('setting alpha value is disabled', () => {
    // handling alpha values is to be implemented in the future
    let comp = new ColorField({ initialValue: '#112233' });
    let picker = comp.picker().props.children[1];
    expect(picker.props.disableAlpha).toBe(true);
  });

  it('displays the current color when first rendered', () => {
    let comp = new ColorField({ initialValue: '#5564ab' });
    let picker = comp.picker().props.children[1];
    expect(picker.props.color).toBe('#5564ab');
    comp.state.value = '#bbca22';
    picker = comp.picker().props.children[1];
    expect(picker.props.color).toBe('#bbca22');
    comp.state.value = '#ffca33';
    picker = comp.picker().props.children[1];
    expect(picker.props.color).toBe('#ffca33');
  });

  it('onChange callback updates the current color', () => {
    let comp = new ColorField({ initialValue: '#11298a' });
    let picker = comp.picker().props.children[1];
    let spy = jest.spyOn(comp, 'setState');
    picker.props.onChange({ hex: '#4412bc' });
    expect(spy.mock.calls[0][0].value).toBe('#4412bc');
    picker.props.onChange({ hex: '#AB11F5' });
    expect(spy.mock.calls[1][0].value).toBe('#ab11f5'); // decapitalizes letters
    picker.props.onChange({ hex: '#f12' });
    expect(spy.mock.calls[2][0].value).toBe('#ff1122'); // expands to 7 characters
    picker.props.onChange({ hex: '#A2D' });
    expect(spy.mock.calls[3][0].value).toBe('#aa22dd'); // expands and decapitalizes
  });

  describe('adding value to recent colors when closed', () => {
    it('adds value when it is not a preset color', () => {
      let comp = new ColorField({ initialValue: '#123456', set: jest.fn() });
      let closingDiv = comp.picker().props.children[0];
      comp.state.value = '#4455ab';
      closingDiv.props.onClick();
      expect(ColorField.recentColors.slice(-1)[0]).toBe('#4455ab');
    });

    it('does not add value when it is a preset color', () => {
      let comp = new ColorField({ initialValue: '#12bbca', set: jest.fn() });
      let closingDiv = comp.picker().props.children[0];
      comp.state.value = PRESET_COLORS.toArray()[2];
      let prev = ColorField.recentColors.slice();
      closingDiv.props.onClick();
      // are unchanged
      expect(ColorField.recentColors.slice().toString()).toBe(prev.toString());
    });
  });

  it('closing passes the current value to the set callback', () => {
    let set = jest.fn();
    let comp = new ColorField({ initialValue: '#abcdef', set: set });
    let closingDiv = comp.picker().props.children[0];
    comp.state.value = '#bbca56';
    expect(set).not.toHaveBeenCalled();
    closingDiv.props.onClick();
    expect(set.mock.calls[0][0]).toBe('#bbca56');
  });
});
