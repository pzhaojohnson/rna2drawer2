import * as React from 'react';
import styles from './ExampleSelect.css';

function LabelSpacer() {
  return <div style={{ flexGrow: 2 }} />;
}

function ExamplesSpacer() {
  return <div style={{ flexGrow: 3 }} />;
}

function EndSpacer() {
  return <div style={{ flexGrow: 2 }} />
}

export type Props = {
  examples: string[];
  select: (example: string) => void;
}

export function ExampleSelect(props: Props): React.ReactElement {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
      <p
        className='unselectable'
        style={{ fontSize: '14px', fontWeight: 500, fontStyle: 'italic', color: 'hsl(240, 5%, 22%)' }}
      >
        Examples...
      </p>
      <LabelSpacer />
      {props.examples.map((e, i) => [
        <p
          key={2 * i}
          className={`${styles.option} unselectable`}
          onClick={() => props.select(e)}
        >
          {e}
        </p>,
        i == props.examples.length - 1 ? null : <ExamplesSpacer key={(2 * i) + 1} />,
      ])}
      <EndSpacer />
    </div>
  );
}
