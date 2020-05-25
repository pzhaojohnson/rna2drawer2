interface TertiaryBond {
  hasBeenRemoved: () => boolean;
  stroke: string;
  fill: string;
  fillOpacity: number;
}

function highlightTertiaryBond(tb: TertiaryBond) {
  if (!tb || tb.hasBeenRemoved()) {
    return;
  }
  tb.fill = tb.stroke;
  tb.fillOpacity = 0.1;
}

function dehighlightTertiaryBond(tb: TertiaryBond) {
  if (!tb || tb.hasBeenRemoved()) {
    return;
  }
  tb.fill = 'none';
}

export default highlightTertiaryBond;

export {
  highlightTertiaryBond,
  dehighlightTertiaryBond,
};
