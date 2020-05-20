import positionIsInStem from '../../parse/positionIsInStem';
import stemOfPosition from '../../parse/stemOfPosition';
import unpairedRegionOfPosition from '../../parse/unpairedRegionOfPosition';
import setBaseHighlightingsOfDrawing from '../edit/setBaseHighlightingsOfDrawing';
import normalizeAngle from '../normalizeAngle';

function _getUnpairedRegion5(st, partners) {
  let p = st.position5 - 1;
  if (p > 0 && !partners[p - 1]) {
    return unpairedRegionOfPosition(p, partners);
  }
  return {
    boundingPosition5: p,
    boundingPosition3: st.position5,
  };
}

function _getUnpairedRegion3(st, partners) {
  let p = st.position3 + 1;
  if (p <= partners.length && !partners[p - 1]) {
    return unpairedRegionOfPosition(p, partners);
  }
  return {
    boundingPosition5: st.position3,
    boundingPosition3: p,
  };
}

class PivotingMode {
  constructor(strictDrawing) {
    this._strictDrawing = strictDrawing;

    this._setBindings();
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
    setBaseHighlightingsOfDrawing(
      this.strictDrawing.drawing,
      highlightings,
    );
  }

  handleMouseoutOnBase(b) {
    if (!this._selected) {
      setBaseHighlightingsOfDrawing(
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
    if (isFinite(this._xMousePrev) && isFinite(this._yMousePrev)) {
      if (this._selected) {
        this._pivot(
          event.screenX - this._xMousePrev,
          event.screenY - this._yMousePrev,
        );
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

  _moveToStretch(xMove, yMove) {
    let s = (xMove**2 + yMove**2)**0.5;
    let wh = (this.strictDrawing.baseWidth + this.strictDrawing.baseHeight) / 2;
    return s / (2 * wh);
  }

  _totalStretchOfUnpairedRegion(ur) {
    let ts = 0;
    let props = this.strictDrawing.perBaseLayoutProps();
    for (let p = ur.boundingPosition5; p < ur.boundingPosition3; p++) {
      if (p > 0) {
        ts += props[p - 1].stretch3;
      }
    }
    return ts;
  }

  _pivot5(xMove, yMove) {
    let s = this._moveToStretch(xMove, yMove);
    let partners = this.strictDrawing.layoutPartners();
    if (this._condense) {
      let ur5 = _getUnpairedRegion5(this._selected, partners);
      let s5 = this._totalStretchOfUnpairedRegion(ur5);
      this._addStretchToUnpairedRegion(-Math.min(s5, s), ur5);
      s -= s5;
    }
    if (s > 0) {
      let ur3 = _getUnpairedRegion3(this._selected, partners);
      this._addStretchToUnpairedRegion(s, ur3);
    }
    this.strictDrawing.applyLayout();
  }

  _pivot3(xMove, yMove) {
    let s = this._moveToStretch(xMove, yMove);
    let partners = this.strictDrawing.layoutPartners();
    if (this._condense) {
      let ur3 = _getUnpairedRegion3(this._selected, partners);
      let s3 = this._totalStretchOfUnpairedRegion(ur3);
      this._addStretchToUnpairedRegion(-Math.min(s3, s), ur3);
      s -= s3;
    }
    if (s > 0) {
      let ur5 = _getUnpairedRegion5(this._selected, partners);
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
    this._selected = null;
    this._condense = true;
    setBaseHighlightingsOfDrawing(
      this.strictDrawing.drawing,
      [],
    );
  }

  _bindKeys() {
    window.addEventListener('keydown', event => {
      let k = event.key.toLowerCase();
      if (k == 'shift' && this._selected) {
        this._condense = false;
      }
    });
  }

  reset() {
    this._selected = null;
    setBaseHighlightingsOfDrawing(
      this.strictDrawing.drawing,
      [],
    );
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
