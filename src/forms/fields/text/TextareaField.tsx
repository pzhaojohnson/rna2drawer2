import * as React from 'react';
import { useState } from 'react';
import { ErrorMessage } from '../../ErrorMessage';

interface Props {
  name: string;
  initialValue?: string;
  checkValue?: (s: string) => string;
  onInput?: () => void;
  onValidInput?: () => void;
  onInvalidInput?: () => void;
  set: (s: string) => void;
  placeholder?: string;
  rows?: number;
}

export function TextareaField(props: Props): React.ReactElement {
  let [value, setValue] = useState(props.initialValue ?? '');
  let [errorMessage, setErrorMessage] = useState('');
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }} >
      <p className={'unselectable-text'} >
        {props.name + ':'}
      </p>
      <textarea
        value={value}
        onChange={event => {
          let v = event.target.value;
          setValue(v);
          let em = props.checkValue ? props.checkValue(v) : ''
          setErrorMessage(em);
          props.onInput ? props.onInput() : undefined;
          if (em) {
            props.onInvalidInput ? props.onInvalidInput() : undefined;
          } else {
            props.onValidInput ? props.onValidInput() : undefined;
          }
        }}
        onBlur={() => {
          let em = props.checkValue ? props.checkValue(value) : '';
          if (!em) {
            props.set(value);
          }
        }}
        placeholder={props.placeholder}
        spellCheck={false}
        rows={props.rows ?? 8}
        style={{ marginTop: '4px' }}
      />
      {!errorMessage ? null : (
        <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'row' }} >
          <div style={{ flexGrow: 1 }} ></div>
          <ErrorMessage message={errorMessage} />
        </div>
      )}
    </div>
  );
}
