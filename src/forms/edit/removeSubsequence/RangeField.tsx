import * as React from 'react';
import { IntegerField } from '../../fields/text/IntegerField';

export interface Range {
  start: number;
  end: number;
}

interface Props {
  initialValue: Range;
  onInput: () => void;
  onValidInput: () => void;
  onInvalidInput: () => void;
  set: (r: Range) => void;
}

export function StartField(props: Props): React.ReactElement {
  return (
    <IntegerField
      name={'Start'}
      initialValue={props.initialValue.start}
      onInput={props.onInput}
      onValidInput={props.onValidInput}
      onInvalidInput={props.onInvalidInput}
      set={n => props.set({ start: n, end: props.initialValue.end })}
    />
  );
}

export function EndField(props: Props): React.ReactElement {
  return (
    <IntegerField
      name={'End'}
      initialValue={props.initialValue.end}
      onInput={props.onInput}
      onValidInput={props.onValidInput}
      onInvalidInput={props.onInvalidInput}
      set={n => props.set({ start: props.initialValue.start, end: n })}
    />
  );
}

export function RangeField(props: Props): React.ReactElement {
  return (
    <div>
      <p>Positions of Subsequence:</p>
      <div style={{ margin: '12px 0px 0px 12px' }} >
        <StartField {...props} />
        <div style={{ marginTop: '8px' }} >
          <EndField {...props} />
        </div>
      </div>
    </div>
  );
}
