import Drawing from './Drawing';
import createNodeSVG from './createNodeSVG';
import Base from './Base';
import { WatsonCrickBond } from './StraightBond';
import TertiaryBond from './TertiaryBond';
import parseDotBracket from '../parse/parseDotBracket';
import StrictLayout from './layout/singleseq/strict/StrictLayout';
import StrictLayoutGeneralProps from './layout/singleseq/strict/StrictLayoutGeneralProps';
import StrictLayoutBaseProps from './layout/singleseq/strict/StrictLayoutBaseProps';

function checkPartners(partners, expectedPartners) {
  expect(partners.length).toBe(expectedPartners.length);
  for (let i = 0; i < expectedPartners.length; i++) {
    expect(partners[i]).toBe(expectedPartners[i]);
  }
}

function defaultBaseProps(length) {
  let baseProps = [];
  for (let i = 0; i < length; i++) {
    baseProps.push(new StrictLayoutBaseProps());
  }
  return baseProps;
}

function checkCoords(coords, expectedCoords) {
  expect(coords.length).toBe(expectedCoords.length);
  for (let i = 0; i < expectedCoords.length; i++) {
    expect(coords[i][0]).toBeCloseTo(expectedCoords[i][0], 3);
    expect(coords[i][1]).toBeCloseTo(expectedCoords[i][1], 3);
  }
}

