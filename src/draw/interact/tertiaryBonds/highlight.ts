import { TertiaryBondInterface as TertiaryBond } from 'Draw/bonds/curved/TertiaryBondInterface';

export function highlightTertiaryBond(tb: TertiaryBond) {
  tb.fill = tb.path.attr('stroke');
  let so = tb.path.attr('stroke-opacity');
  if (typeof so == 'number') {
    tb.fillOpacity = Math.max(0.1 * so, 0.05);
  }
}

export function dehighlightTertiaryBond(tb: TertiaryBond) {
  tb.fill = 'none';
}
