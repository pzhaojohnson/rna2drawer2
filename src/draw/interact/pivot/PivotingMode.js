import positionIsInStem from '../../../parse/positionIsInStem';
import stemOfPosition from '../../../parse/stemOfPosition';
import normalizeAngle from '../../normalizeAngle';

import setAllBaseHighlightings from '../highlight/setAllBaseHighlightings';
import removeAllBaseHighlightings from '../highlight/removeAllBaseHighlightings';

import unpairedRegion5 from './unpairedRegion5';
import unpairedRegion3 from './unpairedRegion3';

import mouseMoveToStretch from './mouseMoveToStretch';
import stretchOfUnpairedRegion from './stretchOfUnpairedRegion';
import addStretchToUnpairedRegion from './addStretchToUnpairedRegion';

class PivotingMode {
  constructor(strictDrawing) {
    this._strictDrawing = strictDrawing;

    this._setBindings();
  }

  get className() {
    return 'PivotingMode';
  }

  get strictDrawing() {
    return this._strictDrawing;
  }

  _setBindings() {
    this._bindMousemove();
    this._bindMouseup();
    this._bindKeys();
  }

  handleMouseoverOnBase(b) {
    if (this._selected) {
      return;
    }
    let p = this.strictDrawing.drawing.overallPositionOfBase(b);
    let partners = this.strictDrawing.layoutPartners();
    if (positionIsInStem(p, partners)) {
      let st = stemOfPosition(p, partners);
      this._highlightStem(st);
    }
  }
  
  _highlightStem(st) {
    let highlightings = [];
    for (let i = 0; i < st.size; i++) {
      let h = { fill: '#00ffff', fillOpacity: 0.5 };
      highlightings[st.position5 + i - 1] = { ...h };
      highlightings[st.position3 - i - 1] = { ...h };
    }
    setAllBaseHighlightings(
      this.strictDrawing.drawing,
      highlightings,
    );
  }

  handleMouseoutOnBase(b) {
    if (!this._selected) {
      setAllBaseHighlightings(
        this.strictDrawing.drawing,
        [],
      );
    }
  }

  handleMousedownOnBase(b) {
    let p = this.strictDrawing.drawing.overallPositionOfBase(b);
    let partners = this.strictDrawing.layoutPartners();
    if (positionIsInStem(p, partners)) {
      this._selected = stemOfPosition(p, partners);
      this._pivoted = false;
    }
  }

  _bindMousemove() {
    this._xMousePrev = NaN;
    this._yMousePrev = NaN;
    window.addEventListener('mousemove', event => {
      this.handleMousemove(event);
    });
  }

  handleMousemove(event) {
    if (!this._disabled) {
      if (isFinite(this._xMousePrev) && isFinite(this._yMousePrev)) {
        if (this._selected) {
          this._pivot(
            event.screenX - this._xMousePrev,
            event.screenY - this._yMousePrev,
          );
        }
      }
    }
    this._xMousePrev = event.screenX;
    this._yMousePrev = event.screenY;
  }

  _pivot(xMove, yMove) {
    if (!this._selected) {
      return;
    }
    if (!this._pivoted) {
      this.fireShouldPushUndo();
      this._pivoted = true;
    }
    let moveAngle = Math.atan2(yMove, xMove);
    let drawing = this.strictDrawing.drawing;
    let p5 = this._selected.position5;
    let b5 = drawing.getBaseAtOverallPosition(p5);
    let p3 = this._selected.position3;
    let b3 = drawing.getBaseAtOverallPosition(p3);
    let angle53 = b5.angleBetweenCenters(b3);
    moveAngle = normalizeAngle(moveAngle, angle53);
    if (moveAngle - angle53 < Math.PI / 2 || moveAngle - angle53 > 3 * Math.PI / 2) {
      this._pivot3(xMove, yMove);
    } else {
      this._pivot5(xMove, yMove);
    }
  }

  _pivot5(xMove, yMove) {
    let s = mouseMoveToStretch(xMove, yMove, this.strictDrawing);
    let partners = this.strictDrawing.layoutPartners();
    let perBaseProps = this.strictDrawing.perBaseLayoutProps();
    if (this._condense) {
      let ur5 = unpairedRegion5(this._selected, partners);
      let s5 = stretchOfUnpairedRegion(ur5, perBaseProps);
      this._addStretchToUnpairedRegion(-Math.min(s5, s), ur5);
      s -= s5;
    }
    if (s > 0) {
      let ur3 = unpairedRegion3(this._selected, partners);
      this._addStretchToUnpairedRegion(s, ur3);
    }
    this.strictDrawing.applyLayout();
  }

  _pivot3(xMove, yMove) {
    let s = mouseMoveToStretch(xMove, yMove, this.strictDrawing);
    let partners = this.strictDrawing.layoutPartners();
    let perBaseProps = this.strictDrawing.perBaseLayoutProps();
    if (this._condense) {
      let ur3 = unpairedRegion3(this._selected, partners);
      let s3 = stretchOfUnpairedRegion(ur3, perBaseProps);
      this._addStretchToUnpairedRegion(-Math.min(s3, s), ur3);
      s -= s3;
    }
    if (s > 0) {
      let ur5 = unpairedRegion5(this._selected, partners);
      this._addStretchToUnpairedRegion(s, ur5);
    }
    this.strictDrawing.applyLayout();
  }

  _addStretchToUnpairedRegion(s, ur) {
    let urSize = ur.boundingPosition3 - ur.boundingPosition5;
    if (ur.boundingPosition5 == 0) {
      urSize--;
    }
    if (urSize == 0) {
      return;
    }
    let s3 = s / urSize;
    let perBaseProps = this.strictDrawing.perBaseLayoutProps();
    for (let p = ur.boundingPosition5; p < ur.boundingPosition3; p++) {
      if (p > 0) {
        perBaseProps[p - 1].stretch3 += s3;
      }
    }
    this.strictDrawing.setPerBaseLayoutProps(perBaseProps);
  }

  _bindMouseup() {
    window.addEventListener('mouseup', () => this.handleMouseup());
  }

  handleMouseup() {
    if (this._disabled) {
      return;
    }
    this._selected = null;
    this._condense = true;
    removeAllBaseHighlightings(this.strictDrawing.drawing);
  }

  _bindKeys() {
    window.addEventListener('keydown', event => {
      let k = event.key.toLowerCase();
      if (k == 'shift' && this._selected) {
        this._condense = false;
      }
    });
  }

  handleMousedownOnDrawing() {}

  reset() {
    this._selected = null;
    removeAllBaseHighlightings(this.strictDrawing.drawing);
  }

  disable() {
    this._disabled = true;
  }

  enable() {
    this._disabled = false;
  }

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

export default PivotingMode;
