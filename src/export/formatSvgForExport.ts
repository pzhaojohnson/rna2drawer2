import {
  SvgInterface as Svg,
  SvgElementInterface as SvgElement,
  SvgTextInterface as SvgText,
  SvgLineInterface as SvgLine,
  SvgPathInterface as SvgPath,
  SvgCircleInterface as SvgCircle,
  SvgRectInterface as SvgRect,
} from '../draw/SvgInterface';
import { nonemptySplitByWhitespace } from '../parse/nonemptySplitByWhitespace';
import { trimNum } from './trimNum';

function _removeInvisibleLines(svg: Svg) {
  let toBeRemoved = [] as SvgLine[];
  svg.children().forEach((c: SvgElement) => {
    if (c.type === 'line') {
      if (c.attr('opacity') === 0 || c.attr('stroke-opacity') === 0) {
        toBeRemoved.push(c);
      }
    }
  });
  toBeRemoved.forEach(line => line.remove());
}

const _X_PADDING = 500;
const _Y_PADDING = 500;

/**
 * Returns zero if there are no text elements.
 */
function _xTextMin(svg: Svg): number {
  let x = NaN;
  svg.children().forEach((c: SvgElement) => {
    if (c.type === 'text') {
      if (!Number.isFinite(x) || c.attr('x') < x) {
        x = c.attr('x');
      }
    }
  });
  if (!Number.isFinite(x)) {
    return 0;
  }
  return x;
}

/**
 * Returns zero if there are no text elements.
 */
function _xTextMax(svg: Svg): number {
  let x = NaN;
  svg.children().forEach((c: SvgElement) => {
    if (c.type === 'text') {
      if (!Number.isFinite(x) || c.attr('x') > x) {
        x = c.attr('x');
      }
    }
  });
  if (!Number.isFinite(x)) {
    return 0;
  }
  return x;
}

/**
 * Returns zero if there are no text elements.
 */
function _yTextMin(svg: Svg): number {
  let y = NaN;
  svg.children().forEach((c: SvgElement) => {
    if (c.type === 'text') {
      if (!Number.isFinite(y) || c.attr('y') < y) {
        y = c.attr('y');
      }
    }
  });
  if (!Number.isFinite(y)) {
    return 0;
  }
  return y;
}

/**
 * Returns zero if there are no text elements.
 */
function _yTextMax(svg: Svg): number {
  let y = NaN;
  svg.children().forEach((c: SvgElement) => {
    if (c.type === 'text') {
      if (!Number.isFinite(y) || c.attr('y') > y) {
        y = c.attr('y');
      }
    }
  });
  if (!Number.isFinite(y)) {
    return 0;
  }
  return y;
}

function _shiftElements(svg: Svg) {
  let xShift = _X_PADDING - _xTextMin(svg);
  let yShift = _Y_PADDING - _yTextMin(svg);
  svg.children().forEach((c: SvgElement) => {
    c.dmove(xShift, yShift);
  });
}

function _scaleCoordinate(c: number, scaling: number, cOrigin: number): number {
  return cOrigin + (scaling * (c - cOrigin));
}

function _scaleText(text: SvgText, scaling: number, xOrigin: number, yOrigin: number) {
  let x = _scaleCoordinate(text.attr('x'), scaling, xOrigin);
  let y = _scaleCoordinate(text.attr('y'), scaling, yOrigin);
  text.attr({ 'x': x, 'y': y });
  let fs = text.attr('font-size');
  if (typeof fs === 'number') {
    text.attr({ 'font-size': scaling * fs });
  }
}

function _scaleLine(line: SvgLine, scaling: number, xOrigin: number, yOrigin: number) {
  let x1 = _scaleCoordinate(line.attr('x1'), scaling, xOrigin);
  let y1 = _scaleCoordinate(line.attr('y1'), scaling, yOrigin);
  let x2 = _scaleCoordinate(line.attr('x2'), scaling, xOrigin);
  let y2 = _scaleCoordinate(line.attr('y2'), scaling, yOrigin);
  let sw = scaling * line.attr('stroke-width');
  line.attr({
    'x1': x1,
    'y1': y1,
    'x2': x2,
    'y2': y2,
    'stroke-width': sw,
  });
}

