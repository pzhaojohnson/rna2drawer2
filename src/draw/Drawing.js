import Sequence from './Sequence';
import {
  PrimaryBond,
  SecondaryBond,
} from './StraightBond';
import { TertiaryBond } from './QuadraticBezierBond';
import parseStems from '../parse/parseStems';
import angleBetween from './angleBetween';
import normalizeAngle from './normalizeAngle';

class Drawing {

  constructor() {
    this._sequences = [];
      
    this._bonds = {
      primary: [],
      secondary: [],
      tertiary: [],
    };
  }

  /**
   * @callback Drawing~SVG 
   * 
   * @returns {SVG.Svg} 
   */

  /**
   * @param {Node} container 
   * @param {Drawing~SVG} SVG 
   */
  addTo(container, SVG) {
    this._div = document.createElement('div');
    this._div.style.cssText = 'width: 100%;'
      + 'height: 100%;'
      + 'display: flex;'
      + 'align-items: center;'
      + 'justify-content: center;'
      + 'overflow: auto;';
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
    if (this.width == 0) {
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
    return this.numSequences == 0;
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
   * @param {string} characters 
   * 
   * @returns {Sequence|null} 
   */
  appendSequenceOutOfView(id, characters) {
    if (this.sequenceIdIsTaken(id)) {
      return null;
    }
    let seq = Sequence.createOutOfView(this._svg, id, characters);
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
  getBaseAtOverallPosition(p) {
    let base = null;
    this.forEachBase((b, q) => {
      if (q === p) {
        base = b;
      }
    });
    return base;
  }

  /**
   * Returns zero if the given base is not in this drawing.
   * 
   * @param {Base} b 
   * 
   * @returns {number} 
   */
  overallPositionOfBase(b) {
    let p = 0;
    this.forEachBase((base, q) => {
      if (base.id === b.id) {
        p = q;
      }
    });
    return p;
  }

  /**
   * @callback Drawing~forEachBase 
   * @param {Base} b 
   * @param {number} p The overall position of the base.
   */

  /**
   * @param {Drawing~forEachBase} cb 
   */
  forEachBase(cb) {
    let p = 1;
    this.forEachSequence(seq => {
      seq.forEachBase(b => {
        cb(b, p);
        p++;
      });
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
      if (s.contains(b)) {
        seq = s;
      }
    });
    return seq;
  }

  /**
   * @returns {number} 
   */
  get numPrimaryBonds() {
    return this._bonds.primary.length;
  }

  /**
   * @param {callback} cb 
   */
  forEachPrimaryBond(cb) {
    this._bonds.primary.forEach(pb => cb(pb));
  }

  /**
   * @param {Base} b1 
   * @param {Base} b2 
   * 
   * @returns {PrimaryBond} 
   */
  addPrimaryBond(b1, b2) {
    let sb = PrimaryBond.create(this._svg, b1, b2);
    this._bonds.primary.push(sb);
    return sb;
  }

  /**
   * @param {Sequence} seq 
   * 
   * @returns {Array<PrimaryBond>} 
   */
  addPrimaryBondsForSequence(seq) {
    let bonds = [];
    for (let p = 1; p <= seq.length - 1; p++) {
      let b1 = seq.getBaseAtPosition(p);
      let b2 = seq.getBaseAtPosition(p + 1);
      bonds.push(this.addPrimaryBond(b1, b2));
    }
    return bonds;
  }

  /**
   * @returns {number} 
   */
  get numSecondaryBonds() {
    return this._bonds.secondary.length;
  }
  
  /**
   * @param {callback} cb 
   */
  forEachSecondaryBond(cb) {
    this._bonds.secondary.forEach(sb => cb(sb));
  }

  /**
   * @param {Base} b1 
   * @param {Base} b2 
   * 
   * @returns {SecondaryBond} 
   */
  addSecondaryBond(b1, b2) {
    let sb = SecondaryBond.create(this._svg, b1, b2);
    this._bonds.secondary.push(sb);
    return sb;
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
   * @param {Base} b1 
   * @param {Base} b2 
   * 
   * @returns {TertiaryBond} 
   */
  addTertiaryBond(b1, b2) {
    let tb = TertiaryBond.create(this._svg, b1, b2);
    this._bonds.tertiary.push(tb);
    return tb;
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

  repositionBonds() {
    this.forEachPrimaryBond(pb => pb.reposition());
    this.forEachSecondaryBond(sb => sb.reposition());
    this.forEachTertiaryBond(tb => tb.reposition());
  }

  adjustNumberingLineAngles() {
    this.forEachSequence(seq => {
      seq.forEachBase((b, p) => {
        if (b.hasNumbering()) {
          b.numbering.lineAngle = seq.outerNormalAngleAtPosition(p);
        }
      });
    });
    this.forEachSecondaryBond(sb => {
      let b1 = sb.base1;
      let b2 = sb.base2;
      let ba = b1.angleBetweenCenters(b2);
      if (b1.hasNumbering()) {
        let la = normalizeAngle(b1.numbering.lineAngle, ba) - ba;
        if (la < Math.PI / 2 || la > 3 * Math.PI / 2) {
          b1.numbering.lineAngle = b1.numbering.lineAngle + Math.PI;
        }
      }
      if (b2.hasNumbering()) {
        let la = normalizeAngle(b2.numbering.lineAngle + Math.PI, ba) - ba;
        if (la < Math.PI / 2 || la > 3 * Math.PI / 2) {
          b2.numbering.lineAngle = b2.numbering.lineAngle + Math.PI;
        }
      }
    });
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
   * @property {Array<StraightBond~SavableState} primary 
   * @property {Array<StraightBond~SavableState} secondary 
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
        primary: [],
        secondary: [],
        tertiary: [],
      },
    };
    this._sequences.forEach(
      seq => savableState.sequences.push(seq.savableState())
    );
    this._bonds.primary.forEach(
      pb => savableState.bonds.primary.push(pb.savableState())
    );
    this._bonds.secondary.forEach(
      sb => savableState.bonds.secondary.push(sb.savableState())
    );
    this._bonds.tertiary.forEach(
      tb => savableState.bonds.tertiary.push(tb.savableState())
    );
    return savableState;
  }
}

export default Drawing;
