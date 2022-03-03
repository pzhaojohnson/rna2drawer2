import { Point2D as Point } from 'Math/points/Point';
import * as SVG from '@svgdotjs/svg.js';

export type BaseCoordinates = {
  center: Point;
};

export type Layout = {
  baseCoordinates: BaseCoordinates[],
};

export class LayoutTrace {

  // the underlying path elements of the layout trace
  readonly borderPath: SVG.Path;
  readonly fillPath: SVG.Path;

  constructor(layout: Layout) {
    this.borderPath = new SVG.Path();
    this.fillPath = new SVG.Path();

    this.borderPath.attr({
      'stroke': '#D0D9FF',
      'stroke-width': 19.5,
      'stroke-opacity': 1,
      'stroke-linejoin': 'round',
    });

    this.fillPath.attr({
      'stroke': 'white',
      'stroke-width': 13.5,
      'stroke-opacity': 1,
      'stroke-linejoin': 'round',
      'fill': 'white',
      'fill-opacity': 1,
    });

    this.retrace(layout);
  }

  appendTo(svg: SVG.Svg) {
    this.borderPath.addTo(svg);
    this.fillPath.addTo(svg);
  }

  remove() {
    this.fillPath.remove();
    this.borderPath.remove();
  }

  retrace(layout: Layout) {
    if (layout.baseCoordinates.length == 0) {
      return;
    }

    let c1 = layout.baseCoordinates[0].center;
    let d = `M ${c1.x} ${c1.y}`;

    for (let i = 1; i < layout.baseCoordinates.length; i++) {
      let ci = layout.baseCoordinates[i].center;
      d += `L ${ci.x} ${ci.y}`;
    }

    if (layout.baseCoordinates.length > 1) {
      d += 'z';
    }

    this.borderPath.plot(d);
    this.fillPath.plot(d);
  }
}
