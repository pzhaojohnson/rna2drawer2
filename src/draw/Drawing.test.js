import Drawing from './Drawing';
import NodeSVG from './NodeSVG';
import { Sequence } from 'Draw/sequences/Sequence';
import { Base } from 'Draw/bases/Base';
import * as AdjustBaseNumbering from './edit/adjustBaseNumbering';
import { addPrimaryBond } from 'Draw/bonds/straight/add';
import { savableState as savableStraightBondState } from 'Draw/bonds/straight/save';
import { savableState as savableTertiaryBondState } from 'Draw/bonds/curved/save';

let drawing = new Drawing();
let container = document.createElement('div');
document.body.appendChild(container);
drawing.addTo(container, () => NodeSVG());
let seq1 = drawing.appendSequenceOutOfView('asdf', 'asdfasdf');
let seq2 = drawing.appendSequenceOutOfView('qwer', 'qwerqwerqwer');
let pb1 = addPrimaryBond(
  drawing,
  seq1.getBaseAtPosition(1),
  seq1.getBaseAtPosition(2),
);
let pb2 = addPrimaryBond(
  drawing,
  seq2.getBaseAtPosition(4),
  seq2.getBaseAtPosition(5),
);
let sb1 = drawing.addSecondaryBond(
  seq1.getBaseAtPosition(2),
  seq2.getBaseAtPosition(11),
);
let sb2 = drawing.addSecondaryBond(
  seq2.getBaseAtPosition(1),
  seq2.getBaseAtPosition(6),
);
let tb1 = drawing.addTertiaryBond(
  seq2.getBaseAtPosition(2),
  seq1.getBaseAtPosition(2),
);
let tb2 = drawing.addTertiaryBond(
  seq1.getBaseAtPosition(8),
  seq2.getBaseAtPosition(7),
);

describe('addTo and centerView methods', () => {
  let drawing = new Drawing();
  let container = document.createElement('div');
  document.body.appendChild(container);
  drawing.addTo(container, () => NodeSVG());

  it('addTo method added the drawing', () => {
    expect(container.childNodes.length).toBe(1); // added the drawing
  });

  it('centerView method does not throw', () => {
    drawing.setWidthAndHeight(3000, 2000);
    expect(() => drawing.centerView()).not.toThrow();
  });
});

describe('width, height and zoom properties', () => {
  let drawing = new Drawing();
  let container = document.createElement('div');
  document.body.appendChild(container);
  drawing.addTo(container, () => NodeSVG());

  it('normal use of width and height setter', () => {
    // initialize width and height to nonzero values
    drawing.setWidthAndHeight(100, 100);
    drawing.zoom = 1.78;
    drawing.setWidthAndHeight(872, 1656); // use setter
    expect(drawing.width).toBe(872); // check getter
    expect(drawing.svg.viewbox().width).toBe(872); // check actual value
    expect(drawing.height).toBe(1656); // check getter
    expect(drawing.svg.viewbox().height).toBe(1656); // check actual value
    // maintains zoom
    expect(drawing.zoom).toBeCloseTo(1.78); // check getter
    // check actual values
    expect(drawing.svg.attr('width')).toBeCloseTo(1.78 * 872);
    expect(drawing.svg.attr('height')).toBeCloseTo(1.78 * 1656);
  });

  it('width and height setter ignores negative values', () => {
    drawing.setWidthAndHeight(200, 300);
    drawing.setWidthAndHeight(-50, 200); // negative width
    expect(drawing.width).toBe(200);
    expect(drawing.height).toBe(300);
    drawing.setWidthAndHeight(500, -100); // negative height
    expect(drawing.width).toBe(200);
    expect(drawing.height).toBe(300);
  });

  it('normal use of zoom setter', () => {
    drawing.setWidthAndHeight(250, 300);
    drawing.zoom = 2.5; // use setter
    expect(drawing.zoom).toBeCloseTo(2.5); // check getter
    // check actual width and height
    expect(drawing.svg.attr('width')).toBeCloseTo(625);
    expect(drawing.svg.attr('height')).toBeCloseTo(750);
    // maintains width and height of drawing
    expect(drawing.width).toBe(250);
    expect(drawing.height).toBe(300);
  });

  it('zoom getter handles drawing with zero width and height', () => {
    drawing.setWidthAndHeight(0, 0);
    expect(drawing.zoom).toBe(1);
  });

  it('zoom setter ignores nonpositive values', () => {
    drawing.setWidthAndHeight(100, 100);
    drawing.zoom = 2.33;
    drawing.zoom = -5; // a negative value
    expect(drawing.zoom).toBeCloseTo(2.33);
    drawing.zoom = 0; // zero
    expect(drawing.zoom).toBeCloseTo(2.33);
  });
});

