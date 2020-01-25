import React from 'react';
import logo from './logo.svg';
import checkmark from './checkmark.svg';

class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      borderColor: '#bfbfbf',
      backgroundColor: '#fafafa',
      buttonColor: 'black'
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

  _topButton(text) {
    return (
      <button
        style={{
          ...this._stylesButton(),
          backgroundColor: this.state.backgroundColor,
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

  _droppedButton(text) {
    return (
      <button
        className={'menu-dropped-button'}
        style={{
          ...this._stylesButton(),
          minWidth: '200px',
          textAlign: 'left',
        }}
      >
        {text}
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

  _fileMenu() {
    return (
      <div className={'dropdown-menu'} >
        {this._topButton('File')}
        <div
          className={'dropdown-menu-content'}
          style={this._stylesDropdownContent()}
        >
          {this._droppedButton('New')}
          {this._dropdownSeparator()}
          {this._droppedButton('Open Sequence')}
          {this._droppedButton('Open FASTA')}
          {this._droppedButton('Open Dot-Bracket')}
          {this._droppedButton('Open CT')}
          {this._droppedButton('Open RNA2Drawer')}
          {this._dropdownSeparator()}
          {this._droppedButton('Save')}
        </div>
      </div>
    );
  }

  _modeMenu() {
    return (
      <div className={'dropdown-menu'} >
        {this._topButton('Mode')}
        <div
          className={'dropdown-menu-content'}
          style={this._stylesDropdownContent()}
        >
          {this._droppedButton('Fold')}
          {this._droppedButton('Pivot Stems')}
        </div>
      </div>
    );
  }

  _editMenu() {
    return (
      <div className={'dropdown-menu'} >
        {this._topButton('Edit')}
        <div
          className={'dropdown-menu-content'}
          style={this._stylesDropdownContent()}
        >
          {this._droppedButton('Undo')}
          {this._droppedButton('Redo')}
          {this._dropdownSeparator()}
          {this._droppedButton('Add a Sequence')}
          {this._droppedButton('Delete a Sequence')}
          {this._droppedButton('Delete a Subsequence')}
          {this._dropdownSeparator()}
          {this._droppedButton('Edit Numbering Offsets')}
        </div>
      </div>
    );
  }

  _exportMenu() {
    return (
      <div className={'dropdown-menu'} >
        {this._topButton('Export')}
        <div
          className={'dropdown-menu-content'}
          style={this._stylesDropdownContent()}
        >
          {this._droppedButton('SVG')}
          {this._droppedButton('PowerPoint (PPTX)')}
        </div>
      </div>
    );
  }

  _settingsMenu() {
    return (
      <div className={'dropdown-menu'} >
        {this._topButton('Settings')}
        <div
          className={'dropdown-menu-content'}
          style={this._stylesDropdownContent()}
        >
          {this._droppedButton('App Styles')}
        </div>
      </div>
    );
  }

  _helpMenu() {
    return (
      <div className={'dropdown-menu'} >
        {this._topButton('Help')}
        <div
          className={'dropdown-menu-content'}
          style={this._stylesDropdownContent()}
        >
          {this._droppedButton('About')}
        </div>
      </div>
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
