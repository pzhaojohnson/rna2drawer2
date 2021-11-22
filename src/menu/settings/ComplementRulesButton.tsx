import * as React from 'react';
import { DroppedButton } from 'Menu/DroppedButton';
import { AppInterface as App } from 'AppInterface';
import { ComplementRules } from 'Forms/settings/complements/ComplementRules';

export type Props = {
  app: App;
}

export function ComplementRulesButton(props: Props) {
  return (
    <DroppedButton
      text='Complement Rules'
      onClick={() => {
        props.app.renderForm(unmount => (
          <ComplementRules app={props.app} unmount={unmount} />
        ));
      }}
    />
  );
}
