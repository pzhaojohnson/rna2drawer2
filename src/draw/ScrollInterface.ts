/**
 * An interface that provides access to scrolling related
 * properties and methods for an element.
 */
export class ScrollInterface {
  readonly element: Element;

  constructor(element: Element) {
    this.element = element;
  }

  get left() {
    return this.element.scrollLeft;
  }

  set left(left: number) {
    this.element.scrollLeft = left;
  }

  get top() {
    return this.element.scrollTop;
  }

  set top(top: number) {
    this.element.scrollTop = top;
  }

  get width() {
    return this.element.scrollWidth;
  }

  get height() {
    return this.element.scrollHeight;
  }
}