it('isEmpty method', () => {
  let drawing = new Drawing();
  let container = document.createElement('div');
  document.body.appendChild(container);
  drawing.addTo(container, () => NodeSVG());
  expect(drawing.isEmpty()).toBeTruthy();
  drawing.appendSequenceOutOfView('asdf', 'asdf');
  expect(drawing.isEmpty()).toBeFalsy();
});

describe('sequence and base attributes', () => {
  let drawing = new Drawing();
  let container = document.createElement('div');
  document.body.appendChild(container);
  drawing.addTo(container, () => NodeSVG());
  let seq1 = drawing.appendSequenceOutOfView('asdf', 'asdfasdf');
  let seq2 = drawing.appendSequenceOutOfView('qwer', 'qwerqwerqwer');
  let seq3 = drawing.appendSequenceOutOfView('zxcv', 'zxcv');

  it('numSequences getter', () => {
    expect(drawing.numSequences).toBe(3);
  });

  it('getSequenceById method', () => {
    expect(drawing.getSequenceById('qwer').id).toBe('qwer');
    expect(drawing.getSequenceById('nonexistent ID')).toBeFalsy();
  });

  it('getSequenceAtIndex method', () => {
    expect(drawing.getSequenceAtIndex(0).id).toBe('asdf');
    expect(drawing.getSequenceAtIndex(1).id).toBe('qwer');
    expect(drawing.getSequenceAtIndex(2).id).toBe('zxcv');
    expect(drawing.getSequenceAtIndex(100)).toBeFalsy(); // out of range
  });

  it('forEachSequence method', () => {
    let ids = ['asdf', 'qwer', 'zxcv'];
    let i = 0;
    drawing.forEachSequence(seq => {
      expect(seq.id).toBe(ids[i]);
      i++;
    });
    expect(i).toBe(3);
  });

  it('sequenceIds method', () => {
    let ids = drawing.sequenceIds();
    expect(ids[0]).toBe('asdf');
    expect(ids[1]).toBe('qwer');
    expect(ids[2]).toBe('zxcv');
  });

  it('sequenceIdIsTaken method', () => {
    expect(drawing.sequenceIdIsTaken('qwer')).toBeTruthy();
    expect(drawing.sequenceIdIsTaken('nonexistent ID')).toBeFalsy();
  });

  it('overallCharacters getter handles multiple sequences', () => {
    expect(drawing.overallCharacters).toBe('asdfasdfqwerqwerqwerzxcv');
  });

  it('numBases getter handles multiple sequences', () => {
    expect(drawing.numBases).toBe(24);
  });

  it('getBaseById method', () => {
    let b = seq2.getBaseAtPosition(9); // in second sequence
    expect(drawing.getBaseById(b.id)).toBe(b);
    expect(drawing.getBaseById('nonexistent ID')).toBeFalsy();
  });

  it('getBaseAtOverallPosition method', () => {
    let b1 = seq1.getBaseAtPosition(5);
    let b2 = seq2.getBaseAtPosition(3);
    expect(drawing.getBaseAtOverallPosition(5)).toBe(b1);
    expect(drawing.getBaseAtOverallPosition(seq1.length + 3)).toBe(b2);
    expect(drawing.getBaseAtOverallPosition(1000)).toBeFalsy(); // out of range
  });

  it('overallPositionOfBase method', () => {
    let b1 = seq1.getBaseAtPosition(7);
    let b2 = seq2.getBaseAtPosition(5);
    expect(drawing.overallPositionOfBase(b1)).toBe(7);
    expect(drawing.overallPositionOfBase(b2)).toBe(seq1.length + 5);
    let b3 = Base.create(drawing.svg, 'a', 1, 2); // not in drawing
    expect(drawing.overallPositionOfBase(b3)).toBe(0);
  });

  it('forEachBase method handles multiple sequences', () => {
    let i = 0;
    drawing.forEachBase((b, p) => {
      expect(drawing.getBaseAtOverallPosition(p)).toBe(b);
      i++;
    });
    expect(i).toBe(drawing.numBases);
  });

  it('bases method', () => {
    // test with multiple sequences
    expect(drawing.numSequences).toBeGreaterThan(1);
    let bs = drawing.bases();
    let n = 0;
    drawing.forEachSequence(seq => {
      seq.forEachBase(b => {
        expect(bs.includes(b)).toBeTruthy();
        n++;
      });
    });
    expect(bs.length).toBe(n);
  });

  it('baseIds method handles multiple sequences', () => {
    let ids = drawing.baseIds();
    ids.forEach((id, i) => {
      expect(id).toBe(drawing.getBaseAtOverallPosition(i + 1).id);
    });
  });

  it('basesByIds method', () => {
    expect(drawing.numBases).toBeGreaterThan(3);
    expect(drawing.numSequences).toBeGreaterThan(1); // handles multiple sequences
    let basesByIds = drawing.basesByIds();
    expect(Object.keys(basesByIds).length).toBe(drawing.numBases);
    drawing.forEachBase(b => {
      expect(basesByIds[b.id]).toBe(b);
    });
  });

  it('sequenceOfBase method', () => {
    let b2 = seq2.getBaseAtPosition(3);
    expect(drawing.sequenceOfBase(b2)).toBe(seq2);
    let b3 = Base.create(drawing.svg, 'q', 4, 5); // not in drawing
    expect(drawing.sequenceOfBase(b3)).toBeFalsy();
  });

  it('createBases method', () => {
    let characters = 'asdfqwerZXCV';
    let bs = drawing.createBases(characters);
    for (let i = 0; i < characters.length; i++) {
      expect(bs[i].character).toBe(characters.charAt(i));
    }
    expect(bs.length).toBe(characters.length);
  });
});

