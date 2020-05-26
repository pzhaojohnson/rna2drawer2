import removeAllBaseHighlightings from './removeAllBaseHighlightings';
import NodeSVG from '../../NodeSVG';
import Drawing from '../../Drawing';

it('handles missing drawing argument', () => {
  expect(
    () => removeAllBaseHighlightings(undefined)
  ).not.toThrow();
  expect(
    () => removeAllBaseHighlightings(null)
  ).not.toThrow();
});

it('handles multiple sequences', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => NodeSVG());
  let seq1 = drawing.appendSequenceOutOfView('asdf', 'asdf');
  let seq2 = drawing.appendSequenceOutOfView('qwer', 'qwer');
  let seq3 = drawing.appendSequenceOutOfView('zxcv', 'zxcv');
  seq1.getBaseAtPosition(2).addCircleHighlighting();
  seq2.getBaseAtPosition(3).addCircleHighlighting();
  seq3.getBaseAtPosition(1).addCircleHighlighting();
  removeAllBaseHighlightings(drawing);
  drawing.forEachBase(b => {
    expect(b.hasHighlighting()).toBeFalsy();
  });
});
