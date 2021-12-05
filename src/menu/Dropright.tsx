import * as React from 'react';
import styles from './Dropright.css';
import { RightCaret } from './RightCaret';

export type Props = {
  name: string;

  // the content of the dropright menu
  dropped: React.ReactNode;
}

export function Dropright(props: Props) {
  return (
    <div className={styles.dropright} >
      <div
        className={styles.button}
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
      >
        <p className={styles.buttonText} style={{ flexGrow: 1, textAlign: 'left' }} >
          {props.name}
        </p>
        <RightCaret style={{ height: '16px', padding: '0px' }} />
      </div>
      <div className={styles.droppedContainer} >
        {props.dropped}
      </div>
    </div>
  );
}
