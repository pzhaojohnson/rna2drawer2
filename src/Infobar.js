import React from 'react';
import PropTypes from 'prop-types';

class Infobar extends React.Component {
  borderStyles() {
    return {
      height: 1,
      backgroundColor: '#bfbfbf'
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
      fontFamily: 'Segoe UI',
      fontSize: 12
    };
  }

  actionStyles() {
    let s = this.pieceStyles();
    s.flexGrow = 1;
    return s;
  }

  render() {
    let content = null;
    return (
      <div
        style={{
          borderWidth: 'thin 0px 0px 0px',
          borderStyle: 'solid',
          borderColor: '#bfbfbf',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fafafa',
        }}
      >
        {content}
      </div>
    );
  }
}

Infobar.propTypes = {};

export default Infobar;
