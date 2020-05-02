import InteractiveDrawing from './InteractiveDrawing';
import createNodeSVG from './createNodeSVG';

describe('InteractiveDrawing class', () => {
  describe('constructor', () => {
    it('initializes drawing', () => {
      let idrawing = new InteractiveDrawing();
      expect(idrawing._drawing).toBeTruthy();
    });

    it('initializes strict layout properties', () => {
      let idrawing = new InteractiveDrawing();
      expect(idrawing._strictLayoutProps.general).toBeTruthy();
      expect(idrawing._strictLayoutProps.base).toBeTruthy();
      expect(idrawing._strictLayoutProps.baseWidth).toBeTruthy();
      expect(idrawing._strictLayoutProps.baseHeight).toBeTruthy();
    });

    it('initializes layout type', () => {
      let idrawing = new InteractiveDrawing();
      expect(idrawing.layoutType).toBeTruthy();
    });
  });

  it('addTo method', () => {
    let idrawing = new InteractiveDrawing();
    let n = document.body.childNodes.length;
    idrawing.addTo(document.body, () => createNodeSVG());
    expect(document.body.childNodes.length).toBe(n + 1);
  });

  it('layoutType getter', () => {
    let idrawing = new InteractiveDrawing();
    idrawing._layoutType = 'freeform';
    expect(idrawing.layoutType).toBe('freeform');
  });

  it('hasStrictLayout method', () => {
    let idrawing = new InteractiveDrawing();
    idrawing._layoutType = 'freeform';
    expect(idrawing.hasStrictLayout()).toBeFalsy();
    idrawing._layoutType = 'strict';
    expect(idrawing.hasStrictLayout()).toBeTruthy();
  });

  describe('_appendSequenceOutOfView method', () => {
    it('sequence cannot be appended', () => {
      let idrawing = new InteractiveDrawing();
      idrawing.addTo(document.body, () => createNodeSVG());
      idrawing._appendSequenceOutOfView('asdf', 'asdf');
      let seq2 = idrawing._appendSequenceOutOfView('asdf', 'qwer');
      expect(seq2).toBe(null);
    });

    it('appends sequence', () => {
      let idrawing = new InteractiveDrawing();
      idrawing.addTo(document.body, () => createNodeSVG());
      let seq1 = idrawing._appendSequenceOutOfView('asdf', 'asdf');
      let seq2 = idrawing._appendSequenceOutOfView('qwer', 'qwer');
      expect(idrawing._drawing._sequences[0]).toBe(seq1);
      expect(idrawing._drawing._sequences[1]).toBe(seq2);
    });

    it('creates sequence out of view', () => {
      let idrawing = new InteractiveDrawing();
      idrawing.addTo(document.body, () => createNodeSVG());
      let seq = idrawing._appendSequenceOutOfView('asdf', 'asdf');
      seq.forEachBase(b => {
        expect(b.xCenter < -50 || b.yCenter < -50).toBeTruthy();
      });
    });

    it('appends strict layout base properties', () => {
      let idrawing = new InteractiveDrawing();
      idrawing.addTo(document.body, () => createNodeSVG());
      expect(idrawing._strictLayoutProps.base.length).toBe(0);
      idrawing._appendSequenceOutOfView('asdf', 'zxcv');
      expect(idrawing._strictLayoutProps.base.length).toBe(4);
      idrawing._appendSequenceOutOfView('qwer', 'bbn');
      expect(idrawing._strictLayoutProps.base.length).toBe(7);
    });
  });

  describe('_overallSecondaryPartners method', () => {
    it('multiple sequences', () => {
      let id = new InteractiveDrawing();
      id.addTo(document.body, () => createNodeSVG());

    });
  });
});