describe('Drawing class', () => {
  it('instantiates', () => {
    expect(() => { new Drawing() }).not.toThrow();
  });

  it('addTo method', () => {
    let drawing = new Drawing();
    expect(document.body.childNodes.length).toBe(0);
    drawing.addTo(document.body, () => createNodeSVG());
    expect(document.body.childNodes.length).toBe(1);
    expect(document.body.childNodes[0].isSameNode(drawing._div)).toBeTruthy();
  });

  it('centerView method runs without throwing', () => {
    let drawing = new Drawing();
    document.body.style.cssText = 'width: 2000px; height: 2000px;';
    drawing.addTo(document.body, () => createNodeSVG());
    drawing._div.scrollLeft = 0;
    drawing._div.scrollTop = 0;
    expect(() => drawing.centerView()).not.toThrow();
    expect(typeof drawing._div.scrollLeft).toBe('number');
    expect(typeof drawing._div.scrollTop).toBe('number');
  });

  it('width and height getters', () => {
    let drawing = new Drawing();
    drawing.addTo(document.body, () => createNodeSVG());
    drawing._svg.viewbox(0, 0, 125, 68);
    expect(drawing.width).toBe(125);
    expect(drawing.height).toBe(68);
  });

  describe('setWidthAndHeight method', () => {
    it('sets width and height', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.setWidthAndHeight(128, 156);
      let vb = drawing._svg.viewbox();
      expect(vb.x).toBe(0);
      expect(vb.y).toBe(0);
      expect(vb.width).toBe(128);
      expect(vb.height).toBe(156);
    });

    it('maintains zoom', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.setWidthAndHeight(100, 80);
      drawing._svg.attr({
        'width': 150,
        'height': 120,
      });
      expect(drawing.zoom).toBeCloseTo(1.5, 3);
      drawing.setWidthAndHeight(120, 100);
      expect(drawing._svg.attr('width')).toBeCloseTo(180, 3);
      expect(drawing._svg.attr('height')).toBeCloseTo(150, 3);
    });
  });

  describe('zoom getter', () => {
    it('drawing width is zero', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.setWidthAndHeight(0, 0);
      expect(drawing.zoom).toBe(1);
    });

    it('drawing width is greater than zero', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing._svg.viewbox(0, 0, 120, 120);
      drawing._svg.attr({
        'width': 240,
        'height': 240,
      });
      expect(drawing.zoom).toBeCloseTo(2, 3);
    });
  });

  it('numSequences getter', () => {
    let drawing = new Drawing();
    drawing.addTo(document.body, () => createNodeSVG());
    expect(drawing.numSequences).toBe(0);
    drawing.appendSequenceOutOfView('asdf', 'qwer');
    drawing.appendSequenceOutOfView('zxcv', 'asdf');
    expect(drawing.numSequences).toBe(2);
  });

  describe('isEmpty method', () => {
    it('drawing is empty', () => {
      let drawing = new Drawing();
      expect(drawing.isEmpty()).toBeTruthy();
    });

    it('drawing is not empty', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('A Sequence', 'AUGC');
      expect(drawing.isEmpty()).toBeFalsy();
    });
  });

  describe('getSequenceById method', () => {
    it('empty drawing', () => {
      let drawing = new Drawing();
      expect(drawing.getSequenceById('id')).toBe(null);
    });

    it('a sequence has the given ID', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('blah', 'asdf');
      drawing.appendSequenceOutOfView('asdf', 'blah');
      expect(drawing.getSequenceById('asdf').id).toBe('asdf');
    });

    it('a sequence does not have the given ID', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('qwer', 'AAGGCC');
      expect(drawing.getSequenceById('zxcv')).toBe(null);
    });
  });

  describe('forEachSequence method', () => {
    it('empty drawing', () => {
      let drawing = new Drawing();
      let ct = 0;
      drawing.forEachSequence(seq => ct++);
      expect(ct).toBe(0);
    });

    it('multiple sequences', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asdf', 'zxcv');
      drawing.appendSequenceOutOfView('zxcv', 'asdf');
      let ids = ['asdf', 'zxcv'];
      let i = 0;
      drawing.forEachSequence(seq => {
        expect(seq.id).toBe(ids[i]);
        i++;
      });
      expect(i).toBe(2);
    });
  });
  
  describe('sequenceIds method', () => {
    it('empty drawing', () => {
      let drawing = new Drawing();
      expect(drawing.sequenceIds().length).toBe(0);
    });

    it('multiple sequences', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('fdsa', 'fdsa');
      drawing.appendSequenceOutOfView('zxcv', 'qwer');
      let ids = drawing.sequenceIds();
      expect(ids.length).toBe(2);
      expect(ids[0]).toBe('fdsa');
      expect(ids[1]).toBe('zxcv');
    });
  });
  
  describe('sequenceIdIsTaken method', () => {
    it('sequence ID is not taken', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asdf', 'asdf');
      expect(drawing.sequenceIdIsTaken('asd')).toBeFalsy();
    });

    it('sequence ID is taken', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asdf', 'asdf');
      expect(drawing.sequenceIdIsTaken('asdf')).toBeTruthy();
    });
  });

  describe('appendSequenceOutOfView method', () => {
    it('sequence ID is taken', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asdf', 'asdfasdf');
      expect(drawing.numSequences).toBe(1);
      let seq = drawing.appendSequenceOutOfView('asdf', 'qwer');
      expect(seq).toBe(null);
      expect(drawing.numSequences).toBe(1);
    });

    it('multiple calls', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      expect(drawing.numSequences).toBe(0);
      let seq1 = drawing.appendSequenceOutOfView('qwer', 'qwer');
      expect(seq1.id).toBe('qwer');
      let seq2 = drawing.appendSequenceOutOfView('zxcv', 'zxcv');
      expect(seq2.id).toBe('zxcv');
      expect(drawing.numSequences).toBe(2);
      let ids = ['qwer', 'zxcv'];
      let i = 0;
      drawing.forEachSequence(seq => {
        expect(seq.id).toBe(ids[i]);
        i++;
      });
    });
  });

  describe('removeSequenceById method', () => {
    it('no sequence has the given ID', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asdf', 'qwer');
      drawing.removeSequenceById('qwer');
      expect(drawing.numSequences).toBe(1);
    });

    it('removing the first sequence', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('qwer', 'zxcv');
      drawing.appendSequenceOutOfView('zxcv', 'asdfasdf');
      drawing.removeSequenceById('qwer');
      expect(drawing.numSequences).toBe(1);
      let ids = drawing.sequenceIds();
      expect(ids[0]).toBe('zxcv');
    });

    it('removing the last sequence', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('zxcv', 'qwerqwer');
      drawing.appendSequenceOutOfView('asdf', 'qwer');
      drawing.removeSequenceById('asdf');
      expect(drawing.numSequences).toBe(1);
      let ids = drawing.sequenceIds();
      expect(ids[0]).toBe('zxcv');
    });

    it('calls the remove method of a sequence', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      let svg = drawing._svg;
      drawing.appendSequenceOutOfView('asdf', 'zxcv');
      let seq = drawing.getSequenceById('asdf');
      let b1 = seq.getBaseAtPosition(1);
      expect(drawing.numSequences).toBe(1);
      expect(svg.findOne('#' + b1._text.id())).not.toBe(null);
      drawing.removeSequenceById('asdf');
      expect(drawing.numSequences).toBe(0);
      expect(svg.findOne('#' + b1._text.id())).toBe(null);
    });
  });

  it('numBases getter', () => {
    let drawing = new Drawing();
    drawing.addTo(document.body, () => createNodeSVG());
    expect(drawing.numBases).toBe(0);
    drawing.appendSequenceOutOfView('asdf', 'zx');
    expect(drawing.numBases).toBe(2);
    drawing.appendSequenceOutOfView('qwer', 'zxcv');
    expect(drawing.numBases).toBe(6);
  });

  describe('getBaseAtStrictLayoutPosition method', () => {
    it('getting the first and last base', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asdf', 'ab');
      drawing.appendSequenceOutOfView('qwer', 'cd');
      expect(drawing.getBaseAtStrictLayoutPosition(1).letter).toBe('a');
      expect(drawing.getBaseAtStrictLayoutPosition(4).letter).toBe('d');
    });

    it('positions out of range', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asdf', 'ab');
      drawing.appendSequenceOutOfView('qwer', 'cd');
      expect(drawing.getBaseAtStrictLayoutPosition(0)).toBe(null);
      expect(drawing.getBaseAtStrictLayoutPosition(5)).toBe(null);
    });
  });

  describe('getBasesInStrictLayoutRange method', () => {
    it('basic case', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asdf', 'qwerasdf');
      drawing.appendSequenceOutOfView('zxcv', 'zxcv');
      let bases = drawing.getBasesInStrictLayoutRange(7, 10);
      expect(bases.length).toBe(4);
      expect(bases[0].letter).toBe('d');
      expect(bases[1].letter).toBe('f');
      expect(bases[2].letter).toBe('z');
      expect(bases[3].letter).toBe('x');
    });

    it('invalid range', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asdf', 'asdfasdf');
      let bases = drawing.getBasesInStrictLayoutRange(6, 3);
      expect(bases.length).toBe(0);
    });
  });

  describe('strictLayoutPositionOfBase method', () => {
    it('base is not in drawing', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      let b = Base.create(drawing._svg, 'a', 1, 2);
      expect(drawing.strictLayoutPositionOfBase(b)).toBe(0);
    });

    it('multiple sequences', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asdf', 'zxcv');
      drawing.appendSequenceOutOfView('qwer', 'zx');
      let seq = drawing.getSequenceById('qwer');
      let b = seq.getBaseAtPosition(1);
      expect(drawing.strictLayoutPositionOfBase(b)).toBe(5);
    });
  });

  it('forEachBase method', () => {
    let drawing = new Drawing();
    drawing.addTo(document.body, () => createNodeSVG());
    drawing.appendSequenceOutOfView('qwer', 'as');
    drawing.appendSequenceOutOfView('zxcv', 'gh');
    let letters = 'asgh';
    let i = 0;
    drawing.forEachBase(b => {
      expect(b.letter).toBe(letters.charAt(i));
      i++;
    });
    expect(i).toBe(4);
  });

  describe('baseIds method', () => {
    it('multiple sequences', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asdf', 'ab');
      drawing.appendSequenceOutOfView('qwer', 'z');
      let seq1 = drawing.getSequenceById('asdf');
      let b1 = seq1.getBaseAtPosition(1);
      let b2 = seq1.getBaseAtPosition(2);
      let seq2 = drawing.getSequenceById('qwer');
      let b3 = seq2.getBaseAtPosition(1);
      let ids = drawing.baseIds();
      expect(ids.length).toBe(3);
      expect(ids[0]).toBe(b1.id);
      expect(ids[1]).toBe(b2.id);
      expect(ids[2]).toBe(b3.id);
    });
  });

  describe('sequenceOfBase method', () => {
    it('multiple sequences', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asdf', 'qwer');
      let seq = drawing.appendSequenceOutOfView('zxcv', 'zxcv');
      let b = seq.getBaseAtPosition(2);
      expect(drawing.sequenceOfBase(b)).toBe(seq);
    });

    it('no sequence contains base', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      let b = Base.create(drawing._svg, 'a', 1, 2);
      expect(drawing.sequenceOfBase(b)).toBe(null);
    });
  });

  describe('clockwiseNormalAngleOfBase method', () => {
    it('drawing contains base', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asdf', 'asdf');
      let seq2 = drawing.appendSequenceOutOfView('qwer', 'qwer');
      let b = seq2.getBaseAtPosition(3);
      expect(
        drawing.clockwiseNormalAngleOfBase(b)
      ).toBe(seq2.clockwiseNormalAngleAtPosition(3));
    });

    it('drawing does not contain base', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asdf', 'asdf');
      let b = Base.create(drawing._svg, 'a', 1, 2);
      expect(drawing.clockwiseNormalAngleOfBase(b)).toBe(0);
    });
  });

  it('numStrandBonds getter', () => {
    let drawing = new Drawing();
    drawing.addTo(document.body, () => createNodeSVG());
    expect(drawing.numStrandBonds).toBe(0);
    let seq = drawing.appendSequenceOutOfView('asdf', 'zxcv');
    drawing.addStrandBondsForSequence(seq);
    expect(drawing.numStrandBonds).toBe(3);
  });

  it('forEachStrandBond method', () => {
    let drawing = new Drawing();
    drawing.addTo(document.body, () => createNodeSVG());
    let seq = drawing.appendSequenceOutOfView('asdf', 'asd');
    drawing.addStrandBondsForSequence(seq);
    let i = 0;
    drawing.forEachStrandBond(sb => {
      expect(sb.id).toBe(drawing._bonds.strand[i].id);
      i++;
    });
    expect(i).toBe(2);
  });
  
  it('addStrandBond method', () => {
    let drawing = new Drawing();
    drawing.addTo(document.body, () => createNodeSVG());
    drawing.appendSequenceOutOfView('asfd', 'ab');
    let b1 = drawing.getBaseAtStrictLayoutPosition(1);
    let b2 = drawing.getBaseAtStrictLayoutPosition(2);
    expect(drawing.numStrandBonds).toBe(0);
    let sb = drawing.addStrandBond(b1, b2);
    expect(drawing.numStrandBonds).toBe(1);
    expect(sb).toBe(drawing._bonds.strand[0]);
    expect(sb.base1.id).toBe(b1.id);
    expect(sb.base2.id).toBe(b2.id);
  });

  describe('addStrandBondsForSequence method', () => {
    it('sequence has length greater than one', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      let seq = drawing.appendSequenceOutOfView('asdf', 'zxc');
      expect(drawing.numStrandBonds).toBe(0);
      let bonds = drawing.addStrandBondsForSequence(seq);
      expect(bonds.length).toBe(2);
      expect(drawing.numStrandBonds).toBe(2);
      expect(bonds[0]).toBe(drawing._bonds.strand[0]);
      expect(bonds[1]).toBe(drawing._bonds.strand[1]);
      let baseIds = drawing.baseIds();
      expect(bonds[0].base1.id).toBe(baseIds[0]);
      expect(bonds[0].base2.id).toBe(baseIds[1]);
      expect(bonds[1].base1.id).toBe(baseIds[1]);
      expect(bonds[1].base2.id).toBe(baseIds[2]);
    });

    it('sequence has length less than or equal to one', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      let seq = drawing.appendSequenceOutOfView('asdf', 'a');
      expect(drawing.numStrandBonds).toBe(0);
      let bonds = drawing.addStrandBondsForSequence(seq);
      expect(bonds.length).toBe(0);
      expect(drawing.numStrandBonds).toBe(0);
    });
  });

  it('numWatsonCrickBonds getter', () => {
    let drawing = new Drawing();
    drawing.addTo(document.body, () => createNodeSVG());
    drawing.appendSequenceOutOfView('asdf', 'aaaggguuu');
    expect(drawing.numWatsonCrickBonds).toBe(0);
    drawing.applyStrictLayoutPartners([9, 8, null, null, null, null, null, 2, 1]);
    expect(drawing.numWatsonCrickBonds).toBe(2);
  });

  it('forEachWatsonCrickBond method', () => {
    let drawing = new Drawing();
    drawing.addTo(document.body, () => createNodeSVG());
    let seq = drawing.appendSequenceOutOfView('asdf', 'GGGAAACCC');
    let wcb1 = WatsonCrickBond.create(drawing._svg, seq.getBaseAtPosition(1), seq.getBaseAtPosition(9));
    let wcb2 = WatsonCrickBond.create(drawing._svg, seq.getBaseAtPosition(2), seq.getBaseAtPosition(8));
    drawing._bonds.watsonCrick.push(wcb1);
    drawing._bonds.watsonCrick.push(wcb2);
    let bonds = [wcb1, wcb2];
    let i = 0;
    drawing.forEachWatsonCrickBond(wcb => {
      expect(wcb).toBe(bonds[i]);
      i++;
    });
    expect(i).toBe(2);
  });

  describe('strictLayoutPartners method', () => {
    it('unstructured', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asdf', 'aaggcc');
      checkPartners(
        drawing.strictLayoutPartners(),
        [null, null, null, null, null, null],
      );
    });

    it('multiple sequences', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      let seq1 = drawing.appendSequenceOutOfView('asdf', 'agc');
      let seq2 = drawing.appendSequenceOutOfView('qwer', 'ewq');
      drawing._bonds.watsonCrick.push(
        WatsonCrickBond.create(drawing._svg, seq1.getBaseAtPosition(1), seq2.getBaseAtPosition(3)),
      );
      drawing._bonds.watsonCrick.push(
        WatsonCrickBond.create(drawing._svg, seq1.getBaseAtPosition(2), seq2.getBaseAtPosition(2)),
      );
      checkPartners(
        drawing.strictLayoutPartners(),
        [6, 5, null, null, 2, 1],
      );
    });
  });

  describe('removeExcessStrictLayoutPairs method', () => {
    it('partners notation is the wrong length', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asdf', 'aaaggguuu');
      drawing.applyStrictLayoutPartners([9, 8, 7, null, null, null, 3, 2, 1]);
      expect(drawing.numWatsonCrickBonds).toBe(3);
      drawing.removeExcessStrictLayoutPairs([7, 6, null, null, null, 2, 1]);
      expect(drawing.numWatsonCrickBonds).toBe(3);
    });

    it('removes bonds from bonds array', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asdf', 'ggguuuccc');
      drawing.applyStrictLayoutPartners([9, 8, 7, null, null, null, 3, 2, 1]);
      let bonds = [];
      drawing.forEachWatsonCrickBond(wcb => bonds.push(wcb));
      expect(drawing.numWatsonCrickBonds).toBe(3);
      drawing.removeExcessStrictLayoutPairs([9, null, 7, null, null, null, 3, null, 1]);
      expect(drawing.numWatsonCrickBonds).toBe(2);
      bonds.splice(1, 1);
      let i = 0;
      drawing.forEachWatsonCrickBond(wcb => {
        expect(wcb).toBe(bonds[i]);
        i++;
      });
    });

    it('calls remove method of bonds', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asdf', 'aaauuuccc');
      drawing.applyStrictLayoutPartners([9, 8, 7, null, null, null, 3, 2, 1]);
      let bonds = [];
      drawing.forEachWatsonCrickBond(wcb => bonds.push(wcb));
      let wcb2 = bonds[1];
      let lineId = wcb2._line.id();
      expect(drawing._svg.findOne('#' + lineId)).not.toBe(null);
      drawing.removeExcessStrictLayoutPairs([9, null, 7, null, null, null, 3, null, 1]);
      expect(drawing._svg.findOne('#' + lineId)).toBe(null);
    });
  });

  describe('addMissingStrictLayoutPairs method', () => {
    it('partners notation is the wrong length', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asdf', 'aaacc');
      drawing.appendSequenceOutOfView('qwer', 'cuuu');
      expect(drawing.numWatsonCrickBonds).toBe(0);
      drawing.addMissingStrictLayoutPairs([9, 8, 7, null, null, null, 3, 2, 1, null]);
      expect(drawing.numWatsonCrickBonds).toBe(0);
    });

    it('multiple sequences (and returns the added bonds)', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asdf', 'aaacc');
      drawing.appendSequenceOutOfView('qwer', 'cuuu');
      expect(drawing.numWatsonCrickBonds).toBe(0);
      let bonds = drawing.addMissingStrictLayoutPairs([9, null, 7, null, null, null, 3, null, 1]);
      expect(drawing.numWatsonCrickBonds).toBe(2);
      expect(bonds.length).toBe(2);
      let p = 1;
      let i = 0;
      drawing.forEachWatsonCrickBond(wcb => {
        expect(wcb.base1).toBe(drawing.getBaseAtStrictLayoutPosition(p));
        expect(wcb.base2).toBe(drawing.getBaseAtStrictLayoutPosition(10 - p));
        expect(wcb).toBe(bonds[i]);
        p += 2;
        i++;
      });
    });
  });

  describe('applyStrictLayoutPartners method', () => {
    it('partners notation is the wrong length', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asdf', 'aaagggccc');
      expect(drawing.numWatsonCrickBonds).toBe(0);
      drawing.applyStrictLayoutPartners([7, 6, null, null, null, 2, 1]);
      expect(drawing.numWatsonCrickBonds).toBe(0);
    });

    it('removes and adds bonds and returns the added bonds', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asdf', 'gggaaaccc');
      expect(drawing.numWatsonCrickBonds).toBe(0);
      drawing.applyStrictLayoutPartners([9, 8, null, null, null, null, null, 2, 1]);
      expect(drawing.numWatsonCrickBonds).toBe(2);
      let bonds = drawing.applyStrictLayoutPartners([9, null, 7, null, null, null, 3, null, 1]);
      expect(drawing.numWatsonCrickBonds).toBe(2);
      expect(bonds.length).toBe(1);
      expect(bonds[0].base1).toBe(drawing.getBaseAtStrictLayoutPosition(3));
      expect(bonds[0].base2).toBe(drawing.getBaseAtStrictLayoutPosition(7));
      let p = 1;
      drawing.forEachWatsonCrickBond(wcb => {
        expect(wcb.base1).toBe(drawing.getBaseAtStrictLayoutPosition(p));
        expect(wcb.base2).toBe(drawing.getBaseAtStrictLayoutPosition(10 - p));
        p += 2;
      });
    });
  });

  it('numTertiaryBonds getter', () => {
    let drawing = new Drawing();
    drawing.addTo(document.body, () => createNodeSVG());
    drawing.appendSequenceOutOfView('asdf', 'asdfasdfasdf');
    expect(drawing.numTertiaryBonds).toBe(0);
    let tb = drawing.addTertiaryBond(
      drawing.getBasesInStrictLayoutRange(1, 4),
      drawing.getBasesInStrictLayoutRange(9, 12),
    );
    expect(drawing.numTertiaryBonds).toBe(1);
    drawing.removeTertiaryBondById(tb.id);
    expect(drawing.numTertiaryBonds).toBe(0);
  });

  describe('getTertiaryBondById method', () => {
    it('basic case', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asdf', 'asdfasdfasdfasdf');
      drawing.addTertiaryBond(
        drawing.getBasesInStrictLayoutRange(1, 3),
        drawing.getBasesInStrictLayoutRange(7, 9),
      );
      let tb2 = drawing.addTertiaryBond(
        drawing.getBasesInStrictLayoutRange(3, 5),
        drawing.getBasesInStrictLayoutRange(9, 11),
      );
      drawing.addTertiaryBond(
        drawing.getBasesInStrictLayoutRange(5, 7),
        drawing.getBasesInStrictLayoutRange(14, 16),
      );
      expect(drawing.numTertiaryBonds).toBe(3);
      expect(drawing.getTertiaryBondById(tb2.id).id).toBe(tb2.id);
    });

    it('no tertiary bond has the given ID', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asfd', 'asdfasdfasdf');
      drawing.addTertiaryBond(
        drawing.getBasesInStrictLayoutRange(1, 3),
        drawing.getBasesInStrictLayoutRange(7, 9),
      );
      expect(drawing.getTertiaryBondById('qwer')).toBe(null);
    });
  });

  it('forEachTertiaryBond method', () => {
    let drawing = new Drawing();
    drawing.addTo(document.body, () => createNodeSVG());
    drawing.appendSequenceOutOfView('asdf', 'qwerqwerqwer');
    let tb1 = drawing.addTertiaryBond(
      drawing.getBasesInStrictLayoutRange(1, 3),
      drawing.getBasesInStrictLayoutRange(7, 9),
    );
    let tb2 = drawing.addTertiaryBond(
      drawing.getBasesInStrictLayoutRange(3, 5),
      drawing.getBasesInStrictLayoutRange(10, 12),
    );
    let bonds = [tb1, tb2];
    let i = 0;
    drawing.forEachTertiaryBond(tb => {
      expect(tb).toBe(bonds[i]);
      i++;
    });
    expect(i).toBe(2);
  });

  describe('addTertiaryBond method', () => {
    it('sides have lengths of zero', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asdf', 'asdfasdfasdf');
      let tb1 = drawing.addTertiaryBond(
        [],
        drawing.getBasesInStrictLayoutRange(3, 5),
      );
      expect(tb1).toBe(null);
      let tb2 = drawing.addTertiaryBond(
        drawing.getBasesInStrictLayoutRange(2, 4),
        [],
      );
      expect(tb2).toBe(null);
      expect(drawing.numTertiaryBonds).toBe(0);
    });

    it('returns the added bond', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asdf', 'asdfasdfasdf');
      let tb = drawing.addTertiaryBond(
        drawing.getBasesInStrictLayoutRange(2, 4),
        drawing.getBasesInStrictLayoutRange(7, 9),
      );
      expect(drawing.numTertiaryBonds).toBe(1);
      expect(tb).toBe(drawing._bonds.tertiary[0]);
    });

    it('creates the bond with correct sides and angles', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      let seq = drawing.appendSequenceOutOfView('asdf', 'qwerqwerqwerqwer');
      let tb = drawing.addTertiaryBond(
        drawing.getBasesInStrictLayoutRange(2, 3),
        drawing.getBasesInStrictLayoutRange(7, 8),
      );
      let etb = TertiaryBond.create(
        drawing._svg,
        seq.getBasesInRange(2, 3),
        seq.getBasesInRange(7, 8),
        b => {
          let p = seq.positionOfBase(b);
          return seq.clockwiseNormalAngleAtPosition(p);
        },
      );
      expect(tb._side1[0]).toBe(etb._side1[0]);
      expect(tb._side1[1]).toBe(etb._side1[1]);
      expect(tb._side2[0]).toBe(etb._side2[0]);
      expect(tb._side2[1]).toBe(etb._side2[1]);
      expect(tb._bracket1.attr('d')).toBe(etb._bracket1.attr('d'));
      expect(tb._bracket2.attr('d')).toBe(etb._bracket2.attr('d'));
    });
  });

  describe('addTertiaryBondForStrictLayoutStem method', () => {
    it('returns the added bond', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asdf', 'asdfasdf');
      drawing.appendSequenceOutOfView('qwer', 'qwerqwer');
      let tb = drawing.addStrictLayoutStemAsTertiaryBond(2, 12, 2);
      expect(drawing.numTertiaryBonds).toBe(1);
      expect(tb).toBe(drawing._bonds.tertiary[0]);
    });

    it('adds the bond with the correct sides', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      let seq1 = drawing.appendSequenceOutOfView('asdf', 'asdfasdf');
      let seq2 = drawing.appendSequenceOutOfView('qwer', 'qwerqwer');
      let tb = drawing.addStrictLayoutStemAsTertiaryBond(3, 14, 2);
      expect(tb._side1[0]).toBe(seq1.getBaseAtPosition(3));
      expect(tb._side1[1]).toBe(seq1.getBaseAtPosition(4));
      expect(tb._side2[0]).toBe(seq2.getBaseAtPosition(5));
      expect(tb._side2[1]).toBe(seq2.getBaseAtPosition(6));
    });
  });

  describe('addTertiaryPairsForSequence', () => {
    it('returns the added bonds', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      let seq = drawing.appendSequenceOutOfView('asdf', 'qwerqwerqwer');
      expect(drawing.numTertiaryBonds).toBe(0);
      let bonds = drawing.addTertiaryPairsForSequence(
        seq,
        [9, 8, null, null, 7, null, 5, 2, 1, null, null, null],
      );
      expect(bonds.length).toBe(2);
      expect(drawing.numTertiaryBonds).toBe(2);
      expect(bonds[0]).toBe(drawing._bonds.tertiary[0]);
      expect(bonds[1]).toBe(drawing._bonds.tertiary[1]);
    });

    it('adds bonds with the correct sides', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      let seq = drawing.appendSequenceOutOfView('qwer', 'qwerqwerqwer');
      let bonds = drawing.addTertiaryPairsForSequence(
        seq,
        parseDotBracket('.((..(.)..))').secondaryPartners,
      );
      expect(bonds[0]._side1.length).toBe(2);
      expect(bonds[0]._side1[0]).toBe(seq.getBaseAtPosition(2));
      expect(bonds[0]._side1[1]).toBe(seq.getBaseAtPosition(3));
      expect(bonds[0]._side2.length).toBe(2);
      expect(bonds[0]._side2[0]).toBe(seq.getBaseAtPosition(11));
      expect(bonds[0]._side2[1]).toBe(seq.getBaseAtPosition(12));
      expect(bonds[1]._side1.length).toBe(1);
      expect(bonds[1]._side1[0]).toBe(seq.getBaseAtPosition(6));
      expect(bonds[1]._side2.length).toBe(1);
      expect(bonds[1]._side2[0]).toBe(seq.getBaseAtPosition(8));
    });
  });

  describe('removeTertiaryBondById method', () => {
    it('no tertiary bond has the given ID', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asdf', 'asdfasdfasdf');
      drawing.addTertiaryBond(
        drawing.getBasesInStrictLayoutRange(1, 3),
        drawing.getBasesInStrictLayoutRange(6, 7),
      );
      expect(drawing.numTertiaryBonds).toBe(1);
      drawing.removeTertiaryBondById('blah');
      expect(drawing.numTertiaryBonds).toBe(1);
    });

    it('removes the correct tertiary bond and removes it from the drawing', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asdf', 'asdfasdfasdfasdf');
      let tb1 = drawing.addTertiaryBond(
        drawing.getBasesInStrictLayoutRange(1, 3),
        drawing.getBasesInStrictLayoutRange(6, 7),
      );
      let tb2 = drawing.addTertiaryBond(
        drawing.getBasesInStrictLayoutRange(4, 5),
        drawing.getBasesInStrictLayoutRange(12, 12),
      );
      let curveId2 = tb2._curve.id();
      expect(drawing.numTertiaryBonds).toBe(2);
      drawing.removeTertiaryBondById(tb2.id);
      expect(drawing.numTertiaryBonds).toBe(1);
      expect(drawing._svg.findOne('#' + curveId2)).toBe(null);
      expect(drawing._bonds.tertiary[0]).toBe(tb1);
    });
  });

  describe('applyStrictLayout method', () => {
    it('runs without throwing', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      let letters = 'asdfasdfasdfasdfqwerqwerqwerqwerqwer';
      let dtbr = '..(((....(((((....)))))..((..))..)))';
      drawing.appendSequenceOutOfView('asdf', letters);
      let sl = new StrictLayout(
        parseDotBracket(dtbr).secondaryPartners,
        new StrictLayoutGeneralProps(),
        defaultBaseProps(letters.length),
      );
      drawing.applyStrictLayout(sl, 8, 10);
      drawing.forEachBase(b => {
        expect(typeof b.xCenter).toBe('number');
        expect(isFinite(b.xCenter)).toBeTruthy();
        expect(typeof b.yCenter).toBe('number');
        expect(isFinite(b.yCenter)).toBeTruthy();
      });
    });
  });
});
