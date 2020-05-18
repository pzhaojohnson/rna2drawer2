import layoutPartnersOfStrictDrawing from './layoutPartnersOfStrictDrawing';
import StrictDrawing from '../StrictDrawing';
import createNodeSVG from '../createNodeSVG';

import validatePartners from '../../parse/validatePartners';
import isKnotless from '../../parse/isKnotless';

it('handles no secondary bonds', () => {
  let sd = new StrictDrawing();
  sd.addTo(document.body, () => createNodeSVG());
  sd.appendSequence('asdf', 'asdf');
  let partners = layoutPartnersOfStrictDrawing(sd);
  expect(partners.length).toBe(4);
  partners.forEach(v => {
    expect(v).toBe(null);
  });
});

it('handles multiple sequences', () => {
  let sd = new StrictDrawing();
  sd.addTo(document.body, () => createNodeSVG());
  sd.appendSequence('asdf', 'asdf');
  sd.appendSequence('qwer', 'qwerqwer');
  let drawing = sd.drawing;
  let seq1 = drawing.getSequenceById('asdf');
  let seq2 = drawing.getSequenceById('qwer');
  drawing.addSecondaryBond(
    seq1.getBaseAtPosition(1),
    seq2.getBaseAtPosition(7),
  );
  drawing.addSecondaryBond(
    seq1.getBaseAtPosition(4),
    seq2.getBaseAtPosition(5),
  );
  let partners = layoutPartnersOfStrictDrawing(sd);
  let expected = [11, null, null, 9, null, null, null, null, 4, null, 1, null];
  expect(partners.length).toBe(expected.length);
  expected.forEach((v, i) => {
    expect(partners[i]).toBe(v);
  });
});

it('removes knots', () => {
  let sd = new StrictDrawing();
  sd.addTo(document.body, () => createNodeSVG());
  sd.appendSequence('asdf', 'asdfasdfasdf');
  let drawing = sd.drawing;
  let seq = drawing.getSequenceById('asdf');
  drawing.addSecondaryBond(
    seq.getBaseAtPosition(1),
    seq.getBaseAtPosition(7),
  );
  drawing.addSecondaryBond(
    seq.getBaseAtPosition(3),
    seq.getBaseAtPosition(11),
  );
  let partners = layoutPartnersOfStrictDrawing(sd);
  expect(() => validatePartners(partners)).not.toThrow();
  expect(isKnotless(partners)).toBeTruthy();
});

it('handles secondary bonds that share bases', () => {
  let sd = new StrictDrawing();
  sd.addTo(document.body, () => createNodeSVG());
  sd.appendSequence('asdf', 'asdfasdfasdf');
  let drawing = sd.drawing;
  let seq = drawing.getSequenceById('asdf');
  drawing.addSecondaryBond(
    seq.getBaseAtPosition(2),
    seq.getBaseAtPosition(6),
  );
  drawing.addSecondaryBond(
    seq.getBaseAtPosition(6),
    seq.getBaseAtPosition(12),
  );
  let partners = layoutPartnersOfStrictDrawing(sd);
  expect(() => validatePartners(partners)).not.toThrow();
});
