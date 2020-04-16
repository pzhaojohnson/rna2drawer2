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

function _scaleText(text, scaling, xOrigin, yOrigin) {}

function _scaleLine(line, scaling, xOrigin, yOrigin) {}

function _scalePath(path, scaling, xOrigin, yOrigin) {}

function _scaleCircle(circle, scaling, xOrigin, yOrigin) {}

function _scaleRect(rect, scaling, xOrigin, yOrigin) {}

function _scaleElements(svg, scaling) {}

function _trimTextNumbers(text) {}

function _trimLineNumbers(line) {}

function _trimPathNumbers(path) {}

function _trimCircleNumbers(circle) {}

function _trimRectNumbers(rect) {}

function _trimNumbers(svg) {}

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
  _scaleText,
  _scaleLine,
  _scalePath,
  _scaleCircle,
  _scaleRect,
  _scaleElements,
  _trimTextNumbers,
  _trimLineNumbers,
  _trimPathNumbers,
  _trimCircleNumbers,
  _trimRectNumbers,
  _trimNumbers,
};
