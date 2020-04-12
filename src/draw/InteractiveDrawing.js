import Drawing from './Drawing';
import StrictLayoutGeneralProps from './layout/singleseq/strict/StrictLayoutGeneralProps';
import StrictLayoutBaseProps from './layout/singleseq/strict/StrictLayoutBaseProps';

class InteractiveDrawing {

  /**
   * @param {Element} container The DOM element to place the SVG document of this drawing in.
   */
  constructor(container) {
    this._drawing = new Drawing(container);

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

  /**
   * @param {string} id 
   * @param {string} letters 
   * @param {Array<number|null>} secondaryPartners 
   * @param {Array<number|null>} tertiaryPartners 
   */
  appendStructure(id, letters, secondaryPartners, tertiaryPartners) {
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
  }
}

export default InteractiveDrawing;
