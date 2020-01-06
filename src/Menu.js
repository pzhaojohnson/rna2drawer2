import React from 'react';
import logo from './logo.svg';
import checkmarkIcon from './checkmark.svg';

let _stylesTopButton = {
  paddingLeft: 8,
  paddingRight: 8,
  paddingTop: 4,
  paddingBottom: 4,
  margin: 0,
  fontFamily: 'verdana',
  fontSize: 12,
  color: 'black',
  border: 'none',
  outline: 'none'
};

let _stylesDropdownContent = {
  borderStyle: 'solid',
  borderTopWidth: 0,
  borderRightWidth: 1,
  borderBottomWidth: 1,
  borderLeftWidth: 1,
  borderColor: 'gainsboro'
};

let _stylesDroppedButton = { ..._stylesTopButton };
_stylesDroppedButton.minWidth = 200;
_stylesDroppedButton.textAlign = 'left';

let _stylesCheckmark = {
  height: 16,
  paddingRight: 8,
  paddingLeft: 8
};

function _droppedButton(text, onClick, checkmark=false) {
  let cm = checkmark ? <img src={checkmarkIcon} alt={'Checkmark'} style={_stylesCheckmark} /> : null;

  return (
    <button style={_stylesDroppedButton} >
      <div style={{ display: 'flex', flexDirection: 'row' }} >
        <div style={{ flexGrow: 1 }} >
          {text}
        </div>
        {cm}
      </div>
    </button>
  );
}

let _stylesDropdownSeparator = {
  height: 1,
  marginLeft: 4,
  marginRight: 4,
  backgroundColor: 'gainsboro'
};

function _dropdownSeparator() {
  return (
    <div style={_stylesDropdownSeparator} ></div>
  );
}

class _FileMenu extends React.Component {
  render() {
    return (
      <div class={'menu-dropdown'} >
        <button style={_stylesTopButton} >File</button>
        <div class={'menu-dropdown-content'} style={_stylesDropdownContent} >
          <button style={_stylesDroppedButton} onClick={() => alert('blah')} >New</button>
          {_dropdownSeparator()}
          {_droppedButton('Open Sequence', () => 'blah', true)}
          {_droppedButton('Open FASTA')}
          {_droppedButton('Open Dot-Bracket')}
          {_droppedButton('Open CT')}
          {_droppedButton('Open RNA2Drawer')}
          {_dropdownSeparator()}
          {_droppedButton('Save')}
        </div>
      </div>
    );
  }
}

class _ModeMenu extends React.Component {
  render() {
    return (
      <div class={'menu-dropdown'} >
        <button style={_stylesTopButton} >Mode</button>
        <div class={'menu-dropdown-content'} style={_stylesDropdownContent} >
          {_droppedButton('Fold')}
          {_droppedButton('Pivot Stems')}
        </div>
      </div>
    );
  }
}

class _EditMenu extends React.Component {
  render() {
    return (
      <div class={'menu-dropdown'} >
        <button style={_stylesTopButton} >Edit</button>
        <div class={'menu-dropdown-content'} style={_stylesDropdownContent} >
          {_droppedButton('Undo')}
          {_droppedButton('Redo')}
          {_dropdownSeparator()}
          {_droppedButton('Add a Sequence')}
          {_droppedButton('Delete a Sequence')}
          {_droppedButton('Delete a Subsequence')}
          {_dropdownSeparator()}
          {_droppedButton('Edit Numbering Offsets')}
        </div>
      </div>
    );
  }
}

class _ExportMenu extends React.Component {
  render() {
    return (
      <div class={'menu-dropdown'} >
        <button style={_stylesTopButton} >Export</button>
        <div class={'menu-dropdown-content'} style={_stylesDropdownContent} >
          {_droppedButton('SVG')}
          {_droppedButton('PowerPoint (PPTX)')}
        </div>
      </div>
    )
  }
}

class _SettingsMenu extends React.Component {
  render() {
    return (
      <div class={'menu-dropdown'} >
        <button style={_stylesTopButton} >Settings</button>
        <div class={'menu-dropdown-content'} style={_stylesDropdownContent} >
          {_droppedButton('App Styles')}
        </div>
      </div>
    );
  }
}

class Menu extends React.Component {
  stylesDiv0() {
    return {
      display: 'flex',
      flexDirection: 'column',
    }
  }

  stylesDiv1() {
    return {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'whitesmoke'
    };
  }

  stylesLogo() {
    return {
      height: 16,
      paddingLeft: 8,
      paddingRight: 8
    };
  }

  stylesItem() {
    return {
      paddingLeft: 8,
      paddingRight: 8,
      paddingTop: 4,
      paddingBottom: 4,
      margin: 0,
      fontFamily: 'verdana',
      fontSize: 12,
      fontColor: 'darkgray'
    }
  }

  stylesDropDown() {
    let styles = this.stylesItem();



    return styles;
  }

  stylesDropRight() {
    return {};
  }

  stylesBorder() {
    return {
      height: 1,
      backgroundColor: 'gainsboro'
    }
  }

  render() {
    return (
      <div style={this.stylesDiv0()} >
        <div style={this.stylesDiv1()} >
          <img src={logo} alt={'Logo'} style={this.stylesLogo()} />
          <_FileMenu />
          <_ModeMenu />
          <_EditMenu />
          <_ExportMenu />
          <_SettingsMenu />
        </div>
        <div style={this.stylesBorder()} ></div>
      </div>
    );
  }
}

export default Menu;
