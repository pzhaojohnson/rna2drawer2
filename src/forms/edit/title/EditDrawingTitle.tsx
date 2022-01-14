import * as React from 'react';
import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';
import { AppInterface as App } from 'AppInterface';
import { DrawingTitleInput } from './DrawingTitleInput';

export type Props = {
  app: App;

  unmount: () => void;
  history: FormHistoryInterface;
}

export function EditDrawingTitle(props: Props) {
  return (
    <PartialWidthContainer
      unmount={props.unmount}
      history={props.history}
      title='Drawing Title'
      style={{ width: '332px' }}
    >
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }} >
        <DrawingTitleInput app={props.app} />
      </div>
      <div style={{ margin: '8px 0px 8px 3px' }} >
        <p
          className='unselectable'
          style={{ fontSize: '14px', fontStyle: 'italic', color: 'rgb(115 115 115)' }}
        >
          Defaults to the sequence ID.
        </p>
      </div>
    </PartialWidthContainer>
  );
}
