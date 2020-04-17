import { nonemptySplitByWhitespace } from '../parse/nonemptySplitByWhitespace';

const _X_PADDING = 100;
const _Y_PADDING = 100;

/**
 * If there are no text elements, this function returns zero.
 * 
 * @param {SVG.Svg} svg 
 * 
 * @returns {number} 
 */
function _xTextMin(svg) {
  let x = null;
  svg.children().forEach(c => {
    if (c.type === 'text') {
      if (x === null || c.attr('x') < x) {
        x = c.attr('x');
      }
    }
  });
  if (x === null) {
    return 0;
  }
  return x;
}

/**
 * If there are no text elements, this function returns zero.
 * 
 * @param {SVG.Svg} svg 
 * 
 * @returns {number} 
 */
function _yTextMin(svg) {
  let y = null;
  svg.children().forEach(c => {
    if (c.type === 'text') {
      if (y === null || c.attr('y') < y) {
        y = c.attr('y');
      }
    }
  });
  if (y === null) {
    return 0;
  }
  return y;
}

/**
 * @param {SVG.Text} text 
 * @param {number} xShift 
 * @param {number} yShift 
 */
function _shiftText(text, xShift, yShift) {
  let x = text.attr('x') + xShift;
  let y = text.attr('y') + yShift;
  text.attr({ 'x': x, 'y': y });
}

/**
 * @param {SVG.Line} line 
 * @param {number} xShift 
 * @param {number} yShift 
 */
