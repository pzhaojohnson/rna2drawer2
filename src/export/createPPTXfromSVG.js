import PptxGenJs from 'pptxgenjs';
import { pixelsToInches } from './pixelsToInches';
import { pixelsToPoints } from './pixelsToPoints';
import { pointsToInches } from './pointsToInches';
import { trimNum } from './trimNum';

/**
 * If the given hex code is a string and the first character is a '#',
 * this function will remove the '#'. Otherwise, this function will simply
 * return the given string.
 * 
 * If the given hex code is a number, this function will return the string
 * of that number.
 * 
 * If the given hex code has a different type (e.g. undefined), this function
 * will return '000000'.
 * 
 * @param {string|number} hex 
 * 
 * @returns {string} The hex code in a format compatible with PptxGenJs.
 */
function _pptxHex(hex) {
  if (typeof hex === 'string') {
    if (hex.charAt(0) === '#') {
      return hex.substring(1);
    }
    return hex;
  } else if (typeof hex === 'number') {
    return hex.toString();
  }
  return '000000';
}

const _NUMBER_TRIM = 2;

/**
 * @param {number} n 
 * 
 * @returns {number} 
 */
function _trimNum(n) {
  return trimNum(n, _NUMBER_TRIM);
}

/**
 * @param {PptxGenJs.PptxGenJs} pres 
 * @param {SVG.Svg} svg 
 */
function _setSlideDimensions(pres, svg) {
  let w = pixelsToInches(svg.viewbox().width);
  let h = pixelsToInches(svg.viewbox().height);
  pres.defineLayout({
    name: 'CUSTOM_LAYOUT',
    width: _trimNum(w),
    height: _trimNum(h),
  });
  pres.layout = 'CUSTOM_LAYOUT';
}

/**
 * If text-anchor was undefined, this function will set it to 'start',
 * which should not change how the text element is displayed.
 * 
 * @param {SVG.Text} text 
 * 
 * @returns {number} 
 */
function _xTextCenter(text) {
  let taPrev = text.attr('text-anchor');
  if (!taPrev) {
    taPrev = 'start';
  }
  let cx = text.bbox().cx;
  text.attr({ 'text-anchor': 'middle' });
  let shift = text.bbox().cx - cx;
  text.attr({ 'text-anchor': taPrev });
  return text.attr('x') - shift;
}

/**
 * If dominant-baseline was undefined, this function will set it to 'auto',
 * which should not change how the text element is displayed.
 * 
 * @param {SVG.Text} text 
 * 
 * @returns {number} 
 */
function _yTextCenter(text) {
  let dblPrev = text.attr('dominant-baseline');
  if (!dblPrev) {
    dblPrev = 'auto';
  }
  let b = text.bbox();
  let cy = b.cy;
  text.attr({ 'dominant-baseline': 'middle' });
  b = text.bbox();
  let shift = b.cy - cy;
  text.attr({ 'dominant-baseline': dblPrev });
  return text.attr('y') - shift;
}

/**
 * @param {SVG.Text} text 
 * 
 * @returns {Object} 
 */
function _textOptions(text) {
  let fs = pixelsToPoints(text.attr('font-size'));
  let w = pointsToInches(1.5 * fs);
  let h = pointsToInches(1.5 * fs);
  let x = pixelsToInches(_xTextCenter(text)) - (w / 2);
  let y = pixelsToInches(_yTextCenter(text)) - (h / 2);
  let fw = text.attr('font-weight');
  let bold = false;
  if (fw === 'bold' || fw === 'bolder') {
    bold = true;
  } else if (typeof fw === 'number' && fw > 500) {
    bold = true;
  }
  return {
    x: _trimNum(x),
    y: _trimNum(y),
    w: _trimNum(w),
    h: _trimNum(h),
    align: 'center',
    valign: 'middle',
    fontFace: text.attr('font-family'),
    fontSize: _trimNum(fs),
    bold: bold,
    color: _pptxHex(text.attr('fill')),
  };
}

/**
 * @param {PptxGenJs.Slide} slide 
 * @param {SVG.Text} text 
 */
function _addText(slide, text) {
  slide.addText(
    text.text(),
    _textOptions(text),
  );
}

/**
 * @param {SVG.Line} line 
 * 
 * @returns {Object} 
 */
