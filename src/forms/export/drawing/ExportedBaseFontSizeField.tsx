import * as React from 'react';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import errorMessageStyles from 'Forms/ErrorMessage.css';

export type Props = {
  value: string;
  onChange: (value: string) => void;
  errorMessage?: string;
}

export function ExportedBaseFontSizeField(props: Props) {
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
        <input
          className={textFieldStyles.input}
          type='text'
          value={props.value}
          onChange={event => props.onChange(event.target.value)}
          spellCheck='false'
          style={{ width: '28px', textAlign: 'left' }}
        />
        <p
          className={textFieldStyles.label}
          style={{ marginLeft: '6px' }}
        >
          Exported Font Size of Bases
        </p>
      </div>
      {!props.errorMessage ? null : (
        <p
          key={Math.random()}
          className={`${errorMessageStyles.errorMessage} ${errorMessageStyles.fadesIn} unselectable`}
          style={{ marginTop: '3px' }}
        >
          {props.errorMessage}
        </p>
      )}
      <p
        className='unselectable'
        style={{ margin: '6px 0px 0px 12px', fontSize: '12px' }}
      >
        Scale the exported drawing according to the font size of bases.
      </p>
    </div>
  );
}
