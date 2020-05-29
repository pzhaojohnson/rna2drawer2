import FoldingMode from './FoldingMode';
import NodeSVG from '../../NodeSVG';
import StrictDrawing from '../../StrictDrawing';

jest.mock('./handleMouseoverOnBase');
import handleMouseoverOnBase from './handleMouseoverOnBase';

jest.mock('./handleMouseoutOnBase');
import handleMouseoutOnBase from './handleMouseoutOnBase';

jest.mock('./handleMousedownOnBase');
import handleMousedownOnBase from './handleMousedownOnBase';

jest.mock('./handleMousedownOnDrawing');
import handleMousedownOnDrawing from './handleMousedownOnDrawing';

jest.mock('./handleMouseup');
import handleMouseup from './handleMouseup';

jest.mock('../highlight/removeAllBaseHighlightings');
import removeAllBaseHighlightings from '../highlight/removeAllBaseHighlightings';

let sd = new StrictDrawing();
sd.addTo(document.body, () => NodeSVG());
let mode = new FoldingMode(sd);

it('className getter', () => {
  expect(mode.className).toBe('FoldingMode');
});

it('strictDrawing getter', () => {
  expect(mode.strictDrawing).toBe(sd);
});

describe('minSelected, maxSelected and selectedLength getters', () => {
  it('nothing selected', () => {
    mode.selected = null;
    expect(mode.minSelected).toBe(null);
    expect(mode.maxSelected).toBe(null);
    expect(mode.selectedLength).toBe(0);
  });

  it('tight end is smaller', () => {
    mode.selected = {
      tightEnd: 5,
      looseEnd: 10,
    };
    expect(mode.minSelected).toBe(5);
    expect(mode.maxSelected).toBe(10);
    expect(mode.selectedLength).toBe(6);
  });

  it('loose end is smaller', () => {
    mode.selected = {
      tightEnd: 12,
      looseEnd: 8,
    };
    expect(mode.minSelected).toBe(8);
    expect(mode.maxSelected).toBe(12);
    expect(mode.selectedLength).toBe(5);
  });
});

describe('withinSelected method', () => {
  it('nothing selected', () => {
    mode.selected = null;
    expect(mode.withinSelected(2)).toBeFalsy();
  });

  it('with selection', () => {
    mode.selected = {
      tightEnd: 2,
      looseEnd: 4,
    };
    expect(mode.withinSelected(1)).toBeFalsy();
    expect(mode.withinSelected(2)).toBeTruthy();
    expect(mode.withinSelected(3)).toBeTruthy();
    expect(mode.withinSelected(4)).toBeTruthy();
    expect(mode.withinSelected(5)).toBeFalsy();
  });
});

describe('overlapsSelected method', () => {
  it('nothing selected', () => {
    mode.selected = null;
    expect(mode.overlapsSelected(1, 2)).toBeFalsy();
  });

  it('with selection', () => {
    mode.selected = {
      tightEnd: 5,
      looseEnd: 9,
    };
    expect(mode.overlapsSelected(2, 4)).toBeFalsy();
    expect(mode.overlapsSelected(3, 6)).toBeTruthy();
    expect(mode.overlapsSelected(6, 8)).toBeTruthy();
    expect(mode.overlapsSelected(9, 11)).toBeTruthy();
    expect(mode.overlapsSelected(10, 12)).toBeFalsy();
  });
});

describe('hoveringSelected method', () => {
  it('has hovering but no selection', () => {
    mode.hovered = 5;
    mode.selected = null;
    expect(mode.hoveringSelected()).toBeFalsy();
  });

  it('has selection but no hovering', () => {
    mode.hovered = null;
    mode.selected = {
      tightEnd: 5,
      looseEnd: 8,
    };
    expect(mode.hoveringSelected()).toBeFalsy();
  });

  it('has hovering and selection', () => {
    mode.selected = {
      tightEnd: 6,
      looseEnd: 8,
    };
    mode.hovered = 5;
    expect(mode.hoveringSelected()).toBeFalsy();
    mode.hovered = 6;
    expect(mode.hoveringSelected()).toBeTruthy();
    mode.hovered = 10;
    expect(mode.hoveringSelected()).toBeFalsy();
  });
});

it('handleMouseoverOnBase method', () => {
  let f = jest.fn();
  handleMouseoverOnBase.mockImplementation(f);
  let b = jest.fn();
  mode.handleMouseoverOnBase(b);
  expect(f.mock.calls[0][0]).toBe(mode);
  expect(f.mock.calls[0][1]).toBe(b);
});

it('handleMouseoutOnBase method', () => {
  let f = jest.fn();
  handleMouseoutOnBase.mockImplementation(f);
  let b = jest.fn();
  mode.handleMouseoutOnBase(b);
  expect(f.mock.calls[0][0]).toBe(mode);
  expect(f.mock.calls[0][1]).toBe(b);
});

it('handleMousedownOnBase method', () => {
  let f = jest.fn();
  handleMousedownOnBase.mockImplementation(f);
  let b = jest.fn();
  mode.handleMousedownOnBase(b);
  expect(f.mock.calls[0][0]).toBe(mode);
  expect(f.mock.calls[0][1]).toBe(b);
});

it('handleMousedownOnDrawing method', () => {
  let f = jest.fn();
  handleMousedownOnDrawing.mockImplementation(f);
  mode.handleMousedownOnDrawing();
  expect(f.mock.calls[0][0]).toBe(mode);
});

it('binds mouseup event', () => {
  let f = jest.fn();
  handleMouseup.mockImplementation(f);
  window.dispatchEvent(new Event('mouseup'));
  expect(f.mock.calls[0][0]).toBe(mode);
});

it('reset method', () => {
  mode.hovered = 5;
  mode.selected = {
    tightEnd: 6,
    looseEnd: 8,
  };
  mode.selecting = true;
  let f = jest.fn();
  removeAllBaseHighlightings.mockImplementation(f);
  mode.reset();
  expect(mode.hovered).toBe(null);
  expect(mode.selected).toBe(null);
  expect(mode.selecting).toBe(false);
  expect(f.mock.calls[0][0]).toBe(sd.drawing);
});

it('disabling and enabling', () => {
  mode.disable();
  expect(mode.disabled()).toBeTruthy();
  expect(mode.enable()).toBeFalsy();
  mode.enable();
  expect(mode.disabled()).toBeFalsy();
  expect(mode.enabled()).toBeTruthy();
  mode.disable();
  expect(mode.disabled()).toBeTruthy();
  expect(mode.enabled()).toBeFalsy();
});

describe('shouldPushUndo event', () => {
  it('firing without binding', () => {
    let mode = new FoldingMode(sd);
    expect(
      () => mode.fireShouldPushUndo()
    ).not.toThrow();
  });

  it('can be bound', () => {
    let f = jest.fn();
    mode.onShouldPushUndo(f);
    mode.fireShouldPushUndo();
    expect(f.mock.calls.length).toBe(1);
  });
});

describe('change event', () => {
  it('firing without binding', () => {
    let mode = new FoldingMode(sd);
    expect(
      () => mode.fireChange()
    ).not.toThrow();
  });

  it('can be bound', () => {
    let f = jest.fn();
    mode.onChange(f);
    mode.fireChange();
    expect(f.mock.calls.length).toBe(1);
  });
});
