import React from 'react';
import logo from './logo.svg';
import checkmark from './checkmark.svg';

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
   * @param {string} text The text of the button.
   * @param {object} options 
   * @param {string} options.color A custom color for the button.
   */
  _topButton(text, options={}) {
    let color = options.color ? options.color : this.state.buttonColor;

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
   * @param {string} text The text of the button.
   * @param {object} options 
   * @param {callback} onClick The callback to call when the button is clicked.
   * @param {boolean} checkmark Set to true to give the button a checkmark.
   * 
   * @returns {React.Component} The dropped button.
   */
  _droppedButton(text, options={}) {
    let onClick;

    if (!options.onClick) {
      onClick = () => null;
    }

    return (
      <button
        className={'menu-dropped-button'}
        onClick={onClick}
        style={{
          ...this._stylesButton(),
          minWidth: '200px',
          textAlign: 'left',
        }}
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
        this._droppedButton('New'),
        this._dropdownSeparator(),
        this._droppedButton('Open Sequence'),
        this._droppedButton('Open FASTA'),
        this._droppedButton('Open Dot-Bracket'),
        this._droppedButton('Open CT'),
        this._droppedButton('Open RNA2Drawer'),
        this._dropdownSeparator(),
        this._droppedButton('Save'),
      ],
    );
  }

  _modeMenu() {
    return this._dropdownMenu(
      this._topButton('Mode'),
      [
        this._droppedButton('Fold', {
          checkmark: true
        }),
        this._droppedButton('Pivot Stems'),
      ],
    );
  }

  _editMenu() {
    return this._dropdownMenu(
      this._topButton('Edit'),
      [
        this._droppedButton('Undo'),
        this._droppedButton('Redo'),
        this._dropdownSeparator(),
        this._droppedButton('Add a Sequence'),
        this._droppedButton('Delete a Sequence'),
        this._droppedButton('Delete a Subsequence'),
        this._dropdownSeparator(),
        this._droppedButton('Edit Numbering Offsets'),
      ],
    );
  }

  _exportMenu() {
    return this._dropdownMenu(
      this._topButton('Export'),
      [
        this._droppedButton('SVG'),
        this._droppedButton('PowerPoint (PPTX)'),
      ],
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

export default Menu;
