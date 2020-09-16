import * as React from 'react';
import { NumberField } from '../../../fields/text/NumberField';

interface Range {
  min: number;
  max: number;
}

interface Props {
  initialValue: Range;
  onInput?: () => void;
  onValidInput?: () => void;
  onInvalidInput?: () => void;
  set: (r: Range) => void;
}

export function MinField(props: Props): React.ReactElement {
  return (
    <NumberField
      name={'Min'}
      initialValue={props.initialValue.min}
      onInput={props.onInput}
      onValidInput={props.onValidInput}
      onInvalidInput={props.onInvalidInput}
      set={min => props.set({ min: min, max: props.initialValue.max })}
    />
  );
}

export function MaxField(props: Props): React.ReactElement {
  return (
    <NumberField
      name={'Max'}
      initialValue={props.initialValue.max}
      onInput={props.onInput}
      onValidInput={props.onValidInput}
      onInvalidInput={props.onInvalidInput}
      set={max => props.set({ min: props.initialValue.min, max: max })}
    />
  );
}

export function DataRangeField(props: Props): React.ReactElement {
  return (
    <div>
      <p className={'unselectable-text'} >
        Range of Data to Select:
      </p>
      <div style={{ margin: '12px 0px 0px 12px' }} >
        <MinField {...props} />
        <div style={{ marginTop: '8px' }} >
          <MaxField {...props} />
        </div>
      </div>
    </div>
  );
}
