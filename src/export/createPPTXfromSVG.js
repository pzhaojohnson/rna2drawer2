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

const _NUMBER_TRIM = 3;

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
  let flipH = false;
  if (line.attr('x1') > xMin) {
    flipH = true;
  }
  let flipV = false;
  if (line.attr('y1') > yMin) {
    flipV = true;
  }
  let x = pixelsToInches(line.attr('x1'));
  let y = pixelsToInches(line.attr('y1'));
  let w = pixelsToInches(xMax - xMin);
  let h = pixelsToInches(yMax - yMin);
  return {
    x: _trimNum(x),
    y: _trimNum(y),
    w: _trimNum(w),
    h: _trimNum(h),
    flipH: flipH,
    flipV: flipV,
    line: line.attr('stroke'),
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
function _pathHasOnlyLines(path) {
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
    line: path.attr('stroke'),
    lineSize: path.attr('stroke-width'),
    lineDash: lineDash,
  };
}

/**
 * @param {PptxGenJs.PptxGenJs} pres 
 * @param {PptxGenJs.Slide} slide 
 * @param {SVG.Path} path 
 */
function _addLinesPath(pres, slide, path) {
  let pa = path.array();
  let m = pa[0];
  let xPrev = m[1];
  let yPrev = m[2];
  pa.slice(1).forEach(segment => {
    slide.addShape(
      pres.ShapeType.line,
      _pathLineOptions(path, xPrev, yPrev, segment[1], segment[2]),
    );
    xPrev = segment[1];
    yPrev = segment[2];
  });
}

/**
 * @param {PptxGenJs.Slide} slide 
 * @param {SVG.Path} path 
 */
function _addPathAsSVG(slide, path) {
  let xml = path.svg();
  let base64 = null;
  try {
    base64 = window.btoa(xml);
  } catch (err) {}
  if (base64) {
    slide.addImage({
      data: 'image/svg+xml;base64,' + base64,
    });
  }
}

/**
 * @param {PptxGenJs.PptxGenJs} pres 
 * @param {PptxGenJs.Slide} slide 
 * @param {SVG.Path} path 
 */
function _addPath(pres, slide, path) {
  if (_pathHasOnlyLines(path)) {
    _addLinesPath(pres, slide, path);
    return;
  }
  _addPathAsSVG(slide, path);
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
  let lineSize = pixelsToPoints(circle.attr('stroke-width'));
  if (circle.attr('stroke-opacity') === 0) {
    lineSize = 0;
  }
  return {
    x: _trimNum(pixelsToInches(x)),
    y: _trimNum(pixelsToInches(y)),
    w: _trimNum(pixelsToInches(w)),
    h: _trimNum(pixelsToInches(h)),
    line: circle.attr('stroke'),
    lineSize: _trimNum(lineSize),
    fill: {
      type: 'solid',
      color: circle.attr('fill'),
      alpha: 100 * circle.attr('fill-opacity'),
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
    pres.ShapeType.oval,
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
    line: rect.attr('stroke'),
    lineSize: rect.attr('stroke-width'),
    fill: {
      type: 'solid',
      color: rect.attr('fill'),
      alpha: 100 * rect.attr('fill-opacity'),
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
    pres.ShapeType.rectangle,
    _rectOptions(rect),
  );
}

/**
 * @param {SVG.Svg} svg 
 * 
 * @returns {PptxGenJs.PptxGenJs} 
 */
function createPPTXfromSVG(svg) {
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
  createPPTXfromSVG,

  // these are only exported to aid testing
  _pptxHex,
  _NUMBER_TRIM,
  _trimNum,
  _xTextCenter,
  _yTextCenter,
  _textOptions,
  _lineOptions,
  _circleOptions,
};
