import { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';
import { values } from 'Draw/bonds/straight/values';
import { setValues } from 'Draw/bonds/straight/values';

import * as SVG from '@svgdotjs/svg.js';

// obscures the view of a secondary bond to indicate
// that it may be removed
export class SecondaryBondShroud {

  // the secondary bond to be shrouded
  readonly secondaryBond: SecondaryBond;

  readonly shroud: SecondaryBond;

  constructor(secondaryBond: SecondaryBond) {
    this.secondaryBond = secondaryBond;

    let line = new SVG.Line();
    this.shroud = new SecondaryBond(line, secondaryBond.base1, secondaryBond.base2);

    setValues(this.shroud, values(secondaryBond));

    this.shroud.line.attr({
      'stroke': 'white',
      'stroke-opacity': 0.75,
    });

    this.shroud.reposition();
  }

  appendTo(svg: SVG.Svg) {
    this.shroud.line.addTo(svg);
  }

  remove() {
    this.shroud.line.remove();
  }
}
