import setBaseHighlightingsOfDrawing from '../edit/setBaseHighlightingsOfDrawing';
import unpairedRegionOfPosition from '../../parse/unpairedRegionOfPosition';
import isKnotless from '../../parse/isKnotless';

function areComplementary(characters1, characters2) {
  if (characters1.length !== characters2.length) {
    return false;
  }
  characters1 = characters1.toUpperCase();
  characters2 = characters2.toUpperCase();
  for (let i = 0; i < characters1.length; i++) {
    let c1 = characters1.charAt(i);
    let c2 = characters2.charAt(characters2.length - i - 1);
    let complementary = {
      'A': ['U', 'T'],
      'U': ['A', 'G'],
      'G': ['C', 'U', 'T'],
      'C': ['G'],
      'T': ['A', 'G'],
    }[c1].includes(c2);
    if (!complementary) {
      return false;
    }
  }
  return true;
}

function evenOutStretches3(ur, perBaseProps) {
  let s = 0;
  for (let p = ur.boundingPosition5; p < ur.boundingPosition3; p++) {
    if (p > 0) {
      s += perBaseProps[p - 1].stretch3;
    }
  }
  let size = ur.boundingPosition3 - ur.boundingPosition5;
  for (let p = ur.boundingPosition5; p < ur.boundingPosition3; p++) {
    if (p > 0) {
      perBaseProps[p - 1].stretch3 = s / size;
    }
  }
}

class FoldingMode {
  constructor(strictDrawing) {
    this._strictDrawing = strictDrawing;
  }

  get className() {
    return 'FoldingMode';
  }

  get strictDrawing() {
    return this._strictDrawing;
  }

  handleMouseoverOnBase(b) {
    let drawing = this.strictDrawing.drawing;
    this._hovered = drawing.overallPositionOfBase(b);
    this._setBaseHighlightings();
  }

  handleMouseoutOnBase(b) {
    this._hovered = null;
    this._setBaseHighlightings();
  }

  handleMousedownOnBase(b, event) {
    let drawing = this.strictDrawing.drawing;
    let p = drawing.overallPositionOfBase(b);
    if (this._selected && event.shiftKey) {
      this._selected.looseEnd = p;
    } else if (this.withinSelected(p)) {
      if (!this.selectedAreUnpaired()) {
        this.fireShouldPushUndo();
        this._unpair();
      }
    } else if (this.hoveredComplement()) {
      this.fireShouldPushUndo();
      this._pair();
    } else {
      this._selected = {
        tightEnd: p,
        looseEnd: p,
      };
    }
    this._setBaseHighlightings();
  }

  get minSelected() {
    if (!this._selected) {
      return null;
    }
    return Math.min(
      this._selected.tightEnd,
      this._selected.looseEnd,
    );
  }

  get maxSelected() {
    if (!this._selected) {
      return null;
    }
    return Math.max(
      this._selected.tightEnd,
      this._selected.looseEnd,
    );
  }

  selectedAreUnpaired() {
    if (!this._selected) {
      return true;
    }
    let partners = this.strictDrawing.layoutPartners();
    for (let p = this.minSelected; p <= this.maxSelected; p++) {
      if (partners[p - 1]) {
        return false;
      }
    }
    return true;
  }

  get selectedLength() {
    if (!this._selected) {
      return 0;
    }
    return this.maxSelected - this.minSelected + 1;
  }

  get selectedCharacters() {
    if (!this._selected) {
      return '';
    }
    let cs = this.strictDrawing.drawing.overallCharacters;
    return cs.substring(
      this.minSelected - 1,
      this.maxSelected,
    );
  }

  withinSelected(p) {
    if (!this._selected) {
      return;
    }
    return p >= this.minSelected && p <= this.maxSelected;
  }

  overlapsSelected(p5, p3) {
    if (!this._selected) {
      return false;
    }
    return this.withinSelected(p5) || this.withinSelected(p3);    
  }

  hoveredComplement() {
    if (!this._hovered || !this._selected) {
      return null;
    }
    let selectedCharacters = this.selectedCharacters;
    let overallCharacters = this.strictDrawing.drawing.overallCharacters;
    for (let i = 0; i < this.selectedLength; i++) {
      let p5 = this._hovered - i;
      let p3 = p5 + this.selectedLength - 1;
      let complementary = areComplementary(
        selectedCharacters,
        overallCharacters.substring(p5 - 1, p3),
      );
      if (complementary && !this.overlapsSelected(p5, p3)) {
        return { p5: p5, p3: p3 };
      }
    }
    return null;
  }

  _unpair() {
    let drawing = this.strictDrawing.drawing;
    let toRemove = [];
    drawing.forEachSecondaryBond(sb => {
      let p1 = drawing.overallPositionOfBase(sb.base1);
      let p2 = drawing.overallPositionOfBase(sb.base2);
      if (this.withinSelected(p1) || this.withinSelected(p2)) {
        toRemove.push(sb);
      }
    });
    toRemove.forEach(sb => {
      drawing.removeSecondaryBondById(sb.id);
    });
    let perBaseProps = this.strictDrawing.perBaseLayoutProps();
    let partners = this.strictDrawing.layoutPartners();
    evenOutStretches3(
      unpairedRegionOfPosition(this._selected.tightEnd, partners),
      perBaseProps,
    );
    this.strictDrawing.setPerBaseLayoutProps(perBaseProps);
    this.strictDrawing.applyLayout();
    this._hovered = null;
    this._selected = null;
  }

