import Drawing from './Drawing';

class InteractiveDrawing {

  /**
   * @param {Element} container The DOM element to place the SVG document of this drawing in.
   */
  constructor(container) {
    this._drawing = new Drawing(container);

    this._strictLayoutProps = {
      general: new StrictLayoutGeneralProps(),
      base: [],
      baseWidth: 12,
      baseHeight: 12,
    };

    this._layoutType = 'strict';
  }

  /**
   * @returns {boolean} True if this drawing is empty.
   */
  isEmpty() {
    return this._drawing.isEmpty();
  }
}

export default InteractiveDrawing;
