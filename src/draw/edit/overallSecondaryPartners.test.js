import overallSecondaryPartners from './overallSecondaryPartners';
import Drawing from '../Drawing';
import createNodeSVG from '../createNodeSVG';

it('handles no secondary bonds', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => createNodeSVG());
  drawing.appendSequenceOutOfView('asdf', 'asdf');
  let partners = overallSecondaryPartners(drawing);
  expect(partners.length).toBe(4);
  partners.forEach(v => {
    expect(v).toBe(null);
  });
});

it('handles multiple sequences and knots', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => createNodeSVG());
  let seq1 = drawing.appendSequenceOutOfView('asdf', 'asdf');
  let seq2 = drawing.appendSequenceOutOfView('qwer', 'qwerqwer');
  drawing.addSecondaryBond(
    seq1.getBaseAtPosition(1),
    seq2.getBaseAtPosition(7),
  );
  drawing.addSecondaryBond(
    seq1.getBaseAtPosition(4),
    seq2.getBaseAtPosition(5),
  );
  drawing.addSecondaryBond(
    seq1.getBaseAtPosition(3),
    seq2.getBaseAtPosition(2),
  );
  let partners = overallSecondaryPartners(drawing);
  let expected = [11, null, 6, 9, null, 3, null, null, 4, null, 1, null];
  expect(partners.length).toBe(expected.length);
  expected.forEach((v, i) => {
    expect(partners[i]).toBe(v);
  });
});
