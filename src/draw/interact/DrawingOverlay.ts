import * as SVG from '@svgdotjs/svg.js';
import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';

export type Options = {

  // for specifying alternatives to components of the SVG.js library
  // (useful for testing)
  SVG?: {

    // can be used to specify an SVG function compatible with Node.js
    SVG?: () => SVG.Svg;
  }
}

// provides an absolutely positioned SVG document that can be placed over
// (or under) a drawing and drawn on to transiently highlight aspects of
// the drawing
export class DrawingOverlay {

  // the SVG document of the drawing overlay
  // (to be "drawn on")
  readonly svg: SVG.Svg;

  constructor(options?: Options) {
    this.svg = options?.SVG?.SVG ? options.SVG.SVG() : SVG.SVG();

    this.svg.node.style.position = 'fixed';
    this.svg.node.style.pointerEvents = 'none';
  }

  placeOver(drawing: Drawing) {
    this.svg.node.style.position = 'fixed'; // in case got changed

    let parent = drawing.svg.node.parentNode;
    if (parent) {
      parent.insertBefore(this.svg.node, drawing.svg.node.nextSibling);
    }
  }

  placeUnder(drawing: Drawing) {
    this.svg.node.style.position = 'fixed'; // in case got changed

    let parent = drawing.svg.node.parentNode;
    if (parent) {
      parent.insertBefore(this.svg.node, drawing.svg.node);
    }
  }

  fitTo(drawing: Drawing) {
    if (!(drawing.svg.node instanceof Element)) { // should never be true
      console.error('SVG document node is not an Element instance.');
      return;
    }

    this.svg.node.style.position = 'fixed'; // in case got changed

    let r = drawing.svg.node.getBoundingClientRect();
    this.svg.node.style.left = r.left + 'px';
    this.svg.node.style.top = r.top + 'px';

    this.svg.attr({
      'width': drawing.svg.attr('width'),
      'height': drawing.svg.attr('height'),
    });

    let vb = drawing.svg.viewbox();
    this.svg.viewbox(vb);
  }

  clear() {
    this.svg.clear();
  }
}
