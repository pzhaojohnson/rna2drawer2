import Drawing from './Drawing';
import StrictLayout from './layout/singleseq/strict/StrictLayout';
import GeneralStrictLayoutProps from './layout/singleseq/strict/GeneralStrictLayoutProps';
import StrictLayoutPerBaseProps from './layout/singleseq/strict/StrictLayoutPerBaseProps';
import { radiateStems } from './layout/singleseq/strict/radiateStems';

class InteractiveDrawing {

  constructor() {
    this._drawing = new Drawing();

    this._strictLayoutProps = {
      general: new GeneralStrictLayoutProps(),
      base: [],
      baseWidth: 13.5,
      baseHeight: 13.5,
    };

    this._layoutType = 'strict';
  }

  /**
   * @callback InteractiveDrawing~SVG 
   * 
   * @returns {SVG.Svg} 
   */

  /**
   * @param {Node} container 
   * @param {InteractiveDrawing~SVG} SVG 
   */
  addTo(container, SVG) {
    this._drawing.addTo(container, SVG);
  }

  /**
   * @returns {string} 
   */
  get layoutType() {
    return this._layoutType;
  }

  /**
   * @returns {boolean} 
   */
  hasStrictLayout() {
    return this.layoutType === 'strict';
  }

  /**
   * @returns {boolean} True if this drawing is empty.
   */
  isEmpty() {
    return this._drawing.isEmpty();
  }

  /**
   * Returns null if the sequence cannot be appended.
   * 
   * @param {string} id 
   * @param {string} characters 
   * 
   * @returns {Sequence|null} 
   */
  _appendSequenceOutOfView(id, characters) {
    let seq = this._drawing.appendSequenceOutOfView(id, characters);
    if (seq) {
      seq.forEachBase(b => {
        this._strictLayoutProps.base.push(new StrictLayoutPerBaseProps());
      });
    }
    return seq;
  }

  /**
   * @returns {Array<number|null>} 
   */
  _overallSecondaryPartners() {
    let idsToPositions = {};
    this._drawing.forEachBase((b, p) => {
      idsToPositions[b.id] = p;
    });
    let partners = [];
    this._drawing.forEachBase(b => {
      partners.push(null);
    });
    this._drawing.forEachSecondaryBond(sb => {
      let p = idsToPositions[sb.base1.id];
      let q = idsToPositions[sb.base2.id];
      partners[p - 1] = q;
      partners[q - 1] = p;
    });
    return partners;
  }

  /**
   * Returns null if a strict layout cannot be created for this drawing.
   * 
   * @returns {StrictLayout|null} 
   */
  _strictLayout() {
    let perBaseProps = [];
    this._strictLayoutProps.base.forEach(pbps => {
      perBaseProps.push(pbps.deepCopy());
    });
    let sl = null;
    try {
      sl = new StrictLayout(
        this._overallSecondaryPartners(),
        this._strictLayoutProps.general.deepCopy(),
        perBaseProps,
      );
    } catch (err) {
      return null;
    }
    return sl;
  }

  _applyStrictLayout() {
    let sl = this._strictLayout();
    if (!sl) {
      return;
    }
    let bw = this._strictLayoutProps.baseWidth;
    let bh = this._strictLayoutProps.baseHeight;
    let xMin = sl.xMin;
    let yMin = sl.yMin;
    this._drawing.forEachBase((b, p) => {
      let bcs = sl.baseCoordinatesAtPosition(p);
      b.moveTo(
        window.screen.width + (bw * (bcs.xCenter - xMin)),
        window.screen.height + (bh * (bcs.yCenter - yMin)),
      );
    });
    this._drawing.repositionBonds();
    this._drawing.adjustNumberingLineAngles();
    this._drawing.setWidthAndHeight(
      (2 * window.screen.width) + (bw * (sl.xMax - xMin)),
      (2 * window.screen.height) + (bh * (sl.yMax - yMin)),
    );
  }

  /**
   * @param {Sequence} seq 
   */
  _addPrimaryBondsForSequence(seq) {
    seq.forEachBase((b1, p) => {
      if (p < seq.length) {
        let b2 = seq.getBaseAtPosition(p + 1);
        this._drawing.addPrimaryBond(b1, b2);
      }
    });
  }

  /**
   * @param {Sequence} seq 
   * @param {Array<number|null>} partners 
   */
  _addSecondaryBondsForSequence(seq, partners) {
    seq.forEachBase((b, p) => {
      let q = partners[p - 1];
      if (q != null && p < q) {
        this._drawing.addSecondaryBond(
          seq.getBaseAtPosition(p),
          seq.getBaseAtPosition(q)
        );
      }
    });
  }

  /**
   * @param {Sequence} seq 
   * @param {Array<number|null>} partners 
   */
  _addTertiaryBondsForSequence(seq, partners) {
    seq.forEachBase((b, p) => {
      let q = partners[p - 1];
      if (q != null && p < q) {
        this._drawing.addTertiaryBond(
          seq.getBaseAtPosition(p),
          seq.getBaseAtPosition(q),
        );
      }
    });
  }

  /**
   * @param {string} id 
   * @param {string} characters 
   * @param {Array<number|null>} secondaryPartners 
   * @param {Array<number|null>} tertiaryPartners 
   */
  appendStructure(id, characters, secondaryPartners, tertiaryPartners) {
    let wasEmpty = this.isEmpty();
    let seq = this._appendSequenceOutOfView(id, characters);
    if (!seq) {
      return;
    }
    let stretches3 = radiateStems(secondaryPartners);
    let i = this._strictLayoutProps.base.length - secondaryPartners.length;
    for (let j = 0; j < secondaryPartners.length; j++) {
      this._strictLayoutProps.base[i + j].stretch3 = stretches3[j];
    }
    this._addPrimaryBondsForSequence(seq);
    this._addSecondaryBondsForSequence(seq, secondaryPartners);
    this._addTertiaryBondsForSequence(seq, tertiaryPartners);
    if (this.hasStrictLayout()) {
      this._applyStrictLayout();
    }
    if (wasEmpty) {
      this._drawing.centerView();
    }
  }
}

export default InteractiveDrawing;
