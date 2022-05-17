import type { App } from 'App';

import * as React from 'react';
import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';

import { SequenceIdInput } from './SequenceIdInput';

export type Props = {
  app: App; // a reference to the whole app

  unmount: () => void;
  history: FormHistoryInterface;
}

export function EditSequenceIdForm(props: Props) {
  let drawing = props.app.strictDrawing.drawing;
  if (drawing.sequences.length > 1) {
    console.error('Unable to edit the IDs of more than one sequence.');
  }

  return (
    <PartialWidthContainer
      unmount={props.unmount}
      history={props.history}
      title='Sequence ID'
      style={{ width: '332px' }}
    >
      {drawing.sequences.length == 0 ? (
        <p className='unselectable' style={{ fontSize: '12px' }} >
          Drawing has no sequences.
        </p>
      ) : (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }} >
          <SequenceIdInput app={props.app} sequence={drawing.sequences[0]} />
        </div>
      )}
    </PartialWidthContainer>
  );
}
