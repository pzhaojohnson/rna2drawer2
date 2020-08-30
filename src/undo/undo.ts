import { AppInterface as App } from '../AppInterface';

export function pushUndo(app: App) {
  app.undoRedo.pushUndo(
    app.strictDrawing.savableState()
  );
  app.renderPeripherals();
}

export function undo(app: App) {
  if (app.canUndo()) {
    let currState = app.strictDrawing.savableState();
    app.strictDrawing.applySavedState(
      app.undoRedo.undo(currState)
    );
    app.drawingChangedNotByInteraction();
  }
}

export function redo(app: App) {
  if (app.canRedo()) {
    let currState = app.strictDrawing.savableState();
    app.strictDrawing.applySavedState(
      app.undoRedo.redo(currState)
    );
    app.drawingChangedNotByInteraction();
  }
}
