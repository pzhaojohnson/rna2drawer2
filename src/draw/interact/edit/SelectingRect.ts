import * as SVG from '@svgdotjs/svg.js';

import { Point2D as Point } from 'Math/points/Point';
import { Point2D as Vector } from 'Math/points/Point';

import { DrawingElementInterface as DrawingElement } from './DrawingElementInterface';
import { selectingBox } from './selectingBox';

export class SelectingRect {
  readonly _start: Point;
  _end: Point;

  // the underlying rect element
  readonly rect: SVG.Rect;

  constructor(start: Point) {
    this._start = { ...start };
    this._end = { ...start };

    this.rect = new SVG.Rect();

    this.rect.attr({
      'stroke': 'blue',
      'stroke-width': 0.5,
      'stroke-opacity': 1,
      'fill': 'blue',
      'fill-opacity': 0.05,
    });

    this.reposition();
  }

  appendTo(parent: SVG.Element) {
    this.rect.addTo(parent);
  }

  remove() {
    this.rect.remove();
  }

  reposition() {
    this.rect.attr({
      'x': Math.min(this._start.x, this._end.x),
      'y': Math.min(this._start.y, this._end.y),
      'width': Math.abs(this._start.x - this._end.x),
      'height': Math.abs(this._start.y - this._end.y),
    });
  }

  start(): Point {
    return { ...this._start };
  }

  end(): Point {
    return { ...this._end };
  }

  // shifts the end point of this selecting rect element by the given vector
  drag(v: Vector) {
    this._end = {
      x: this._end.x + v.x,
      y: this._end.y + v.y,
    };
    this.reposition();
  }

  // makes the given point the end point of this selecting rect element
  dragTo(p: Point) {
    this._end = { ...p };
    this.reposition();
  }

  encompasses(ele: DrawingElement): boolean {
    let box = selectingBox(ele);
    if (!box) {
      return false; // unrecognized element
    }
    return (
      Math.min(this._start.x, this._end.x) <= box.x
      && Math.min(this._start.y, this._end.y) <= box.y
      && Math.max(this._start.x, this._end.x) >= box.x + box.width
      && Math.max(this._start.y, this._end.y) >= box.y + box.height
    );
  }
}
