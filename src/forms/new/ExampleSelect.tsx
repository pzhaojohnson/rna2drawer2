import * as React from 'react';

interface Props {
  examples: string[];
  selected: string;
  select: (example: string) => void;
}

export function ExampleSelect(props: Props): React.ReactElement {
  return (
    <div style={{ margin: '0px', alignItems: 'center' }} >
      <p
        className={'unselectable-text'}
        style={{ margin: '0px 8px 0px 0px', fontSize: '12px', display: 'inline-block' }}
      >
        Examples:
      </p>
      <select
        value={props.selected}
        onChange={event => props.select(event.target.value)}
        style={{ fontSize: '12px' }}
      >
        {props.examples.map(e => <option key={e} value={e}>{e}</option>)}
      </select>
    </div>
  );
}
