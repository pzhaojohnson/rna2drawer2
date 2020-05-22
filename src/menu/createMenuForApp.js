import React from 'react';
import Menu from './Menu';

import openNewTab from './openNewTab';

import renderCreateNewDrawingInApp from '../forms/renderCreateNewDrawingInApp';
import renderOpenRna2drawerInApp from '../forms/renderOpenRna2drawerInApp';
import renderEditLayoutInApp from '../forms/renderEditLayoutInApp';
import renderExportSvgInApp from '../forms/renderExportSvgInApp';
import renderExportPptxInApp from '../forms/renderExportPptxInApp';

/**
 * @param {App} app 
 * 
 * @returns {React.Element} 
 */
function createMenuForApp(app) {
  return (
    <Menu
      drawingIsEmpty={app.strictDrawing.isEmpty()}
      createNewDrawing={() => {
        if (!app.strictDrawing.isEmpty()) {
          openNewTab();
          return;
        }
        renderCreateNewDrawingInApp(app);
      }}
      openRna2drawer={() => {
        if (!app.strictDrawing.isEmpty()) {
          openNewTab();
          return;
        }
        renderOpenRna2drawerInApp(app);
      }}
      save={() => app.save()}
      pivoting={app.strictDrawingInteraction.pivoting()}
      startPivoting={() => {
        app.strictDrawingInteraction.startPivoting();
        app.renderPeripherals();
      }}
      folding={app.strictDrawingInteraction.folding()}
      startFolding={() => {
        app.strictDrawingInteraction.startFolding();
        app.renderPeripherals();
      }}
      undo={() => app.undo()}
      canUndo={app.canUndo()}
      redo={() => app.redo()}
      canRedo={app.canRedo()}
      flatOutermostLoop={() => {
        if (app.strictDrawing.hasFlatOutermostLoop()) {
          return;
        }
        app.pushUndo();
        app.strictDrawing.flatOutermostLoop();
        app.renderPeripherals();
      }}
      hasFlatOutermostLoop={app.strictDrawing.hasFlatOutermostLoop()}
      roundOutermostLoop={() => {
        if (app.strictDrawing.hasRoundOutermostLoop()) {
          return;
        }
        app.pushUndo();
        app.strictDrawing.roundOutermostLoop();
        app.renderPeripherals();
      }}
      hasRoundOutermostLoop={app.strictDrawing.hasRoundOutermostLoop()}
      editLayout={() => renderEditLayoutInApp(app)}
      exportSvg={() => renderExportSvgInApp(app)}
      exportPptx={() => renderExportPptxInApp(app)}
    />
  );
}

export default createMenuForApp;
