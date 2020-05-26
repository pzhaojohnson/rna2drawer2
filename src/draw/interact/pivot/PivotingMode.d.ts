interface Drawing {
  zoom: number;
}

interface StrictDrawing {
  drawing: Drawing;
  baseWidth: number;
  baseHeight: number;
}

interface PivotingMode {
  strictDrawing: StrictDrawing;
}
