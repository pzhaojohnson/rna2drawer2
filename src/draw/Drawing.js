import { SVG } from '@svgdotjs/svg.js';
import Sequence from './Sequence';
import StraightBond from './StraightBond';

import StrictLayout from './layout/singleseq/strict/StrictLayout';

class Drawing {

  /**
   * @param {Element} container The DOM element to place the SVG document of the drawing in.
   */
  constructor(container) {
    this._initializeSVG(container);

    this._sequences = [];
      
    this._bonds = {
      strand: [],
      watsonCrick: [],
      tertiary: []
    };

    this._baseWidth = 12;
    this._baseHeight = 16;
  }

  /**
   * @param {Element} container 
   */
  _initializeSVG(container) {
    this._svgDiv = document.createElement('div');
    this._svgDiv.style.cssText = 'width: 100%; height: 100%; overflow: auto;';
    container.appendChild(this._svgDiv);

    this._svg = SVG().addTo(this._svgDiv);

    this._svg.attr({
      'width': 2 * window.screen.width,
      'height': 2 * window.screen.height,
    });
  }

  centerView() {

    /* Using window.innerWidth is not perfectly precise, but this._container.innerWidth
    always seems to return 0. */
    this._svgDiv.scrollLeft = (this._svgDiv.scrollWidth - window.innerWidth) / 2;
    
    this._svgDiv.scrollTop = (this._svgDiv.scrollHeight - this._svgDiv.clientHeight) / 2;
  }

  /**
   * @returns {number} 
   */
  get baseWidth() {
    return this._baseWidth;
  }

  /**
   * @param {number} bw 
   */
  set baseWidth(bw) {
    this._baseWidth = bw;
  }

  /**
   * @returns {number} 
   */
  get baseHeight() {
    return this._baseHeight;
  }

  /**
   * @param {number} bh 
   */
  set baseHeight(bh) {
    this._baseHeight = bh;
  }

  /**
   * @returns {boolean} 
   */
  isEmpty() {
    return this._sequences.length === 0;
  }

  /**
   * Returns null if the given ID does not match any sequence.
   * 
   * @param {string} id 
   * 
   * @returns {Sequence|null} 
   */
  getSequenceById(id) {
    for (let i = 0; i < this._sequences.length; i++) {
      if (this._sequences[i].id === id) {
        return this._sequences[i];
      }
    }
    return null;
  }

  /**
   * @returns {Array<string>} 
   */
  sequenceIds() {
    let ids = [];
    this._sequences.forEach(seq => ids.push(seq.id));
    return ids;
  }

  /**
   * @param {callback} cb 
   */
  forEachSequence(cb) {
    this._sequences.forEach(seq => cb(seq));
  }

  /**
   * @param {callback} cb 
   */
  forEachStrandBond(cb) {
    this._bonds.strand.forEach(sb => cb(sb));
  }

  /**
   * @param {callback} cb 
   */
  forEachWatsonCrickBond(cb) {
    this._bonds.watsonCrick.forEach(wcb => cb(wcb));
  }

  /**
   * @param {callback} cb 
   */
  forEachTertiaryBond(cb) {
    this._bonds.tertiary.forEach(tb => cb(tb));
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

  /**
   * @typedef {Object} Drawing~SavableState 
   * @property {string} svg 
   * @property {Array<Sequence~SavableState>} sequences 
   * @property {Drawing~BondsSavableState} bonds 
   */

  /**
   * @typedef {Object} Drawing~BondsSavableState 
   * @property {Array<StraightBond~SavableState} strand 
   * @property {Array<StraightBond~SavableState} watsonCrick 
   * @property {Array<TertiaryBond~SavableState} tertiary 
   */

  /**
   * @returns {Drawing~SavableState} 
   */
  savableState() {
    let savableState = {
      svg: this._svg.svg(),
      sequences: [],
      bonds: {
        strand: [],
        watsonCrick: [],
        tertiary: [],
      },
    };
    this._sequences.forEach(
      seq => savableState.sequences.push(seq.savableState())
    );
    this._bonds.strand.forEach(
      sb => savableState.bonds.strand.push(sb.savableState())
    );
    this._bonds.watsonCrick.forEach(
      wcb => savableState.bonds.watsonCrick.push(wcb.savableState())
    );
    this._bonds.tertiary.forEach(
      tb => savableState.bonds.tertiary.push(tb.savableState())
    );
    return savableState;
  }
}

export default Drawing;
