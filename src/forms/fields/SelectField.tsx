import * as React from 'react';
import Select from 'react-select';
import { getAtIndex } from '../../array/getAtIndex';

interface ValueLabel {
  value: string;
  label: string;
}

function toValueLabel(value: string): ValueLabel {
  return { value: value, label: value };
}

interface Props {
  name: string;
  initialValue?: string;
  options: string[];
  set: (v: string) => void;
}

export function SelectField(props: Props): React.ReactElement {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
      <p style={{ display: 'inline-block', paddingRight: '4px' }} >
        {props.name}
      </p>
      <Select
        defaultValue={props.initialValue ? toValueLabel(props.initialValue) : undefined}
        options={props.options.map(o => toValueLabel(o))}
        placeholder=''
        isMulti={false}
        isClearable={false}
        isSearchable={false}
        onChange={couldBeNullish => {
          // the types for the onChange handler are a bit awkward to work with...
          if (couldBeNullish) {
            let couldBeArray = couldBeNullish;
            let notArray = Array.isArray(couldBeArray) ? getAtIndex(couldBeArray, 0) : couldBeArray;
            if (typeof notArray == 'object') {
              let isObject = notArray;
              if (typeof isObject.value == 'string') {
                let value = isObject.value;
                // setting the value will often unmount the field
                // and unmounting the field too quickly after a change event
                // can cause a memory leak involving the underlying select element
                setTimeout(() => props.set(value), 350);
              }
            }
          }
        }}
      />
    </div>
  );
}
