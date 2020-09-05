import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';
import { Dropdown } from '../Dropdown';
import { ByCharacterButton } from './ByCharacterButton';
import { ByDataButton } from './ByDataButton';

interface Props {
  app: App;
}

export function AnnotateDropdown(props: Props): React.ReactElement {
  return (
    <Dropdown
      name={'Annotate'}
      dropped={
        <div>
          <ByCharacterButton app={props.app} />
          <ByDataButton app={props.app} />
        </div>}
      disabled={props.app.strictDrawing.isEmpty()}
    />
  );
}
