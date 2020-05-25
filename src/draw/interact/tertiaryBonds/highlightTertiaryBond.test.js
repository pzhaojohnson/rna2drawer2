import {
  highlightTertiaryBond,
  dehighlightTertiaryBond,
} from './highlightTertiaryBond';
import NodeSVG from '../../NodeSVG';
import Drawing from '../../Drawing';

let drawing = new Drawing();
drawing.addTo(document.body, () => NodeSVG());
let seq = drawing.appendSequenceOutOfView('asdf', 'asdf');
let b1 = seq.getBaseAtPosition(1);
let b2 = seq.getBaseAtPosition(2);

describe('highlightTertiaryBond function', () => {
  it('returns early for missing tertiary bond', () => {
    expect(
      () => highlightTertiaryBond(undefined)
    ).not.toThrow();
    expect(
      () => highlightTertiaryBond(null)
    ).not.toThrow();
  });

  it('returns early for removed tertiary bond', () => {
    let tb = drawing.addTertiaryBond(b1, b2);
    tb.remove();
    expect(tb.hasBeenRemoved()).toBeTruthy();
    expect(
      () => highlightTertiaryBond(tb)
    ).not.toThrow();
  });

  it('highlights the tertiary bond', () => {
    let tb = drawing.addTertiaryBond(b1, b2);
    tb.stroke = '#0000ff';
    tb.fill = 'none';
    tb.fillOpacity = 0;
    highlightTertiaryBond(tb);
    expect(tb.fill).toBe(tb.stroke);
    expect(tb.fillOpacity).toBeGreaterThan(0);
  });
});

describe('dehighlightTertiaryBond function', () => {
  it('returns early for missing tertiary bond', () => {
    expect(
      () => dehighlightTertiaryBond(undefined)
    ).not.toThrow();
    expect(
      () => dehighlightTertiaryBond(null)
    ).not.toThrow();
  });

  it('returns early for removed tertiary bond', () => {
    let tb = drawing.addTertiaryBond(b1, b2);
    tb.remove();
    expect(tb.hasBeenRemoved()).toBeTruthy();
    expect(
      () => dehighlightTertiaryBond(tb)
    ).not.toThrow();
  });

  it('dehighlights the tertiary bond', () => {
    let tb = drawing.addTertiaryBond(b1, b2);
    tb.stroke = '#0000ff';
    tb.fill = tb.stroke;
    tb.fillOpacity = 0.1;
    dehighlightTertiaryBond(tb);

    /* Set fill to none rather than setting fill opacity to zero
    so that the mouse can hover over elements beneath the fill. */
    expect(tb.fill).toBe('none');
  });
});
