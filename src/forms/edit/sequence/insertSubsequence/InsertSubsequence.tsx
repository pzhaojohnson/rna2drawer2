import * as React from 'react';
import { useState } from 'react';
import { AppInterface as App } from '../../../../AppInterface';
import { ClosableContainer } from '../../../containers/ClosableContainer';
import { Fields } from './Fields';
import { ErrorMessage } from '../../../ErrorMessage';
import { SolidButton } from '../../../buttons/SolidButton';
import { cannotInsert, insert } from './insert';

interface Props {
  app: App;
  close: () => void;
}

let lastEntered = {
  insertPosition: 1,
  subsequence: '',
  ignoreNumbers: true,
  ignoreNonAugctLetters: false,
  ignoreNonAlphanumerics: true,
};

export function InsertSubsequence(props: Props): React.ReactElement {
  let [inputs, setInputs] = useState(lastEntered);
  let [inputsAreValid, setInputsAreValid] = useState(true);
  let [errorMessage, setErrorMessage] = useState<string[]>([]);
  return (
    <ClosableContainer
      close={props.close}
      title={'Insert Subsequence'}
      contained={
        <div style={{ display: 'flex', flexDirection: 'column' }} >
          <Fields
            initialValue={inputs}
            onInput={() => setErrorMessage([])}
            onValidInput={() => setInputsAreValid(true)}
            onInvalidInput={() => setInputsAreValid(false)}
            set={vs => {
              setInputs(vs);
              lastEntered = vs;
            }}
          />
          <div style={{ marginTop: errorMessage.join('') ? '12px' : '18px' }} >
            {errorMessage.join('') ? <ErrorMessage message={errorMessage.join('')} /> : null}
          </div>
          <div style={{ marginTop: '6px' }} >
            <SolidButton
              text={'Insert'}
              onClick={() => {
                let message = cannotInsert(props.app.strictDrawing, inputs);
                if (message) {
                  setErrorMessage([message]);
                } else {
                  props.close();
                  props.app.pushUndo();
                  insert(props.app.strictDrawing, inputs);
                  props.app.drawingChangedNotByInteraction();
                }
              }}
              disabled={!inputsAreValid}
            />
          </div>
          <p style={{ marginTop: '16px' }} >
            <span style={{ fontWeight: 600, color: 'rgba(0,0,0,1)' }} >Note:&nbsp;</span>
            The numbering of bases must be updated manually after inserting a subsequence.
          </p>
        </div>
      }
    />
  );
}
