import * as React from 'react';
import CloseButton from '../buttons/CloseButton';

interface Props {
  close: () => void;
  children: React.ReactElement[],
  width?: string;
}

export function ClosableContainer(props: Props): React.ReactElement {
  return (
    <div
      style={{
        position: 'relative',
        width: props.width ?? '400px',
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
        onClick={() => props.close()}
      />
      {props.children}
    </div>
  );
}

export default ClosableContainer;
