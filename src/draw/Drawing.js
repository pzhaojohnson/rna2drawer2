import Sequence from './Sequence';
import {
  PrimaryBond,
  SecondaryBond,
} from './StraightBond';
import { TertiaryBond } from './QuadraticBezierBond';
import normalizeAngle from './normalizeAngle';

class Drawing {

  constructor() {
    this._sequences = [];
    
    this._primaryBonds = [];
    this._secondaryBonds = [];
    this._tertiaryBonds = [];
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
    let vb = this._svg.viewbox();
    return vb.width;
  }

  /**
   * @returns {number} 
   */
  get height() {
    let vb = this._svg.viewbox();
    return vb.height;
  }

  /**
   * @param {number} width 
   * @param {number} height 
   */
  setWidthAndHeight(width, height) {
    let z = this.zoom;
    this._svg.viewbox(0, 0, width, height);
    this._svg.attr({
      'width': z * width,
      'height': z * height,
    });
  }

  /**
   * @returns {number} 
   */
  get zoom() {
    let vb = this._svg.viewbox();
    if (vb.width == 0) {
      return 1;
    }
    return this._svg.attr('width') / vb.width;
  }

  /**
   * @param {number} z 
   */
  set zoom(z) {
    let vb = this._svg.viewbox();
    let w = z * vb.width;
    let h = z * vb.height;
    let change = z / this.zoom;
    let sl = Math.floor(change * this._div.scrollLeft);
    let st = Math.floor(change * this._div.scrollTop);
    this._svg.attr({ 'width': w, 'height': h });
    this._div.scrollLeft = sl;
    this._div.scrollTop = st;
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
   * @param {number} i 
   * 
   * @returns {Sequence} 
   */
  getSequenceAtIndex(i) {
    return this._sequences[i];
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
   * Returns null if no base has the given ID.
   * 
   * @param {string} id 
   * 
   * @returns {Base|null} 
   */
  getBaseById(id) {
    let base = null;
    this.forEachBase(b => {
      if (b.id === id) {
        base = b;
      }
    });
    return base;
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
    return this._primaryBonds.length;
  }

  /**
   * @param {callback} cb 
   */
  forEachPrimaryBond(cb) {
    this._primaryBonds.forEach(pb => cb(pb));
  }

  /**
   * @param {Base} b1 
   * @param {Base} b2 
   * 
   * @returns {PrimaryBond} 
   */
  addPrimaryBond(b1, b2) {
    let sb = PrimaryBond.create(this._svg, b1, b2);
    this._primaryBonds.push(sb);
    return sb;
  }

  /**
   * @returns {number} 
   */
  get numSecondaryBonds() {
    return this._secondaryBonds.length;
  }
  
  /**
   * @param {callback} cb 
   */
  forEachSecondaryBond(cb) {
    this._secondaryBonds.forEach(sb => cb(sb));
  }

  /**
   * @param {Base} b1 
   * @param {Base} b2 
   * 
   * @returns {SecondaryBond} 
   */
  addSecondaryBond(b1, b2) {
    let sb = SecondaryBond.create(this._svg, b1, b2);
    this._secondaryBonds.push(sb);
    return sb;
  }

  /**
   * @returns {number} 
   */
  get numTertiaryBonds() {
    return this._tertiaryBonds.length;
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
    this._tertiaryBonds.forEach(tb => cb(tb));
  }

  _addTertiaryBond(tb) {
    this._tertiaryBonds.push(tb);
    if (this._onAddTertiaryBond) {
      this._onAddTertiaryBond(tb);
    }
  }

  /**
   * @param {Base} b1 
   * @param {Base} b2 
   * 
   * @returns {TertiaryBond} 
   */
  addTertiaryBond(b1, b2) {
    let tb = TertiaryBond.create(this._svg, b1, b2);
    this._addTertiaryBond(tb);
    return tb;
  }

  onAddTertiaryBond(cb) {
    this._onAddTertiaryBond = cb;
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
      this._tertiaryBonds.splice(i, 1);
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
      let ba12 = b1.angleBetweenCenters(b2);
      let ba21 = b2.angleBetweenCenters(b1);
      if (b1.hasNumbering()) {
        let la = normalizeAngle(b1.numbering.lineAngle, ba12) - ba12;
        if (la < Math.PI / 4 || la > 7 * Math.PI / 4) {
          b1.numbering.lineAngle = b1.numbering.lineAngle + Math.PI;
        }
      }
      if (b2.hasNumbering()) {
        let la = normalizeAngle(b2.numbering.lineAngle, ba21) - ba21;
        if (la < Math.PI / 4 || la > 7 * Math.PI / 4) {
          b2.numbering.lineAngle = b2.numbering.lineAngle + Math.PI;
        }
      }
    });
  }

  /**
   * @returns {string} 
   */
  get svgString() {
    return this._svg.svg();
  }

  /**
   * @typedef {Object} Drawing~SavableState 
   * @property {string} className 
   * @property {string} svg 
   * @property {Array<Sequence~SavableState>} sequences 
   * @property {Array<PrimaryBond~SavableState>} primaryBonds 
   * @property {Array<SecondaryBond~SavableState>} secondaryBonds 
   * @property {Array<TertiaryBond~SavableState>} tertiaryBonds 
   */

  /**
   * @returns {Drawing~SavableState} 
   */
  savableState() {
    let savableState = {
      className: 'Drawing',
      svg: this._svg.svg(),
      sequences: [],
      primaryBonds: [],
      secondaryBonds: [],
      tertiaryBonds: [],
    };
    this._sequences.forEach(
      seq => savableState.sequences.push(seq.savableState())
    );
    this._primaryBonds.forEach(
      pb => savableState.primaryBonds.push(pb.savableState())
    );
    this._secondaryBonds.forEach(
      sb => savableState.secondaryBonds.push(sb.savableState())
    );
    this._tertiaryBonds.forEach(
      tb => savableState.tertiaryBonds.push(tb.savableState())
    );
    return savableState;
  }

  /**
   * @param {Drawing~SavableState} savedState 
   */
  applySavedState(savedState) {
    let wasEmpty = this.isEmpty();
    this._sequences = [];
    this._primaryBonds = [];
    this._secondaryBonds = [];
    this._tertiaryBonds = [];
    this._applySavedSvg(savedState.svg);
    savedState.sequences.forEach(sseq => {
      let seq = Sequence.fromSavedState(sseq, this._svg);
      this._sequences.push(seq);
    });
    savedState.primaryBonds.forEach(spb => {
      let pb = PrimaryBond.fromSavedState(spb, this._svg, id => this.getBaseById(id));
      this._primaryBonds.push(pb);
    });
    savedState.secondaryBonds.forEach(ssb => {
      let sb = SecondaryBond.fromSavedState(ssb, this._svg, id => this.getBaseById(id));
      this._secondaryBonds.push(sb);
    });
    savedState.tertiaryBonds.forEach(stb => {
      let tb = TertiaryBond.fromSavedState(stb, this._svg, id => this.getBaseById(id));
      this._addTertiaryBond(tb);
    });
    this.adjustNumberingLineAngles();
    if (wasEmpty) {
      this.centerView();
    }
  }

  /**
   * @param {string} svgString 
   */
  _applySavedSvg(svgString) {
    this._svg.clear();
    this._svg.svg(svgString);
    let nested = this._svg.first();
    let vb = nested.viewbox();
    let w = vb.width;
    let h = vb.height;
    let content = nested.svg(false);
    this._svg.clear();
    this._svg.svg(content);
    this.setWidthAndHeight(w, h);
  }
}

export default Drawing;
