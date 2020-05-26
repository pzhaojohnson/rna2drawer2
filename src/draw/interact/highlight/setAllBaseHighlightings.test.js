import setAllBaseHighlightings from './setAllBaseHighlightings';
import NodeSVG from '../../NodeSVG';
import Drawing from '../../Drawing';

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
  let seq = drawing.appendSequenceOutOfView('asdf', 'asdf');
  let b2 = seq.getBaseAtPosition(2);
  let b4 = seq.getBaseAtPosition(4);
  b2.addCircleHighlighting();
  b4.addCircleHighlighting();
  setAllBaseHighlightings(
    drawing,
    [undefined, undefined, undefined, undefined],
  );
  expect(b2.hasHighlighting()).toBeFalsy();
  expect(b4.hasHighlighting()).toBeFalsy();
});

it('can add highlighting with default props', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => NodeSVG());
  let seq = drawing.appendSequenceOutOfView('asdf', 'asdf');
  let b2 = seq.getBaseAtPosition(2);
  setAllBaseHighlightings(
    drawing,
    [undefined, {}, undefined, undefined],
  );
  let h = b2.highlighting;
  expect(h.radius).toBeDefined();
  expect(h.stroke).toBeDefined();
  expect(h.strokeWidth).toBeDefined();
  expect(h.fill).toBeDefined();
  expect(h.fillOpacity).toBeDefined();
});

it('can add highlighting with specified props', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => NodeSVG());
  let seq = drawing.appendSequenceOutOfView('asdf', 'asdf');
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
  expect(h.radius).toBeCloseTo(10);
  expect(h.stroke).toBe('cyan');
  expect(h.strokeWidth).toBe(1.37);
  expect(h.fill).toBe('brown');
  expect(h.fillOpacity).toBe(0.815);
});

it('handles highlightings lists of wrong lengths', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => NodeSVG());
  let seq = drawing.appendSequenceOutOfView('asd', 'asd');
  let b1 = seq.getBaseAtPosition(1);
  let b2 = seq.getBaseAtPosition(2);
  let b3 = seq.getBaseAtPosition(3);
  setAllBaseHighlightings(
    drawing,
    [undefined, {}, undefined, undefined, {}], // too long
  );
  expect(b1.hasHighlighting()).toBeFalsy();
  expect(b2.hasHighlighting()).toBeTruthy();
  expect(b3.hasHighlighting()).toBeFalsy();
  setAllBaseHighlightings(
    drawing,
    [{}, undefined], // too short
  );
  expect(b1.hasHighlighting()).toBeTruthy();
  expect(b2.hasHighlighting()).toBeFalsy();
  expect(b3.hasHighlighting()).toBeFalsy();
});

it('handles multiple sequences', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => NodeSVG());
  let seq1 = drawing.appendSequenceOutOfView('asd', 'asd');
  let seq2 = drawing.appendSequenceOutOfView('qwe', 'qwe');
  let b2 = seq1.getBaseAtPosition(2);
  let b6 = seq2.getBaseAtPosition(3);
  setAllBaseHighlightings(
    drawing,
    [undefined, {}, undefined, undefined, undefined, {}],
  );
  expect(b2.hasHighlighting()).toBeTruthy();
  expect(b6.hasHighlighting()).toBeTruthy();
});
