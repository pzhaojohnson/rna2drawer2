import * as React from 'react';
import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';
import type { App } from 'App';
import { IdInput } from './IdInput';

export type Props = {
  app: App;

  unmount: () => void;
  history: FormHistoryInterface;
}

export function EditSequenceId(props: Props) {
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
          <IdInput app={props.app} sequence={drawing.sequences[0]} />
        </div>
      )}
    </PartialWidthContainer>
  );
}
