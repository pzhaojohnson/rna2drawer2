import Drawing from './Drawing';
import createNodeSVG from './createNodeSVG';
import Base from './Base';

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
});
