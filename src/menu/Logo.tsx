import * as React from 'react';
import logo from '../icons/logo.svg';

class Logo extends React.Component {
  render() {
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
}

export default Logo;
