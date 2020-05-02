import InteractiveDrawing from './InteractiveDrawing';
import createNodeSVG from './createNodeSVG';

describe('InteractiveDrawing class', () => {
  describe('_overallSecondaryPartners method', () => {
    it('multiple sequences', () => {
      let id = new InteractiveDrawing();
      id.addTo(document.body, () => createNodeSVG());

    });
  });
});
