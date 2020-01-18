import InteractiveDrawing from './InteractiveDrawing';

class TrackedDrawing {

  /**
   * @param {Element} container The DOM element to place the SVG document of this drawing in.
   */
  constructor(container) {
    this._interactiveDrawing = new InteractiveDrawing(container);
  }
}

export default TrackedDrawing;
