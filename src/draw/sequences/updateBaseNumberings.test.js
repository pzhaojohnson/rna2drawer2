import { updateBaseNumberings } from './updateBaseNumberings';
import Drawing from 'Draw/Drawing';
import { NodeSVG } from 'Draw/svg/NodeSVG';
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

  drawing = new Drawing({ SVG: { SVG: NodeSVG } });
  drawing.appendTo(container);
});

afterEach(() => {
  drawing.clear();
  drawing = null;

  container.remove();
  container = null;
});

describe('updateBaseNumberings function', () => {
  it('updates base numberings', () => {
    drawing.appendSequence('asdf', 'ASDFasdfQWERzxcvZ');
    let seq = drawing.sequences[0];
    addNumbering(seq.bases[14], 101); // must remove
    addNumbering(seq.bases[8], 37); // may maintain
    updateBaseNumberings(seq, { offset: 28, increment: 6, anchor: -3 });
    expect(baseNumbers(seq)).toEqual(
      [null, null, 31, null, null, null, null, null, 37, null, null, null, null, null, 43, null, null]
    );
  });

  it('handles negative numbering increments', () => {
    // a negative numbering increment could cause an infinite loop
    // depending on how the bases of the sequence are iterated over
    drawing.appendSequence('qwer', 'qwerQWERasdfASDF');
    let seq = drawing.sequences[0];
    updateBaseNumberings(seq, { offset: 0, increment: -5, anchor: 0 }); // doesn't infinite loop
  });
});
