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

  describe('_overallSecondaryPartners method', () => {
    it('multiple sequences', () => {
      let id = new InteractiveDrawing();
      id.addTo(document.body, () => createNodeSVG());

    });
  });
});
