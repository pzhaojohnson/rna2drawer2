import { AppInterface as App } from '../AppInterface';

export function pushUndo(app: App) {
  app.undoRedo.pushUndo(
    app.strictDrawing.savableState()
  );
  app.renderPeripherals();
}

export function undo(app: App) {
  let pivotingMode = app.strictDrawingInteraction.pivotingMode;
  if (app.canUndo() && !pivotingMode.pivoting()) {
    let currState = app.strictDrawing.savableState();
    app.strictDrawing.applySavedState(
      app.undoRedo.undo(currState)
    );
    app.refresh();
  }
}

export function redo(app: App) {
  let pivotingMode = app.strictDrawingInteraction.pivotingMode;
  if (app.canRedo() && !pivotingMode.pivoting()) {
    let currState = app.strictDrawing.savableState();
    app.strictDrawing.applySavedState(
      app.undoRedo.redo(currState)
    );
    app.refresh();
  }
}
