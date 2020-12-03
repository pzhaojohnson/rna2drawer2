import { AppInterface as App } from '../../../AppInterface';
import * as React from 'react';
import { ClosableContainer } from '../../containers/ClosableContainer';
import { DrawingTitleField, DrawingTitleDescription } from './DrawingTitleField';

interface Props {
  app: App;
  close: () => void;
}

export function EditDrawingTitle(props: Props): React.ReactElement {
  return (
    <ClosableContainer
      close={props.close}
      title='Edit Drawing Title'
      contained={
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }} >
          <DrawingTitleField app={props.app} />
          <div style={{ margin: '6px 0px 0px 12px' }} >
            <DrawingTitleDescription />
          </div>
        </div>
      }
    />
  );
}
