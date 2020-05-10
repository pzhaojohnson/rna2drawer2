import Drawing from './Drawing';
import StrictLayout from './layout/singleseq/strict/StrictLayout';
import GeneralStrictLayoutProps from './layout/singleseq/strict/GeneralStrictLayoutProps';
import PerBaseStrictLayoutProps from './layout/singleseq/strict/PerBaseStrictLayoutProps';
import { radiateStems } from './layout/singleseq/strict/radiateStems';
import FiniteStack from './FiniteStack';

class StrictDrawing {
  constructor() {
    this._generalLayoutProps = new GeneralStrictLayoutProps();
    this._perBaseLayoutProps = [];
    this._baseWidth = 13.5;
    this._baseHeight = 13.5;

    this._drawing = new Drawing();

    this._undoStack = new FiniteStack();
    this._redoStack = new FiniteStack();
  }

  /**
   * @callback StrictDrawing~SVG 
   * 
   * @returns {SVG.Svg} 
   */

  /**
   * @param {Node} container 
   * @param {StrictDrawing~SVG} SVG 
   */
  addTo(container, SVG) {
    this._drawing.addTo(container, SVG);
  }

  /**
   * @returns {string} 
   */
  get svgString() {
    return this._drawing.svgString;
  }

  /**
   * @returns {number} 
   */
  get zoom() {
    return this._drawing.zoom;
  }

  /**
   * @param {number} z 
   */
  set zoom(z) {
    this._drawing.zoom = z;
  }

  /**
   * @returns {boolean} 
   */
  isEmpty() {
    return this._drawing.isEmpty();
  }

  _pushUndo() {
    this._undoStack.push(this.savableState());

  }

  undo() {
    if (!this._undoStack.isEmpty()) {
      this._redoStack.push(this.savableState());
      let state = this._undoStack.pop();
      this._applySavedState(state);
    }
  }

  redo() {
    if (!this._redoStack.isEmpty()) {
      this._undoStack.push(this.savableState());
      let state = this._redoStack.pop();
      this._applySavedState(state);
    }
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
        this._perBaseLayoutProps.push(new PerBaseStrictLayoutProps());
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
    let sl = null;
    try {
      sl = new StrictLayout(
        this._overallSecondaryPartners(),
        this._generalLayoutProps,
        this._perBaseLayoutProps,
      );
    } catch (err) {
      return null;
    }
    return sl;
  }

  _updateLayout() {
    let sl = this._strictLayout();
    if (!sl) {
      return;
    }
    let bw = this._baseWidth;
    let bh = this._baseHeight;
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
        let tb = this._drawing.addTertiaryBond(
          seq.getBaseAtPosition(p),
          seq.getBaseAtPosition(q),
        );
        tb.cursor = 'pointer';
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
    this._updateLayout();
    if (wasEmpty) {
      this._drawing.centerView();
    }
  }

  /**
   * @typedef {Object} StrictDrawing~SavableState 
   * @property {GeneralStrictLayoutProps~SavableState} generalLayoutProps 
   * @property {Array<PerBaseStrictLayoutProps~SavableState>} perBaseLayoutProps 
   * @property {number} baseWidth 
   * @property {number} baseHeight 
   * @property {Drawing~SavableState} drawing 
   */

  /**
   * @returns {StrictDrawing~SavableState} 
   */
  savableState() {
    let state = {
      className: 'StrictDrawing',
      generalLayoutProps: this._generalLayoutProps.savableState(),
      perBaseLayoutProps: [],
      baseWidth: this._baseWidth,
      baseHeight: this._baseHeight,
      drawing: this._drawing.savableState(),
    };
    this._perBaseLayoutProps.forEach(pbps => {
      state.perBaseLayoutProps.push(pbps.savableState());
    });
    return state;
  }

  /**
   * @returns {string} 
   */
  savableString() {
    let savableState = this.savableState();
    return JSON.stringify(savableState);
  }

  /**
   * @param {StrictDrawing~SavableState} savedState 
   */
  _applySavedState(savedState) {
    this._generalLayoutProps = GeneralStrictLayoutProps.fromSavedState(savedState);
    this._perBaseLayoutProps = [];
    savedState.perBaseLayoutProps.forEach(spbps => {
      let pbps = PerBaseStrictLayoutProps.fromSavedState(spbps);
      this._perBaseLayoutProps.push(pbps);
    });
    this._baseWidth = savedState.baseWidth;
    this._baseHeight = savedState.baseHeight;
    this._drawing.applySavedState(savedState.drawing);
  }
}

export {
  StrictDrawing,
};
