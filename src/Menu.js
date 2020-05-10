import React from 'react';
import PropTypes from 'prop-types';
import logo from './logo.svg';
import checkmark from './checkmark.svg';
const uuidv1 = require('uuid/v1');

class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      borderColor: '#bfbfbf',
      backgroundColor: '#fefefe',
      buttonColor: 'black',
      disabledButtonColor: 'gray',
    };
  }

  render() {
    return (
      <div
        style={{
          borderWidth: '0px 0px thin 0px',
          borderStyle: 'solid',
          borderColor: this.state.borderColor,
          backgroundColor: this.state.backgroundColor,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        {this.logo()}
        {this.fileDropdown()}
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
          backgroundColor: this.state.backgroundColor,
          color: props.disabled ? this.state.disabledButtonColor : this.state.buttonColor,
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
          backgroundColor: props.disabled ? this.state.backgroundColor : undefined,
          textAlign: 'left',
          fontSize: '12px',
          color: props.disabled ? this.state.disabledButtonColor : this.state.buttonColor,
        }}
      >
        <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }} >
          <div style={{ flexGrow: '1' }} >
            {props.text}
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
          backgroundColor: this.state.backgroundColor,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            height: '0px',
            borderWidth: '0px 0px thin 0px',
            borderStyle: 'solid',
            borderColor: this.state.borderColor,
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
            borderColor: this.state.borderColor,
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
        this.separator(),
        this.droppedButton({
          text: 'Open CT',
          onClick: () => this.props.openCt(),
          disabled: !this.props.drawingIsEmpty,
        }),
        this.droppedButton({
          text: 'Open RNA2Drawer 2',
          disabled: !this.props.drawingIsEmpty,
        }),
        this.separator(),
        this.droppedButton({
          text: 'Save',
          disabled: this.props.drawingIsEmpty,
        }),
      ],
    );
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
  drawingIsEmpty: PropTypes.bool,
  createNewDrawing: PropTypes.func,
  openCt: PropTypes.func,
  exportSvg: PropTypes.func,
  exportPptx: PropTypes.func,
};

Menu.defaultProps = {
  drawingIsEmpty: true,
  createNewDrawing: () => {},
  openCt: () => {},
  exportSvg: () => {},
  exportPptx: () => {},
};

export default Menu;
