import type { Drawing } from 'Draw/Drawing';

// for displaying messages in the bottom left corner of a drawing
export class OverlaidMessageContainer {
  readonly node: HTMLDivElement;

  constructor() {
    this.node = document.createElement('div');
    this.node.style.pointerEvents = 'none';
  }

  // places this message container on top of and close to
  // the bottom left corner of the drawing
  placeOver(drawing: Drawing) {
    this.node.style.position = 'fixed';

    // places after (and on top of) the drawing
    drawing.svgContainer.appendChild(this.node);

    let rect = drawing.svgContainer.getBoundingClientRect();
    let bottom = (
      (document.documentElement.clientHeight - rect.bottom)
      + (rect.height - drawing.svgContainer.clientHeight) // accounts for scrollbar
      + 6
    );
    this.node.style.bottom = `${bottom}px`;
    this.node.style.left = '8px';
  }

  remove() {
    this.node.remove();
  }

  // can be used to append elements containing text (such as paragraph
  // elements) to this message container
  append(child: Node) {
    this.node.appendChild(child);
  }

  clear() {
    while (this.node.lastChild) {
      this.node.lastChild.remove();
    }
  }

  get style() {
    return this.node.style;
  }
}
