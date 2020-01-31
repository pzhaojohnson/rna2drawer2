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
      backgroundColor: '#fafafa',
      buttonColor: 'black',
      disabledButtonColor: 'gray',
    };
  }

  _logo() {
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

  _stylesDropdownContent() {
    return {
      borderWidth: '0px thin thin thin',
      borderStyle: 'solid',
      borderColor: this.state.borderColor,
    };
  }

  _stylesButton() {
    return {
      border: 'none',
      margin: '0px',
      padding: '4px 8px 4px 8px',
      fontSize: '12px',
      color: this.state.buttonColor,
    };
  }

  /**
   * Disabling a top button simply changes its color to this.state.disabledButtonColor.
   * 
   * @param {string} text The text of the button.
   * @param {object} options 
   * @param {boolean} options.disabled Set to true to disable the button.
   */
  _topButton(text, options={}) {
    let color = options.disabled ? this.state.disabledButtonColor : this.state.buttonColor;

    return (
      <button
        style={{
          ...this._stylesButton(),
          backgroundColor: this.state.backgroundColor,
          color: color,
        }}
      >
        {text}
      </button>
    );
  }

  _checkmark() {
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

  /**
   * Disabling a dropped button prevents any onClick callback from being called,
   * changes the color of the button to this.state.disabledButtenColor, and prevents
   * the background color of the button from changing on hover.
   * 
   * @param {string} text The text of the button.
   * @param {object} options 
   * @param {callback} options.onClick The callback to call when the button is clicked.
   * @param {boolean} options.disabled Set to true to disable the button.
   * @param {boolean} options.checkmark Set to true to give the button a checkmark.
   * 
   * @returns {React.Component} The dropped button.
   */
  _droppedButton(text, options={}) {
    let onClick = options.onClick ? options.onClick : () => null;
    
    let style = {
      ...this._stylesButton(),
      minWidth: '200px',
      textAlign: 'left',
      color: this.state.buttonColor,
    };

    if (options.disabled) {
      onClick = () => null;
      style.color = this.state.disabledButtonColor;
      
      // prevents the background color from changing on hover as defined in App.css
      style.backgroundColor = this.state.backgroundColor;
    }

    return (
      <button
        key={uuidv1()}
        className={'menu-dropped-button'}
        onClick={onClick}
        style={style}
      >
        <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }} >
          <div style={{ flexGrow: '1' }} >
            {text}
          </div>
          {options.checkmark ? this._checkmark() : null}
        </div>
      </button>
    );
  }

  _dropdownSeparator() {
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
   * @param {Array<React.Component>} droppedItems The dropped items.
   */
  _dropdownMenu(topButton, droppedItems) {
    return (
      <div className={'dropdown-menu'} >
        {topButton}
        <div
          className={'dropdown-menu-content'}
          style={this._stylesDropdownContent()}
        >
          {droppedItems}
        </div>
      </div>
    );
  }

  _fileMenu() {
    return this._dropdownMenu(
      this._topButton('File'),
      [
        this._droppedButton('New', {
          onClick: this.props.openFormCreateNewDrawingCallback,
        }),
        this._dropdownSeparator(),
        this._droppedButton('Open Dot-Bracket'),
        this._droppedButton('Open CT'),
        this._droppedButton('Open RNA2Drawer'),
        this._dropdownSeparator(),
        this._droppedButton('Save', {
          disabled: this.props.drawingIsEmptyCallback(),
        }),
      ],
    );
  }

  _modeMenu() {
    let droppedItems = [
      this._droppedButton('Fold', {
        checkmark: true
      }),
      this._droppedButton('Pivot Stems'),
    ];

    if (this.props.drawingIsEmptyCallback()) {
      droppedItems = [];
    }

    return this._dropdownMenu(
      this._topButton('Mode', {
        disabled: this.props.drawingIsEmptyCallback(),
      }),
      droppedItems,
    );
  }

  _editMenu() {
    let droppedItems = [
      this._droppedButton('Undo'),
      this._droppedButton('Redo'),
      this._dropdownSeparator(),
      this._droppedButton('Add a Sequence'),
      this._droppedButton('Delete a Sequence'),
      this._droppedButton('Delete a Subsequence'),
      this._dropdownSeparator(),
      this._droppedButton('Edit Numbering Offsets'),
    ];

    if (this.props.drawingIsEmptyCallback()) {
      droppedItems = [];
    }

    return this._dropdownMenu(
      this._topButton('Edit', {
        disabled: this.props.drawingIsEmptyCallback(),
      }),
      droppedItems,
    );
  }

  _exportMenu() {
    let droppedItems = [
      this._droppedButton('SVG'),
      this._droppedButton('PowerPoint (PPTX)'),
    ];

    if (this.props.drawingIsEmptyCallback()) {
      droppedItems = [];
    }

    return this._dropdownMenu(
      this._topButton('Export', {
        disabled: this.props.drawingIsEmptyCallback(),
      }),
      droppedItems,
    );
  }

  _settingsMenu() {
    return this._dropdownMenu(
      this._topButton('Settings'),
      [
        this._droppedButton('App Styles'),
      ],
    );
  }

  _helpMenu() {
    return this._dropdownMenu(
      this._topButton('Help'),
      [
        this._droppedButton('About'),
      ],
    );
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
        {this._logo()}
        {this._fileMenu()}
        {this._modeMenu()}
        {this._editMenu()}
        {this._exportMenu()}
        {this._settingsMenu()}
        {this._helpMenu()}
      </div>
    );
  }
}

Menu.propTypes = {
  drawingIsEmptyCallback: PropTypes.func,
  openFormCreateNewDrawingCallback: PropTypes.func,
};

export default Menu;
