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
        <p
          className={textFieldStyles.label}
          style={{ display: 'inline-block', marginRight: '12px' }}
        >
          Font Size of Bases:
        </p>
        <input
          className={textFieldStyles.input}
          type='text'
          value={props.value}
          onChange={event => props.onChange(event.target.value)}
          spellCheck='false'
          style={{ flexGrow: 1, textAlign: 'right' }}
        />
      </div>
      {!props.errorMessage ? null : (
        <div style={{ marginTop: '3px', width: '100%', display: 'flex', flexDirection: 'row' }} >
          <div style={{ flexGrow: 1 }} />
          <p
            key={Math.random()}
            className={`${errorMessageStyles.errorMessage} ${errorMessageStyles.fadesIn} unselectable`}
          >
            {props.errorMessage}
          </p>
        </div>
      )}
      <p
        className='unselectable'
        style={{ margin: '6px 0px 0px 12px', fontSize: '12px' }}
      >
        Scale the exported drawing by specifying the font size of bases.
      </p>
    </div>
  );
}
