import Sequence from './Sequence';
import {
  StrandBond,
  WatsonCrickBond,
} from './StraightBond';
import TertiaryBond from './TertiaryBond';
import parseStems from '../parse/parseStems';

class Drawing {

  constructor() {
    this._sequences = [];
      
    this._bonds = {
      strand: [],
      watsonCrick: [],
      tertiary: [],
    };
  }

  /**
   * @callback Drawing~SVG 
   * 
   * @returns {SVG.Doc} 
   */

  /**
   * @param {Node} container 
   * @param {Drawing~SVG} SVG 
   */
  addTo(container, SVG) {
    this._div = document.createElement('div');
    this._div.style.cssText = 'width: 100%; height: 100%; overflow: auto;';
    container.appendChild(this._div);
    this._svg = SVG().addTo(this._div);
    this._svg.attr({
      'width': 2 * window.screen.width,
      'height': 2 * window.screen.height,
    });
  }

  centerView() {
    this._div.scrollLeft = (this._div.scrollWidth - window.innerWidth) / 2;
    this._div.scrollTop = (this._div.scrollHeight - this._div.clientHeight) / 2;
  }

  /**
   * @returns {number} 
   */
  get width() {
    return this._svg.viewbox().width;
  }

  /**
   * @returns {number} 
   */
  get height() {
    return this._svg.viewbox().height;
  }

  /**
   * @param {number} width 
   * @param {number} height 
   */
  setWidthAndHeight(width, height) {
    let zoom = this.zoom;
    this._svg.viewbox(0, 0, width, height);
    this._svg.attr({
      'width': zoom * width,
      'height': zoom * height,
    });
  }

  /**
   * @returns {number} 
   */
  get zoom() {
    if (this.width === 0) {
      return 1;
    }
    return this._svg.attr('width') / this.width;
  }

  /**
   * @returns {number} 
   */
  get numSequences() {
    return this._sequences.length;
  }

