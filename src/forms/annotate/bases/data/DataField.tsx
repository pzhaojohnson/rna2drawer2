import * as React from 'react';
import { useState } from 'react';
import { TextareaField } from '../../../fields/text/TextareaField';
import { parseData } from './parseData';

interface Props {
  initialValue: number[];
  onInput?: () => void;
  onValidInput?: () => void;
  onInvalidInput?: () => void;
  set: (data: number[]) => void;
}

export function DataField(props: Props): React.ReactElement {
  let [key, setKey] = useState(0);
  return (
    <TextareaField
      key={key}
      name={'Data'}
      initialValue={props.initialValue.join('\n')}
      checkValue={s => {
        let parsed = parseData(s);
        if (!parsed) {
          return 'Unable to parse data.';
        }
        return '';
      }}
      onInput={props.onInput}
      onValidInput={props.onValidInput}
      onInvalidInput={props.onInvalidInput}
      set={s => {
        let parsed = parseData(s);
        if (parsed) {
          props.set(parsed);
          setKey(key + 1);
        }
      }}
      placeholder={' ...separated by whitespace, commas or line endings'}
      rows={10}
    />
  );
}
