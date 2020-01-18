import Drawing from './Drawing';

class InteractiveDrawing {

  /**
   * @param {Element} container The DOM element to place the SVG document of this drawing in.
   */
  constructor(container) {
    this._drawing = new Drawing(container);
  }
}

export default InteractiveDrawing;
