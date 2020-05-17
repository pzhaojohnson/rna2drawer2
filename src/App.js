import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

import StrictDrawing from './draw/StrictDrawing';

import createMenuForApp from './menu/createMenuForApp';
import createInfobarForApp from './infobar/createInfobarForApp';

import renderCreateNewDrawingInApp from './forms/renderCreateNewDrawingInApp';

import offerFileForDownload from './export/offerFileForDownload';

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
    this.renderPeripherals();
    
    renderCreateNewDrawingInApp(this);
  }

  /**
   * @returns {App~SVG} 
   */
  get SVG() {
    return this._SVG;
  }

  _fillInBody() {
    let outermostDiv = document.createElement('div');
    outermostDiv.style.cssText = 'height: 100vh; display: flex; flex-direction: column;';
    document.body.appendChild(outermostDiv);

    let menuContainer = document.createElement('div');
    menuContainer.id = this._menuContainerId;
    outermostDiv.appendChild(menuContainer);

    let drawingAndFormDiv = document.createElement('div');
    drawingAndFormDiv.style.cssText = 'min-height: 0px; flex-grow: 1; display: flex; flex-direction: row;';
    outermostDiv.appendChild(drawingAndFormDiv);

    let drawingContainer = document.createElement('div');
    drawingContainer.id = this._drawingContainerId;
    drawingContainer.style.cssText = 'flex-grow: 1; overflow: auto;';
    drawingAndFormDiv.appendChild(drawingContainer);

    let formContainer = document.createElement('div');
    formContainer.id = this._formContainerId;
    drawingAndFormDiv.appendChild(formContainer);

    let infobarContainer = document.createElement('div');
    infobarContainer.id = this._infobarContainerId;
    outermostDiv.appendChild(infobarContainer);
  }

  /**
   * @returns {string} 
   */
  get _menuContainerId() {
    return 'MenuContainer';
  }
  
  /**
   * @returns {string} 
   */
  get _drawingContainerId() {
    return 'DrawingContainer';
  }

  /**
   * @returns {string} 
   */
  get _formContainerId() {
    return 'FormContainer';
  }

  /**
   * @returns {string} 
   */
  get _infobarContainerId() {
    return 'InfobarContainer';
  }

  /**
   * @returns {Element} 
   */
  _getMenuContainer() {
    return document.getElementById(this._menuContainerId);
  }

  /**
   * @returns {Element} 
   */
  _getDrawingContainer() {
    return document.getElementById(this._drawingContainerId);
  }

  /**
   * @returns {Element} 
   */
  _getFormContainer() {
    return document.getElementById(this._formContainerId);
  }

  /**
   * @returns {Element} 
   */
  _getInfobarContainer() {
    return document.getElementById(this._infobarContainerId);
  }

  _initializeDrawing() {
    this._strictDrawing = new StrictDrawing();
    let container = this._getDrawingContainer();
    this._strictDrawing.addTo(container, () => this._SVG());
  }

  /**
   * @returns {StrictDrawing} 
   */
  get strictDrawing() {
    return this._strictDrawing;
  }

  renderPeripherals() {
    this.renderMenu();
    this.renderInfobar();
    if (this._currForm) {
      this._currForm.forceUpdate();
    }
  }

  renderMenu() {
    ReactDOM.render(
      createMenuForApp(this),
      this._getMenuContainer(),
    );
  }

  renderInfobar() {
    ReactDOM.render(
      createInfobarForApp(this),
      this._getInfobarContainer(),
    );
  }

  /**
   * @param {React.Element} formElement 
   */
  renderForm(formElement) {
    this.unmountCurrForm();
    this._currForm = ReactDOM.render(
      formElement,
      this._getFormContainer()
    );
  }

  unmountCurrForm() {
    this._currForm = null;
    ReactDOM.unmountComponentAtNode(
      this._getFormContainer()
    );
  }

  updateDocumentTitle() {
    if (this.strictDrawing.isEmpty()) {
      document.title = 'RNA2Drawer 2';
      return;
    }
    document.title = this.strictDrawing.sequenceIds().join(', ');
  }

  save() {
    offerFileForDownload({
      name: document.title + '.rna2drawer2',
      type: 'text/plain',
      contents: this.strictDrawing.savableString,
    });
  }
}

export default App;
