import TertiaryBondsInteraction from './TertiaryBondsInteraction';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import Drawing from '../../Drawing';

let drawing = new Drawing();
drawing.addTo(document.body, () => NodeSVG());

describe('shouldPushUndo event', () => {
  it('can fire with no binding', () => {
    let tbi = new TertiaryBondsInteraction(drawing);
    expect(tbi._onShouldPushUndo).toBeFalsy();
    expect(
      () => tbi.fireShouldPushUndo()
    ).not.toThrow();
  });

  it('can be bound', () => {
    let tbi = new TertiaryBondsInteraction(drawing);
    let cb = jest.fn();
    tbi.onShouldPushUndo(cb);
    expect(cb.mock.calls.length).toBe(0);
    tbi.fireShouldPushUndo();
    expect(cb.mock.calls.length).toBe(1);
  });
});

describe('change event', () => {
  it('can fire with no binding', () => {
    let tbi = new TertiaryBondsInteraction(drawing);
    expect(tbi._onChange).toBeFalsy();
    expect(
      () => tbi.fireChange()
    ).not.toThrow();
  });

  it('can be bound', () => {
    let tbi = new TertiaryBondsInteraction(drawing);
    let cb = jest.fn();
    tbi.onChange(cb);
    expect(cb.mock.calls.length).toBe(0);
    tbi.fireChange();
    expect(cb.mock.calls.length).toBe(1);
  });
});