describe('appendSequenceOutOfView method', () => {
  let drawing = new Drawing();
  let container = document.createElement('div');
  document.body.appendChild(container);
  drawing.addTo(container, () => NodeSVG());
  let seq1 = drawing.appendSequenceOutOfView('qwer', 'qwerqwer');

  it('sequence ID is already taken', () => {
    let n = drawing.numSequences;
    let spy1 = jest.spyOn(Sequence, 'createOutOfView');
    let spy2 = jest.spyOn(drawing, 'fireAddSequence');
    let seq = drawing.appendSequenceOutOfView('qwer', 'qwer');
    expect(seq).toBeFalsy();
    expect(drawing.numSequences).toBe(n);
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
  });

  it('sequence ID is not already taken', () => {
    let n = drawing.numSequences;
    let spy = jest.spyOn(drawing, 'fireAddSequence');
    let seq = drawing.appendSequenceOutOfView('zxcvbnm', 'zxcvbnmqq');
    expect(seq.id).toBe('zxcvbnm');
    expect(seq.characters).toBe('zxcvbnmqq');
    expect(drawing.numSequences).toBe(n + 1);
    expect(drawing.getSequenceAtIndex(n).id).toBe(seq.id);
    expect(spy.mock.calls[0][0]).toBe(seq);
  });
});

it('add sequence event', () => {
  drawing._onAddSequence = null; // removing any binding
  expect(() => drawing.fireAddSequence()).not.toThrow(); // firing with no binding
  let f = jest.fn();
  let seq = jest.fn();
  drawing.onAddSequence(f);
  drawing.fireAddSequence(seq);
  expect(f.mock.calls[0][0]).toBe(seq);
});

