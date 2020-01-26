import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Menu from './Menu';
import Infobar from './Infobar';

import TrackedDrawing from './draw/TrackedDrawing';

import CreateNewDrawing from './forms/CreateNewDrawing';

class App {

  /**
   * @param {object} options 
   * @param {boolean} options.testing Set to True to tell the app that it is running in a test via Node.js.
   * @param {Element} options.testingDrawingContainer Container for the drawing of the app when testing.
   */
  constructor(options={}) {
    this._options = options;

    this._fillInBody();
    this._renderPermanentComponents();

    (this.openFormCreateNewDrawingCallback())();
  }

  /**
   * Fills in the body element of this app with permanent elements.
   * 
   * It is preferrable to specify these elements here rather than in dist/index.html
   * since using an HTML file with the Jest testing framework does not seem very
   * straightforward... and this allows rendering of this app in testing.
   * 
   * The body element in dist/index.html is otherwise empty except for the script tag
   * to bundle.js. This method assumes that the body element is empty prior to its calling.
   * 
   * Use of document.body.innerHTML is also discouraged given its association with
   * XSS attacks.
   */
  _fillInBody() {
    let outermostDiv = document.createElement('div');
    outermostDiv.style.cssText = 'height: 100vh; display: flex; flex-direction: column;';
    document.body.appendChild(outermostDiv);

    let menuContainer = document.createElement('div');
    menuContainer.id = this._menuContainerId;
    outermostDiv.appendChild(menuContainer);

    let drawingAndTaskPaneDiv = document.createElement('div');
    drawingAndTaskPaneDiv.style.cssText = 'min-height: 0; flex-grow: 1; display: flex; flex-direction: row;';
    outermostDiv.appendChild(drawingAndTaskPaneDiv);

    let drawingContainer = document.createElement('div');
    drawingContainer.id = this._drawingContainerId;
    drawingContainer.style.cssText = 'flex-grow: 1; overflow: auto;';
    drawingAndTaskPaneDiv.appendChild(drawingContainer);

    let formContainer = document.createElement('div');
    formContainer.id = this._formContainerId;
    drawingAndTaskPaneDiv.appendChild(formContainer);

    let infobarContainer = document.createElement('div');
    infobarContainer.id = this._infobarContainerId;
    outermostDiv.appendChild(infobarContainer);
  }

  /**
   * @returns {string} The ID of the container element for the menu.
   */
  get _menuContainerId() {
    return 'MenuContainer';
  }
  
  /**
   * @returns {Element} The container element for the menu.
   */
  _getMenuContainer() {
    return document.getElementById(this._menuContainerId);
  }

  /**
   * @returns {string} The ID of the container element for the SVG document of the drawing.
   */
  get _drawingContainerId() {
    return 'DrawingContainer';
  }

  /**
   * @returns {Element} The container element for the SVG document of the drawing.
   */
  _getDrawingContainer() {
    if (this._options.testing) {
      return this._options.testingDrawingContainer;
    } else {
      return document.getElementById(this._drawingContainerId);
    }
  }

  /**
   * @returns {string} The ID of the container element for forms.
   */
  get _formContainerId() {
    return 'FormContainer';
  }

  /**
   * @returns {Element} The container element for any task panes.
   */
  _getFormContainer() {
    return document.getElementById(this._formContainerId);
  }

  /**
   * @returns {string} The ID of the container element for the infobar.
   */
  get _infobarContainerId() {
    return 'InfobarContainer';
  }

  /**
   * @returns {Element} The container element for the infobar.
   */
  _getInfobarContainer() {
    return document.getElementById(this._infobarContainerId);
  }

  /**
   * Initializes and renders the drawing, menu, and infobar components and stores references to them
   * in the _drawing, _menu, and _infobar properties, respectively.
   * 
   * The drawing must be initialized and rendered before the menu and infobar, since the rendering of
   * the menu and infobar depends on the state of the drawing.
   * 
   * These instances of the menu, drawing, and infobar components will remain throughout the lifetime
   * of this app.
   */
  _renderPermanentComponents() {
    this._renderDrawing();
    this._renderMenu();
    this._renderInfobar();
  }

  _renderDrawing() {
    this._drawing = new TrackedDrawing(this._getDrawingContainer());
  }

  _renderMenu() {
    ReactDOM.unmountComponentAtNode(this._getMenuContainer())
    
    this._menu = (
      <Menu
        drawingIsEmptyCallback={this.drawingIsEmptyCallback()}
        openFormCreateNewDrawingCallback={this.openFormCreateNewDrawingCallback()}
      />
    );
    
    ReactDOM.render(this._menu, this._getMenuContainer());
  }

  _renderInfobar() {
    ReactDOM.unmountComponentAtNode(this._getInfobarContainer())
    
    this._infobar = (
      <Infobar
        drawingIsEmptyCallback={this.drawingIsEmptyCallback()}
      />
    );
    
    ReactDOM.render(this._infobar, this._getInfobarContainer());
  }

  /**
   * @callback App~drawingIsEmptyCallback 
   * @returns {boolean} True if the drawing of this app is currently empty.
   */
  
  /**
   * @returns {App~drawingIsEmptyCallback} 
   */
  drawingIsEmptyCallback() {
    return () => this._drawing.isEmpty();
  }

  _openForm(form) {
    this._closeCurrForm();
    ReactDOM.render(form, this._getFormContainer());
  }

  _closeCurrForm() {
    ReactDOM.unmountComponentAtNode(this._getFormContainer());
  }

  closeFormCallback() {
    return () => this._closeCurrForm();
  }

  openFormCreateNewDrawingCallback() {
    return () => this._openForm(
      <CreateNewDrawing
        width={'100vw'}
        height={'100%'}
        addStructureCallback={this.addStructureCallback()}
        closeCallback={this.closeFormCallback()}
      />
    );
  }

  _updatePeripherals() {
    this._renderMenu();
    this._renderInfobar();
  }

  addStructureCallback() {
    return (id, sequence, partners) => {
      this._drawing.addStructure(id, sequence, partners);
      this._updatePeripherals();
    }
  }
}

export default App;
