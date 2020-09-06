import * as React from 'react';
import { useState } from 'react';
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

export function DataRangeField(props: Props): React.ReactElement {
  let [minKey, setMinKey] = useState(0);
  let [maxKey, setMaxKey] = useState(0);
  return (
    <div>
      <p className={'unselectable-text'} >
        Range of Data to Select:
      </p>
      <div style={{ margin: '8px 0px 0px 8px' }} >
        <NumberField
          key={minKey}
          name={'Min'}
          initialValue={props.initialValue.min}
          checkValue={n => {
            if (n > props.initialValue.max) {
              return 'Min cannot be greater than max.';
            }
            return '';
          }}
          onFocus={() => {
            setMaxKey(maxKey + 1);
            props.onInput ? props.onInput() : undefined;
            props.onValidInput ? props.onValidInput() : undefined;
          }}
          onInput={props.onInput}
          onValidInput={props.onValidInput}
          onInvalidInput={props.onInvalidInput}
          set={min => props.set({ min: min, max: props.initialValue.max })}
        />
        <div style={{ marginTop: '8px' }} >
          <NumberField
            key={maxKey}
            name={'Max'}
            initialValue={props.initialValue.max}
            checkValue={n => {
              if (n < props.initialValue.min) {
                return 'Max cannot be less than min.';
              }
              return '';
            }}
            onFocus={() => {
              setMinKey(minKey + 1);
              props.onInput ? props.onInput() : undefined;
              props.onValidInput ? props.onValidInput() : undefined;
            }}
            onInput={props.onInput}
            onValidInput={props.onValidInput}
            onInvalidInput={props.onInvalidInput}
            set={max => props.set({ min: props.initialValue.min, max: max })}
          />
        </div>
      </div>
    </div>
  );
}
