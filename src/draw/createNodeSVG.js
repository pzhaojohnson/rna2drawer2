const window = require('svgdom');
const document = window.document;
const { SVG, registerWindow } = require('@svgdotjs/svg.js');

registerWindow(window, document);

/**
 * Meant to only be used for testing purposes.
 * 
 * @returns {SVG.Doc} A new SVG document compatible with Node.js.
 */
function createNodeSVG() {
  let svg = SVG(document.documentElement);

  // elements seem to linger from previously created SVG documents...
  svg.clear();

  // needed for Drawing class tests to work
  svg.addTo = () => svg;
  
  return svg;
}

export default createNodeSVG;
