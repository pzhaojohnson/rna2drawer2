import type { App } from 'App';

import * as React from 'react';
import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';

import { DrawingTitleInput } from './DrawingTitleInput';
import { FieldDescription } from 'Forms/inputs/labels/FieldDescription';

export type Props = {
  app: App; // a reference to the whole app

  unmount: () => void;
  history: FormHistoryInterface;
}

export function EditDrawingTitleForm(props: Props) {
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
      <FieldDescription style={{ margin: '8px 0px 8px 3px' }} >
        Defaults to the sequence ID.
      </FieldDescription>
    </PartialWidthContainer>
  );
}
