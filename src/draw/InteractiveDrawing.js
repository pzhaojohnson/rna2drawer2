import Drawing from './Drawing';
import StrictLayout from './layout/singleseq/strict/StrictLayout';
import StrictLayoutGeneralProps from './layout/singleseq/strict/StrictLayoutGeneralProps';
import StrictLayoutBaseProps from './layout/singleseq/strict/StrictLayoutBaseProps';

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
   * @param {string} letters 
   * 
   * @returns {Sequence|null} 
   */
  _appendSequenceOutOfView(id, letters) {
    let seq = this._drawing.appendSequenceOutOfView(id, letters);
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
   * @param {string} letters 
   * @param {Array<number|null>} secondaryPartners 
   * @param {Array<number|null>} tertiaryPartners 
   */
  appendStructure(id, letters, secondaryPartners, tertiaryPartners) {
    let wasEmpty = this.isEmpty();
    let strictLayoutPartners = this._drawing.strictLayoutPartners();
    let seq = this._appendSequenceOutOfView(id, letters);
    if (!seq) {
      return;
    }
    this._drawing.addStrandBondsForSequence(seq);
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
