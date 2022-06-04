import * as React from 'react';
import { SolidButton } from 'Forms/buttons/SolidButton';

export type Props = {
  onClick: () => void;
};

export function SelectButton(props: Props) {
  return (
    <SolidButton
      text='Select'
      onClick={props.onClick}
      style={{ marginTop: '32px', alignSelf: 'start' }}
    />
  );
}
