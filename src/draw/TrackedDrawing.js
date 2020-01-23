import InteractiveDrawing from './InteractiveDrawing';

class TrackedDrawing {

  /**
   * @param {Element} container The DOM element to place the SVG document of this drawing in.
   */
  constructor(container) {
    this._interactiveDrawing = new InteractiveDrawing(container);
  }

  /**
   * @returns {boolean} True if this drawing is empty.
   */
  isEmpty() {
    return this._interactiveDrawing.isEmpty();
  }

  addStructure(id, sequence, partners) {
    this._interactiveDrawing.addStructure(id, sequence, partners);
  }
}

export default TrackedDrawing;
