import Drawing from './Drawing';

class InteractiveDrawing {

  /**
   * @param {Element} container The DOM element to place the SVG document of this drawing in.
   */
  constructor(container) {
    this._drawing = new Drawing(container);
  }

  /**
   * @returns {boolean} True if this drawing is empty.
   */
  isEmpty() {
    return this._drawing.isEmpty();
  }

  addStructure(id, sequence, partners) {
    this._drawing.addStructure(id, sequence, partners);
  }
}

export default InteractiveDrawing;
