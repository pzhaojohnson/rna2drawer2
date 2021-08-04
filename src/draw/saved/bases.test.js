import { getBaseByUniqueId } from './bases';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import Drawing from 'Draw/Drawing';

let container = null;
let drawing = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  drawing = new Drawing();
  drawing.addTo(container, () => NodeSVG());

  // test with multiple sequences
  drawing.appendSequenceOutOfView('Seq1', 'asdfQWERzxcvZXCV');
  drawing.appendSequenceOutOfView('Seq2', 'QQWWeerr');
  drawing.appendSequenceOutOfView('Seq3', '1234cc5678');
});

afterEach(() => {
  drawing.clear();
  drawing = null;

  container.remove();
  container = null;
});

describe('getBaseByUniqueId function', () => {
  it('gets the base with the given ID', () => {
    let b = drawing.getBaseAtOverallPosition(20);
    expect(getBaseByUniqueId(drawing, b.id)).toBe(b);
  });

  it('checks that the given ID is a string', () => {
    [5, true, {}, null, undefined].forEach(v => {
      expect(
        () => getBaseByUniqueId(drawing, v)
      ).toThrow();
    });
  });

  it('throws if no base has the given ID', () => {
    let id = 'asdf';
    // no base has the ID
    drawing.bases().forEach(b => {
      expect(b.id).not.toEqual(id);
    });
    expect(
      () => getBaseByUniqueId(drawing, id)
    ).toThrow();
  });

  it('throws if the given ID is not unique', () => {
    let b15 = drawing.getBaseAtOverallPosition(15);
    let b21 = drawing.getBaseAtOverallPosition(21);
    b21.text.id(b15.id);
    // now have the same ID
    expect(b21.id).toBe(b15.id);
    expect(
      () => getBaseByUniqueId(drawing, b15.id)
    ).toThrow();
  });
});
