function _fillInPropsForBase(props, b) {
  props.radius = props.radius ?? 1.25 * b.fontSize;
  props.stroke = props.stroke ?? '#000000';
  props.strokeWidth = props.strokeWidth ?? 0;
  props.fill = props.fill ?? '#ffd700';
  props.fillOpacity = props.fillOpacity ?? 0.5;
}

function _applyPropsToHighlighting(props, h) {
  h.radius = props.radius;
  h.stroke = props.stroke;
  h.strokeWidth = props.strokeWidth;
  h.fill = props.fill;
  h.fillOpacity = props.fillOpacity;
}

/**
 * @typedef {Object} Highlighting 
 * @property {number} radius 
 * @property {string} stroke 
 * @property {number} strokeWidth 
 * @property {string} fill 
 * @property {number} fillOpacity 
 */

/**
 * @param {Drawing} drawing 
 * @param {Array<Highlighting>} highlightings 
 */
function setBaseHighlightingsOfDrawing(drawing, highlightings) {
  drawing.forEachBase((b, p) => {
    let props = highlightings[p - 1];
    if (!props) {
      b.removeHighlighting();
    } else {
      props = { ...props };
      _fillInPropsForBase(props, b);
      let h = b.addCircleHighlighting();
      _applyPropsToHighlighting(props, h);
    }
  });
}

export default setBaseHighlightingsOfDrawing;