describe('secondary bonds attributes', () => {
  let drawing = new Drawing();
  let container = document.createElement('div');
  document.body.appendChild(container);
  drawing.addTo(container, () => NodeSVG());
  let seq1 = drawing.appendSequenceOutOfView('asdf', 'asdfasdf');
  let seq2 = drawing.appendSequenceOutOfView('qwer', 'qwerqwerqwer');
  let sb1 = drawing.addSecondaryBond(seq1.getBaseAtPosition(2), seq2.getBaseAtPosition(11));
  let sb2 = drawing.addSecondaryBond(seq1.getBaseAtPosition(5), seq2.getBaseAtPosition(10));
  let sb3 = drawing.addSecondaryBond(seq2.getBaseAtPosition(1), seq2.getBaseAtPosition(8));

  it('numSecondaryBonds getter', () => {
    expect(drawing.numSecondaryBonds).toBe(3);
  });

  it('getSecondaryBondById method', () => {
    expect(drawing.getSecondaryBondById(sb2.id)).toBe(sb2);
    expect(drawing.getSecondaryBondById('nonexistent ID')).toBeFalsy();
  });

  it('forEachSecondaryBond method', () => {
    let i = 0;
    drawing.forEachSecondaryBond(sb => {
      expect(sb).toBe(drawing.secondaryBonds[i]);
      i++;
    });
    expect(i).toBe(drawing.numSecondaryBonds);
  });

  it('addSecondaryBond method', () => {
    let b1 = seq1.getBaseAtPosition(7);
    let b2 = seq2.getBaseAtPosition(3);
    let n = drawing.numSecondaryBonds;
    let sb = drawing.addSecondaryBond(b1, b2);
    expect(drawing.numSecondaryBonds).toBe(n + 1);
    expect(sb.base1).toBe(b1);
    expect(sb.base2).toBe(b2);
  });

  describe('removeSecondaryBondById method', () => {
    it('removes a secondary bond with the given ID', () => {
      let sb = drawing.addSecondaryBond(
        seq1.getBaseAtPosition(4),
        seq2.getBaseAtPosition(6),
      );
      expect(drawing.getSecondaryBondById(sb.id)).toBeTruthy();
      drawing.removeSecondaryBondById(sb.id);
      expect(drawing.getSecondaryBondById(sb.id)).toBeFalsy();
    });

    it('handles no secondary bond having the given ID', () => {
      let n = drawing.numSecondaryBonds;
      drawing.removeSecondaryBondById('nonexistent ID');
      expect(drawing.numSecondaryBonds).toBe(n);
    });
  });
});

