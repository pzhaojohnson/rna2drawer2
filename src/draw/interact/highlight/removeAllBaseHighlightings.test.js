import removeAllBaseHighlightings from './removeAllBaseHighlightings';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import Drawing from '../../Drawing';
import { addCircleHighlighting } from 'Draw/bases/annotate/circle/add';

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
  let seq1 = drawing.appendSequence('asdf', 'asdf');
  let seq2 = drawing.appendSequence('qwer', 'qwer');
  let seq3 = drawing.appendSequence('zxcv', 'zxcv');
  addCircleHighlighting(seq1.getBaseAtPosition(2));
  addCircleHighlighting(seq2.getBaseAtPosition(3));
  addCircleHighlighting(seq3.getBaseAtPosition(1));
  removeAllBaseHighlightings(drawing);
  drawing.forEachBase(b => {
    expect(b.highlighting).toBeFalsy();
  });
});
