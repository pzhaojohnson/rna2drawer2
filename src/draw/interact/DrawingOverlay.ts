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

  readonly svgContainer: HTMLDivElement;

  constructor(options?: Options) {
    this.svgContainer = document.createElement('div');
    this.svgContainer.style.position = 'relative';
    this.svgContainer.style.width = '0px';
    this.svgContainer.style.height = '0px';
    this.svgContainer.style.pointerEvents = 'none';

    this.svg = options?.SVG?.SVG ? options.SVG.SVG() : SVG.SVG();
    this.svg.node.style.position = 'absolute';
    this.svg.node.style.pointerEvents = 'none';
    this.svg.addTo(this.svgContainer);
  }

  placeOver(drawing: Drawing) {
    drawing.svgContainer.insertBefore(this.svgContainer, drawing.svgContainer.firstChild);
    // assumes that the SVG document of the drawing has a Z index of zero
    this.svgContainer.style.zIndex = '1';
  }

  placeUnder(drawing: Drawing) {
    drawing.svgContainer.insertBefore(this.svgContainer, drawing.svgContainer.firstChild);
    // assumes that the SVG document of the drawing has a Z index of zero
    this.svgContainer.style.zIndex = '0';
  }

  fitTo(drawing: Drawing) {
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
