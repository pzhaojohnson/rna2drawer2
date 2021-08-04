import {
  minSelected,
  maxSelected,
  selectedRange,
  selectedCharacters,
} from './selected';
import StrictDrawing from '../../StrictDrawing';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import FoldingMode from './FoldingMode';

let sd = new StrictDrawing();
sd.addTo(document.body, () => NodeSVG());
let mode = new FoldingMode(sd);
sd.appendSequence('asdf', 'asdfasdf');
sd.appendSequence('qwer', 'qwerqw');
sd.appendSequence('zxcv', 'zxcvzxcvzxcvzxcv');

describe('minSelected and maxSelected functions', () => {
  it('with a selection', () => {
    mode.selected = { tightEnd: 8, looseEnd: 14 };
    expect(minSelected(mode)).toBe(8);
    expect(maxSelected(mode)).toBe(14);
    mode.selected = { tightEnd: 16, looseEnd: 11 };
    expect(minSelected(mode)).toBe(11);
    expect(maxSelected(mode)).toBe(16);
  });

  it('with no selection', () => {
    mode.selected = undefined;
    expect(minSelected(mode)).toBe(NaN);
    expect(maxSelected(mode)).toBe(NaN);
  });
});

describe('selectedRange function', () => {
  it('with a selection', () => {
    mode.selected = { tightEnd: 2, looseEnd: 12 };
    let r1 = selectedRange(mode);
    expect(r1.start).toBe(2);
    expect(r1.end).toBe(12);
    mode.selected = { tightEnd: 9, looseEnd: 6 };
    let r2 = selectedRange(mode);
    expect(r2.start).toBe(6);
    expect(r2.end).toBe(9);
  });

  it('with no selection', () => {
    mode.selected = undefined;
    let r = selectedRange(mode);
    expect(r).toBeFalsy();
  });
});

describe('selectecCharacters function', () => {
  it('with a selection', () => {
    mode.selected = { tightEnd: 6, looseEnd: 10 };
    expect(selectedCharacters(mode)).toBe('sdfqw');
    mode.selected = { tightEnd: 18, looseEnd: 12 };
    expect(selectedCharacters(mode)).toBe('rqwzxcv');
  });

  it('with no selection', () => {
    mode.selected = undefined;
    expect(selectedCharacters(mode)).toBe('');
  });
});
