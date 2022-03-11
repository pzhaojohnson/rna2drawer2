import { TertiaryBondInterface } from 'Draw/bonds/curved/TertiaryBondInterface';
import { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';
import { values } from 'Draw/bonds/curved/values';
import { setValues } from 'Draw/bonds/curved/values';

import * as SVG from '@svgdotjs/svg.js';

// obscures the view of a tertiary bond to indicate
// that it may be removed
export class TertiaryBondShroud {

  // the tertiary bond to be shrouded
  readonly tertiaryBond: TertiaryBondInterface;

  readonly shroud: TertiaryBond;

  constructor(tertiaryBond: TertiaryBondInterface) {
    this.tertiaryBond = tertiaryBond;

    let path = new SVG.Path();
    path.plot('M 0 0 Q 1 1 2 2'); // must already be a quadratic bezier curve
    this.shroud = new TertiaryBond(path, tertiaryBond.base1, tertiaryBond.base2);

    setValues(this.shroud, values(tertiaryBond));
    this.shroud.setControlPointDisplacement(tertiaryBond.controlPointDisplacement());

    this.shroud.path.attr({
      'stroke': 'white',
      'stroke-opacity': 0.75,
    });

    this.shroud.reposition();
  }

  appendTo(svg: SVG.Svg) {
    this.shroud.path.addTo(svg);
  }

  remove() {
    this.shroud.path.remove();
  }
}