  _pair() {
    let complement = this.hoveredComplement();
    if (!complement) {
      return;
    }
    let partners = this.strictDrawing.layoutPartners();
    for (let i = 0; i < this.selectedLength; i++) {
      partners[this.minSelected + i - 1] = complement.p3 - i;
      partners[complement.p3 - i - 1] = this.minSelected + i;
    }
    if (isKnotless(partners)) {
      this._addSecondaryPairs(complement);
    } else {
      this._addTertiaryPairs(complement);
    }
    this._hovered = null;
    this._selected = null;
  }

  _addSecondaryPairs(complement) {
    let drawing = this.strictDrawing.drawing;
    let perBaseProps = this.strictDrawing.perBaseLayoutProps();
    for (let i = 0; i < this.selectedLength; i++) {
      let p1 = this.minSelected + i;
      let p2 = complement.p3 - i;
      let b1 = drawing.getBaseAtOverallPosition(p1);
      let b2 = drawing.getBaseAtOverallPosition(p2);
      drawing.addSecondaryBond(b1, b2);
      perBaseProps[p1 - 1].stretch3 = 0;
      perBaseProps[p2 - 1].stretch3 = 0;
    }
    this.strictDrawing.setPerBaseLayoutProps(perBaseProps);
    this.strictDrawing.applyLayout();
  }

  _addTertiaryPairs(complement) {
    let drawing = this.strictDrawing.drawing;
      for (let i = 0; i < this.selectedLength; i++) {
      let p1 = this.minSelected + i;
      let p2 = complement.p3 - i;
      let b1 = drawing.getBaseAtOverallPosition(p1);
      let b2 = drawing.getBaseAtOverallPosition(p2);
      drawing.addTertiaryBond(b1, b2);
    }
  }

  _setBaseHighlightings() {
    let highlightings = [];
    this._addSelectedToBaseHighlightings(highlightings);
    this._addComplementsToBaseHighlightings(highlightings);
    this._addHoveredToBaseHighlightings(highlightings);
    setBaseHighlightingsOfDrawing(
      this.strictDrawing.drawing,
      highlightings,
    );
  }

  _addSelectedToBaseHighlightings(highlightings) {
    if (!this._selected) {
      return;
    }
    for (let p = this.minSelected; p <= this.maxSelected; p++) {
      highlightings[p - 1] = {
        fill: '#ffd700',
        fillOpacity: 0.75,
      };
    }
  }

  _addComplementsToBaseHighlightings(highlightings) {
    if (!this._selected) {
      return;
    }
    let selectedCharacters = this.selectedCharacters;
    let overallCharacters = this.strictDrawing.drawing.overallCharacters;
    for (let p5 = 1; p5 <= overallCharacters.length - this.selectedLength + 1; p5++) {
      let p3 = p5 + this.selectedLength - 1;
      let complementary = areComplementary(
        selectedCharacters,
        overallCharacters.substring(p5 - 1, p3),
      );
      if (complementary && !this.overlapsSelected(p5, p3)) {
        for (let p = p5; p <= p3; p++) {
          highlightings[p - 1] = { fill: '#0000ff', fillOpacity: 0.15 };
        }
      }
    }
  }

  _addHoveredToBaseHighlightings(highlightings) {
    if (!this._hovered) {
      return;
    }
    if (!this._selected) {
      highlightings[this._hovered - 1] = { fill: '#ffd700', fillOpacity: 0.75 };
      return;
    }
    if (this._hovered >= this.minSelected && this._hovered <= this.maxSelected) {
      if (!this.selectedAreUnpaired()) {
        for (let p = this.minSelected; p <= this.maxSelected; p++) {
          highlightings[p - 1] = { fill: '#ff0000', fillOpacity: 1 };
        }
      }
      return;
    }
    let complement = this.hoveredComplement();
    if (complement) {
      for (let p = complement.p5; p <= complement.p3; p++) {
        highlightings[p - 1] = { fill: '#0000ff', fillOpacity: 0.45 };
      }
      return;
    }
    highlightings[this._hovered - 1] = { fill: '#ffd700', fillOpacity: 0.75 };
  }

  handleMousedownOnDrawing() {  
    if (!this._hovered) {
      this._selected = null;
      this._setBaseHighlightings();
    }
  }

  reset() {
    this._hovered = null;
    this._selected = null;
    this._setBaseHighlightings();
  }

  disable() {}

  enable() {}

  onShouldPushUndo(cb) {
    this._onShouldPushUndo = cb;
  }

  fireShouldPushUndo() {
    if (this._onShouldPushUndo) {
      this._onShouldPushUndo();
    }
  }

  onChange(cb) {
    this._onChange = cb;
  }

  fireChange() {
    if (this._onChange) {
      this._onChange();
    }
  }
}

export default FoldingMode;
