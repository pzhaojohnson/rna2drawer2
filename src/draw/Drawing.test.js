import Drawing from './Drawing';
import createNodeSVG from './createNodeSVG';

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

  describe('isEmpty method', () => {
    it('drawing is empty', () => {
      let drawing = new Drawing();
      expect(drawing.isEmpty()).toBeTruthy();
    });

    it('drawing is not empty', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequence('A Sequence', 'AUGC');
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
      drawing.appendSequence('blah', 'asdf');
      drawing.appendSequence('asdf', 'blah');
      expect(drawing.getSequenceById('asdf').id).toBe('asdf');
    });

    it('a sequence does not have the given ID', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequence('qwer', 'AAGGCC');
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
      drawing.appendSequence('asdf', 'zxcv');
      drawing.appendSequence('zxcv', 'asdf');
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
      drawing.appendSequence('fdsa', 'fdsa');
      drawing.appendSequence('zxcv', 'qwer');
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
      drawing.appendSequence('asdf', 'asdf');
      expect(drawing.sequenceIdIsTaken('asd')).toBeFalsy();
    });

    it('sequence ID is taken', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequence('asdf', 'asdf');
      expect(drawing.sequenceIdIsTaken('asdf')).toBeTruthy();
    });
  });

  describe('appendSequence method', () => {
    it('sequence ID is taken', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequence('asdf', 'asdfasdf');
      expect(drawing.numSequences).toBe(1);
      drawing.appendSequence('asdf', 'qwer');
      expect(drawing.numSequences).toBe(1);
    });

    it('multiple calls', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      expect(drawing.numSequences).toBe(0);
      drawing.appendSequence('qwer', 'qwer');
      drawing.appendSequence('zxcv', 'zxcv');
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
      drawing.appendSequence('asdf', 'qwer');
      drawing.removeSequenceById('qwer');
      expect(drawing.numSequences).toBe(1);
    });

    it('removing the first sequence', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequence('qwer', 'zxcv');
      drawing.appendSequence('zxcv', 'asdfasdf');
      drawing.removeSequenceById('qwer');
      expect(drawing.numSequences).toBe(1);
      let ids = drawing.sequenceIds();
      expect(ids[0]).toBe('zxcv');
    });

    it('removing the last sequence', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      drawing.appendSequence('zxcv', 'qwerqwer');
      drawing.appendSequence('asdf', 'qwer');
      drawing.removeSequenceById('asdf');
      expect(drawing.numSequences).toBe(1);
      let ids = drawing.sequenceIds();
      expect(ids[0]).toBe('zxcv');
    });

    it('calls the remove method of a sequence', () => {
      let drawing = new Drawing();
      drawing.addTo(document.body, () => createNodeSVG());
      let svg = drawing._svg;
      drawing.appendSequence('asdf', 'zxcv');
      let seq = drawing.getSequenceById('asdf');
      let b1 = seq.getBaseAtPosition(1);
      expect(drawing.numSequences).toBe(1);
      expect(svg.findOne('#' + b1._text.id())).not.toBe(null);
      drawing.removeSequenceById('asdf');
      expect(drawing.numSequences).toBe(0);
      expect(svg.findOne('#' + b1._text.id())).toBe(null);
    });
  });
});