function _lineOptions(line) {
  let xMin = Math.min(line.attr('x1'), line.attr('x2'));
  let xMax = Math.max(line.attr('x1'), line.attr('x2'));
  let yMin = Math.min(line.attr('y1'), line.attr('y2'));
  let yMax = Math.max(line.attr('y1'), line.attr('y2'));
  let x = pixelsToInches(xMin);
  let y = pixelsToInches(yMin);
  let w = pixelsToInches(xMax - xMin);
  let h = pixelsToInches(yMax - yMin);
  return {
    x: _trimNum(x),
    y: _trimNum(y),
    w: _trimNum(w),
    h: _trimNum(h),
    flipH: line.attr('x1') > xMin,
    flipV: line.attr('y1') > yMin,
    line: _pptxHex(line.attr('stroke')),
    lineSize: _trimNum(pixelsToPoints(line.attr('stroke-width'))),
  };
}

/**
 * @param {PptxGenJs.PptxGenJs} pres 
 * @param {PptxGenJs.Slide} slide 
 * @param {SVG.Line} line 
 */
function _addLine(pres, slide, line) {
  slide.addShape(
    pres.ShapeType.line,
    _lineOptions(line),
  );
}

/**
 * @param {SVG.Path} path 
 * 
 * @returns {boolean} 
 */
function _pathIsOnlyLines(path) {
  if (path.attr('fill-opacity') > 0) {
    return false;
  }
  let onlyLines = true;
  let pa = path.array();
  if (pa[0][0] !== 'M') {
    onlyLines = false;
  }
  pa.slice(1).forEach(segment => {
    if (segment[0] !== 'L') {
      onlyLines = false;
    }
  });
  return onlyLines;
}

/**
 * @param {SVG.Path} path 
 * @param {number} x1 
 * @param {number} y1 
 * @param {number} x2 
 * @param {number} y2 
 * 
 * @returns {Object} 
 */
function _pathLineOptions(path, x1, y1, x2, y2) {
  let x = Math.min(x1, x2);
  let y = Math.min(y1, y2);
  let w = Math.max(x1, x2) - x;
  let h = Math.max(y1, y2) - y;
  let lineDash = 'solid';
  if (path.attr('stroke-dasharray')) {
    lineDash = 'lgDash';
  }
  return {
    x: _trimNum(pixelsToInches(x)),
    y: _trimNum(pixelsToInches(y)),
    w: _trimNum(pixelsToInches(w)),
    h: _trimNum(pixelsToInches(h)),
    flipH: x1 > x2,
    flipV: y1 > y2,
    line: _pptxHex(path.attr('stroke')),
    lineSize: _trimNum(pixelsToPoints(path.attr('stroke-width'))),
    lineDash: lineDash,
  };
}

/**
 * @param {SVG.Path} path 
 * 
 * @returns {Array<Object>} 
 */
function _linesPathOptions(path) {
  let options = [];
  let pa = path.array();
  let m = pa[0];
  let xPrev = m[1];
  let yPrev = m[2];
  pa.slice(1).forEach(segment => {
    options.push(
      _pathLineOptions(path, xPrev, yPrev, segment[1], segment[2])
    );
    xPrev = segment[1];
    yPrev = segment[2];
  });
  return options;
}

/**
 * @param {PptxGenJs.PptxGenJs} pres 
 * @param {PptxGenJs.Slide} slide 
 * @param {SVG.Path} path 
 */
function _addLinesPath(pres, slide, path) {
  let options = _linesPathOptions(path);
  options.forEach(opts => {
    slide.addShape(
      pres.ShapeType.line,
      opts,
    );
  });
}

/**
 * Returns null if the SVG XML of the path is unable to
 * be converted to base64 using the window.btoa function.
 * 
 * @param {SVG.Path} path 
 * 
 * @returns {Object|null} 
 */
function _pathImageOptions(path) {
  let b = path.bbox();
  let sw = path.attr('stroke-width');
  let svg = path.root();
  let nested = svg.nested();
  nested.svg(path.svg());
  let np = nested.first();
  nested.viewbox(0, 0, b.width + sw, b.height + sw);
  nested.attr({ 'width': b.width + sw, 'height': b.height + sw });
  np.dmove(-b.x + (sw / 2), -b.y + (sw / 2));
  let xml = nested.svg();
  nested.clear();
  nested.remove();
  let base64 = null;
  try {
    base64 = window.btoa(xml);
  } catch (err) {}
  if (!base64) {
    return null;
  }
  return {
    data: 'image/svg+xml;base64,' + base64,
    x: _trimNum(pixelsToInches(b.x - (sw / 2))),
    y: _trimNum(pixelsToInches(b.y - (sw / 2))),
    w: _trimNum(pixelsToInches(b.width + sw)),
    h: _trimNum(pixelsToInches(b.height + sw)),
  };
}

