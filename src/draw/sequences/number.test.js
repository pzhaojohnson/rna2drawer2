import { updateBaseNumberings } from './number';
import Drawing from 'Draw/Drawing';
import { NodeSVG } from 'Draw/NodeSVG';
import { addNumbering } from 'Draw/bases/number/add';

function baseNumbers(seq) {
  let ns = [];
  seq.bases.forEach(b => {
    if (b.numbering) {
      ns.push(Number(b.numbering.text.text()));
    } else {
      ns.push(null);
    }
  });
  return ns;
}

let container = null;
let drawing = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  drawing = new Drawing();
  drawing.addTo(container, () => NodeSVG());
});

afterEach(() => {
  drawing.clear();
  drawing = null;

  container.remove();
  container = null;
});

describe('updateBaseNumberings function', () => {
  it('updates base numberings', () => {
    drawing.appendSequenceOutOfView('asdf', 'ASDFasdfQWERzxcvZ');
    let seq = drawing.sequences[0];
    seq.numberingOffset = 28;
    seq.numberingAnchor = -3;
    seq.numberingIncrement = 6;
    addNumbering(seq.bases[14], 101); // must remove
    addNumbering(seq.bases[8], 37); // may maintain
    updateBaseNumberings(seq);
    expect(baseNumbers(seq)).toEqual(
      [null, null, 31, null, null, null, null, null, 37, null, null, null, null, null, 43, null, null]
    );
  });

  it('handles negative numbering increments', () => {
    // a negative numbering increment could cause an infinite loop
    // depending on how the bases of the sequence are iterated over
    drawing.appendSequenceOutOfView('qwer', 'qwerQWERasdfASDF');
    let seq = drawing.sequences[0];
    seq.numberingOffset = 0;
    seq.numberingAnchor = 0;
    seq.numberingIncrement = -5;
    updateBaseNumberings(seq); // doesn't infinite loop
  });
});
