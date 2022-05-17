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
  let drawing = props.app.drawing;

  if (drawing.sequences.length == 0) {
    console.error('Drawing has no sequences.');
  } else if (drawing.sequences.length > 1) {
    console.error('Drawing has multiple sequences. This form can only edit the ID of the first sequence.');
  }

  return (
    <PartialWidthContainer
      unmount={props.unmount}
      history={props.history}
      title='Sequence ID'
      style={{ width: '332px' }}
    >
      {drawing.sequences.length == 0 ? (
        'Drawing has no sequences.' // never supposed to happen
      ) : (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }} >
          <SequenceIdInput app={props.app} sequence={drawing.sequences[0]} />
        </div>
      )}
    </PartialWidthContainer>
  );
}
