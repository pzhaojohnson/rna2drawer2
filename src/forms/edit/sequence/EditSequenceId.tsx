import * as React from 'react';
import formStyles from './EditSequenceId.css';
import { CloseButton } from 'Forms/buttons/CloseButton';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';
import { BackwardForwardButtons } from 'Forms/history/BackwardForwardButtons';
import { AppInterface as App } from 'AppInterface';
import { IdInput } from './IdInput';

export type Props = {
  app: App;

  unmount: () => void;
  history: FormHistoryInterface;
}

function Title() {
  return (
    <p
      className='unselectable'
      style={{ fontSize: '24px', color: 'rgba(0,0,0,1)' }}
    >
      Sequence ID
    </p>
  );
}

function TitleUnderline() {
  return (
    <div
      style={{
        height: '0px',
        borderWidth: '0px 0px 1px 0px',
        borderStyle: 'solid',
        borderColor: 'rgba(0,0,0,0.175)',
      }}
    />
  );
}

export function EditSequenceId(props: Props) {
  let drawing = props.app.strictDrawing.drawing;
  if (drawing.sequences.length > 1) {
    console.error('Unable to edit the IDs of more than one sequence.');
  }

  return (
    <div
      className={formStyles.form}
      style={{ position: 'relative', width: '332px', height: '100%', overflow: 'auto' }}
    >
      <div style={{ position: 'absolute', top: '0px', right: '0px' }} >
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'start' }} >
          <BackwardForwardButtons {...props.history} />
          <CloseButton onClick={() => props.unmount()} />
        </div>
      </div>
      <div style={{ margin: '16px 32px 0px 32px' }} >
        <Title />
      </div>
      <div style={{ margin: '8px 16px 0px 16px' }} >
        <TitleUnderline />
      </div>
      <div style={{ margin: '24px 40px 8px 40px' }} >
        {drawing.sequences.length == 0 ? (
          <p className='unselectable' style={{ fontSize: '12px' }} >
            Drawing has no sequences.
          </p>
        ) : (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }} >
            <IdInput app={props.app} sequence={drawing.sequences[0]} />
          </div>
        )}
      </div>
    </div>
  );
}
