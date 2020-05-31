import Drawing from './Drawing';
import NodeSVG from './NodeSVG';
import Sequence from './Sequence';
import Base from './Base';
import { SecondaryBond } from './StraightBond';
import distanceBetween from './distanceBetween';
import * as AdjustBaseNumbering from './edit/adjustBaseNumbering';

let drawing = new Drawing();
let container = document.createElement('div');
document.body.appendChild(container);
drawing.addTo(container, () => NodeSVG());
let seq1 = drawing.appendSequenceOutOfView('asdf', 'asdfasdf');
let seq2 = drawing.appendSequenceOutOfView('qwer', 'qwerqwerqwer');
let pb1 = drawing.addPrimaryBond(
  seq1.getBaseAtPosition(1),
  seq1.getBaseAtPosition(2),
);
let pb2 = drawing.addPrimaryBond(
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

it('addTo method adds the drawing', () => {
  let drawing = new Drawing();
  let n = container.childNodes.length;
  drawing.addTo(container, () => NodeSVG());
  expect(container.childNodes.length).toBe(n + 1);
});

it('centerView method does not throw', () => {
  expect(() => drawing.centerView()).not.toThrow();
});

it('width, height and zoom properties', () => {
  drawing.setWidthAndHeight(872, 1656);
  drawing.zoom = 1.78;
  expect(drawing._svg.viewbox().width).toBe(872); // sets width
  expect(drawing.width).toBe(872); // check getter
  expect(drawing._svg.viewbox().height).toBe(1656); // sets height
  expect(drawing.height).toBe(1656); // check getter
  expect(drawing._svg.attr('width')).toBeCloseTo(1.78 * 872); // maintains zoom with respect to width
  expect(drawing._svg.attr('height')).toBeCloseTo(1.78 * 1656); // maintains zoom with respect to height
  expect(drawing.zoom).toBeCloseTo(1.78); // check getter
});

it('zoom getter handles drawing with zero area', () => {
  drawing.setWidthAndHeight(0, 0);
  expect(drawing.zoom).toBe(1);
});

it('numSequences getter', () => {
  expect(drawing.numSequences).toBe(drawing._sequences.length);
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

it('getSequenceById method', () => {
  expect(drawing.getSequenceById('nonexistent ID')).toBeFalsy();
  expect(drawing.getSequenceById('qwer').id).toBe('qwer');
});

it('getSequenceAtIndex method', () => {
  expect(drawing.numSequences).toBeGreaterThan(1);
  expect(drawing.getSequenceAtIndex(0)).toBe(drawing._sequences[0]);
  expect(drawing.getSequenceAtIndex(1)).toBe(drawing._sequences[1]);
  expect(drawing.getSequenceAtIndex(100)).toBeFalsy();
});

it('forEachSequence method', () => {
  expect(drawing.numSequences).toBeGreaterThan(1);
  let ids = {};
  drawing.forEachSequence(seq => ids[seq.id] = null);
  expect(Object.keys(ids).length).toBe(drawing.numSequences);
});

it('sequenceIds method', () => {
  expect(drawing.numSequences).toBeGreaterThan(1);
  let ids = drawing.sequenceIds();
  expect(ids.length).toBe(drawing.numSequences);
  ids.forEach((id, i) => {
    expect(drawing.getSequenceAtIndex(i).id).toBe(id);
  });
});

it('sequenceIdIsTaken method', () => {
  expect(drawing.sequenceIdIsTaken('nonexistent ID')).toBeFalsy();
  expect(drawing.sequenceIdIsTaken('asdf')).toBeTruthy();
});

it('overallCharacters getter', () => {
  expect(drawing.overallCharacters).toBe('asdfasdfqwerqwerqwer');
});

describe('appendSequenceOutOfView method', () => {
  it('sequence ID is already taken', () => {
    let n = drawing.numSequences;
    let spy1 = jest.spyOn(Sequence, 'createOutOfView');
    let spy2 = jest.spyOn(drawing, 'fireAddSequence');
    let seq = drawing.appendSequenceOutOfView('asdf', 'asdf');
    expect(seq).toBeFalsy();
    expect(drawing.numSequences).toBe(n);
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
  });

  it('can append sequence', () => {
    let n = drawing.numSequences;
    let spy1 = jest.spyOn(Sequence, 'createOutOfView');
    let spy2 = jest.spyOn(drawing, 'fireAddSequence');
    let seq = drawing.appendSequenceOutOfView('zxcvbnm', 'zxcvbnmqq');
    expect(seq.id).toBe('zxcvbnm');
    expect(seq.characters).toBe('zxcvbnmqq');
    expect(drawing.numSequences).toBe(n + 1);
    expect(drawing.getSequenceAtIndex(n).id).toBe(seq.id);
    expect(spy1).toHaveBeenCalled();
    let c2 = spy2.mock.calls[0];
    expect(c2[0]).toBe(seq);
  });
});

it('add sequence event', () => {
  drawing._onAddSequence = null;
  expect(() => drawing.fireAddSequence()).not.toThrow(); // firing with no binding
  let f = jest.fn();
  let seq = jest.fn();
  drawing.onAddSequence(f);
  drawing.fireAddSequence(seq);
  expect(f.mock.calls[0][0]).toBe(seq);
});

it('numBases getter handles multipel sequences', () => {
  let drawing = new Drawing();
  let container = document.createElement('div');
  document.body.appendChild(container);
  drawing.addTo(container, () => NodeSVG());
  drawing.appendSequenceOutOfView('asdf', 'asdfasdf');
  drawing.appendSequenceOutOfView('zxcv', 'zxcvqwerkl');
  expect(drawing.numBases).toBe(18);
});

it('getBaseById method', () => {
  expect(drawing.getBaseById('nonexistent ID')).toBeFalsy();
  let b = seq2.getBaseAtPosition(3);
  expect(drawing.getBaseById(b.id)).toBe(b);
});

it('getBaseAtOverallPosition method', () => {
  let b1 = seq1.getBaseAtPosition(5);
  let b2 = seq2.getBaseAtPosition(3);
  expect(drawing.getBaseAtOverallPosition(5)).toBe(b1);
  expect(drawing.getBaseAtOverallPosition(seq1.length + 3)).toBe(b2);
  expect(drawing.getBaseAtOverallPosition(1000)).toBeFalsy();
});

it('overallPositionOfBase method', () => {
  let b1 = seq1.getBaseAtPosition(7);
  let b2 = seq2.getBaseAtPosition(5);
  expect(drawing.overallPositionOfBase(b1)).toBe(7);
  expect(drawing.overallPositionOfBase(b2)).toBe(seq1.length + 5);
  let b3 = Base.create(drawing._svg, 'a', 1, 2);
  expect(drawing.overallPositionOfBase(b3)).toBe(0);
});

it('forEachBase method', () => {
  expect(drawing.numSequences).toBeGreaterThan(1);
  let i = 0;
  drawing.forEachBase((b, p) => {
    expect(drawing.getBaseAtOverallPosition(p)).toBe(b);
    i++;
  });
  expect(i).toBe(drawing.numBases);
});

it('baseIds method', () => {
  expect(drawing.numSequences).toBeGreaterThan(1);
  let ids = drawing.baseIds();
  let s = new Set(ids);
  expect(s.size).toBe(drawing.numBases);
});

it('sequenceOfBase method', () => {
  let b2 = seq2.getBaseAtPosition(3);
  expect(drawing.sequenceOfBase(b2)).toBe(seq2);
  let b3 = Base.create(drawing._svg, 'q', 4, 5);
  expect(drawing.sequenceOfBase(b3)).toBeFalsy();
});

it('numPrimaryBonds getter', () => {
  expect(drawing.numPrimaryBonds).toBe(drawing._primaryBonds.length);
});

it('forEachPrimaryBond method', () => {
  expect(drawing.numPrimaryBonds).toBeGreaterThan(1);
  let ids = {};
  drawing.forEachPrimaryBond(pb => {
    ids[pb.id] = pb;
    expect(drawing._primaryBonds.includes(pb)).toBeTruthy();
  });
  expect(Object.keys(ids).length).toBe(drawing.numPrimaryBonds);
});

it('addPrimaryBond method', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => NodeSVG());
  drawing.appendSequenceOutOfView('asfd', 'ab');
  let b1 = drawing.getBaseAtOverallPosition(1);
  let b2 = drawing.getBaseAtOverallPosition(2);
  expect(drawing.numPrimaryBonds).toBe(0);
  let pb = drawing.addPrimaryBond(b1, b2);
  expect(drawing.numPrimaryBonds).toBe(1);
  expect(pb).toBe(drawing._primaryBonds[0]);
  expect(pb.base1.id).toBe(b1.id);
  expect(pb.base2.id).toBe(b2.id);
});

it('numSecondaryBonds getter', () => {
  let drawing = new Drawing();
  drawing.addTo(document.body, () => NodeSVG());
  let seq = drawing.appendSequenceOutOfView('asdf', 'aaaggguuu');
  expect(drawing.numSecondaryBonds).toBe(0);
  drawing.addSecondaryBond(seq.getBaseAtPosition(1), seq.getBaseAtPosition(7));
  drawing.addSecondaryBond(seq.getBaseAtPosition(2), seq.getBaseAtPosition(5));
  expect(drawing.numSecondaryBonds).toBe(2);
});

it('getSecondaryBondById and forEachSecondaryBond methods', () => {
  expect(drawing.numSecondaryBonds).toBeGreaterThan(1);
  let ids = {};
  drawing.forEachSecondaryBond(sb => ids[sb.id] = sb);
  expect(Object.keys(ids).length).toBe(drawing.numSecondaryBonds);
  Object.keys(ids).forEach(id => {
    expect(drawing.getSecondaryBondById(id)).toBe(ids[id]);
  });
});

it('addSecondaryBond method', () => {
  let b1 = seq1.getBaseAtPosition(7);
  let b2 = seq2.getBaseAtPosition(3);
  let n = drawing.numSecondaryBonds;
  let sb = drawing.addSecondaryBond(b1, b2);
  expect(sb.base1).toBe(b1);
  expect(sb.base2).toBe(b2);
  expect(drawing.numSecondaryBonds).toBe(n + 1);
  expect(drawing._secondaryBonds[n]).toBe(sb);
});

it('removeSecondaryBondById method', () => {
  let sb = drawing.addSecondaryBond(
    seq1.getBaseAtPosition(4),
    seq2.getBaseAtPosition(6),
  );
  expect(drawing.getSecondaryBondById(sb.id)).toBeTruthy();
  let spy = jest.spyOn(sb, 'remove');
  drawing.removeSecondaryBondById(sb.id);
  expect(drawing.getSecondaryBondById(sb.id)).toBeFalsy();
  expect(spy).toHaveBeenCalled();

  expect(() => drawing.removeSecondaryBondById('nonexistent ID')).not.toThrow();
});

it('numTertiaryBonds getter', () => {
  expect(drawing.numTertiaryBonds).toBe(drawing._tertiaryBonds.length);
  expect(drawing.numTertiaryBonds).toBeGreaterThan(1);
});

it('getTertiaryBondById and forEachTertiaryBond methods', () => {
  expect(drawing.numTertiaryBonds).toBeGreaterThan(1);
  let ids = {};
  drawing.forEachTertiaryBond(tb => {
    expect(drawing.getTertiaryBondById(tb.id)).toBe(tb);
    ids[tb.id] = tb;
  });
  expect(Object.keys(ids).length).toBe(drawing.numTertiaryBonds);

  expect(drawing.getTertiaryBondById('nonexistent ID')).toBeFalsy();
});

it('addTertiaryBond method', () => {
  let b1 = seq2.getBaseAtPosition(5);
  let b2 = seq1.getBaseAtPosition(6);
  let n = drawing.numTertiaryBonds;
  let spy = jest.spyOn(drawing, 'fireAddTertiaryBond');
  let tb = drawing.addTertiaryBond(b1, b2);
  expect(tb.base1).toBe(b1);
  expect(tb.base2).toBe(b2);
  expect(drawing.numTertiaryBonds).toBe(n + 1);
  expect(drawing._tertiaryBonds[n]).toBe(tb);
  let c = spy.mock.calls[0];
  expect(c[0]).toBe(tb);
});

it('add tertiary bond event', () => {
  drawing._onAddTertiaryBond = null;
  expect(() => drawing.fireAddTertiaryBond()).not.toThrow(); // firing with no binding
  let f = jest.fn();
  let tb = jest.fn();
  drawing.onAddTertiaryBond(f);
  drawing.fireAddTertiaryBond(tb);
  let c = f.mock.calls[0];
  expect(c[0]).toBe(tb);
});

describe('removeTertiaryBondById method', () => {
  it('a tertiary bond has the ID', () => {
    let tb = drawing.addTertiaryBond(
      seq2.getBaseAtPosition(1),
      seq1.getBaseAtPosition(6),
    );
    let id = tb.id;
    expect(drawing.getTertiaryBondById(id)).toBeTruthy();
    let spy = jest.spyOn(tb, 'remove');
    drawing.removeTertiaryBondById(id);
    expect(drawing.getTertiaryBondById(id)).toBeFalsy();
    expect(spy).toHaveBeenCalled();
  });

  it('no tertiary bond has the ID', () => {
    let n = drawing.numTertiaryBonds;
    drawing.removeTertiaryBondById('nonexistent ID');
    expect(drawing.numTertiaryBonds).toBe(n);
  });
});

it('repositionBonds method', () => {
  let spies = [];
  drawing.forEachPrimaryBond(pb => spies.push(jest.spyOn(pb, 'reposition')));
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
  drawing._svg.fire('mousedown');
  expect(f.mock.calls.length).toBe(1);
});

it('svgString getter', () => {
  expect(drawing.svgString).toBe(drawing._svg.svg());
});

describe('savableState and applySavedState methods', () => {
  let drawing = new Drawing();
  drawing.addTo(container, () => NodeSVG());
  let seq1 = drawing.appendSequenceOutOfView('asdf', 'asdfasdf');
  let seq2 = drawing.appendSequenceOutOfView('qwer', 'qwerzxcvzxcv');
  let b2 = seq1.getBaseAtPosition(2);
  let b5 = seq1.getBaseAtPosition(5);
  let b12 = seq2.getBaseAtPosition(4);
  let b17 = seq2.getBaseAtPosition(9);
  drawing.addPrimaryBond(b2, b5);
  drawing.addPrimaryBond(b5, b12);
  drawing.addSecondaryBond(b2, b17);
  drawing.addSecondaryBond(b5, b12);
  drawing.addTertiaryBond(b12, b2);
  drawing.addTertiaryBond(b5, b17);
  let savableState = drawing.savableState();
  let svgString = drawing._svg.svg();

  it('can be converted to and from a JSON string', () => {
    let json = JSON.stringify(savableState);
    let parsed = JSON.parse(json);
    expect(JSON.stringify(parsed)).toBe(json);
  });

  it('has class name and svg', () => {
    expect(savableState.className).toBe('Drawing');
    expect(savableState.svg).toBe(svgString);
  });

  it('has sequences', () => {
    expect(savableState.sequences.length).toBe(drawing.numSequences);
    savableState.sequences.forEach((saved, i) => {
      let seq = drawing.getSequenceAtIndex(i);
      expect(JSON.stringify(saved)).toBe(JSON.stringify(seq.savableState()));
    });
  });

  it('has primary bonds', () => {
    expect(savableState.primaryBonds.length).toBe(drawing.numPrimaryBonds);
    savableState.primaryBonds.forEach((saved, i) => {
      let pb = drawing._primaryBonds[i];
      expect(JSON.stringify(saved)).toBe(JSON.stringify(pb.savableState()));
    });
  });

  it('has secondary bonds', () => {
    expect(savableState.secondaryBonds.length).toBe(drawing.numSecondaryBonds);
    savableState.secondaryBonds.forEach((saved, i) => {
      let sb = drawing._secondaryBonds[i];
      expect(JSON.stringify(saved)).toBe(JSON.stringify(sb.savableState()));
    });
  });

  it('has tertiary bonds', () => {
    expect(savableState.tertiaryBonds.length).toBe(drawing.numTertiaryBonds);
    savableState.tertiaryBonds.forEach((saved, i) => {
      let tb = drawing._tertiaryBonds[i];
      expect(JSON.stringify(saved)).toBe(JSON.stringify(tb.savableState()));
    });
  });

  it('can apply saved state', () => {
    let drawing = new Drawing();
    drawing.addTo(container, () => NodeSVG());
    drawing.applySavedState(savableState);
    expect(savableState.svg.includes(drawing._svg.svg(false))).toBeTruthy();
    let appliedState = drawing.savableState();
    expect(JSON.stringify({
      ...appliedState,
      svg: '',
    })).toBe(JSON.stringify({
      ...savableState,
      svg: '',
    }));
  });

  it('applySavedState method can throw', () => {
    let invalidState = {
      ...savableState,
      sequences: 'asdf',
    };
    let drawing = new Drawing();
    drawing.addTo(container, () => NodeSVG());
    expect(() => drawing.applySavedState(invalidState)).toThrow();
  });
});

it('refreshIds method', () => {
  let spies = [];
  drawing.forEachSequence(seq => spies.push(jest.spyOn(seq, 'refreshIds')));
  drawing.forEachPrimaryBond(pb => spies.push(jest.spyOn(pb, 'refreshIds')));
  drawing.forEachSecondaryBond(sb => spies.push(jest.spyOn(sb, 'refreshIds')));
  drawing.forEachTertiaryBond(tb => spies.push(jest.spyOn(tb, 'refreshIds')));
  drawing.refreshIds();
  spies.forEach(s => expect(s).toHaveBeenCalled());
});
