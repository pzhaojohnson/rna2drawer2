import { Point2D as Point } from 'Math/points/Point';
import * as SVG from '@svgdotjs/svg.js';

export type BaseCoordinates = {
  center: Point;
};

export type Layout = {
  // coordinates for every base
  baseCoordinates: BaseCoordinates[];
};

export class DraggedHighlighting {

  // the positions in the layout that are being dragged
  // (will be traced in the order they are present in this array)
  // (should contain at least two positions)
  readonly draggedPositions: number[];

  // the underlying path elements
  readonly borderPath: SVG.Path;
  readonly fillPath: SVG.Path;

  constructor(draggedPositions: number[], layout: Layout) {
    this.draggedPositions = draggedPositions;

    this.borderPath = new SVG.Path();
    this.fillPath = new SVG.Path();

    this.borderPath.attr({
      'stroke': '#344FFF',
      'stroke-width': 17.5,
      'stroke-opacity': 1,
      'stroke-linejoin': 'round',
      'fill': '#344FFF',
      'fill-opacity': 1,
    });

    this.fillPath.attr({
      'stroke': '#AAFBFF',
      'stroke-width': 13.5,
      'stroke-opacity': 1,
      'stroke-linejoin': 'round',
      'fill': '#AAFBFF',
      'fill-opacity': 1,
    });

    this.refit(layout);
  }

  appendTo(svg: SVG.Svg) {
    this.borderPath.addTo(svg);
    this.fillPath.addTo(svg);
  }

  remove() {
    this.fillPath.remove();
    this.borderPath.remove();
  }

  refit(layout: Layout) {
    let draggedBaseCoordinates: BaseCoordinates[] = [];
    this.draggedPositions.forEach(p => {
      let bcs: BaseCoordinates | undefined = layout.baseCoordinates[p - 1];
      if (bcs) {
        draggedBaseCoordinates.push(bcs);
      }
    });

    if (draggedBaseCoordinates.length > 0) {
      let d = '';

      let c1 = draggedBaseCoordinates[0].center;
      d += `M ${c1.x} ${c1.y}`;

      for (let i = 1; i < draggedBaseCoordinates.length; i++) {
        let ci = draggedBaseCoordinates[i].center;
        d += `L ${ci.x} ${ci.y}`;
      }

      if (draggedBaseCoordinates.length > 1) {
        d += 'z';
      }

      this.borderPath.plot(d);
      this.fillPath.plot(d);
    }
  }
}
