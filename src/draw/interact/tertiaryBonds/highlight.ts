import { TertiaryBondInterface as TertiaryBond } from '../../QuadraticBezierBondInterface';

export function highlightTertiaryBond(tb: TertiaryBond) {
  tb.fill = tb.stroke;
  tb.fillOpacity = Math.max(0.1 * tb.strokeOpacity, 0.05);
}

export function dehighlightTertiaryBond(tb: TertiaryBond) {
  tb.fill = 'none';
}