function _scalePathSegments(path: SvgPath, scaling: number, xOrigin: number, yOrigin: number) {
  let pa = path.array();
  if (!pa) {
    return;
  }
  let d = '';
  pa.forEach(segment => {
    if (segment[0] === 'M') {
      let s = [
        'M',
        _scaleCoordinate(segment[1] as number, scaling, xOrigin),
        _scaleCoordinate(segment[2] as number, scaling, yOrigin),
      ];
      d += s.join(' ') + ' ';
    } else if (segment[0] === 'L') {
      let s = [
        'L',
        _scaleCoordinate(segment[1] as number, scaling, xOrigin),
        _scaleCoordinate(segment[2] as number, scaling, yOrigin),
      ];
      d += s.join(' ') + ' ';
    } else if (segment[0] === 'Q') {
      let s = [
        'Q',
        _scaleCoordinate(segment[1] as number, scaling, xOrigin),
        _scaleCoordinate(segment[2] as number, scaling, yOrigin),
        _scaleCoordinate(segment[3] as number, scaling, xOrigin),
        _scaleCoordinate(segment[4] as number, scaling, yOrigin),
      ];
      d += s.join(' ') + ' ';
    } else {
      console.log('Unrecognized segment in path: ' + segment[0]);
      d += segment.join(' ') + ' ';
    }
  });
  path.plot(d);
}

function _scalePathStrokeDasharray(path: SvgPath, scaling: number) {
  let s = path.attr('stroke-dasharray');
  if (!s) {
    return;
  }
  let da = nonemptySplitByWhitespace(s);
  let scaled = [] as number[];
  da.forEach(v => {
    let n = Number(v);
    scaled.push(scaling * n);
  });
  path.attr({ 'stroke-dasharray': scaled.join(' ') });
}

function _scalePathStrokeWidth(path: SvgPath, scaling: number) {
  let sw = scaling * path.attr('stroke-width');
  path.attr({ 'stroke-width': sw });
}

function _scalePath(path: SvgPath, scaling: number, xOrigin: number, yOrigin: number) {
  _scalePathSegments(path, scaling, xOrigin, yOrigin);
  _scalePathStrokeDasharray(path, scaling);
  _scalePathStrokeWidth(path, scaling);
}

function _scaleCircle(circle: SvgCircle, scaling: number, xOrigin: number, yOrigin: number) {
  let cx = _scaleCoordinate(circle.attr('cx'), scaling, xOrigin);
  let cy = _scaleCoordinate(circle.attr('cy'), scaling, yOrigin);
  let r = scaling * circle.attr('r');
  let sw = scaling * circle.attr('stroke-width');
  circle.attr({
    'cx': cx,
    'cy': cy,
    'r': r,
    'stroke-width': sw,
  });
}

function _scaleRect(rect: SvgRect, scaling: number, xOrigin: number, yOrigin: number) {
  let x = _scaleCoordinate(rect.attr('x'), scaling, xOrigin);
  let y = _scaleCoordinate(rect.attr('y'), scaling, yOrigin);
  let w = scaling * rect.attr('width');
  let h = scaling * rect.attr('height');
  let sw = scaling * rect.attr('stroke-width');
  rect.attr({
    'x': x,
    'y': y,
    'width': w,
    'height': h,
    'stroke-width': sw,
  });
}

function _scaleOther(ele: SvgElement, scaling: number, xOrigin: number, yOrigin: number) {
  let cx = _scaleCoordinate(ele.cx(), scaling, xOrigin);
  let cy = _scaleCoordinate(ele.cy(), scaling, yOrigin);
  ele.center(cx, cy);
}

function _scaleElements(svg: Svg, scaling: number) {
  let xOrigin = _xTextMin(svg);
  let yOrigin = _yTextMin(svg);
  svg.children().forEach((c: SvgElement) => {
    if (c.type === 'text') {
      _scaleText(c as SvgText, scaling, xOrigin, yOrigin);
    } else if (c.type === 'line') {
      _scaleLine(c as SvgLine, scaling, xOrigin, yOrigin);
    } else if (c.type === 'path') {
      _scalePath(c as SvgPath, scaling, xOrigin, yOrigin);
    } else if (c.type === 'circle') {
      _scaleCircle(c as SvgCircle, scaling, xOrigin, yOrigin);
    } else if (c.type === 'rect') {
      _scaleRect(c as SvgRect, scaling, xOrigin, yOrigin);
    } else {
      console.log('Unrecognized element type: ' + c.type);
      _scaleOther(c, scaling, xOrigin, yOrigin);
    }
  });
}

/**
 * Sets the dominant-baseline for all text elements to auto and
 * updates the y attribute such that where the text is displayed
 * remains the same.
 * 
 * This step is important because some applications (e.g. Illustrator)
 * do not support the dominant-baseline attribute.
 */
function _resetTextDominantBaselines(svg: Svg) {
  svg.children().forEach((c: SvgElement) => {
    if (c.type === 'text') {
      let cx = c.cx();
      let cy = c.cy();
      c.attr({ 'dominant-baseline': 'auto' });
      c.center(cx, cy);
    }
  });
}

const _NUMBER_TRIM = 6;

function _trimNum(n: number): number {
  return trimNum(n, _NUMBER_TRIM);
}

