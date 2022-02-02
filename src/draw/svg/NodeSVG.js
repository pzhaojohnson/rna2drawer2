const window = require('svgdom');
const document = window.document;
const { SVG, registerWindow } = require('@svgdotjs/svg.js');

registerWindow(window, document);

// creates a root SVG node compatible with Node.js
// (primarily meant for testing purposes)
export function NodeSVG() {
  let svg = SVG(document.documentElement);

  // elements seem to linger from previously created root SVG nodes
  svg.clear();

  // actual addTo method does not seem to work on Node.js
  svg.addTo = () => {
    console.log('Using placeholder addTo method.');
    return svg;
  };

  return svg;
}
