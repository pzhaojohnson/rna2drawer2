import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';
import { BasesByCharacter } from 'Forms/edit/bases/by/character/BasesByCharacter';

export type Props = {
  app: App;
}

export function ByCharacterButton(props: Props) {
  return (
    <DroppedButton
      text='By Character'
      onClick={() => {
        props.app.renderForm(unmount => (
          <BasesByCharacter app={props.app} unmount={unmount} />
        ))
      }}
    />
  );
}