describe('tertiary bonds attributes', () => {
  let drawing = new Drawing();
  let container = document.createElement('div');
  document.body.appendChild(container);
  drawing.addTo(container, () => NodeSVG());
  let seq1 = drawing.appendSequenceOutOfView('qwer', 'qwerqwer');
  let seq2 = drawing.appendSequenceOutOfView('zxcv', 'zxcvzxcvzxcv');
  let tb1 = drawing.addTertiaryBond(seq1.getBaseAtPosition(6), seq1.getBaseAtPosition(2));
  let tb2 = drawing.addTertiaryBond(seq2.getBaseAtPosition(1), seq2.getBaseAtPosition(4));
  let tb3 = drawing.addTertiaryBond(seq2.getBaseAtPosition(2), seq1.getBaseAtPosition(5));
  let tb4 = drawing.addTertiaryBond(seq2.getBaseAtPosition(8), seq2.getBaseAtPosition(1));
  let tb5 = drawing.addTertiaryBond(seq1.getBaseAtPosition(1), seq2.getBaseAtPosition(1));

  it('numTertiaryBonds getter', () => {
    expect(drawing.numTertiaryBonds).toBe(5);
  });

  it('getTertiaryBondById method', () => {
    expect(drawing.getTertiaryBondById(tb2.id)).toBe(tb2);
    expect(drawing.getTertiaryBondById('nonexistent ID')).toBeFalsy();
  });

  it('getTertiaryBondsByIds method', () => {
    let tbs = drawing.getTertiaryBondsByIds(
      new Set([tb2.id, tb4.id, 'random ID', tb5.id])
    );
    expect(tbs.length).toBe(3);
    [tb2, tb4, tb5].forEach(tb => {
      expect(tbs.includes(tb)).toBeTruthy();
    });
  });

  it('forEachTertiaryBond method', () => {
    let i = 0;
    drawing.forEachTertiaryBond(tb => {
      expect(tb).toBe(drawing.tertiaryBonds[i]);
      i++;
    });
    expect(i).toBe(drawing.numTertiaryBonds);
  });

  it('addTertiaryBond method', () => {
    let b1 = seq2.getBaseAtPosition(5);
    let b2 = seq1.getBaseAtPosition(6);
    let n = drawing.numTertiaryBonds;
    let spy = jest.spyOn(drawing, 'fireAddTertiaryBond');
    let tb = drawing.addTertiaryBond(b1, b2);
    expect(drawing.numTertiaryBonds).toBe(n + 1);
    // creates with correct bases
    expect(tb.base1).toBe(b1);
    expect(tb.base2).toBe(b2);
    // fires add tertiary bond event
    expect(spy.mock.calls[0][0]).toBe(tb);
  });

  it('add tertiary bond event', () => {
    drawing._onAddTertiaryBond = null; // removes any binding
    expect(() => drawing.fireAddTertiaryBond()).not.toThrow(); // firing with no binding
    let f = jest.fn();
    let tb = jest.fn();
    drawing.onAddTertiaryBond(f);
    drawing.fireAddTertiaryBond(tb);
    expect(f.mock.calls[0][0]).toBe(tb);
  });

  describe('removeTertiaryBondById method', () => {
    it('a tertiary bond has the ID', () => {
      let tb = drawing.addTertiaryBond(
        seq2.getBaseAtPosition(1),
        seq1.getBaseAtPosition(6),
      );
      let id = tb.id;
      expect(drawing.getTertiaryBondById(id)).toBeTruthy();
      drawing.removeTertiaryBondById(id);
      expect(drawing.getTertiaryBondById(id)).toBeFalsy();
    });

    it('no tertiary bond has the ID', () => {
      let n = drawing.numTertiaryBonds;
      drawing.removeTertiaryBondById('nonexistent ID');
      expect(drawing.numTertiaryBonds).toBe(n);
    });
  });
});

it('repositionBonds method', () => {
  expect(drawing.primaryBonds.length).toBeGreaterThan(1);
  expect(drawing.numSecondaryBonds).toBeGreaterThan(1);
  expect(drawing.numTertiaryBonds).toBeGreaterThan(1);
  let spies = [];
  drawing.primaryBonds.forEach(pb => spies.push(jest.spyOn(pb, 'reposition')));
  drawing.forEachSecondaryBond(sb => spies.push(jest.spyOn(sb, 'reposition')));
  drawing.forEachTertiaryBond(tb => spies.push(jest.spyOn(tb, 'reposition')));
  drawing.repositionBonds();
  spies.forEach(s => expect(s).toHaveBeenCalled());
});

it('adjusting base numbering', () => {
  let spy = jest.spyOn(AdjustBaseNumbering, 'adjustBaseNumbering');
  drawing.adjustNumberingLineAngles();
  expect(spy.mock.calls[0][0]).toBe(drawing);
  drawing.adjustBaseNumbering();
  expect(spy.mock.calls[1][0]).toBe(drawing);
});

it('mousedown event', () => {
  let f = jest.fn();
  drawing.onMousedown(f);
  drawing.svg.fire('mousedown');
  expect(f.mock.calls.length).toBe(1);
});

it('dblclick event', () => {
  let f = jest.fn();
  drawing.onDblclick(f);
  expect(f).not.toHaveBeenCalled();
  drawing.svg.fire('dblclick');
  expect(f).toHaveBeenCalled();
});

