import * as SVG from '@svgdotjs/svg.js';
import { atIndex } from 'Array/at';

export function findByUniqueId(svg: SVG.Svg, id: unknown): SVG.Element | never {
  if (typeof id != 'string') {
    throw new Error('The given ID is not a string: ' + id  + '.');
  } else {
    let elements = svg.find('#' + id);
    if (elements.length > 1) {
      throw new Error('The given ID is not unique: ' + id + '.');
    } else {
      let ele = atIndex(elements, 0);
      if (ele && ele instanceof SVG.Element) {
        return ele;
      } else {
        throw new Error('No element has the given ID: ' + id + '.');
      }
    }
  }
}

export function findTextByUniqueId(svg: SVG.Svg, id: unknown): SVG.Text | never {
  let ele = findByUniqueId(svg, id);
  if (ele instanceof SVG.Text) {
    return ele;
  } else {
    throw new Error('Element with the given ID is not a text: ' + id + '.');
  }
}

export function findLineByUniqueId(svg: SVG.Svg, id: unknown): SVG.Line | never {
  let ele = findByUniqueId(svg, id);
  if (ele instanceof SVG.Line) {
    return ele;
  } else {
    throw new Error('Element with the given ID is not a line: ' + id + '.');
  }
}

export function findCircleByUniqueId(svg: SVG.Svg, id: unknown): SVG.Circle | never {
  let ele = findByUniqueId(svg, id);
  if (ele instanceof SVG.Circle) {
    return ele;
  } else {
    throw new Error('Element with the given ID is not a circle: ' + id + '.');
  }
}

export function findRectByUniqueId(svg: SVG.Svg, id: unknown): SVG.Rect | never {
  let ele = findByUniqueId(svg, id);
  if (ele instanceof SVG.Rect) {
    return ele;
  } else {
    throw new Error('Element with the given ID is not a rect: ' + id + '.');
  }
}

export function findPathByUniqueId(svg: SVG.Svg, id: unknown): SVG.Path | never {
  let ele = findByUniqueId(svg, id);
  if (ele instanceof SVG.Path) {
    return ele;
  } else {
    throw new Error('Element with the given ID is not a path: ' + id + '.');
  }
}
