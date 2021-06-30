import { CircleBaseAnnotationInterface } from './CircleBaseAnnotationInterface';
import { CircleBaseAnnotation } from './CircleBaseAnnotation';
import { BaseInterface as Base } from 'Draw/BaseInterface';
import * as SVG from '@svgdotjs/svg.js';
import { SVGCircleWrapper as CircleWrapper } from 'Draw/svg/circle';

// creates a circle annotation for the given base
function create(b: Base): CircleBaseAnnotation | undefined {
  let svg = b.text.root();
  if (!(svg instanceof SVG.Svg)) {
    console.error('Unable to retrieve root SVG element of base.');
  } else {
    let c = new CircleWrapper(svg.circle(10));
    let baseCenter = { x: b.xCenter, y: b.yCenter };
    c.attr({ 'cx': baseCenter.x, 'cy': baseCenter.y });
    return new CircleBaseAnnotation(c, baseCenter);
  }
}

export function addCircleOutline(b: Base) {
  let cba = create(b);
  if (cba) {
    removeCircleOutline(b);
    b.outline = cba;
  }
}

export function addCircleHighlighting(b: Base) {
  let cba = create(b);
  if (cba) {
    removeCircleHighlighting(b);
    b.highlighting = cba;
  }
}

function remove(cba: CircleBaseAnnotationInterface) {
  cba.circle.remove();
}

export function removeCircleOutline(b: Base) {
  if (b.outline) {
    remove(b.outline);
    b.outline = undefined;
  }
}

export function removeCircleHighlighting(b: Base) {
  if (b.highlighting) {
    remove(b.highlighting);
    b.highlighting = undefined;
  }
}
