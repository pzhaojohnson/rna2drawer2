import * as React from 'react';
import styles from './ExampleSelect.css';

export type Props = {
  examples: string[];
  select: (example: string) => void;
}

export function ExampleSelect(props: Props): React.ReactElement {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
      <p
        className='unselectable'
        style={{ fontSize: '14px', fontStyle: 'italic', color: 'rgb(82 82 82)' }}
      >
        Examples...
      </p>
      {props.examples.map((e, i) => (
        <div
          key={i}
          style={{ flexGrow: 1, display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        >
          <div style={{ flexGrow: 1 }} />
          <p
            className={`${styles.option} unselectable`}
            onClick={() => props.select(e)}
          >
            {e}
          </p>
          <div style={{ flexGrow: 1 }} />
        </div>
      ))}
    </div>
  );
}
