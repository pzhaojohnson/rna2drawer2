import * as React from 'react';
import { IntegerField } from '../../../fields/text/IntegerField';

interface Props {
  initialValue: number;
  onInput?: () => void;
  onValidInput?: () => void;
  onInvalidInput?: () => void;
  set: (p: number) => void;
}

export function StartPositionField(props: Props): React.ReactElement {
  return (
    <IntegerField
      name={'Start Position of Data'}
      initialValue={props.initialValue}
      onInput={props.onInput}
      onValidInput={props.onValidInput}
      onInvalidInput={props.onInvalidInput}
      set={props.set}
    />
  );
}
