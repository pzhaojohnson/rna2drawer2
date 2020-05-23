import * as React from 'react';
import checkMark from '../icons/checkMark.svg';

class CheckMark extends React.Component {
  render() {
    return (
      <img
        src={checkMark}
        alt={'Checkmark'}
        style={{
          height: '16px',
          padding: '0px 8px 0px 8px',
        }}
      />
    );
  }
}

export default CheckMark;
