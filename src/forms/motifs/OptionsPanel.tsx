import type { Options } from './FindMotifsForm';

import * as React from 'react';

import { CheckboxField } from 'Forms/inputs/checkbox/CheckboxField';
import { Props as CheckboxFieldProps } from 'Forms/inputs/checkbox/CheckboxField';

import { AllowedMismatchField } from './AllowedMismatchField';

function UTField(props: CheckboxFieldProps) {
  return (
    <CheckboxField
      label='Match Us and Ts'
      checked={props.checked}
      onChange={props.onChange}
      style={{ alignSelf: 'start' }}
    />
  );
}

function IUPACField(props: CheckboxFieldProps) {
  return (
    <CheckboxField
      label='Use IUPAC single letter codes'
      checked={props.checked}
      onChange={props.onChange}
      style={{ alignSelf: 'start' }}
    />
  );
}

function TreatMotifAsRegExpField(props: CheckboxFieldProps) {
  return (
    <CheckboxField
      label='Treat Motif as a Regular Expression'
      checked={props.checked}
      onChange={props.onChange}
      style={{ alignSelf: 'start' }}
    />
  );
}

export type Props = {
  value: Options;
  onChange: (event: { target: { value: Options } }) => void;
};

export function OptionsPanel(props: Props) {
  return (
    <div style={{ margin: '10px 0 0 12px', display: 'flex', flexDirection: 'column' }} >
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }} >
        <UTField
          checked={props.value.UT}
          onChange={event => {
            let UT = event.target.checked;
            props.onChange({ target: { value: { ...props.value, UT } } });
          }}
        />
        <div style={{ height: '6px' }} />
        <IUPACField
          checked={props.value.IUPAC}
          onChange={event => {
            let IUPAC = event.target.checked;
            props.onChange({ target: { value: { ...props.value, IUPAC } } });
          }}
        />
        <div style={{ height: '8px' }} />
        <AllowedMismatchField
          value={props.value.allowedMismatch}
          onSubmit={event => {
            let allowedMismatch = event.target.value;
            props.onChange({ target: { value: { ...props.value, allowedMismatch } } });
          }}
        />
        {!props.value.treatMotifAsRegExp ? null : (
          // shrouds the above option fields
          <div style={{
            position: 'absolute', top: '0px', right: '0px', bottom: '0px', left: '0px',
            backgroundColor: 'white', opacity: 0.8,
          }} />
        )}
      </div>
      <div style={{ height: '8px' }} />
      <TreatMotifAsRegExpField
        checked={props.value.treatMotifAsRegExp}
        onChange={event => {
          let treatMotifAsRegExp = event.target.checked;
          props.onChange({ target: { value: { ...props.value, treatMotifAsRegExp } } });
        }}
      />
    </div>
  );
}
