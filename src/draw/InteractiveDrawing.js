import Drawing from './Drawing';

const _MODES = {
  FOLDING: 'FOLDING',
  PIVOTING: 'PIVOTING',
  SELECTING_BASES: 'SELECTING_BASES',
};

class InteractiveDrawing {

  /**
   * @param {Element} container The DOM element to place the SVG document of this drawing in.
   */
  constructor(container) {
    this._drawing = new Drawing(container);

    this._layoutType = 'strict';
    this._mode = _MODES.FOLDING;
  }

  /**
   * @returns {boolean} True if this drawing is empty.
   */
  isEmpty() {
    return this._drawing.isEmpty();
  }

  addStructure(id, sequence, partners) {
    this._drawing.addStructure(id, sequence, partners);
  }

  applyStrictLayout() {
    this._drawing.applyStrictLayout();
  }

  handleMousemove(e) {
    if (this._mode === _MODES.PIVOTING) {
      this._handleMousemovePivoting(e);
    } else if (this._mode === _MODES.SELECTING_BASES) {
      this._handleMousemoveSelectingBases(e);
    }
  }

  handleMouseup(e) {
    if (this._mode === _MODES.PIVOTING) {
      this._handleMouseupPivoting(e);
    } else if (this._mode === _MODES.SELECTING_BASES) {
      this._handleMouseupSelectingBases(e);
    }
  }

  /**
   * @param {Base} b 
   */
  handleMouseoverBase(b) {
    if (this._mode === _MODES.FOLDING) {
      this._handleMouseoverBaseFolding(b);
    }
  }

  _handleMouseoverBaseFolding(b) {
    let p = this._drawing.strictLayoutPositionOfBase(b);
    
    let startingState = {
      hovered: p,
      firstSelected: this._firstSelected,
      lastSelected: this._lastSelected,
      partners: this._drawing.strictLayoutPartners(),
      baseProps: this._strictLayoutProps.base,
    };

    let endingState = FoldingMode.handleMouseover(startingState);

    if (partnersDifferent || basePropsDifferent) {
      this.pushUndo();
    }

    let layout = new StrictLayout(endingState.partners, generalProps, baseProps);
    this._drawing.applyStrictLayout(layout);
    this.baseProps = baseProps;
    this.applyHighlighting();
  }

  handleMouseoutBase(e) {}

  handleMousedownBase(e) {}

  handleDblclickBase(e) {}

  handleDblclickTertiaryBond(e) {}
}

export default InteractiveDrawing;
