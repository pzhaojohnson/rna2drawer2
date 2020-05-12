import Drawing from './Drawing';
import StrictLayout from './layout/singleseq/strict/StrictLayout';
import GeneralStrictLayoutProps from './layout/singleseq/strict/GeneralStrictLayoutProps';
import PerBaseStrictLayoutProps from './layout/singleseq/strict/PerBaseStrictLayoutProps';
import { radiateStems } from './layout/singleseq/strict/radiateStems';
import FiniteStack from './FiniteStack';

class StrictDrawing {
  constructor() {
    this._drawing = new Drawing();

    this._generalLayoutProps = new GeneralStrictLayoutProps();
    this._perBaseLayoutProps = [];
    this._baseWidth = 13.5;
    this._baseHeight = 13.5;

    this._undoStack = new FiniteStack();
    this._redoStack = new FiniteStack();

    this._interactionState = {};
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
    this._redoStack.clear();
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
    this._drawing.applySavedState(savedState.drawing);
    this._generalLayoutProps = GeneralStrictLayoutProps.fromSavedState(savedState);
    this._perBaseLayoutProps = [];
    savedState.perBaseLayoutProps.forEach(spbps => {
      let pbps = PerBaseStrictLayoutProps.fromSavedState(spbps);
      this._perBaseLayoutProps.push(pbps);
    });
    this._baseWidth = savedState.baseWidth;
    this._baseHeight = savedState.baseHeight;
  }

  /**
   * @typedef {Object} StrictDrawing~Structure 
   * @property {string} id 
   * @property {string} characters 
   * @property {Array<number|null>} secondaryPartners 
   * @property {Array<number|null>} tertiaryPartners 
   */

   /**
    * @param {StrictDrawing~Structure} structure 
    * 
    * @returns {boolean} True if the structure was successfully appended.
    */
  appendStructure(structure) {
    let wasEmpty = this.isEmpty();
    let seq = this._appendSequenceOfStructure(structure);
    if (!seq) {
      return false;
    }
    this._addPrimaryBondsOfStructure(structure);
    this._addSecondaryBondsOfStructure(structure);
    this._addTertiaryBondsOfStructure(structure);
    this._radiateStemsOfStructure(structure);
    this._updateLayout();
    if (wasEmpty) {
      this._drawing.centerView();
    }
    return true;
  }

  /**
   * Returns null if the sequence could not be appended.
   * 
   * @param {StrictDrawing~Structure} structure 
   * 
   * @returns {Sequence|null} 
   */
  _appendSequenceOfStructure(structure) {
    let seq = this._drawing.appendSequenceOutOfView(
      structure.id,
      structure.characters,
    );
    if (!seq) {
      return null;
    }
    seq.forEachBase(() => {
      this._perBaseLayoutProps.push(new PerBaseStrictLayoutProps());
    });
    return seq;
  }

  /**
   * @param {StrictDrawing~Structure} structure 
   */
  _addPrimaryBondsOfStructure(structure) {
    let seq = this._drawing.getSequenceById(structure.id);
    seq.forEachBase((b, p) => {
      if (p < seq.length) {
        this._drawing.addPrimaryBond(
          seq.getBaseAtPosition(p),
          seq.getBaseAtPosition(p + 1),
        );
      }
    });
  }

  /**
   * @param {StrictDrawing~Structure} structure 
   */
  _addSecondaryBondsOfStructure(structure) {
    let seq = this._drawing.getSequenceById(structure.id);
    seq.forEachBase((b, p) => {
      let q = structure.secondaryPartners[p - 1];
      if (typeof q == 'number' && p < q) {
        this._drawing.addSecondaryBond(
          seq.getBaseAtPosition(p),
          seq.getBaseAtPosition(q),
        );
      }
    });
  }

  /**
   * @param {StrictDrawing~Structure} structure 
   */
  _addTertiaryBondsOfStructure(structure) {
    let seq = this._drawing.getSequenceById(structure.id);
    seq.forEachBase((b, p) => {
      let q = structure.secondaryPartners[p - 1];
      if (typeof q == 'number' && p < q) {
        let tb = this._drawing.addTertiaryBond(
          seq.getBaseAtPosition(p),
          seq.getBaseAtPosition(q),
        );
        tb.cursor = 'pointer';
      }
    });
  }

  /**
   * @param {StrictDrawing~Structure} structure 
   */
  _radiateStemsOfStructure(structure) {
    let stretches3 = radiateStems(structure.secondaryPartners);
    let seq = this._drawing.getSequenceById(structure.id);
    if (seq.length == 0) {
      return;
    }
    let b1 = seq.getBaseAtPosition(1);
    let op1 = this._drawing.overallPositionOfBase(b1);
    seq.forEachBase((b, p) => {
      let op = op1 + p - 1;
      this._perBaseLayoutProps[op - 1].stretch3 = stretches3[p - 1];
    });
  }

  /**
   * @returns {Array<number|null>} 
   */
  overallSecondaryPartners() {
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
   * @returns {GeneralStrictLayoutProps} 
   */
  generalLayoutProps() {
    return this._generalLayoutProps.deepCopy();
  }

  /**
   * @returns {Array<PerBaseStrictLayoutProps>} 
   */
  perBaseLayoutProps() {
    let props = [];
    this._perBaseLayoutProps.forEach(ps => {
      props.push(ps.deepCopy());
    });
    return props;
  }

  /**
   * @returns {StrictLayout} 
   */
  layout() {
    return new StrictLayout(
      this.overallSecondaryPartners(),
      this.generalLayoutProps(),
      this.perBaseLayoutProps(),
    );
  }

  _updateLayout() {
    let l = this.layout();
    let bw = this._baseWidth;
    let bh = this._baseHeight;
    let xMin = l.xMin;
    let yMin = l.yMin;
    this._drawing.forEachBase((b, p) => {
      let bcs = l.baseCoordinatesAtPosition(p);
      b.moveTo(
        window.screen.width + (bw * (bcs.xCenter - xMin)),
        window.screen.height + (bh * (bcs.yCenter - yMin)),
      );
    });
    this._drawing.repositionBonds();
    this._drawing.adjustNumberingLineAngles();
    this._drawing.setWidthAndHeight(
      (2 * window.screen.width) + (bw * (l.xMax - xMin)),
      (2 * window.screen.height) + (bh * (l.yMax - yMin)),
    );
  }
  
  /**
   * @typedef {Object} StrictDrawing~Ct 
   * @property {string} id 
   * @property {string} characters 
   * @property {Array<number|null>} secondaryPartners 
   * @property {Array<number|null>} tertiaryPartners 
   * @property {number} numberingOffset 
   */

  /**
   * @param {StrictDrawing~Ct} ct 
   * 
   * @returns {boolean} True if the structure was successfully appended.
   */
  openCt(ct) {
    let result = this.appendStructure({
      id: ct.id,
      characters: ct.characters,
      secondaryPartners: ct.secondaryPartners,
      tertiaryPartners: ct.tertiaryPartners,
    });
    if (!result) {
      return false;
    }
    let seq = this._drawing.getSequenceById(ct.id);
    seq.numberingOffset = ct.numberingOffset;
    return true;
  }

  /**
   * @param {string} fileContents 
   * 
   * @returns {boolean} True if the contents of the file are valid.
   */
  openRna2drawer2(fileContents) {
    let savedState = null;
    try {
      savedState = JSON.parse(fileContents);
    } catch (err) {
      return false;
    }
    this._applySavedState(savedState);
    return true;
  }
}

export {
  StrictDrawing,
};
