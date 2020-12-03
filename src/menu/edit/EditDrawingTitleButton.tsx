import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import { DroppedButton } from '../DroppedButton';
import { EditDrawingTitle } from '../../forms/edit/drawingTitle/EditDrawingTitle';

interface Props {
  app: App;
}

export function EditDrawingTitleButton(props: Props): React.ReactElement {
  return (
    <DroppedButton
      text='Drawing Title'
      onClick={() => {
        props.app.renderForm(close => (
          <EditDrawingTitle app={props.app} close={close ?? (() => props.app.unmountCurrForm())} />
        ));
      }}
    />
  );
}
