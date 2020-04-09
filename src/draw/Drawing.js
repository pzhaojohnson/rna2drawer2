import Sequence from './Sequence';
import StraightBond from './StraightBond';

import StrictLayout from './layout/singleseq/strict/StrictLayout';

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
  }

  centerView() {
    this._div.scrollLeft = (this._div.scrollWidth - window.innerWidth) / 2;
    this._div.scrollTop = (this._div.scrollHeight - this._div.clientHeight) / 2;
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
   * @param {string} id 
   * @param {string} letters 
   */
  appendSequence(id, letters) {
    if (this.sequenceIdIsTaken(id)) {
      return;
    }
    this._sequences.push(
      Sequence.createOutOfView(this._svg, id, letters)
    );
  }

  /**
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
