import TertiaryBondsInteraction from './TertiaryBondsInteraction';

class StrictDrawingInteraction {
  constructor(strictDrawing) {
    this._strictDrawing = strictDrawing;

    this._initializeTertiaryBondsInteraction();
  }

  get strictDrawing() {
    return this._strictDrawing;
  }

  _setBindings() {}

  _initializeTertiaryBondsInteraction() {
    this._tertiaryBondsInteraction = new TertiaryBondsInteraction(
      this.strictDrawing.drawing
    );
    this._tertiaryBondsInteraction.onShouldPushUndo(() => {
      this.fireShouldPushUndo();
    });
    this._tertiaryBondsInteraction.onChange(() => {
      this.fireChange();
    });
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

export default StrictDrawingInteraction;