/**
 * @param {PptxGenJs.Slide} slide 
 * @param {SVG.Path} path 
 */
function _addPathAsImage(slide, path) {
  let options = _pathImageOptions(path);
  if (options) {
    slide.addImage(options);
  }
}

/**
 * @param {PptxGenJs.PptxGenJs} pres 
 * @param {PptxGenJs.Slide} slide 
 * @param {SVG.Path} path 
 */
function _addPath(pres, slide, path) {
  if (_pathIsOnlyLines(path)) {
    _addLinesPath(pres, slide, path);
    return;
  }
  _addPathAsImage(slide, path);
}

/**
 * @param {SVG.Circle} circle 
 * 
 * @returns {Object} 
 */
function _circleOptions(circle) {
  let x = circle.attr('cx') - circle.attr('r');
  let y = circle.attr('cy') - circle.attr('r');
  let w = 2 * circle.attr('r');
  let h = 2 * circle.attr('r');
  return {
    x: _trimNum(pixelsToInches(x)),
    y: _trimNum(pixelsToInches(y)),
    w: _trimNum(pixelsToInches(w)),
    h: _trimNum(pixelsToInches(h)),
    line: {
      type: 'solid',
      color: _pptxHex(circle.attr('stroke')),
      alpha: 100 * (1 - circle.attr('stroke-opacity')),
    },
    lineSize: _trimNum(pixelsToPoints(circle.attr('stroke-width'))),
    fill: {
      type: 'solid',
      color: _pptxHex(circle.attr('fill')),
      alpha: 100 * (1 - circle.attr('fill-opacity')),
    },
  };
}

/**
 * @param {PptxGenJs.PptxGenJs} pres 
 * @param {PptxGenJs.Slide} slide 
 * @param {SVG.Circle} circle 
 */
function _addCircle(pres, slide, circle) {
  slide.addShape(
    pres.ShapeType.ellipse,
    _circleOptions(circle),
  );
}

/**
 * @param {SVG.Rect} rect 
 * 
 * @returns {Object} 
 */
function _rectOptions(rect) {
  return {
    x: _trimNum(pixelsToInches(rect.attr('x'))),
    y: _trimNum(pixelsToInches(rect.attr('y'))),
    w: _trimNum(pixelsToInches(rect.attr('width'))),
    h: _trimNum(pixelsToInches(rect.attr('height'))),
    line: {
      type: 'solid',
      color: _pptxHex(rect.attr('stroke')),
      alpha: 100 * (1 - rect.attr('stroke-opacity')),
    },
    lineSize: _trimNum(pixelsToPoints(rect.attr('stroke-width'))),
    fill: {
      type: 'solid',
      color: _pptxHex(rect.attr('fill')),
      alpha: 100 * (1 - rect.attr('fill-opacity')),
    },
  };
}

/**
 * @param {PptxGenJs.PptxGenJs} pres 
 * @param {PptxGenJs.Slide} slide 
 * @param {SVG.Rect} rect 
 */
function _addRect(pres, slide, rect) {
  slide.addShape(
    pres.ShapeType.rect,
    _rectOptions(rect),
  );
}

/**
 * @param {SVG.Svg} svg 
 * 
 * @returns {PptxGenJs.PptxGenJs} 
 */
function createPptxFromSvg(svg) {
  let pres = new PptxGenJs();
  _setSlideDimensions(pres, svg);
  let slide = pres.addSlide();
  svg.children().forEach(c => {
    if (c.type === 'text') {
      _addText(slide, c);
    } else if (c.type === 'line') {
      _addLine(pres, slide, c);
    } else if (c.type === 'path') {
      _addPath(pres, slide, c);
    } else if (c.type === 'circle') {
      _addCircle(pres, slide, c);
    } else if (c.type === 'rect') {
      _addRect(pres, slide, c);
    }
  });
  return pres;
}

export {
  createPptxFromSvg,

  // these are only exported to aid testing
  _pptxHex,
  _NUMBER_TRIM,
  _trimNum,
  _xTextCenter,
  _yTextCenter,
  _textOptions,
  _lineOptions,
  _pathIsOnlyLines,
  _pathLineOptions,
  _linesPathOptions,
  _pathImageOptions,
  _circleOptions,
  _rectOptions,
};
