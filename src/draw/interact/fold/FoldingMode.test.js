import FoldingMode from './FoldingMode';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import StrictDrawing from '../../StrictDrawing';
import { round } from '../../../math/round';

let sd = new StrictDrawing();
sd.addTo(document.body, () => NodeSVG());
let mode = new FoldingMode(sd);

it('className getter', () => {
  expect(mode.className).toBe('FoldingMode');
});

it('strictDrawing getter', () => {
  expect(mode.strictDrawing).toBe(sd);
});

it('rounds allowed mismatch', () => {
  let am = 5.19278391014;
  mode.allowedMismatch = am;
  let rounded = round(am, mode.allowedMismatchPrecision);
  expect(am).not.toEqual(rounded);
  expect(mode.allowedMismatch).toEqual(rounded);
});

it('switching between submodes', () => {
  let spy = jest.spyOn(mode, 'fireChange');

  mode.onlyAddTertiaryBonds();
  expect(mode.pairingComplements()).toBeFalsy();
  expect(mode.forcePairing()).toBeFalsy();
  expect(mode.onlyAddingTertiaryBonds()).toBeTruthy();
  expect(spy).toHaveBeenCalledTimes(1);

  mode.forcePair();
  expect(mode.pairingComplements()).toBeFalsy();
  expect(mode.forcePairing()).toBeTruthy();
  expect(mode.onlyAddingTertiaryBonds()).toBeFalsy();
  expect(spy).toHaveBeenCalledTimes(2);
  
  mode.pairComplements();
  expect(mode.pairingComplements()).toBeTruthy();
  expect(mode.forcePairing()).toBeFalsy();
  expect(mode.onlyAddingTertiaryBonds()).toBeFalsy();
  expect(spy).toHaveBeenCalledTimes(3);
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
