import FoldingMode from './FoldingMode';
import NodeSVG from '../../NodeSVG';
import StrictDrawing from '../../StrictDrawing';

let sd = new StrictDrawing();
sd.addTo(document.body, () => NodeSVG());
let mode = new FoldingMode(sd);

it('className getter', () => {
  expect(mode.className).toBe('FoldingMode');
});

it('strictDrawing getter', () => {
  expect(mode.strictDrawing).toBe(sd);
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
