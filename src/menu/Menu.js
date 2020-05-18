import React from 'react';
import PropTypes from 'prop-types';
import logo from '../icons/logo.svg';
import checkmark from '../icons/checkmark.svg';
const uuidv1 = require('uuid/v1');

class Menu extends React.Component {
  render() {
    return (
      <div
        style={{
          borderWidth: '0px 0px thin 0px',
          borderStyle: 'solid',
          borderColor: this.props.borderColor,
          backgroundColor: this.props.backgroundColor,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        {this.logo()}
        {this.fileDropdown()}
        {this.editDropdown()}
        {this.exportDropdown()}
      </div>
    );
  }

  logo() {
    return (
      <img
        src={logo}
        alt={'Logo'}
        style={{
          height: '18px',
          padding: '4px 8px 4px 8px'
        }}
      />
    );
  }

  /**
   * @typedef {Object} Menu~TopButtonProps 
   * @property {string} text 
   * @property {boolean} disabled 
   */

  /**
   * @param {Menu~TopButtonProps} props 
   * 
   * @returns {React.Component} 
   */
  topButton(props) {
    return (
      <button
        style={{
          border: 'none',
          margin: '0px',
          padding: '6px 8px 6px 8px',
          fontSize: '12px',
          backgroundColor: this.props.backgroundColor,
          color: props.disabled ? this.props.disabledButtonColor : this.props.buttonColor,
        }}
      >
        {props.text}
      </button>
    );
  }

  /**
   * @typedef {Object} Menu~DroppedButtonProps 
   * @property {string} text 
   * @property {callback} onClick 
   * @property {boolean} disabled 
   * @property {string} keyBinding 
   * @param {boolean} checked 
   */

  /**
   * @param {Menu~DroppedButtonProps} props 
   * 
   * @returns {React.Component} 
   */
  droppedButton(props) {
    return (
      <button
        key={uuidv1()}
        className={'dropped-menu-button'}
        onClick={props.disabled ? () => {} : props.onClick}
        style={{
          minWidth: '200px',
          border: 'none',
          margin: '0px',
          padding: '6px 8px 6px 8px',
          backgroundColor: props.disabled ? this.props.backgroundColor : undefined,
          textAlign: 'left',
          fontSize: '12px',
          color: props.disabled ? this.props.disabledButtonColor : this.props.buttonColor,
        }}
      >
        <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }} >
          <div style={{ flexGrow: '1' }} >
            {props.text}
          </div>
          <div>
            {props.keyBinding ? props.keyBinding : null}
          </div>
          {props.checked ? this.checkmark() : null}
        </div>
      </button>
    );
  }
  
  separator() {
    return (
      <div
        key={uuidv1()}
        style={{
          width: '100%',
          backgroundColor: this.props.backgroundColor,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            height: '0px',
            borderWidth: '0px 0px thin 0px',
            borderStyle: 'solid',
            borderColor: this.props.borderColor,
            margin: '0px 4px 0px 4px',
          }}
        ></div>
      </div>
    );
  }

  /**
   * @param {React.Component} topButton The top button.
   * @param {Array<React.Component>} droppedComps The dropped items.
   */
  dropdown(topButton, droppedComps) {
    return (
      <div className={'dropdown-menu'} >
        {topButton}
        <div
          className={'dropdown-menu-content'}
          style={{
            borderWidth: '0px thin thin thin',
            borderStyle: 'solid',
            borderColor: this.props.borderColor,
          }}
        >
          {droppedComps}
        </div>
      </div>
    );
  }

  fileDropdown() {
    return this.dropdown(
      this.topButton({ text: 'File' }),
      [
        this.droppedButton({
          text: 'New',
          onClick: () => this.props.createNewDrawing(),
        }),
        this.droppedButton({
          text: 'Open RNA2Drawer 2',
          onClick: () => this.props.openRna2drawer(),
          disabled: !this.props.drawingIsEmpty,
        }),
        this.droppedButton({
          text: 'Save',
          onClick: () => this.props.save(),
          disabled: this.props.drawingIsEmpty,
        }),
      ],
    );
  }

  editDropdown() {
    let topButton = this.topButton({
      text: 'Edit',
      disabled: this.props.drawingIsEmpty,
    });
    let droppedComps = [];
    if (!this.props.drawingIsEmpty) {
      droppedComps = [
        this.droppedButton({
          text: 'Undo',
          onClick: () => this.props.undo(),
          disabled: !this.props.canUndo,
          keyBinding: 'Ctrl+Z',
        }),
        this.droppedButton({
          text: 'Redo',
          onClick: () => this.props.redo(),
          disabled: !this.props.canRedo,
          keyBinding: 'Ctrl+Shift+Z',
        }),
      ];
    }
    return this.dropdown(topButton, droppedComps);
  }

  exportDropdown() {
    let topButton = this.topButton({
      text: 'Export',
      disabled: this.props.drawingIsEmpty,
    });
    let droppedComps = [];
    if (!this.props.drawingIsEmpty) {
      droppedComps = [
        this.droppedButton({
          text: 'SVG',
          onClick: () => this.props.exportSvg(),
        }),
        this.droppedButton({
          text: 'PowerPoint (PPTX)',
          onClick: () => this.props.exportPptx(),
        }),
      ];
    }
    return this.dropdown(topButton, droppedComps);
  }

  checkmark() {
    return (
      <img
        src={checkmark}
        alt={'Checkmark'}
        style={{
          height: '16px',
          padding: '0px 8px 0px 8px',
        }}
      />
    );
  }
}

Menu.propTypes = {
  borderColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  buttonColor: PropTypes.string,
  disabledButtonColor: PropTypes.string,

  drawingIsEmpty: PropTypes.bool,
  createNewDrawing: PropTypes.func,
  openRna2drawer: PropTypes.func,
  save: PropTypes.func,
  undo: PropTypes.func,
  canUndo: PropTypes.bool,
  redo: PropTypes.func,
  canRedo: PropTypes.bool,
  exportSvg: PropTypes.func,
  exportPptx: PropTypes.func,
};

Menu.defaultProps = {
  borderColor: '#bfbfbf',
  backgroundColor: '#ffffff',
  buttonColor: '#000000',
  disabledButtonColor: '#808080',

  drawingIsEmpty: true,
  createNewDrawing: () => {},
  openRna2drawer: () => {},
  save: () => {},
  undo: () => {},
  canUndo: false,
  redo: () => {},
  canRedo: false,
  exportSvg: () => {},
  exportPptx: () => {},
};

export default Menu;
