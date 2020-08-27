import * as React from 'react';
import CloseButton from '../buttons/CloseButton';
import { Underline } from './Underline';

interface Props {
  close: () => void;
  title?: string;
  contained: React.ReactElement;
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
      {props.title ? (
        <div style={{ padding: '16px 32px 0px 32px'}} >
          <p className={'unselectable-text'} style={{ fontSize: '24px' }} >
            {props.title}
          </p>
        </div>
      ) : null}
      {props.title ? (
        <div style={{ marginTop: '8px', width: '100%', display: 'flex', flexDirection: 'column' }} >
          <Underline margin={'0px 16px 0px 16px'} />
        </div>
      ) : null}
      <div style={{ margin: '24px 40px 0px 40px' }} >
        {props.contained}
      </div>
    </div>
  );
}

export default ClosableContainer;
