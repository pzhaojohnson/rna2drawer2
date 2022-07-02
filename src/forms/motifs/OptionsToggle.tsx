import * as React from 'react';
import { OptionsToggle as _OptionsToggle } from 'Forms/buttons/OptionsToggle';

type Props = {
  onClick: () => void;
};

export function OptionsToggle(props: Props) {
  return (
    <_OptionsToggle
      onClick={props.onClick}
      style={{
        margin: '12px 0 0 3px',
        alignSelf: 'start',
        padding: '1px 14px',
        fontSize: '11px',
        fontWeight: 500,
      }}
    >
      Options
    </_OptionsToggle>
  );
}
