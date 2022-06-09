import type { App } from 'App';
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

function constrainPositionToInsertAt(positionToInsertAt: string): string {
  let n = Number.parseFloat(positionToInsertAt);

  if (!Number.isFinite(n)) {
    return positionToInsertAt.trim(); // just trim whitespace
  }

  n = Math.floor(n); // make an integer
  return n.toString();
}

let prevState = {
  subsequence: '',

  ignoreNumbers: true,
  ignoreNonAUGCTLetters: false,
  ignoreNonAlphanumerics: true,

  positionToInsertAt: '1',
};

export function InsertSubsequenceForm(props: Props) {
  let drawing = props.app.strictDrawing.drawing;

  if (drawing.sequences.length > 1) {
    console.error('This form can only be used to insert subsequences into the first sequence of a drawing.');
  }

  let sequence = atIndex(drawing.sequences, 0);

  let [subsequence, setSubsequence] = useState(prevState.subsequence);

  let [ignoreNumbers, setIgnoreNumbers] = useState(prevState.ignoreNumbers);
  let [ignoreNonAUGCTLetters, setIgnoreNonAUGCTLetters] = useState(prevState.ignoreNonAUGCTLetters);
  let [ignoreNonAlphanumerics, setIgnoreNonAlphanumerics] = useState(prevState.ignoreNonAlphanumerics);

  let [positionToInsertAt, setPositionToInsertAt] = useState(prevState.positionToInsertAt);

  let processPositionToInsertAt = () => {
    setPositionToInsertAt(constrainPositionToInsertAt(positionToInsertAt));
  };

  let [errorMessage, setErrorMessage] = useState('');

  // to be incremented every time the error message is set
  // (to trigger error message animations)
  let [errorMessageKey, setErrorMessageKey] = useState(0);

  // remember certain aspects of state between renderings (such as inputs)
  useEffect(() => {
    return () => {
      prevState = {
        subsequence,
        ignoreNumbers, ignoreNonAUGCTLetters, ignoreNonAlphanumerics,
        positionToInsertAt,
      };
    };
  });

  return (
    <PartialWidthContainer
      unmount={props.unmount}
      history={props.history}
      title='Insert Subsequence'
      style={{ width: '372px' }}
    >
      <SubsequenceField
        value={subsequence}
        onChange={event => setSubsequence(event.target.value)}
      />
      <div style={{ margin: '8px 0px 0px 8px', display: 'flex', flexDirection: 'column' }} >
        <CheckboxField
          label='Ignore Numbers'
          checked={ignoreNumbers}
          onChange={event => setIgnoreNumbers(event.target.checked)}
          style={{ alignSelf: 'start' }}
        />
        <div style={{ height: '6px' }} />
        <CheckboxField
          label='Ignore Non-AUGCT Letters'
          checked={ignoreNonAUGCTLetters}
          onChange={event => setIgnoreNonAUGCTLetters(event.target.checked)}
          style={{ alignSelf: 'start' }}
        />
        <div style={{ height: '6px' }} />
        <CheckboxField
          label='Ignore Non-Alphanumerics'
          checked={ignoreNonAlphanumerics}
          onChange={event => setIgnoreNonAlphanumerics(event.target.checked)}
          style={{ alignSelf: 'start' }}
        />
      </div>
      <PositionToInsertAtField
        value={positionToInsertAt}
        onChange={event => setPositionToInsertAt(event.target.value)}
        onBlur={() => processPositionToInsertAt()}
        onKeyUp={event => {
          if (event.key.toLowerCase() == 'enter') {
            processPositionToInsertAt();
          }
        }}
      />
      <div style={{ height: '6px' }} />
      {!sequence ? null : <DisplayableSequenceRange sequence={sequence} />}
      <div style={{ marginTop: '32px' }} >
        <SolidButton
          text='Insert'
          onClick={() => {
            try {
              let app = props.app;
              insertSubsequence({
                app,
                subsequence,
                ignoreNumbers, ignoreNonAUGCTLetters, ignoreNonAlphanumerics,
                positionToInsertAt,
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
