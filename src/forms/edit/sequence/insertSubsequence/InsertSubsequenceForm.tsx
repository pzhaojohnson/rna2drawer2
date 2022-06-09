import type { App } from 'App';
import { numberingOffset } from 'Draw/sequences/numberingOffset';
import { atIndex } from 'Array/at';

import * as React from 'react';
import { useState, useEffect } from 'react';
import styles from './InsertSubsequenceForm.css';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';
import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import { SubsequenceField } from './SubsequenceField';
import { CheckboxField } from 'Forms/inputs/checkbox/CheckboxField';
import { PositionToInsertAtField } from './PositionToInsertAtField';
import { DisplayableSequenceRange } from 'Forms/edit/sequence/DisplayableSequenceRange';
import { SolidButton } from 'Forms/buttons/SolidButton';
import { ErrorMessage } from './ErrorMessage';
import { TrailingNotes } from './TrailingNotes';

import { insertSubsequence } from './insertSubsequence';

export type Props = {
  unmount: () => void;
  history: FormHistoryInterface;

  // a reference to the whole app
  app: App;
}

type Inputs = {
  subsequence: string;
  positionToInsertAt: string;
  ignoreNumbers: boolean;
  ignoreNonAUGCTLetters: boolean;
  ignoreNonAlphanumerics: boolean;
}

function constrainPositionInput(position: string): string {
  let n = Number.parseFloat(position);
  if (!Number.isFinite(n)) {
    return position.trim();
  } else {
    n = Math.floor(n); // make an integer
    return n.toString();
  }
}

function constrainInputs(inputs: Inputs): Inputs {
  return {
    ...inputs,
    positionToInsertAt: constrainPositionInput(inputs.positionToInsertAt),
  };
}

let prevInputs: Inputs | undefined = undefined;

export function InsertSubsequenceForm(props: Props) {
  let drawing = props.app.strictDrawing.drawing;

  if (drawing.sequences.length > 1) {
    console.error('This form can only be used to insert subsequences into the first sequence of a drawing.');
  }

  let seq = atIndex(drawing.sequences, 0);
  let no = !seq ? 0 : (numberingOffset(seq) ?? 0);

  let [inputs, setInputs] = useState<Inputs>(prevInputs ?? {
    subsequence: '',
    positionToInsertAt: !seq ? '' : (no + 1).toString(),
    ignoreNumbers: true,
    ignoreNonAUGCTLetters: false,
    ignoreNonAlphanumerics: true,
  });

  let [errorMessage, setErrorMessage] = useState('');

  // to be incremented every time the error message is set
  // (to trigger error message animations)
  let [errorMessageKey, setErrorMessageKey] = useState(0);

  // remember inputs
  useEffect(() => {
    return () => { prevInputs = { ...inputs }; };
  });

  return (
    <PartialWidthContainer
      unmount={props.unmount}
      history={props.history}
      title='Insert Subsequence'
      style={{ width: '372px' }}
    >
      <SubsequenceField
        value={inputs.subsequence}
        onChange={event => {
          setInputs({ ...inputs, subsequence: event.target.value });
        }}
        onBlur={() => setInputs(constrainInputs(inputs))}
      />
      <div style={{ margin: '8px 0px 0px 8px', display: 'flex', flexDirection: 'column' }} >
        <CheckboxField
          label='Ignore Numbers'
          checked={inputs.ignoreNumbers}
          onChange={event => {
            setInputs({ ...inputs, ignoreNumbers: event.target.checked });
          }}
          style={{ alignSelf: 'start' }}
        />
        <div style={{ height: '6px' }} />
        <CheckboxField
          label='Ignore Non-AUGCT Letters'
          checked={inputs.ignoreNonAUGCTLetters}
          onChange={event => {
            setInputs({ ...inputs, ignoreNonAUGCTLetters: event.target.checked });
          }}
          style={{ alignSelf: 'start' }}
        />
        <div style={{ height: '6px' }} />
        <CheckboxField
          label='Ignore Non-Alphanumerics'
          checked={inputs.ignoreNonAlphanumerics}
          onChange={event => {
            setInputs({ ...inputs, ignoreNonAlphanumerics: event.target.checked });
          }}
          style={{ alignSelf: 'start' }}
        />
      </div>
      <PositionToInsertAtField
        value={inputs.positionToInsertAt}
        onChange={event => {
          setInputs({ ...inputs, positionToInsertAt: event.target.value });
        }}
        onBlur={() => setInputs(constrainInputs(inputs))}
        onKeyUp={event => {
          if (event.key.toLowerCase() == 'enter') {
            setInputs(constrainInputs(inputs));
          }
        }}
      />
      <div style={{ height: '6px' }} />
      {!seq ? null : <DisplayableSequenceRange sequence={seq} />}
      <div style={{ marginTop: '32px' }} >
        <SolidButton
          text='Insert'
          onClick={() => {
            try {
              insertSubsequence({
                app: props.app,
                subsequence: inputs.subsequence,
                ignoreNumbers: inputs.ignoreNumbers,
                ignoreNonAUGCTLetters: inputs.ignoreNonAUGCTLetters,
                ignoreNonAlphanumerics: inputs.ignoreNonAlphanumerics,
                positionToInsertAt: inputs.positionToInsertAt,
              });
            } catch (error) {
              setErrorMessage(error instanceof Error ? error.message : String(error));
              setErrorMessageKey(errorMessageKey + 1);
            }
          }}
        />
      </div>
      {!errorMessage ? null : (
        <ErrorMessage key={errorMessageKey} >{errorMessage}</ErrorMessage>
      )}
      <TrailingNotes />
    </PartialWidthContainer>
  );
}
