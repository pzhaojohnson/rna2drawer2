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
  return SVG(document.documentElement);
}

export default createNodeSVG;
