import Drawing from './Drawing';
import createNodeSVG from './createNodeSVG';
import Base from './Base';
import { SecondaryBond } from './StraightBond';
import { TertiaryBond } from './QuadraticBezierBond';
import distanceBetween from './distanceBetween';
import normalizeAngle from './normalizeAngle';
import angleBetween from './angleBetween';
import { CircleBaseAnnotation } from './BaseAnnotation';

describe('Drawing class', () => {
  it('instantiates', () => {
    expect(() => { new Drawing() }).not.toThrow();
  });

  it('addTo method', () => {
    let drawing = new Drawing();
    let n = document.body.childNodes.length;
    drawing.addTo(document.body, () => createNodeSVG());
    expect(document.body.childNodes.length).toBe(n + 1);
    expect(document.body.childNodes[n].isSameNode(drawing._div)).toBeTruthy();
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

  it('zoom setter', () => {
    let drawing = new Drawing();
    drawing.addTo(document.body, () => createNodeSVG());
    drawing.setWidthAndHeight(2000, 1600);
    drawing.zoom = 1.5;
    expect(drawing._svg.attr('width')).toBeCloseTo(3000);
    expect(drawing._svg.attr('height')).toBeCloseTo(2400);
    expect(drawing.width).toBeCloseTo(2000);  // viewbox width is maintained
    expect(drawing.height).toBeCloseTo(1600); // viewbox height is maintained
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

  it('getSequenceAtIndex method', () => {
    let drawing = new Drawing();
    drawing.addTo(document.body, () => createNodeSVG());
    drawing.appendSequenceOutOfView('asdf', 'asdf');
    drawing.appendSequenceOutOfView('qwer', 'qwer');
    drawing.appendSequenceOutOfView('zxcv', 'zxcv');
    expect(drawing.getSequenceAtIndex(1).id).toBe('qwer');
    expect(drawing.getSequenceAtIndex(0).id).toBe('asdf');
    expect(drawing.getSequenceAtIndex(2).id).toBe('zxcv');
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

  describe('getBaseById method', () => {
    it('handles multiple sequences', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      let seq1 = drawing.appendSequenceOutOfView('asdf', 'asdf');
      let seq2 = drawing.appendSequenceOutOfView('qwer', 'qwer');
      let seq3 = drawing.appendSequenceOutOfView('zxcv', 'zxcv');
      let b = seq2.getBaseAtPosition(3);
      expect(drawing.getBaseById(b.id)).toBe(b);
    });

    it('no base has the given ID', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      let seq = drawing.appendSequenceOutOfView('asdf', 'qwer');
      expect(drawing.getBaseById('fdsa')).toBe(null);
    });
  });

  describe('getBaseAtOverallPosition method', () => {
    it('getting the first and last base', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asdf', 'ab');
      drawing.appendSequenceOutOfView('qwer', 'cd');
      expect(drawing.getBaseAtOverallPosition(1).character).toBe('a');
      expect(drawing.getBaseAtOverallPosition(4).character).toBe('d');
    });

    it('positions out of range', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asdf', 'ab');
      drawing.appendSequenceOutOfView('qwer', 'cd');
      expect(drawing.getBaseAtOverallPosition(0)).toBe(null);
      expect(drawing.getBaseAtOverallPosition(5)).toBe(null);
    });
  });

  describe('overallPositionOfBase method', () => {
    it('base is not in drawing', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      let b = Base.create(drawing._svg, 'a', 1, 2);
      expect(drawing.overallPositionOfBase(b)).toBe(0);
    });

    it('multiple sequences', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asdf', 'zxcv');
      drawing.appendSequenceOutOfView('qwer', 'zx');
      let seq = drawing.getSequenceById('qwer');
      let b = seq.getBaseAtPosition(1);
      expect(drawing.overallPositionOfBase(b)).toBe(5);
    });
  });

  it('forEachBase method', () => {
    let drawing = new Drawing();
    drawing.addTo(document.body, () => createNodeSVG());
    drawing.appendSequenceOutOfView('qwer', 'as');
    drawing.appendSequenceOutOfView('zxcv', 'gh');
    let characters = 'asgh';
    let i = 0;
    drawing.forEachBase((b, p) => {
      expect(b.character).toBe(characters.charAt(i));
      expect(p).toBe(i + 1);
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

  it('numPrimaryBonds getter', () => {
    let drawing = new Drawing();
    drawing.addTo(document.body, () => createNodeSVG());
    expect(drawing.numPrimaryBonds).toBe(0);
    let seq = drawing.appendSequenceOutOfView('asdf', 'zxcv');
    let b1 = seq.getBaseAtPosition(1);
    let b2 = seq.getBaseAtPosition(2);
    let b3 = seq.getBaseAtPosition(3);
    drawing.addPrimaryBond(b1, b2);
    drawing.addPrimaryBond(b2, b3);
    expect(drawing.numPrimaryBonds).toBe(2);
  });

  it('forEachPrimaryBond method', () => {
    let drawing = new Drawing();
    drawing.addTo(document.body, () => createNodeSVG());
    let seq = drawing.appendSequenceOutOfView('asdf', 'asd');
    let b1 = seq.getBaseAtPosition(1);
    let b2 = seq.getBaseAtPosition(2);
    let b3 = seq.getBaseAtPosition(3);
    drawing.addPrimaryBond(b1, b2);
    drawing.addPrimaryBond(b2, b3);
    let i = 0;
    drawing.forEachPrimaryBond(pb => {
      expect(pb.id).toBe(drawing._primaryBonds[i].id);
      i++;
    });
    expect(i).toBe(2);
  });
  
  it('addPrimaryBond method', () => {
    let drawing = new Drawing();
    drawing.addTo(document.body, () => createNodeSVG());
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
    drawing.addTo(document.body, () => createNodeSVG());
    let seq = drawing.appendSequenceOutOfView('asdf', 'aaaggguuu');
    expect(drawing.numSecondaryBonds).toBe(0);
    drawing.addSecondaryBond(seq.getBaseAtPosition(1), seq.getBaseAtPosition(7));
    drawing.addSecondaryBond(seq.getBaseAtPosition(2), seq.getBaseAtPosition(5));
    expect(drawing.numSecondaryBonds).toBe(2);
  });

  it('forEachSecondaryBond method', () => {
    let drawing = new Drawing();
    drawing.addTo(document.body, () => createNodeSVG());
    let seq = drawing.appendSequenceOutOfView('asdf', 'GGGAAACCC');
    let sb1 = SecondaryBond.create(drawing._svg, seq.getBaseAtPosition(1), seq.getBaseAtPosition(9));
    let sb2 = SecondaryBond.create(drawing._svg, seq.getBaseAtPosition(2), seq.getBaseAtPosition(8));
    drawing._secondaryBonds.push(sb1);
    drawing._secondaryBonds.push(sb2);
    let bonds = [sb1, sb2];
    let i = 0;
    drawing.forEachSecondaryBond(sb => {
      expect(sb).toBe(bonds[i]);
      i++;
    });
    expect(i).toBe(2);
  });

  describe('addSecondaryBond method', () => {
    let drawing = new Drawing();
    drawing.addTo(document.body, () => createNodeSVG());
    let seq = drawing.appendSequenceOutOfView('asdf', 'qwerasdf');
    let b1 = seq.getBaseAtPosition(2);
    let b2 = seq.getBaseAtPosition(6);
    let sb = drawing.addSecondaryBond(b1, b2);
    expect(sb.base1).toBe(b1);
    expect(sb.base2).toBe(b2);
    expect(drawing._secondaryBonds[0]).toBe(sb);
  });

  it('numTertiaryBonds getter', () => {
    let drawing = new Drawing();
    drawing.addTo(document.body, () => createNodeSVG());
    drawing.appendSequenceOutOfView('asdf', 'asdfasdfasdf');
    expect(drawing.numTertiaryBonds).toBe(0);
    let tb = drawing.addTertiaryBond(
      drawing.getBaseAtOverallPosition(4),
      drawing.getBaseAtOverallPosition(12),
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
        drawing.getBaseAtOverallPosition(3),
        drawing.getBaseAtOverallPosition(9),
      );
      let tb2 = drawing.addTertiaryBond(
        drawing.getBaseAtOverallPosition(5),
        drawing.getBaseAtOverallPosition(11),
      );
      drawing.addTertiaryBond(
        drawing.getBaseAtOverallPosition(7),
        drawing.getBaseAtOverallPosition(16),
      );
      expect(drawing.numTertiaryBonds).toBe(3);
      expect(drawing.getTertiaryBondById(tb2.id).id).toBe(tb2.id);
    });

    it('no tertiary bond has the given ID', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asfd', 'asdfasdfasdf');
      drawing.addTertiaryBond(
        drawing.getBaseAtOverallPosition(3),
        drawing.getBaseAtOverallPosition(7),
      );
      expect(drawing.getTertiaryBondById('qwer')).toBe(null);
    });
  });

  it('forEachTertiaryBond method', () => {
    let drawing = new Drawing();
    drawing.addTo(document.body, () => createNodeSVG());
    drawing.appendSequenceOutOfView('asdf', 'qwerqwerqwer');
    let tb1 = drawing.addTertiaryBond(
      drawing.getBaseAtOverallPosition(1),
      drawing.getBaseAtOverallPosition(9),
    );
    let tb2 = drawing.addTertiaryBond(
      drawing.getBaseAtOverallPosition(3),
      drawing.getBaseAtOverallPosition(12),
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
    it('returns the added bond', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asdf', 'asdfasdfasdf');
      let tb = drawing.addTertiaryBond(
        drawing.getBaseAtOverallPosition(2),
        drawing.getBaseAtOverallPosition(7),
      );
      expect(drawing.numTertiaryBonds).toBe(1);
      expect(tb).toBe(drawing._tertiaryBonds[0]);
    });

    it('creates the bond with correct bases', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      let seq = drawing.appendSequenceOutOfView('asdf', 'qwerqwerqwerqwer');
      let tb = drawing.addTertiaryBond(
        drawing.getBaseAtOverallPosition(3),
        drawing.getBaseAtOverallPosition(8),
      );
      expect(tb.base1).toBe(drawing.getBaseAtOverallPosition(3));
      expect(tb.base2).toBe(drawing.getBaseAtOverallPosition(8));
    });
  });

  describe('removeTertiaryBondById method', () => {
    it('no tertiary bond has the given ID', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequenceOutOfView('asdf', 'asdfasdfasdf');
      drawing.addTertiaryBond(
        drawing.getBaseAtOverallPosition(3),
        drawing.getBaseAtOverallPosition(6),
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
        drawing.getBaseAtOverallPosition(3),
        drawing.getBaseAtOverallPosition(7),
      );
      let tb2 = drawing.addTertiaryBond(
        drawing.getBaseAtOverallPosition(5),
        drawing.getBaseAtOverallPosition(12),
      );
      let pathId2 = tb2._path.id();
      expect(drawing.numTertiaryBonds).toBe(2);
      drawing.removeTertiaryBondById(tb2.id);
      expect(drawing.numTertiaryBonds).toBe(1);
      expect(drawing._svg.findOne('#' + pathId2)).toBe(null);
      expect(drawing._tertiaryBonds[0]).toBe(tb1);
    });
  });

  describe('repositionBonds method', () => {
    it('repositions primary bonds', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      let seq = drawing.appendSequenceOutOfView('asdf', 'qwerasdf');
      let b2 = seq.getBaseAtPosition(2);
      let b3 = seq.getBaseAtPosition(3);
      let b6 = seq.getBaseAtPosition(6);
      let pb1 = drawing.addPrimaryBond(b2, b3);
      let pb2 = drawing.addPrimaryBond(b6, b2);
      pb1.padding1 = 12.2;
      pb2.padding1 = 6.8;
      b2.moveTo(50, 60);
      b3.moveTo(100, 200);
      b6.moveTo(1000, 2000);
      drawing.repositionBonds();
      expect(distanceBetween(50, 60, pb1.x1, pb1.y1)).toBeCloseTo(12.2);
      expect(distanceBetween(1000, 2000, pb2.x1, pb2.y1)).toBeCloseTo(6.8);
    });

    it('repositions secondary bonds', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      let seq = drawing.appendSequenceOutOfView('asdf', 'qwerasdf');
      let b2 = seq.getBaseAtPosition(2);
      let b3 = seq.getBaseAtPosition(3);
      let b6 = seq.getBaseAtPosition(6);
      let sb1 = drawing.addSecondaryBond(b2, b6);
      let sb2 = drawing.addSecondaryBond(b3, b2);
      sb1.padding1 = 15.7;
      sb2.padding1 = 20.3;
      b2.moveTo(-100, -200);
      b3.moveTo(1000, 350);
      b6.moveTo(450, 12);
      drawing.repositionBonds();
      expect(distanceBetween(-100, -200, sb1.x1, sb1.y1)).toBeCloseTo(15.7);
      expect(distanceBetween(1000, 350, sb2.x1, sb2.y1)).toBeCloseTo(20.3);
    });

    it('repositions tertiary bonds', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      let seq = drawing.appendSequenceOutOfView('asdf', 'qwerasdf');
      let b2 = seq.getBaseAtPosition(2);
      let b3 = seq.getBaseAtPosition(3);
      let b6 = seq.getBaseAtPosition(6);
      let tb1 = drawing.addTertiaryBond(b6, b3);
      let tb2 = drawing.addTertiaryBond(b6, b2);
      tb1.padding2 = 8.97;
      tb2.padding2 = 17.8;
      b2.moveTo(300, 450);
      b3.moveTo(1200, 3000);
      b6.moveTo(900, 750);
      drawing.repositionBonds();
      expect(distanceBetween(1200, 3000, tb1.x2, tb1.y2)).toBeCloseTo(8.97);
      expect(distanceBetween(300, 450, tb2.x2, tb2.y2)).toBeCloseTo(17.8);
    });
  });

  describe('adjustNumberingLineAngles', () => {
    it('sets line angles to outer normal', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      let seq = drawing.appendSequenceOutOfView('asdf', 'asd');
      let b1 = seq.getBaseAtPosition(1);
      let b2 = seq.getBaseAtPosition(2);
      let b3 = seq.getBaseAtPosition(3);
      b1.moveTo(0, 0);
      b2.moveTo(-1, -1);
      b3.moveTo(0, -2);
      let n = b2.addNumbering(2);
      n.lineAngle = 0;
      drawing.adjustNumberingLineAngles();
      expect(normalizeAngle(n.lineAngle)).toBeCloseTo(Math.PI);
    });

    describe('prevents overlaps with secondary bonds for bases 1 and 2', () => {
      it('secondary bond paddings are too large for distance between bases', () => {
        let drawing = new Drawing();
        drawing.addTo(document.body, () => createNodeSVG());
        let seq = drawing.appendSequenceOutOfView('asdf', 'qwezxc');
        seq.getBaseAtPosition(1).moveTo(0, 0);
        seq.getBaseAtPosition(2).moveTo(1, -1);
        seq.getBaseAtPosition(3).moveTo(0, -2);
        seq.getBaseAtPosition(4).moveTo(3, 0);
        seq.getBaseAtPosition(5).moveTo(2, -1);
        seq.getBaseAtPosition(6).moveTo(3, -2);
        let b2 = seq.getBaseAtPosition(2);
        let b5 = seq.getBaseAtPosition(5);
        let sb = drawing.addSecondaryBond(b2, b5);
        sb.padding1 = 8;
        sb.padding2 = 8;
        expect(sb.padding1 + sb.padding2).toBeGreaterThan(b2.distanceBetweenCenters(b5));
        let n2 = b2.addNumbering(2);
        n2.lineAngle = 0;
        let n5 = b5.addNumbering(5);
        n5.lineAngle = Math.PI;
        expect(
          normalizeAngle(seq.outerNormalAngleAtPosition(2))
        ).toBeCloseTo(0);
        expect(
          normalizeAngle(seq.outerNormalAngleAtPosition(5))
        ).toBeCloseTo(Math.PI);
        drawing.adjustNumberingLineAngles();
        expect(normalizeAngle(n2.lineAngle)).toBeCloseTo(Math.PI);
        expect(normalizeAngle(n5.lineAngle)).toBeCloseTo(0);
      });
    });
  });

  it('svgString getter', () => {
    let drawing = new Drawing();
    drawing.addTo(document.body, () => createNodeSVG());
    let seq = drawing.appendSequenceOutOfView('asdf', 'asdf');
    drawing.addSecondaryBond(
      seq.getBaseAtPosition(2),
      seq.getBaseAtPosition(4),
    );
    let svgString1 = drawing.svgString;
    let svg2 = createNodeSVG();
    svg2.svg(svgString1);
    let svg1 = svg2.children()[0];
    let svgContentString1 = svg1.svg(false);
    svg2.clear();
    svg2.svg(svgContentString1);
    let svgContentString2 = svg2.svg(false);
    expect(svgContentString2).toBe(svgContentString1);
  });

  describe('savableState method', () => {
    it('includes class name and svg string', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      let seq = drawing.appendSequenceOutOfView('asdf', 'asdfasdf');
      drawing.addSecondaryBond(seq.getBaseAtPosition(2), seq.getBaseAtPosition(7));
      drawing.addSecondaryBond(seq.getBaseAtPosition(3), seq.getBaseAtPosition(6));
      let savableState = drawing.savableState();
      expect(savableState.className).toBe('Drawing');
      expect(savableState.svg).toBe(drawing._svg.svg());
    });

    it('includes sequences', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      let seq1 = drawing.appendSequenceOutOfView('asdf', 'asdf');
      let seq2 = drawing.appendSequenceOutOfView('qwer', 'qwer');
      let savableState = drawing.savableState();
      expect(savableState.sequences.length).toBe(2);
      expect(
        JSON.stringify(savableState.sequences[0])
      ).toBe(JSON.stringify(seq1.savableState()));
      expect(
        JSON.stringify(savableState.sequences[1])
      ).toBe(JSON.stringify(seq2.savableState()));
    });

    it('includes primary bonds', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      let seq = drawing.appendSequenceOutOfView('asdf', 'asd');
      let b1 = seq.getBaseAtPosition(1);
      let b2 = seq.getBaseAtPosition(2);
      let b3 = seq.getBaseAtPosition(3);
      let pb1 = drawing.addPrimaryBond(b1, b2);
      let pb2 = drawing.addPrimaryBond(b2, b3);
      let savableState = drawing.savableState();
      expect(savableState.primaryBonds.length).toBe(2);
      expect(
        JSON.stringify(savableState.primaryBonds[0])
      ).toBe(JSON.stringify(pb1.savableState()));
      expect(
        JSON.stringify(savableState.primaryBonds[1])
      ).toBe(JSON.stringify(pb2.savableState()));
    });

    it('includes secondary bonds', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      let seq = drawing.appendSequenceOutOfView('asf', 'asdfasdf');
      let sb1 = drawing.addSecondaryBond(seq.getBaseAtPosition(1), seq.getBaseAtPosition(8));
      let sb2 = drawing.addSecondaryBond(seq.getBaseAtPosition(2), seq.getBaseAtPosition(7));
      let savableState = drawing.savableState();
      expect(savableState.secondaryBonds.length).toBe(2);
      expect(
        JSON.stringify(savableState.secondaryBonds[0])
      ).toBe(JSON.stringify(sb1.savableState()));
      expect(
        JSON.stringify(savableState.secondaryBonds[1])
      ).toBe(JSON.stringify(sb2.savableState()));
    });

    it('includes tertiary bonds', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      let seq = drawing.appendSequenceOutOfView('asdf', 'asdfasdfasdf');
      let b2 = drawing.getBaseAtOverallPosition(2);
      let b5 = drawing.getBaseAtOverallPosition(5);
      let b3 = drawing.getBaseAtOverallPosition(3);
      let b8 = drawing.getBaseAtOverallPosition(8);
      let bonds = [
        drawing.addTertiaryBond(b2, b5),
        drawing.addTertiaryBond(b3, b8),
      ];
      let savableState = drawing.savableState();
      expect(savableState.tertiaryBonds.length).toBe(2);
      expect(
        JSON.stringify(savableState.tertiaryBonds[0])
      ).toBe(JSON.stringify(bonds[0].savableState()));
      expect(
        JSON.stringify(savableState.tertiaryBonds[1])
      ).toBe(JSON.stringify(bonds[1].savableState()));
    });

    it('can be converted to and from a JSON string', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      let seq = drawing.appendSequenceOutOfView('asdf', 'asdfasdf');
      drawing.addPrimaryBond(seq.getBaseAtPosition(2), seq.getBaseAtPosition(3));
      drawing.addSecondaryBond(seq.getBaseAtPosition(2), seq.getBaseAtPosition(7));
      drawing.addSecondaryBond(seq.getBaseAtPosition(1), seq.getBaseAtPosition(8));
      drawing.addTertiaryBond(
        drawing.getBaseAtOverallPosition(2),
        drawing.getBaseAtOverallPosition(7),
      );
      let savableState1 = drawing.savableState();
      let json1 = JSON.stringify(savableState1);
      let savableState2 = JSON.parse(json1);
      let json2 = JSON.stringify(savableState2);
      expect(json2).toBe(json1);
    });
  });

  describe('applySavedState method', () => {
    it('replaces SVG content', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      let seq1 = drawing.appendSequenceOutOfView('asdf', 'asdfqwer');
      let svgString1 = drawing.svgString;
      let savableState = drawing.savableState();
      let seq2 = drawing.appendSequenceOutOfView('qwer', 'qwerzxcv');
      expect(drawing.svgString).not.toBe(svgString1);
      drawing.applySavedState(savableState);
      expect(drawing.svgString).toBe(svgString1);
    });
    
    it('replaces sequences', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      let seq1 = drawing.appendSequenceOutOfView('asdf', 'asdf');
      let seq2 = drawing.appendSequenceOutOfView('qwer', 'qwer');
      let savableState = drawing.savableState();
      let seq3 = drawing.appendSequenceOutOfView('zxcv', 'zxcv');
      expect(drawing.numSequences).toBe(3);
      drawing.applySavedState(savableState);
      expect(drawing.numSequences).toBe(2);
    });

    it('replaces primary bonds', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      let seq = drawing.appendSequenceOutOfView('asdf', 'asdfasdf');
      let b1 = seq.getBaseAtPosition(1);
      let b3 = seq.getBaseAtPosition(3);
      let b4 = seq.getBaseAtPosition(4);
      drawing.addPrimaryBond(b1, b3);
      drawing.addPrimaryBond(b3, b4);
      let savableState = drawing.savableState();
      drawing.addPrimaryBond(b1, b4);
      expect(drawing.numPrimaryBonds).toBe(3);
      drawing.applySavedState(savableState);
      expect(drawing.numPrimaryBonds).toBe(2);
    });

    it('replaces secondary bonds', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      let seq = drawing.appendSequenceOutOfView('asdf', 'asdfasdf');
      let b2 = seq.getBaseAtPosition(2);
      let b3 = seq.getBaseAtPosition(3);
      let b7 = seq.getBaseAtPosition(7);
      drawing.addSecondaryBond(b2, b7);
      drawing.addSecondaryBond(b7, b3);
      let savableState = drawing.savableState();
      drawing.addSecondaryBond(b3, b7);
      expect(drawing.numSecondaryBonds).toBe(3);
      drawing.applySavedState(savableState);
      expect(drawing.numSecondaryBonds).toBe(2);
    });

    it('replaces tertiary bonds', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      let seq = drawing.appendSequenceOutOfView('asdf', 'asdfqwer');
      let b2 = seq.getBaseAtPosition(2);
      let b4 = seq.getBaseAtPosition(4);
      let b8 = seq.getBaseAtPosition(8);
      drawing.addTertiaryBond(b2, b4);
      drawing.addTertiaryBond(b8, b2);
      let savableState = drawing.savableState();
      drawing.addTertiaryBond(b4, b2);
      expect(drawing.numTertiaryBonds).toBe(3);
      drawing.applySavedState(savableState);
      expect(drawing.numTertiaryBonds).toBe(2);
    });
  });
});
