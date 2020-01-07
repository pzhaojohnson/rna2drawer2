import React from 'react';

class InfoBar extends React.Component {
  borderStyles() {
    return {
      height: 0.75,
      backgroundColor: 'gainsboro'
    };
  }

  divStyles() {
    return {
      backgroundColor: 'whitesmoke'
    };
  }

  infoStyles() {
    return {
      display: 'flex',
      flexDirection: 'row'
    };
  }

  pieceStyles() {
    return {
      paddingLeft: 12,
      paddingRight: 12,
      paddingTop: 4,
      paddingBottom: 4,
      fontFamily: 'verdana',
      fontSize: 12,
      fontColor: 'black'
    };
  }

  actionStyles() {
    let s = this.pieceStyles();
    s.flexGrow = 1;
    return s;
  }

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'whitesmoke' }} >
        <div style={this.borderStyles()} ></div>
        <div style={this.infoStyles()} >
          <div style={this.actionStyles()} >Select Position 12</div>
          <div style={this.pieceStyles()} >5 Pairables</div>
          <div style={this.pieceStyles()} >Range 1 to 20</div>
        </div>
      </div>
    );
  }
}

export default InfoBar;
