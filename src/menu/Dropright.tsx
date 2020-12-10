import * as React from 'react';
import styles from './Dropright.css';
import { RightCaret } from './RightCaret';

export const trailingBorderStyles = {
  borderStyle: 'solid',
  borderColor: 'rgba(0,0,0,0.1)',
  borderWidth: '0px 0px 0px 1px',
};

interface Props {
  name?: string;
  dropped?: React.ReactElement;
}

export function Dropright(props: Props): React.ReactElement {
  return (
    <div className={styles.dropright} >
      <button
        style={{
          backgroundColor: 'white',
          color: 'rgba(0,0,0,0.85)',
          textAlign: 'left',
        }}
      >
        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
          <div style={{ flexGrow: 1 }} >
            {props.name}
          </div>
          <RightCaret height={'16px'} padding={'0px 0px 0px 2px'} />
        </div>
      </button>
      <div
        className={styles.dropped}
        style={{
          borderStyle: 'solid',
          borderColor: 'rgba(0,0,0,0.1) rgba(0,0,0,0.1) rgba(0,0,0,0.1) white',
          borderWidth: '1px 1px 1px 0px',
        }}
      >
        {props.dropped}
      </div>
    </div>
  );
}
