const _X_PADDING = 100;
const _Y_PADDING = 100;

function _shiftTexts(svg, xShift, yShift) {}

function _shiftLines(svg, xShift, yShift) {}

function _shiftPaths(svg, xShift, yShift) {}

function _shiftCircles(svg, xShift, yShift) {}

function _shiftRects(svg, xShift, yShift) {}

function _shiftElements(svg) {}

function _scaleTexts(svg, scaling, xOrigin, yOrigin) {}

function _scaleLines(svg, scaling, xOrigin, yOrigin) {}

function _scalePaths(svg, scaling, xOrigin, yOrigin) {}

function _scaleCircles(svg, scaling, xOrigin, yOrigin) {}

function _scaleRects(svg, scaling, xOrigin, yOrigin) {}

function _scaleElements(svg, scaling) {}

function _textFontSizeIsInPixels(text) {}

function _convertTextFontSizesToPoints(svg) {}

function _trimTextNumbers(svg) {}

function _trimLineNumbers(svg) {}

function _trimPathNumbers(svg) {}

function _trimCircleNumbers(svg) {}

function _trimRectNumbers(svg) {}

function _trimNumbers(svg) {}

/**
 * @param {SVG.Svg} svg A structure drawing.
 * @param {number} [scaling=1] How much to scale the drawing.
 */
function formatSVGforExport(svg, scaling=1) {
  _shiftElements(svg);
  _scaleElements(svg, scaling);
  _convertTextFontSizesToPoints(svg);
  _trimNumbers(svg);
}

export {
  formatSVGforExport,

  // these are only exported to aid testing
  _X_PADDING,
  _Y_PADDING,
  _shiftTexts,
  _shiftLines,
  _shiftPaths,
  _shiftCircles,
  _shiftRects,
  _shiftElements,
};
