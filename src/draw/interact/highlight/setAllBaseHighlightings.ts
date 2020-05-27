export interface Highlighting {
  radius: number;
  stroke: string;
  strokeWidth: number;
  fill: string;
  fillOpacity: number;
}

export interface Base {
  fontSize: number;
  addCircleHighlighting: () => Highlighting;
  removeHighlighting: () => void;
}

export interface ForEachBaseFunc {
  (b: Base, p: number): void;
}

export interface Drawing {
  forEachBase: (cb: ForEachBaseFunc) => void;
}

export interface HighlightingProps {
  radius?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  fillOpacity?: number;
}

function _fillInPropsForBase(props: HighlightingProps, b: Base) {
  props.radius = props.radius ?? 1.25 * b.fontSize;
  props.stroke = props.stroke ?? '#000000';
  props.strokeWidth = props.strokeWidth ?? 0;
  props.fill = props.fill ?? '#ffd700';
  props.fillOpacity = props.fillOpacity ?? 0.75;
}

function _applyPropsToHighlighting(props: HighlightingProps, h: Highlighting) {
  h.radius = props.radius;
  h.stroke = props.stroke;
  h.strokeWidth = props.strokeWidth;
  h.fill = props.fill;
  h.fillOpacity = props.fillOpacity;
}

export function setAllBaseHighlightings(drawing: Drawing, highlightings: HighlightingProps[]) {
  if (!drawing || !highlightings) {
    return;
  }
  drawing.forEachBase((b: Base, p: number) => {
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

export default setAllBaseHighlightings;