function _shiftLine(line, xShift, yShift) {
  let x1 = line.attr('x1') + xShift;
  let y1 = line.attr('y1') + yShift;
  let x2 = line.attr('x2') + xShift;
  let y2 = line.attr('y2') + yShift;
  line.attr({ 'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2 });
}

/**
 * @param {SVG.Path} path 
 * @param {number} xShift 
 * @param {number} yShift 
 */
function _shiftPath(path, xShift, yShift) {
  let d = '';
  path.array().forEach(segment => {
    if (segment[0] === 'M') {
      let s = [
        'M',
        segment[1] + xShift,
        segment[2] + yShift,
      ];
      d += s.join(' ') + ' ';
    } else if (segment[0] === 'L') {
      let s = [
        'L',
        segment[1] + xShift,
        segment[2] + yShift,
      ];
      d += s.join(' ') + ' ';
    } else if (segment[0] === 'Q') {
      let s = [
        'Q',
        segment[1] + xShift,
        segment[2] + yShift,
        segment[3] + xShift,
        segment[4] + yShift,
      ];
      d += s.join(' ') + ' ';
    } else {
      d += segment.join(' ') + ' ';
    }
  });
  path.plot(d);
}

/**
 * @param {SVG.Circle} circle 
 * @param {number} xShift 
 * @param {number} yShift 
 */
function _shiftCircle(circle, xShift, yShift) {
  let cx = circle.attr('cx') + xShift;
  let cy = circle.attr('cy') + yShift;
  circle.attr({ 'cx': cx, 'cy': cy });
}

/**
 * @param {SVG.Rect} rect 
 * @param {number} xShift 
 * @param {number} yShift 
 */
function _shiftRect(rect, xShift, yShift) {
  let x = rect.attr('x') + xShift;
  let y = rect.attr('y') + yShift;
  rect.attr({ 'x': x, 'y': y });
}

/**
 * @param {SVG.Svg} svg 
 */
function _shiftElements(svg) {
  let xShift = _X_PADDING - _xTextMin(svg);
  let yShift = _Y_PADDING - _yTextMin(svg);
  svg.children().forEach(c => {
    if (c.type === 'text') {
      _shiftText(c, xShift, yShift);
    } else if (c.type === 'line') {
      _shiftLine(c, xShift, yShift);
    } else if (c.type === 'path') {
      _shiftPath(c, xShift, yShift);
    } else if (c.type === 'circle') {
      _shiftCircle(c, xShift, yShift);
    } else if (c.type === 'rect') {
      _shiftRect(c, xShift, yShift);
    }
  });
}

/**
 * @param {number} c 
 * @param {number} scaling 
 * @param {number} cOrigin 
 * 
 * @returns {number} 
 */
function _scaleCoordinate(c, scaling, cOrigin) {
  return cOrigin + (scaling * (c - cOrigin));
}

/**
 * @param {SVG.Text} rect 
 * @param {number} scaling 
 * @param {number} xOrigin 
 * @param {number} yOrigin 
 */
function _scaleText(text, scaling, xOrigin, yOrigin) {
  let x = _scaleCoordinate(text.attr('x'), scaling, xOrigin);
  let y = _scaleCoordinate(text.attr('y'), scaling, yOrigin);
  let fs = scaling * text.attr('font-size');
  text.attr({
    'x': x,
    'y': y,
    'fs': fs,
  });
}

/**
 * @param {SVG.Line} rect 
 * @param {number} scaling 
 * @param {number} xOrigin 
 * @param {number} yOrigin 
 */
function _scaleLine(line, scaling, xOrigin, yOrigin) {
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

/**
 * @param {SVG.Path} rect 
 * @param {number} scaling 
 * @param {number} xOrigin 
 * @param {number} yOrigin 
 */
function _scalePath(path, scaling, xOrigin, yOrigin) {
  let sw = scaling * path.attr('stroke-width');
  path.attr({ 'stroke-width': sw });

  let da = path.attr('stroke-dasharray');
  da = nonemptySplitByWhitespace(da);
  let daScaled = [];
  da.forEach(n => {
    daScaled.push(scaling * Number(n));
  });
  path.attr({ 'stroke-dasharray': daScaled.join(' ') });
  
  let d = '';
  path.array().forEach(segment => {
    if (segment[0] === 'M') {
      let s = [
        'M',
        _scaleCoordinate(segment[1], scaling, xOrigin),
        _scaleCoordinate(segment[2], scaling, yOrigin),
      ];
      d += s.join(' ') + ' ';
    } else if (segment[1] === 'L') {
      let s = [
        'L',
        _scaleCoordinate(segment[1], scaling, xOrigin),
        _scaleCoordinate(segment[2], scaling, yOrigin),
      ];
      d += s.join(' ') + ' ';
    } else if (segment[2] === 'Q') {
      let s = [
        'Q',
        _scaleCoordinate(segment[1], scaling, xOrigin),
        _scaleCoordinate(segment[2], scaling, yOrigin),
        _scaleCoordinate(segment[3], scaling, xOrigin),
        _scaleCoordinate(segment[4], scaling, yOrigin),
      ];
      d += s.join(' ') + ' ';
    } else {
      d += segment.join(' ') + ' ';
    }
  });
  path.plot(d);
}

/**
 * @param {SVG.Circle} rect 
 * @param {number} scaling 
 * @param {number} xOrigin 
 * @param {number} yOrigin 
 */
function _scaleCircle(circle, scaling, xOrigin, yOrigin) {
  let cx = _scaleCoordinate(circle.attr('cx'), scaling, xOrigin);
  let cy = _scaleCoordinate(circle.attr('cy'), scaling, yOrigin);
  let r = scaling * circle.attr('r');
  let sw = scaling * circle.attr('stroke-width');
  circle.attr({
    'cx': cx,
    'cy;': cy,
    'r': r,
    'stroke-width': sw,
  });
}

/**
 * @param {SVG.Rect} rect 
 * @param {number} scaling 
 * @param {number} xOrigin 
 * @param {number} yOrigin 
 */
function _scaleRect(rect, scaling, xOrigin, yOrigin) {
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

/**
 * @param {SVG.Svg} svg 
 * @param {number} scaling 
 */
function _scaleElements(svg, scaling) {
  let xOrigin = _xTextMin(svg);
  let yOrigin = _yTextMin(svg);
  svg.children().forEach(c => {
    if (c.type === 'text') {
      _scaleText(c, scaling, xOrigin, yOrigin);
    } else if (c.type === 'line') {
      _scaleLine(c, scaling, xOrigin, yOrigin);
    } else if (c.type === 'path') {
      _scalePath(c, scaling, xOrigin, yOrigin);
    } else if (c.type === 'circle') {
      _scaleCircle(c, scaling, xOrigin, yOrigin);
    } else if (c.type === 'rect') {
      _scaleRect(c, scaling, xOrigin, yOrigin);
    }
  });
}

const _NUMBER_TRIM = 6;

/**
 * @param {number} n 
 * 
 * @returns {number} 
 */
function _trimNum(n) {
  let trimmed = n.toFixed(_NUMBER_TRIM);
  return Number(trimmed);
}

/**
 * @param {SVG.Text} text 
 */
function _trimTextNumbers(text) {
  let x = _trimNum(text.attr('x'));
  let y = _trimNum(text.attr('y'));
  let fs = _trimNum(text.attr('font-size'));
  text.attr({
    'x': x,
    'y': y,
    'font-size': fs,
  });
}

/**
 * @param {SVG.Line} line 
 */
function _trimLineNumbers(line) {
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

/**
 * @param {SVG.Path} path 
 */
function _trimPathSegmentNumbers(path) {
  let pa = path.array();
  if (!pa) {
    return;
  }
  let d = '';
  pa.forEach(segment => {
    d += segment[0] + ' ';
    segment.slice(1).forEach(n => {
      d += _trimNum(n) + ' ';
    });
  });
  path.plot(d);
}

/**
 * @param {SVG.Path} path 
 */
function _trimPathStrokeDasharrayNumbers(path) {
  let s = path.attr('stroke-dasharray');
  if (!s) {
    return;
  }
  let da = nonemptySplitByWhitespace(s);
  let trimmed = [];
  da.forEach(v => {
    let n = Number(v);
    trimmed.push(_trimNum(n));
  });
  path.attr({ 'stroke-dasharray': trimmed.join(' ') });
}

/**
 * @param {SVG.Path} path 
 */
function _trimPathStrokeWidth(path) {
  let sw = _trimNum(path.attr('stroke-width'));
  path.attr({ 'stroke-width': sw });
}

/**
 * @param {SVG.Path} path 
 */
function _trimPathNumbers(path) {
  _trimPathSegmentNumbers(path);
  _trimPathStrokeDasharrayNumbers(path);
  _trimPathStrokeWidth(path);
}

/**
 * @param {SVG.Circle} circle 
 */
function _trimCircleNumbers(circle) {
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

/**
 * @param {SVG.Rect} rect 
 */
function _trimRectNumbers(rect) {
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

/**
 * @param {SVG.Svg} svg 
 */
function _trimNumbers(svg) {
  svg.children().forEach(c => {
    if (c.type === 'text') {
      _trimTextNumbers(c);
    } else if (c.type === 'line') {
      _trimLineNumbers(c);
    } else if (c.type === 'path') {
      _trimPathNumbers(c);
    } else if (c.type === 'circle') {
      _trimCircleNumbers(c);
    } else if (c.type === 'rect') {
      _trimRectNumbers(c);
    }
  });
}

/**
 * @param {SVG.Svg} svg A structure drawing.
 * @param {number} [scaling=1] How much to scale the drawing.
 */
function formatSVGforExport(svg, scaling=1) {
  _shiftElements(svg);
  _scaleElements(svg, scaling);
  _trimNumbers(svg);
}

export {
  formatSVGforExport,

  // these are only exported to aid testing
  _X_PADDING,
  _Y_PADDING,
  _shiftText,
  _shiftLine,
  _shiftPath,
  _shiftCircle,
  _shiftRect,
  _shiftElements,
  _xTextMin,
  _yTextMin,
  _scaleCoordinate,
  _scaleText,
  _scaleLine,
  _scalePath,
  _scaleCircle,
  _scaleRect,
  _scaleElements,
  _NUMBER_TRIM,
  _trimNum,
  _trimTextNumbers,
  _trimLineNumbers,
  _trimPathNumbers,
  _trimCircleNumbers,
  _trimRectNumbers,
  _trimNumbers,
};
