import { SVG } from '@svgdotjs/svg.js';
import Sequence from './Sequence';
import StraightBond from './StraightBond';

import StrictLayout from './layout/singleseq/strict/StrictLayout';

class Drawing {

  /**
   * @param {Element} container The DOM element to place the SVG document of the drawing in.
   */
  constructor(container) {
    this._container = container;

    this._initializeSVG();

    this._sequences = [];
      
    this._bonds = {
      strand: [],
      watsonCrick: [],
      tertiary: []
    };

    this._initializeDefaults();
  }

  /**
   * Creates the SVG document for this drawing and adds it to
   * the given container element.
   * 
   * Also initializes the Z separators for this drawing, which separate
   * different kinds of elements along the Z axis.
   * 
   * @param {Element} container The DOM element to place the SVG document of this drawing in.
   */
  _initializeSVG() {
    this._svg = SVG().addTo(this._container);

    this._svg.attr({
      'position': 'absolute',
      'width': 2 * window.screen.width,
      'height': 2 * window.screen.height,
      'overflow': 'scroll'
    });
  }

  _initializeDefaults() {
    this._defaults = {
      base: {
        width: 12,
        height: 12,
      },
      numbering: {
        anchor: 0,
        increment: 20,
      },
    };
  }

  /**
   * @returns {boolean} True if this drawing is empty.
   */
  isEmpty() {
    return this._sequences.length === 0;
  }

  centerView() {

    /* Using window.innerWidth is not perfectly precise, but this._container.innerWidth
    always seems to return 0. */
    this._container.scrollLeft = (this._container.scrollWidth - window.innerWidth) / 2;
    
    this._container.scrollTop = (this._container.scrollHeight - this._container.clientHeight) / 2;
  }

  /**
   * Adds the given structure to this drawing.
   * 
   * @param {string} id The sequence ID.
   * @param {string} sequence The sequence.
   * @param {Array<number|null>} partners The partners notation of the secondary structure.
   */
  addStructure(id, sequence, partners) {
    let seq = Sequence.createHorizontalLine(
      this._svg,
      id,
      sequence,
      window.screen.width,
      window.screen.height,
      this.defaults.baseWidth
    );

    this._sequences.push(seq);

    for (let p = 1; p <= sequence.length; p++) {
      let q = partners[p - 1];

      if (q !== null && p < q) {
        this._bonds.watsonCrick.push(StraightBond.createWatsonCrick(
          this._svg,
          seq.getBase(p),
          seq.getBase(q),
          this.defaults
        ));
      }
    }
  }

  /**
   * Applies a strict layout to the drawing.
   */
  applyStrictLayout() {
    let layout = new StrictLayout(
      this.strictLayoutPartners(),
      this.strictLayoutProps(),
      this.strictLayoutBaseProps(),
    );

    let x = 500;
    let y = 500;

    let p = 1;

    this._sequences.forEach(seq => {
      for (let q = 1; q <= seq.length; q++) {
        let b = seq.getBase(q);
        let cs = layout.baseCoordinates(p);
        console.log(cs.xCenter, cs.yCenter, p);

        b.move(
          (cs.xCenter * this.defaults.baseWidth) + 500,
          (cs.yCenter * this.defaults.baseHeight) + 500,
        );

        p++;
      }
    });
  }

  strictLayoutPartners() {
    let baseIdsToPositions = {};
    let p = 1;

    this._sequences.forEach(seq => {
      for (let q = 1; q <= seq.length; q++) {
        let b = seq.getBase(q);
        baseIdsToPositions[b.id] = p;
        p++;
      }
    });

    let partners = [];
    Object.keys(baseIdsToPositions).forEach(k => partners.push(null));

    this._bonds.watsonCrick.forEach(wcb => {
      let r = baseIdsToPositions[wcb.base1.id];
      let s = baseIdsToPositions[wcb.base2.id];
      partners[r - 1] = s;
      partners[s - 1] = r;
    });

    return partners;
  }
}

export default Drawing;
