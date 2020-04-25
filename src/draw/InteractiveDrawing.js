import Drawing from './Drawing';
import StrictLayout from './layout/singleseq/strict/StrictLayout';
import StrictLayoutGeneralProps from './layout/singleseq/strict/StrictLayoutGeneralProps';
import StrictLayoutBaseProps from './layout/singleseq/strict/StrictLayoutBaseProps';
import { radiateStems } from './layout/singleseq/strict/radiateStems';

class InteractiveDrawing {

  constructor() {
    this._drawing = new Drawing();

    this._strictLayoutProps = {
      general: new StrictLayoutGeneralProps(),
      base: [],
      baseWidth: 12,
      baseHeight: 12,
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
   * @returns {boolean} True if this drawing is empty.
   */
  isEmpty() {
    return this._drawing.isEmpty();
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
   * Returns null if no sequence is added.
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
        this._strictLayoutProps.base.push(new StrictLayoutBaseProps());
      });
    }
    return seq;
  }

  _applyStrictLayout() {
    let baseProps = [];
    this._strictLayoutProps.base.forEach(bps => {
      baseProps.push(bps.deepCopy());
    });
    this._drawing.applyStrictLayout(
      new StrictLayout(
        this._drawing.strictLayoutPartners(),
        this._strictLayoutProps.general.deepCopy(),
        baseProps,
      ),
      this._strictLayoutProps.baseWidth,
      this._strictLayoutProps.baseHeight,
    );
  }

  /**
   * @param {string} id 
   * @param {string} characters 
   * @param {Array<number|null>} secondaryPartners 
   * @param {Array<number|null>} tertiaryPartners 
   */
  appendStructure(id, characters, secondaryPartners, tertiaryPartners) {
    let wasEmpty = this.isEmpty();
    let strictLayoutPartners = this._drawing.strictLayoutPartners();
    let seq = this._appendSequenceOutOfView(id, characters);
    if (!seq) {
      return;
    }
    let stretches3 = radiateStems(secondaryPartners);
    let i = this._strictLayoutProps.base.length - secondaryPartners.length;
    for (let j = 0; j < secondaryPartners.length; j++) {
      this._strictLayoutProps.base[i + j].stretch3 = stretches3[j];
    }
    this._drawing.addPrimaryBondsForSequence(seq);
    this._drawing.applyStrictLayoutPartners(
      strictLayoutPartners.concat(secondaryPartners),
    );
    this._drawing.addTertiaryPairsForSequence(seq, tertiaryPartners);
    if (this.hasStrictLayout()) {
      this._applyStrictLayout();
    }
    if (wasEmpty) {
      this._drawing.centerView();
    }
  }
}

export default InteractiveDrawing;
