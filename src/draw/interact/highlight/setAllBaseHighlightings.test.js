import setAllBaseHighlightings from './setAllBaseHighlightings';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import Drawing from '../../Drawing';
import { addCircleHighlighting } from 'Draw/bases/annotate/circle/add';

it('handles missing arguments', () => {
  expect(
    () => setAllBaseHighlightings(undefined, [])
  ).not.toThrow();
  expect(
    () => setAllBaseHighlightings(null, [])
  ).not.toThrow();
  expect(
    () => setAllBaseHighlightings(new Drawing(), undefined)
  ).not.toThrow();
  expect(
    () => setAllBaseHighlightings(new Drawing(), null)
  ).not.toThrow();
});

it('can remove highlighting', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => NodeSVG());
  let seq = drawing.appendSequence('asdf', 'asdf');
  let b2 = seq.getBaseAtPosition(2);
  let b4 = seq.getBaseAtPosition(4);
  addCircleHighlighting(b2);
  addCircleHighlighting(b4);
  setAllBaseHighlightings(
    drawing,
    [undefined, undefined, undefined, undefined],
  );
  expect(b2.highlighting).toBeFalsy();
  expect(b4.highlighting).toBeFalsy();
});

it('can add highlighting with default props', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => NodeSVG());
  let seq = drawing.appendSequence('asdf', 'asdf');
  let b2 = seq.getBaseAtPosition(2);
  setAllBaseHighlightings(
    drawing,
    [undefined, {}, undefined, undefined],
  );
  let h = b2.highlighting;
  expect(h.circle.attr('r')).toBeDefined();
  expect(h.circle.attr('stroke')).toBeDefined();
  expect(h.circle.attr('stroke-width')).toBeDefined();
  expect(h.circle.attr('fill')).toBeDefined();
  expect(h.circle.attr('fill-opacity')).toBeDefined();
});

it('can add highlighting with specified props', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => NodeSVG());
  let seq = drawing.appendSequence('asdf', 'asdf');
  let b3 = seq.getBaseAtPosition(3);
  let props = {
    radius: 10,
    stroke: 'cyan',
    strokeWidth: 1.37,
    fill: 'brown',
    fillOpacity: 0.815,
  };
  setAllBaseHighlightings(
    drawing,
    [undefined, undefined, props, undefined],
  );
  let h = b3.highlighting;
  expect(h.circle.attr('r')).toBeCloseTo(10);
  expect(h.circle.attr('stroke')).toBe('cyan');
  expect(h.circle.attr('stroke-width')).toBe(1.37);
  expect(h.circle.attr('fill')).toBe('brown');
  expect(h.circle.attr('fill-opacity')).toBe(0.815);
});

it('handles highlightings lists of wrong lengths', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => NodeSVG());
  let seq = drawing.appendSequence('asd', 'asd');
  let b1 = seq.getBaseAtPosition(1);
  let b2 = seq.getBaseAtPosition(2);
  let b3 = seq.getBaseAtPosition(3);
  setAllBaseHighlightings(
    drawing,
    [undefined, {}, undefined, undefined, {}], // too long
  );
  expect(b1.highlighting).toBeFalsy();
  expect(b2.highlighting).toBeTruthy();
  expect(b3.highlighting).toBeFalsy();
  setAllBaseHighlightings(
    drawing,
    [{}, undefined], // too short
  );
  expect(b1.highlighting).toBeTruthy();
  expect(b2.highlighting).toBeFalsy();
  expect(b3.highlighting).toBeFalsy();
});

it('handles multiple sequences', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => NodeSVG());
  let seq1 = drawing.appendSequence('asd', 'asd');
  let seq2 = drawing.appendSequence('qwe', 'qwe');
  let b2 = seq1.getBaseAtPosition(2);
  let b6 = seq2.getBaseAtPosition(3);
  setAllBaseHighlightings(
    drawing,
    [undefined, {}, undefined, undefined, undefined, {}],
  );
  expect(b2.highlighting).toBeTruthy();
  expect(b6.highlighting).toBeTruthy();
});
