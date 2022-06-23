import * as React from 'react';
import { SolidButton } from 'Forms/buttons/SolidButton';

export type Props = {
  onClick: () => void;
};

export function RemoveButton(props: Props) {
  return (
    <SolidButton
      text='Remove'
      onClick={props.onClick}
      style={{ marginTop: '38px' }}
    />
  );
}
