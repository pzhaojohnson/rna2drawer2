import * as React from 'react';
import { AppInterface as App } from '../../AppInterface';

import Dropdown from '../Dropdown';
import TopButton from '../TopButton';

import { NewButton } from './NewButton';
import { OpenButton } from './OpenButton';
import { SaveButton } from './SaveButton';

interface Props {
  app: App;
}

export function FileDropdown(props: Props): React.ReactElement {
  return (
    <Dropdown
      topButton={<TopButton text={'File'} />}
      dropped={
        <div>
          <NewButton app={props.app} />
          <OpenButton app={props.app} />
          <SaveButton app={props.app} />
        </div>
      }
    />
  );
}
