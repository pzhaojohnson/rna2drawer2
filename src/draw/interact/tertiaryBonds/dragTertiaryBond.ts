interface TertiaryBond {
  hasBeenRemoved: () => boolean;
  shiftControl: (xShift: number, yShift: number) => void;
}

function dragTertiaryBond(tb: TertiaryBond, xMove: number, yMove: number) {
  if (!tb || tb.hasBeenRemoved()) {
    return;
  }
  if (!Number.isFinite(xMove) || !Number.isFinite(yMove)) {
    return;
  }
  tb.shiftControl(
    2 * xMove,
    2 * yMove,
  );
}

export default dragTertiaryBond;
