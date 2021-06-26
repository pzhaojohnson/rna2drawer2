import { CircleBaseAnnotationInterface } from './CircleBaseAnnotationInterface';
import { CircleBaseAnnotation } from './CircleBaseAnnotation';
import { BaseInterface as Base } from 'Draw/BaseInterface';
import * as SVG from '@svgdotjs/svg.js';

// creates a circle annotation for the given base
function create(b: Base): CircleBaseAnnotation | undefined {
  let svg = b.text.root();
  if (!(svg instanceof SVG.Svg)) {
    console.error('Unable to retrieve root SVG element of base.');
  } else {
    let c = svg.circle(10);
    let baseCenter = { x: b.xCenter, y: b.yCenter };
    c.attr({ 'cx': baseCenter.x, 'cy': baseCenter.y });
    return new CircleBaseAnnotation(c, baseCenter.x, baseCenter.y);
  }
}

export function addOutline(b: Base) {
  let cba = create(b);
  if (cba) {
    removeOutline(b);
    b.outline = cba;
  }
}

export function addHighlighting(b: Base) {
  let cba = create(b);
  if (cba) {
    removeHighlighting(b);
    b.highlighting = cba;
  }
}

function remove(cba: CircleBaseAnnotationInterface) {
  cba.circle.remove();
}

export function removeOutline(b: Base) {
  if (b.outline) {
    remove(b.outline);
    b.outline = undefined;
  }
}

export function removeHighlighting(b: Base) {
  if (b.highlighting) {
    remove(b.highlighting);
    b.highlighting = undefined;
  }
}
