import * as React from 'react';
import { AppInterface as App } from '../../../AppInterface';
import { DroppedButton } from '../../DroppedButton';
import { SelectBasesByCharacter } from '../../../forms/annotate/bases/character/SelectBasesByCharacter';

interface Props {
  app: App;
  borderStyle?: string;
  borderWidth?: string;
  borderColor?: string;
}

export function ByCharacterButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text={'By Character'}
      onClick={() => {
        props.app.renderForm(close => (
          <SelectBasesByCharacter
            app={props.app}
            close={close}
          />
        ))
      }}
      borderStyle={props.borderStyle}
      borderWidth={props.borderWidth}
      borderColor={props.borderColor}
    />
  );
}
