interface StrictDrawing {
  drawing: {
    zoom: number;
  }
  baseWidth: number;
  baseHeight: number;
}

function mouseMoveToStretch(xMove: number, yMove: number, sd: StrictDrawing): number {
  if (xMove == null || yMove == null || !sd) {
    return 0;
  }
  let m = (xMove**2 + yMove**2)**0.5;
  let s = m / ((sd.baseWidth + sd.baseHeight) / 2);
  s /= sd.drawing.zoom;
  if (Number.isFinite(s)) {
    return s;
  }
  return 0;
}

export default mouseMoveToStretch;
