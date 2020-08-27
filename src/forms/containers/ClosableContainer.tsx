import * as React from 'react';
import CloseButton from '../buttons/CloseButton';

interface Props {
  close: () => void;
  children: React.ReactElement[],
  width?: string;
}

export class ClosableContainer extends React.Component {
  static defaultProps: Props;

  props!: Props;

  render(): React.ReactElement {
    return (
      <div
        style={{
          position: 'relative',
          width: this.props.width,
          height: '100%',
          backgroundColor: '#ffffff',
          borderWidth: '0px 0px 0px 1px',
          borderStyle: 'solid',
          borderColor: 'rgba(0,0,0,0.2)',
        }}
      >
        <CloseButton
          position={'absolute'}
          top={'0px'}
          right={'0px'}
          onClick={() => this.props.close()}
        />
        {this.props.children}
      </div>
    );
  }
}

ClosableContainer.defaultProps = {
  close: () => console.error('Missing close callback.'),
  children: [],
  width: '400px',
};

export default ClosableContainer;
