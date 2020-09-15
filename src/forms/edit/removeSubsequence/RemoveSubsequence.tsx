import * as React from 'react';
import { useState } from 'react';
import { AppInterface as App } from '../../../AppInterface';
import { ClosableContainer } from '../../containers/ClosableContainer';
import { RangeField } from './RangeField';
import { ErrorMessage } from '../../ErrorMessage';
import { ActionButton } from '../../buttons/ActionButton';
import { cannotRemove, remove } from './remove';

let lastEntered = {
  start: 1,
  end: 2,
};

interface Props {
  app: App;
  close: () => void;
}

export function RemoveSubsequence(props: Props): React.ReactElement {
  let [range, setRange] = useState(lastEntered);
  let [rangeIsValid, setRangeIsValid] = useState(true);
  let [errorMessage, setErrorMessage] = useState<string[]>([]);
  return (
    <ClosableContainer
      title={'Remove Subsequence'}
      close={props.close}
      contained={
        <div style={{ display: 'flex', flexDirection: 'column' }} >
          <RangeField
            initialValue={range}
            onInput={() => setErrorMessage([])}
            onValidInput={() => setRangeIsValid(true)}
            onInvalidInput={() => setRangeIsValid(false)}
            set={r => setRange(r)}
          />
          <div style={{ marginTop: errorMessage.join('') ? '12px' : '18px' }} >
            {errorMessage.join('') ? <ErrorMessage message={errorMessage.join('')} /> : null}
          </div>
          <div style={{ marginTop: '6px' }} >
            <ActionButton
              text={'Remove'}
              onClick={() => {
                let message = cannotRemove(props.app.strictDrawing, range);
                if (message) {
                  setErrorMessage([message]);
                } else {
                  props.close();
                  props.app.pushUndo();
                  remove(props.app.strictDrawing, range);
                  props.app.drawingChangedNotByInteraction();
                  lastEntered = range;
                }
              }}
              disabled={!rangeIsValid}
            />
          </div>
          <p style={{ marginTop: '16px' }} >
            <b>Note:</b> The numbering of bases must be updated manually after removing a subsequence.
          </p>
        </div>
      }
    />
  );
}