it('clear method removes elements and references', () => {
  let drawing = new Drawing();
  let container = document.createElement('div');
  document.body.appendChild(container);
  drawing.addTo(container, () => NodeSVG());
  let seq1 = drawing.appendSequenceOutOfView('qwer', 'qwerqwer');
  let seq2 = drawing.appendSequenceOutOfView('asdf', 'asdfas');
  let pb1 = addPrimaryBond(drawing, seq1.getBaseAtPosition(1), seq1.getBaseAtPosition(3));
  let pb2 = addPrimaryBond(drawing, seq2.getBaseAtPosition(2), seq2.getBaseAtPosition(3));
  let sb1 = drawing.addSecondaryBond(seq1.getBaseAtPosition(2), seq2.getBaseAtPosition(6));
  let sb2 = drawing.addSecondaryBond(seq1.getBaseAtPosition(1), seq2.getBaseAtPosition(2));
  let tb1 = drawing.addTertiaryBond(seq2.getBaseAtPosition(3), seq1.getBaseAtPosition(5));
  let tb2 = drawing.addTertiaryBond(seq1.getBaseAtPosition(8), seq2.getBaseAtPosition(5));
  let spy = jest.spyOn(drawing.svg, 'clear');
  drawing.clear();
  expect(spy).toHaveBeenCalled(); // removed elements
  // removed references
  expect(drawing.numSequences).toBe(0);
  expect(drawing.primaryBonds.length).toBe(0);
  expect(drawing.numSecondaryBonds).toBe(0);
  expect(drawing.numTertiaryBonds).toBe(0);
});

it('svgString getter', () => {
  expect(drawing.svgString).toBe(drawing.svg.svg());
});

describe('savableState method', () => {
  let drawing = new Drawing();
  drawing.addTo(container, () => NodeSVG());
  let seq1 = drawing.appendSequenceOutOfView('asdf', 'asdf');
  let seq2 = drawing.appendSequenceOutOfView('qwer', 'qwerzx');
  let b1 = seq1.getBaseAtPosition(1);
  let b2 = seq1.getBaseAtPosition(2);
  let b3 = seq1.getBaseAtPosition(3);
  let b6 = seq2.getBaseAtPosition(2);
  let b8 = seq2.getBaseAtPosition(4);
  let pb1 = addPrimaryBond(drawing, b1, b3);
  let pb2 = addPrimaryBond(drawing, b3, b6);
  let sb1 = drawing.addSecondaryBond(b2, b8);
  let sb2 = drawing.addSecondaryBond(b6, b3);
  let tb1 = drawing.addTertiaryBond(b6, b1);
  let tb2 = drawing.addTertiaryBond(b2, b6);
  let savableState = drawing.savableState();
  let svgString = drawing.svg.svg();

  it('includes class name and svg', () => {
    expect(savableState.className).toBe('Drawing');
    expect(savableState.svg).toBe(svgString);
  });

  it('includes sequences', () => {
    let sequences = savableState.sequences;
    expect(sequences.length).toBe(2);
    expect(JSON.stringify(sequences[0])).toBe(JSON.stringify(seq1.savableState()));
    expect(JSON.stringify(sequences[1])).toBe(JSON.stringify(seq2.savableState()));
  });

  it('includes primary bonds', () => {
    let primaryBonds = savableState.primaryBonds;
    expect(primaryBonds.length).toBe(2);
    expect(JSON.stringify(primaryBonds[0])).toBe(JSON.stringify(savableStraightBondState(pb1)));
    expect(JSON.stringify(primaryBonds[1])).toBe(JSON.stringify(savableStraightBondState(pb2)));
  });

  it('includes secondary bonds', () => {
    let secondaryBonds = savableState.secondaryBonds;
    expect(secondaryBonds.length).toBe(2);
    expect(JSON.stringify(secondaryBonds[0])).toBe(JSON.stringify(savableStraightBondState(sb1)));
    expect(JSON.stringify(secondaryBonds[1])).toBe(JSON.stringify(savableStraightBondState(sb2)));
  });

  it('includes tertiary bonds', () => {
    let tertiaryBonds = savableState.tertiaryBonds;
    expect(tertiaryBonds.length).toBe(2);
    expect(JSON.stringify(tertiaryBonds[0])).toBe(JSON.stringify(savableTertiaryBondState(tb1)));
    expect(JSON.stringify(tertiaryBonds[1])).toBe(JSON.stringify(savableTertiaryBondState(tb2)));
  });

  it('can be converted to and from a JSON string', () => {
    let json = JSON.stringify(savableState);
    let parsed = JSON.parse(json);
    expect(JSON.stringify(parsed)).toBe(json);
  });
});

