import * as React from 'react';
import Menu from './Menu';
import createFileDropdownForApp from './file/createFileDropdownForApp';
import createModeDropdownForApp from './mode/createModeDropdownForApp';
import createEditDropdownForApp from './createEditDropdownForApp';
import createExportDropdownForApp from './createExportDropdownForApp';

interface App {
  strictDrawing: {
    isEmpty: () => boolean;
    hasFlatOutermostLoop: () => boolean;
    flatOutermostLoop: () => void;
    hasRoundOutermostLoop: () => boolean;
    roundOutermostLoop: () => void;
  };
  strictDrawingInteraction: {
    pivoting: () => boolean;
    startPivoting: () => void;
    folding: () => boolean;
    startFolding: () => void;
  }
  undo: () => void;
  canUndo: () => boolean;
  redo: () => void;
  canRedo: () => boolean;
  pushUndo: () => void;
  drawingChangedNotByInteraction: () => void;
  save: () => void;
}

function createMenuForApp(app: App): React.ReactElement {
  return (
    <Menu
      fileDropdown={createFileDropdownForApp(app)}
      modeDropdown={createModeDropdownForApp(app)}
      editDropdown={createEditDropdownForApp(app)}
      exportDropdown={createExportDropdownForApp(app)}
    />
  );
}

export default createMenuForApp;
