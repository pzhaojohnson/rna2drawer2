import * as React from 'react';
import { SubmitButton } from 'Forms/buttons/SubmitButton';

export type Props = {
  onClick: () => void;
};

export function SelectButton(props: Props) {
  return (
    <SubmitButton
      onClick={props.onClick}
      style={{ marginTop: '40px', alignSelf: 'start' }}
    >
      Select
    </SubmitButton>
  );
}