function _trimTextNumbers(text: SvgText) {
  let x = _trimNum(text.attr('x'));
  let y = _trimNum(text.attr('y'));
  text.attr({ 'x': x, 'y': y });
  let fs = text.attr('font-size');
  if (typeof fs === 'number') {
    text.attr({ 'font-size': _trimNum(fs) });
  }
}

function _trimLineNumbers(line: SvgLine) {
  let x1 = _trimNum(line.attr('x1'));
  let y1 = _trimNum(line.attr('y1'));
  let x2 = _trimNum(line.attr('x2'));
  let y2 = _trimNum(line.attr('y2'));
  let sw = _trimNum(line.attr('stroke-width'));
  line.attr({
    'x1': x1,
    'y1': y1,
    'x2': x2,
    'y2': y2,
    'stroke-width': sw,
  });
}

function _trimPathSegmentNumbers(path: SvgPath) {
  let pa = path.array();
  if (!pa) {
    return;
  }
  let d = '';
  pa.forEach(segment => {
    d += segment[0] + ' ';
    segment.slice(1).forEach((n: number) => {
      d += _trimNum(n) + ' ';
    });
  });
  path.plot(d);
}

function _trimPathStrokeDasharrayNumbers(path: SvgPath) {
  let s = path.attr('stroke-dasharray');
  if (!s) {
    return;
  }
  let da = nonemptySplitByWhitespace(s);
  let trimmed = [] as number[];
  da.forEach(v => {
    let n = Number(v);
    trimmed.push(_trimNum(n));
  });
  path.attr({ 'stroke-dasharray': trimmed.join(' ') });
}

function _trimPathStrokeWidth(path: SvgPath) {
  let sw = _trimNum(path.attr('stroke-width'));
  path.attr({ 'stroke-width': sw });
}

function _trimPathNumbers(path: SvgPath) {
  _trimPathSegmentNumbers(path);
  _trimPathStrokeDasharrayNumbers(path);
  _trimPathStrokeWidth(path);
}

function _trimCircleNumbers(circle: SvgCircle) {
  let cx = _trimNum(circle.attr('cx'));
  let cy = _trimNum(circle.attr('cy'));
  let r = _trimNum(circle.attr('r'));
  let sw = _trimNum(circle.attr('stroke-width'));
  circle.attr({
    'cx': cx,
    'cy': cy,
    'r': r,
    'stroke-width': sw,
  });
}

function _trimRectNumbers(rect: SvgRect) {
  let x = _trimNum(rect.attr('x'));
  let y = _trimNum(rect.attr('y'));
  let w = _trimNum(rect.attr('width'));
  let h = _trimNum(rect.attr('height'));
  let sw = _trimNum(rect.attr('stroke-width'));
  rect.attr({
    'x': x,
    'y': y,
    'width': w,
    'height': h,
    'stroke-width': sw,
  });
}

function _trimNumbers(svg: Svg) {
  svg.children().forEach((c: SvgElement) => {
    if (c.type === 'text') {
      _trimTextNumbers(c as SvgText);
    } else if (c.type === 'line') {
      _trimLineNumbers(c as SvgLine);
    } else if (c.type === 'path') {
      _trimPathNumbers(c as SvgPath);
    } else if (c.type === 'circle') {
      _trimCircleNumbers(c as SvgCircle);
    } else if (c.type === 'rect') {
      _trimRectNumbers(c as SvgRect);
    }
  });
}

function _setDimensions(svg: Svg) {
  let width = _xTextMax(svg) + _X_PADDING;
  let height = _yTextMax(svg) + _Y_PADDING;
  svg.viewbox(0, 0, width, height);
  svg.attr({
    'width': width,
    'height': height,
  });
}

function formatSvgForExport(svg: Svg, scaling=1) {
  _removeInvisibleLines(svg);
  _shiftElements(svg);
  _scaleElements(svg, scaling);
  _resetTextDominantBaselines(svg);
  _trimNumbers(svg);
  _setDimensions(svg);
}

export {
  formatSvgForExport,

  // these are only exported to aid testing
  _X_PADDING,
  _Y_PADDING,
  _xTextMin,
  _xTextMax,
  _yTextMin,
  _yTextMax,
  _shiftElements,
  _scaleCoordinate,
  _scaleText,
  _scaleLine,
  _scalePath,
  _scaleCircle,
  _scaleRect,
  _scaleElements,
  _resetTextDominantBaselines,
  _NUMBER_TRIM,
  _trimNum,
  _trimTextNumbers,
  _trimLineNumbers,
  _trimPathNumbers,
  _trimCircleNumbers,
  _trimRectNumbers,
  _trimNumbers,
  _setDimensions,
};
