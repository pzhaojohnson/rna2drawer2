import Drawing from './Drawing';
import StrictLayout from './layout/singleseq/strict/StrictLayout';
import GeneralStrictLayoutProps from './layout/singleseq/strict/GeneralStrictLayoutProps';
import PerBaseStrictLayoutProps from './layout/singleseq/strict/PerBaseStrictLayoutProps';
import { radiateStems } from './layout/singleseq/strict/radiateStems';

import layoutPartnersOfStrictDrawing from './edit/layoutPartnersOfStrictDrawing';
import appendStructure from './edit/appendStructure';
import isKnotless from '../parse/isKnotless';
import applyStrictLayout from './edit/applyStrictLayout';

class StrictDrawing {
  constructor() {
    this._drawing = new Drawing();

    this._generalLayoutProps = new GeneralStrictLayoutProps();
    this._perBaseLayoutProps = [];
    this._baseWidth = 13.5;
    this._baseHeight = 13.5;
  }

  get drawing() {
    return this._drawing;
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

  /**
   * @typedef {Object} StrictDrawing~SavableState 
   * @property {Drawing~SavableState} drawing 
   * @property {GeneralStrictLayoutProps~SavableState} generalLayoutProps 
   * @property {Array<PerBaseStrictLayoutProps~SavableState>} perBaseLayoutProps 
   * @property {number} baseWidth 
   * @property {number} baseHeight 
   */

  /**
   * @returns {StrictDrawing~SavableState} 
   */
  savableState() {
    let state = {
      className: 'StrictDrawing',
      drawing: this._drawing.savableState(),
      generalLayoutProps: this._generalLayoutProps.savableState(),
      perBaseLayoutProps: [],
      baseWidth: this._baseWidth,
      baseHeight: this._baseHeight,
    };
    this._perBaseLayoutProps.forEach(pbps => {
      state.perBaseLayoutProps.push(pbps.savableState());
    });
    return state;
  }

  /**
   * @returns {string} 
   */
  get savableString() {
    let savableState = this.savableState();
    return JSON.stringify(savableState, null, ' ');
  }

  applySavedState(savedState) {
    return this._applySavedState(savedState);
  }

  /**
   * If the saved state cannot be successfully applied, the state of
   * this drawing will not be affected.
   * 
   * @param {StrictDrawing~SavableState} savedState 
   * 
   * @returns {boolean} True if the saved state was successfully applied.
   */
  _applySavedState(savedState) {
    let prevState = this.savableState();
    try {
      this._drawing.applySavedState(savedState.drawing);
      this._applySavedGeneralLayoutProps(savedState);
      this._applySavedPerBaseLayoutProps(savedState);
      this._applySavedBaseWidthAndHeight(savedState);
    } catch (err) {
      this._applySavedState(prevState);
      return false;
    }
    return true;
  }

  _applySavedGeneralLayoutProps(savedState) {
    if (!savedState.generalLayoutProps) {
      throw new Error();
    }
    this._generalLayoutProps = GeneralStrictLayoutProps.fromSavedState(
      savedState.generalLayoutProps
    );
  }

  _applySavedPerBaseLayoutProps(savedState) {
    if (savedState.perBaseLayoutProps.length != this._drawing.numBases) {
      throw new Error();
    }
    this._perBaseLayoutProps = [];
    savedState.perBaseLayoutProps.forEach(sps => {
      let ps = PerBaseStrictLayoutProps.fromSavedState(sps);
      this._perBaseLayoutProps.push(ps);
    });
  }

  _applySavedBaseWidthAndHeight(savedState) {
    let bw = savedState.baseWidth;
    let bh = savedState.baseHeight;
    if (typeof bw !== 'number' || typeof bh !== 'number') {
      throw new Error();
    }
    this._baseWidth = bw;
    this._baseHeight = bh;
  }

  /**
   * @param {string} id 
   * @param {string} characters 
   * 
   * @returns {boolean} True if the sequence was successfully appended.
   */
  appendSequence(id, characters) {
    return this._appendSequence(id, characters);
  }

  _appendSequence(id, characters) {
    return this._appendStructure({
      id: id,
      characters: characters,
    });
  }

  /**
   * @typedef {Object} Structure 
   * @property {string} id 
   * @property {string} characters 
   * @property {Array<number|null>|undefined} secondaryPartners 
   * @property {Array<number|null>|undefined} tertiaryPartners 
   */

   /**
    * @param {Structure} structure 
    * 
    * @returns {boolean} True if the structure was successfully appended.
    */
  appendStructure(structure) {
    return this._appendStructure(structure);
  }
  
  _appendStructure(structure) {
    if (structure.secondaryPartners) {
      if (!isKnotless(structure.secondaryPartners)) {
        return false;
      }
    }
    let appended = appendStructure(this._drawing, structure);
    if (!appended) {
      return false;
    }
    this._appendPerBaseLayoutPropsOfStructure(structure);
    this._radiateStemsOfStructure(structure);
    this._applyLayout();
    this._drawing.centerView();
    return true;
  }

  _appendPerBaseLayoutPropsOfStructure(structure) {
    let seq = this._drawing.getSequenceById(structure.id);
    seq.forEachBase(() => {
      this._perBaseLayoutProps.push(new PerBaseStrictLayoutProps());
    });
  }

  /**
   * @param {StrictDrawing~Structure} structure 
   */
  _radiateStemsOfStructure(structure) {
    if (!structure.secondaryPartners) {
      return;
    }
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
  layoutPartners() {
    return layoutPartnersOfStrictDrawing(this);
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
    return PerBaseStrictLayoutProps.deepCopyArray(
      this._perBaseLayoutProps
    );
  }

  get baseWidth() {
    return this._baseWidth;
  }

  get baseHeight() {
    return this._baseHeight;
  }

  /**
   * @returns {StrictLayout} 
   */
  layout() {
    let partners = this.layoutPartners();
    let perBaseProps = this.perBaseLayoutProps();
    while (perBaseProps.length < partners.length) {
      perBaseProps.push(new PerBaseStrictLayoutProps());
    }
    return new StrictLayout(
      partners,
      this.generalLayoutProps(),
      perBaseProps.slice(0, partners.length),
    );
  }

  _applyLayout() {
    applyStrictLayout(
      this._drawing,
      this.layout(),
      this.baseWidth,
      this.baseHeight,
    );
  }

  /**
   * @returns {Array<string>} 
   */
  sequenceIds() {
    return this._drawing.sequenceIds();
  }
}

export default StrictDrawing;
