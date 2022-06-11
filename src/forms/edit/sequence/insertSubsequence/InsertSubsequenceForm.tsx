import type { App } from 'App';
import type { Sequence } from 'Draw/sequences/Sequence';

import { insertSubsequence } from './insertSubsequence';

import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

import styles from './InsertSubsequenceForm.css';

import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';

import { SubsequenceField } from './SubsequenceField';

import { CheckboxField } from 'Forms/inputs/checkbox/CheckboxField';

import { PositionToInsertAtField } from './PositionToInsertAtField';
import { DisplayableSequenceRange } from 'Forms/edit/sequence/DisplayableSequenceRange';

import { IncludeSubstructureField } from './IncludeSubstructureField';
import { SubstructureTextArea } from './SubstructureTextArea';

import { SolidButton } from 'Forms/buttons/SolidButton';
import { ErrorMessage } from './ErrorMessage';

import { TrailingNotes } from './TrailingNotes';

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

  includeSubstructure: false,
  substructure: '',
};

export type Props = {
  unmount: () => void;
  history: FormHistoryInterface;

  // a reference to the whole app
  app: App;
}

export function InsertSubsequenceForm(props: Props) {
  let drawing = props.app.drawing;

  if (drawing.sequences.length == 0) {
    console.error('Drawing has no sequences.');
  } else if (drawing.sequences.length > 1) {
    console.error('Drawing has multiple sequences.');
    console.error('This form can only insert subsequences into the first sequence of the drawing.');
  }

  let sequence: Sequence | undefined = drawing.sequences[0];

  let [subsequence, setSubsequence] = useState(prevState.subsequence);

  let [ignoreNumbers, setIgnoreNumbers] = useState(prevState.ignoreNumbers);
  let [ignoreNonAUGCTLetters, setIgnoreNonAUGCTLetters] = useState(prevState.ignoreNonAUGCTLetters);
  let [ignoreNonAlphanumerics, setIgnoreNonAlphanumerics] = useState(prevState.ignoreNonAlphanumerics);

  let [positionToInsertAt, setPositionToInsertAt] = useState(prevState.positionToInsertAt);

  let [includeSubstructure, setIncludeSubstructure] = useState(prevState.includeSubstructure);
  let [substructure, setSubstructure] = useState(prevState.substructure);

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
        includeSubstructure, substructure,
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
      <div style={{ margin: '12px 0px 0px 8px', display: 'flex', flexDirection: 'column' }} >
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
      <IncludeSubstructureField
        checked={includeSubstructure}
        onChange={event => setIncludeSubstructure(event.target.checked)}
      />
      {!includeSubstructure ? null : (
        <SubstructureTextArea
          value={substructure}
          onChange={event => setSubstructure(event.target.value)}
        />
      )}
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
                includeSubstructure, substructure,
              });
              setErrorMessage('');
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
