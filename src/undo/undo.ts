import type { App } from 'App';

export function pushUndo(app: App) {
  app.undoRedo.pushUndo(
    app.strictDrawing.savableState()
  );
  app.renderPeripherals();
}

export function undo(app: App) {
  let activated = app.strictDrawingInteraction.currentTool.activated;
  if (app.canUndo() && !activated) {
    let currState = app.strictDrawing.savableState();
    app.strictDrawing.applySavedState(
      app.undoRedo.undo(currState)
    );
    app.refresh();
  }
}

export function redo(app: App) {
  let activated = app.strictDrawingInteraction.currentTool.activated;
  if (app.canRedo() && !activated) {
    let currState = app.strictDrawing.savableState();
    app.strictDrawing.applySavedState(
      app.undoRedo.redo(currState)
    );
    app.refresh();
  }
}
