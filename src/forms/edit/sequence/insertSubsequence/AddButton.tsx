import * as React from 'react';
import { SolidButton } from 'Forms/buttons/SolidButton';

export type Props = {
  onClick: () => void;
};

export function AddButton(props: Props) {
  return (
    <SolidButton
      text='Add'
      onClick={props.onClick}
      style={{ margin: '40px 0 0 0', alignSelf: 'start' }}
    />
  );
}