describe('applySavedState method', () => {
  it('can successfully apply saved state', () => {
    let drawing = new Drawing();
    drawing.addTo(container, () => NodeSVG());
    let seq1 = drawing.appendSequenceOutOfView('asdf', 'asdfasdf');
    let seq2 = drawing.appendSequenceOutOfView('qwer', 'qwerzxcvzxcv');
    let b2 = seq1.getBaseAtPosition(2);
    let b5 = seq1.getBaseAtPosition(5);
    let b12 = seq2.getBaseAtPosition(4);
    let b17 = seq2.getBaseAtPosition(9);
    let pb1 = addPrimaryBond(drawing, b2, b5);
    let pb2 = addPrimaryBond(drawing, b5, b12);
    let sb1 = drawing.addSecondaryBond(b2, b17);
    let sb2 = drawing.addSecondaryBond(b5, b12);
    let tb1 = drawing.addTertiaryBond(b12, b2);
    let tb2 = drawing.addTertiaryBond(b5, b17);
    let savableState = drawing.savableState();
    let seq3 = drawing.appendSequenceOutOfView('zxcv', 'zxcvzxcv');
    let pb3 = addPrimaryBond(drawing, b12, b17);
    drawing.removeSecondaryBondById(sb1.id);
    drawing.removeTertiaryBondById(tb2.id);
    expect(JSON.stringify(drawing.savableState())).not.toBe(JSON.stringify(savableState));
    let applied = drawing.applySavedState(savableState);
    expect(applied).toBeTruthy();
    // requires that saved svg, sequences and primary, secondary and tertiary bonds
    // have been applied correctly
    expect(JSON.stringify(drawing.savableState())).toBe(JSON.stringify(savableState));
  });

  it('handles failure to apply saved state', () => {
    let drawing = new Drawing();
    drawing.addTo(container, () => NodeSVG());
    let seq1 = drawing.appendSequenceOutOfView('asdf', 'asdfasdf');
    let seq2 = drawing.appendSequenceOutOfView('qwer', 'qwerqwer');
    let savableState1 = drawing.savableState();
    savableState1.className = 'Drwing';
    let seq3 = drawing.appendSequenceOutOfView('zxcv', 'zxcvzxcv');
    let savableState2 = drawing.savableState();
    expect(JSON.stringify(savableState2)).not.toBe(JSON.stringify(savableState1));
    let applied = drawing.applySavedState(savableState1);
    expect(applied).toBeFalsy();
    // drawing state is not changed
    expect(JSON.stringify(drawing.savableState())).toBe(JSON.stringify(savableState2));
  });
});

it('refreshIds method', () => {
  expect(drawing.numSequences).toBeGreaterThan(1);
  expect(drawing.primaryBonds.length).toBeGreaterThan(1);
  expect(drawing.numSecondaryBonds).toBeGreaterThan(1);
  expect(drawing.numTertiaryBonds).toBeGreaterThan(1);
  let spies = [];
  drawing.forEachSequence(seq => spies.push(jest.spyOn(seq, 'refreshIds')));
  drawing.primaryBonds.forEach(pb => spies.push(jest.spyOn(pb, 'refreshIds')));
  drawing.forEachSecondaryBond(sb => spies.push(jest.spyOn(sb, 'refreshIds')));
  drawing.forEachTertiaryBond(tb => spies.push(jest.spyOn(tb, 'refreshIds')));
  drawing.refreshIds();
  spies.forEach(s => expect(s).toHaveBeenCalled());
});