  /**
   * @returns {boolean} 
   */
  isEmpty() {
    return this.numSequences === 0;
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
   * @param {callback} cb 
   */
  forEachSequence(cb) {
    this._sequences.forEach(seq => cb(seq));
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
   * @param {string} id 
   * 
   * @returns {boolean} 
   */
  sequenceIdIsTaken(id) {
    return this.sequenceIds().includes(id);
  }

  /**
   * Returns null if the given sequence ID is taken.
   * 
   * @param {string} id 
   * @param {string} letters 
   * 
   * @returns {Sequence|null} 
   */
  appendSequenceOutOfView(id, letters) {
    if (this.sequenceIdIsTaken(id)) {
      return null;
    }
    let seq = Sequence.createOutOfView(this._svg, id, letters);
    this._sequences.push(seq);
    return seq;
  }

  /**
   * Has no effect if no sequence has the given ID.
   * 
   * @param {string} id 
   */
  removeSequenceById(id) {
    let i = null;
    for (let j = 0; j < this._sequences.length; j++) {
      if (this._sequences[j].id === id) {
        i = j;
      }
    }
    if (i !== null) {
      this._sequences[i].remove();
      this._sequences.splice(i, 1);
    }
  }

  /**
   * @returns {number} 
   */
  get numBases() {
    let n = 0;
    this.forEachSequence(seq => {
      n += seq.length;
    });
    return n;
  }

  /**
   * Returns null if the position is out of range.
   * 
   * @param {number} p 
   * 
   * @returns {Base|null} 
   */
  getBaseAtStrictLayoutPosition(p) {
    let base = null;
    let q = 1;
    this.forEachBase(b => {
      if (q === p) {
        base = b;
      }
      q++;
    });
    return base;
  }

  /**
   * The returned bases will include the bases at the given
   * 5' and 3' most positions.
   * 
   * The bases are returned in ascending order.
   * 
   * @param {number} p5 
   * @param {number} p3 
   * 
   * @returns {Array<Base>} 
   */
  getBasesInStrictLayoutRange(p5, p3) {
    let bases = [];
    let p = 1;
    this.forEachBase(b => {
      if (p >= p5 && p <= p3) {
        bases.push(b);
      }
      p++;
    });
    return bases;
  }

  /**
   * Returns zero if the given base is not in this drawing.
   * 
   * @param {Base} b 
   * 
   * @returns {number} 
   */
  strictLayoutPositionOfBase(b) {
    let p = 0;
    let q = 1;
    this.forEachBase(base => {
      if (base.id === b.id) {
        p = q;
      }
      q++;
    });
    return p;
  }

  /**
   * @param {callback} cb 
   */
  forEachBase(cb) {
    this.forEachSequence(seq => {
      seq.forEachBase(b => cb(b));
    });
  }

  /**
   * @returns {Array<string>} 
   */
  baseIds() {
    let ids = [];
    this.forEachSequence(seq => {
      ids = ids.concat(seq.baseIds());
    });
    return ids;
  }

  /**
   * Returns null if no sequence contains the given base.
   * 
   * @param {Base} b 
   * 
   * @returns {Sequence|null} 
   */
  sequenceOfBase(b) {
    let seq = null;
    this.forEachSequence(s => {
      if (s.containsBase(b)) {
        seq = s;
      }
    });
    return seq;
  }

  /**
   * Returns zero if this drawing does not contain the given base.
   * 
   * @param {Base} b 
   * 
   * @returns {number} 
   */
  clockwiseNormalAngleOfBase(b) {
    let seq = this.sequenceOfBase(b);
    if (seq) {
      let p = seq.positionOfBase(b);
      return seq.clockwiseNormalAngleAtPosition(p);
    }
    return 0;
  }

  /**
   * @returns {number} 
   */
  get numStrandBonds() {
    return this._bonds.strand.length;
  }

  /**
   * @param {callback} cb 
   */
  forEachStrandBond(cb) {
    this._bonds.strand.forEach(sb => cb(sb));
  }

  /**
   * @param {Base} b1 
   * @param {Base} b2 
   * 
   * @returns {StrandBond} 
   */
  addStrandBond(b1, b2) {
    let sb = StrandBond.create(this._svg, b1, b2);
    this._bonds.strand.push(sb);
    return sb;
  }

  /**
   * @param {Sequence} seq 
   * 
   * @returns {Array<StrandBond>} 
   */
  addStrandBondsForSequence(seq) {
    let bonds = [];
    for (let p = 1; p <= seq.length - 1; p++) {
      let b1 = seq.getBaseAtPosition(p);
      let b2 = seq.getBaseAtPosition(p + 1);
      bonds.push(this.addStrandBond(b1, b2));
    }
    return bonds;
  }

  /**
   * @returns {number} 
   */
  get numWatsonCrickBonds() {
    return this._bonds.watsonCrick.length;
  }
  
  /**
   * @param {callback} cb 
   */
  forEachWatsonCrickBond(cb) {
    this._bonds.watsonCrick.forEach(wcb => cb(wcb));
  }

  /**
   * @returns {Array<number|null>} 
   */
  strictLayoutPartners() {
    let partners = [];
    this.forEachBase(b => {
      partners.push(null);
    });
    this.forEachWatsonCrickBond(wcb => {
      let p = this.strictLayoutPositionOfBase(wcb.base1);
      let q = this.strictLayoutPositionOfBase(wcb.base2);
      partners[p - 1] = q;
      partners[q - 1] = p;
    });
    return partners;
  }

  /**
   * Has no effect if the length of the given partners notation
   * does not match the number of bases in this drawing.
   * 
   * @param {Array<number|null>} partners 
   */
  removeExcessStrictLayoutPairs(partners) {
    if (partners.length !== this.numBases) {
      return;
    }
    let filtered = [];
    this.forEachWatsonCrickBond(wcb => {
      let p = this.strictLayoutPositionOfBase(wcb.base1);
      let q = this.strictLayoutPositionOfBase(wcb.base2);
      if (partners[p - 1] === q) {
        filtered.push(wcb);
      } else {
        wcb.remove();
      }
    });
    this._bonds.watsonCrick = filtered;
  }

  /**
   * Has no effect if the length of the given partners notation
   * does not match the number of bases in this drawing.
   * 
   * @param {Array<number|null>} partners 
   * 
   * @returns {Array<WatsonCrickBond>} 
   */
  addMissingStrictLayoutPairs(partners) {
    if (partners.length !== this.numBases) {
      return;
    }
    let currPartners = this.strictLayoutPartners();
    let added = [];
    for (let p = 1; p <= this.numBases; p++) {
      let q = partners[p - 1];
      if (q !== null && p < q && currPartners[p - 1] !== q) {
        let b1 = this.getBaseAtStrictLayoutPosition(p);
        let b2 = this.getBaseAtStrictLayoutPosition(q);
        let wcb = WatsonCrickBond.create(this._svg, b1, b2);
        this._bonds.watsonCrick.push(wcb);
        added.push(wcb);
      }
    }
    return added;
  }

  /**
   * Has no effect if the length of the given partners notation
   * does not match the number of bases in this drawing.
   * 
   * @param {Array<number|null>} partners 
   * 
   * @returns {Array<WatsonCrickBond>} 
   */
  applyStrictLayoutPartners(partners) {
    if (partners.length !== this.numBases) {
      return;
    }
    this.removeExcessStrictLayoutPairs(partners);
    return this.addMissingStrictLayoutPairs(partners);
  }

  /**
   * @returns {number} 
   */
  get numTertiaryBonds() {
    return this._bonds.tertiary.length;
  }

  /**
   * Returns null if no tertiary bond has the given ID.
   * 
   * @param {string} id 
   * 
   * @returns {TertiaryBond|null} 
   */
  getTertiaryBondById(id) {
    let bond = null;
    this.forEachTertiaryBond(tb => {
      if (tb.id === id) {
        bond = tb;
      }
    });
    return bond;
  }

  /**
   * @param {callback} cb 
   */
  forEachTertiaryBond(cb) {
    this._bonds.tertiary.forEach(tb => cb(tb));
  }

  /**
   * Returns null if no tertiary bond is added.
   * 
   * @param {Array<Base>} side1 
   * @param {Array<Base>} side2 
   * 
   * @returns {TertiaryBond|null} 
   */
  addTertiaryBond(side1, side2) {
    if (side1.length === 0 || side2.length === 0) {
      return null;
    }
    let tb = TertiaryBond.create(
      this._svg,
      side1,
      side2,
      b => this.clockwiseNormalAngleOfBase(b)
    );
    this._bonds.tertiary.push(tb);
    return tb;
  }

  /**
   * Returns null if no tertiary bond is added.
   * 
   * @param {number} p5 
   * @param {number} p3 
   * @param {number} size 
   * 
   * @returns {TertiaryBond|null} 
   */
  addStrictLayoutStemAsTertiaryBond(p5, p3, size) {
    let side1 = this.getBasesInStrictLayoutRange(p5, p5 + size - 1);
    let side2 = this.getBasesInStrictLayoutRange(p3 - size + 1, p3);
    return this.addTertiaryBond(side1, side2);
  }

  /**
   * This method adds the tertiary pairs with the fewest number
   * of tertiary bonds (i.e. maximizes the sizes of tertiary bonds).
   * 
   * @param {Sequence} seq 
   * @param {Array<number|null>} partners 
   * 
   * @returns {Array<TertiaryBond>} 
   */
  addTertiaryPairsForSequence(seq, partners) {
    let stems = parseStems(partners);
    let added = [];
    stems.forEach(st => {
      let side1 = seq.getBasesInRange(st.start, st.start + st.size - 1);
      let side2 = seq.getBasesInRange(st.end - st.size + 1, st.end);
      let tb = this.addTertiaryBond(side1, side2);
      if (tb) {
        added.push(tb);
      }
    });
    return added;
  }

  /**
   * Has no effect if no tertiary bond has the given ID.
   * 
   * @param {string} id 
   */
  removeTertiaryBondById(id) {
    let i = null;
    let j = 0;
    this.forEachTertiaryBond(tb => {
      if (tb.id === id) {
        tb.remove();
        i = j;
      }
      j++;
    });
    if (i !== null) {
      this._bonds.tertiary.splice(i, 1);
    }
  }

  _repositionBonds() {
    this.forEachStrandBond(sb => sb.reposition());
    this.forEachWatsonCrickBond(wcb => wcb.reposition());
    this.forEachTertiaryBond(tb => {
      tb.reposition(b => {
        let seq = this.sequenceOfBase(b);
        if (!seq) {
          return 0;
        }
        let p = seq.positionOfBase(b);
        return seq.clockwiseNormalAngleAtPosition(p);
      });
    });
  }

  /**
   * @param {StrictLayout} layout 
   * @param {number} baseWidth 
   * @param {number} baseHeight 
   */
  applyStrictLayout(layout, baseWidth, baseHeight) {
    let xMin = layout.xMin;
    let yMin = layout.yMin;
    let xPadding = window.screen.width / 2;
    let yPadding = window.screen.height / 2;
    let p = 1;
    this.forEachSequence(seq => {
      let q = 1;
      seq.forEachBase(b => {
        let bc = layout.baseCoordinatesAtPosition(p);
        b.move(
          xPadding + ((bc.xCenter - xMin) * baseWidth),
          yPadding + ((bc.yCenter - yMin) * baseHeight),
          seq.clockwiseNormalAngleAtPosition(q),
          seq.outerNormalAngleAtPosition(q),
        );
        p++;
        q++;
      });
    });
    this._repositionBonds();
    this.setWidthAndHeight(
      ((layout.xMax - xMin) * baseWidth) + (2 * xPadding),
      ((layout.yMax - yMin) * baseHeight) + (2 * yPadding),
    );
  }

  /**
   * @typedef {Object} Drawing~SavableState 
   * @property {string} className 
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
      className: 'Drawing',
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
