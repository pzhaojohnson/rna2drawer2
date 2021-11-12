import * as React from 'react';
import { AppInterface as App } from '../../../AppInterface';
import { DroppedButton } from '../../DroppedButton';
import { BasesByCharacter } from 'Forms/edit/bases/by/character/BasesByCharacter';

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
          <BasesByCharacter
            app={props.app}
            unmount={close}
          />
        ))
      }}
      borderStyle={props.borderStyle}
      borderWidth={props.borderWidth}
      borderColor={props.borderColor}
    />
  );
}
