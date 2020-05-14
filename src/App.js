import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

import StrictDrawing from './draw/StrictDrawing';

import Menu from './Menu';
import Infobar from './Infobar';

import CreateNewDrawing from './forms/CreateNewDrawing';
import { OpenRna2drawer } from './forms/OpenRna2drawer';
import offerFileForDownload from './export/offerFileForDownload';
import { ExportSvg } from './forms/ExportSvg';
import { ExportPptx } from './forms/ExportPptx';

class App {

  /**
   * @callback App~SVG 
   * 
   * @returns {SVG.Svg} 
   */

  /**
   * @param {App~SVG} SVG
   */
  constructor(SVG) {
    this._SVG = SVG;
    
    this._fillInBody();
    this._initializeDrawing();
    this._renderPeripherals();
    
    this.createNewDrawing();
  }

  _fillInBody() {
    let outermostDiv = document.createElement('div');
    outermostDiv.style.cssText = 'height: 100vh; display: flex; flex-direction: column;';
    document.body.appendChild(outermostDiv);

    let menuContainer = document.createElement('div');
    menuContainer.id = this.menuContainerId;
    outermostDiv.appendChild(menuContainer);

    let drawingAndFormDiv = document.createElement('div');
    drawingAndFormDiv.style.cssText = 'min-height: 0px; flex-grow: 1; display: flex; flex-direction: row;';
    outermostDiv.appendChild(drawingAndFormDiv);

    let drawingContainer = document.createElement('div');
    drawingContainer.id = this.drawingContainerId;
    drawingContainer.style.cssText = 'flex-grow: 1; overflow: auto;';
    drawingAndFormDiv.appendChild(drawingContainer);

    let formContainer = document.createElement('div');
    formContainer.id = this.formContainerId;
    drawingAndFormDiv.appendChild(formContainer);

    let infobarContainer = document.createElement('div');
    infobarContainer.id = this.infobarContainerId;
    outermostDiv.appendChild(infobarContainer);
  }

  /**
   * @returns {string} 
   */
  get menuContainerId() {
    return 'MenuContainer';
  }
  
  /**
   * @returns {string} 
   */
  get drawingContainerId() {
    return 'DrawingContainer';
  }

  /**
   * @returns {string} 
   */
  get formContainerId() {
    return 'FormContainer';
  }

  /**
   * @returns {string} 
   */
  get infobarContainerId() {
    return 'InfobarContainer';
  }

  /**
   * @returns {Element} 
   */
  get menuContainer() {
    return document.getElementById(this.menuContainerId);
  }

  /**
   * @returns {Element} 
   */
  get drawingContainer() {
    return document.getElementById(this.drawingContainerId);
  }

  /**
   * @returns {Element} 
   */
  get formContainer() {
    return document.getElementById(this.formContainerId);
  }

  /**
   * @returns {Element} 
   */
  get infobarContainer() {
    return document.getElementById(this.infobarContainerId);
  }

  _initializeDrawing() {
    this._drawing = new StrictDrawing();
    let container = this.drawingContainer;
    this._drawing.addTo(container, () => this._SVG());
  }

  _renderPeripherals() {
    this._renderMenu();
    this._renderInfobar();
  }

  _renderMenu() {
    let menu = (
      <Menu
        drawingIsEmpty={this._drawing.isEmpty()}
        createNewDrawing={() => this.createNewDrawing()}
        openCt={() => this.openCt()}
        openRna2drawer={() => this.openRna2drawer()}
        save={() => this.save()}
        exportSvg={() => this.exportSvg()}
        exportPptx={() => this.exportPptx()}
      />
    );
    ReactDOM.render(menu, this.menuContainer);
  }

  _renderInfobar() {
    let infobar = (
      <Infobar
        drawingIsEmpty={this._drawing.isEmpty()}
        zoom={this._drawing.zoom}
        setZoom={z => this.setDrawingZoom(z)}
      />
    );
    ReactDOM.render(infobar, this.infobarContainer);
  }

  setDrawingZoom(z) {
    this._drawing.zoom = z;
    this._renderPeripherals();
  }

  _updateDocumentTitle() {
    if (this._drawing.isEmpty()) {
      document.title = 'RNA2Drawer 2';
      return;
    }
    document.title = this._drawing.sequenceIds().join(', ');
  }

  openForm(form) {
    this.closeCurrForm();
    ReactDOM.render(form, this.formContainer);
  }

  closeCurrForm() {
    ReactDOM.unmountComponentAtNode(this.formContainer);
  }

  createNewDrawing() {
    if (!this._drawing.isEmpty()) {
      window.open(document.URL);
      return;
    }
    this.openForm(
      <CreateNewDrawing
        width={'100vw'}
        submit={structure => {
          this._drawing.appendStructure(structure);
          this.closeCurrForm();
          this._renderPeripherals();
          this._updateDocumentTitle();
        }}
      />
    );
  }

  openRna2drawer() {
    if (!this._drawing.isEmpty()) {
      window.open(document.URL);
      return;
    }
    this.openForm(
      <OpenRna2drawer
        submit={savedState => {
          let applied = this._drawing.applySavedState(savedState);
          if (applied) {
            this.closeCurrForm();
          }
          this._renderPeripherals();
          this._updateDocumentTitle();
          return applied;
        }}
      />
    );
  }

  save() {
    offerFileForDownload({
      name: 'Drawing.rna2drawer2',
      type: 'text/plain',
      contents: this._drawing.savableString,
    });
  }

  exportSvg() {
    this.openForm(
      <ExportSvg
        SVG={() => this._SVG()}
        getSvgString={() => this._drawing.svgString}
        close={() => this.closeCurrForm()}
      />
    );
  }

  exportPptx() {
    this.openForm(
      <ExportPptx
        SVG={() => this._SVG()}
        getSvgString={() => this._drawing.svgString}
        close={() => this.closeCurrForm()}
      />
    );
  }
}

export default App;
