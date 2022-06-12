import * as React from 'react';
import { SolidButton } from 'Forms/buttons/SolidButton';

export type Props = {
  onClick: () => void;
};

export function InsertButton(props: Props) {
  return (
    <SolidButton
      text='Insert'
      onClick={props.onClick}
      style={{ margin: '40px 0 0 0', alignSelf: 'start' }}
    />
  );
}
