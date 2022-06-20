import type { App } from 'App';

import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';

import { StartPositionField } from './StartPositionField';
import { EndPositionField } from './EndPositionField';
import { DisplayableSequenceRange } from 'Forms/edit/sequence/DisplayableSequenceRange';

import { RemoveButton } from './RemoveButton';
import { ErrorMessage } from 'Forms/ErrorMessage';

import { TrailingNotes } from './TrailingNotes';

import { removeSubsequence } from './removeSubsequence';

export type Props = {
  unmount: () => void;
  history: FormHistoryInterface;

  /**
   * A reference to the whole app.
   */
  app: App;
}

function constrainPosition(value: string): string {
  let n = Number.parseFloat(value);
  if (!Number.isFinite(n)) {
    return value.trim();
  } else {
    n = Math.floor(n); // make an integer
    return n.toString();
  }
}

let prevInputs = {
  startPosition: '1',
  endPosition: '1',
};

export function RemoveSubsequenceForm(props: Props) {
  let drawing = props.app.strictDrawing.drawing;

  if (drawing.sequences.length == 0) {
    console.error('Drawing has no sequences.');
  } else if (drawing.sequences.length > 1) {
    console.error('Unable to handle a drawing with multiple sequences.');
  }

  let [startPosition, setStartPosition] = useState(prevInputs.startPosition);
  let [endPosition, setEndPosition] = useState(prevInputs.endPosition);

  let [errorMessage, setErrorMessage] = useState('');

  // should be incremented every time the error message is set
  // (to trigger error message animations)
  let [errorMessageKey, setErrorMessageKey] = useState(0);

  // remember inputs
  useEffect(() => {
    return () => {
      prevInputs = { startPosition, endPosition };
    };
  });

  return (
    <PartialWidthContainer
      unmount={props.unmount}
      history={props.history}
      title='Remove Subsequence'
      style={{ width: '366px' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }} >
        <StartPositionField
          value={startPosition}
          onChange={event => setStartPosition(event.target.value)}
          onBlur={() => setStartPosition(constrainPosition(startPosition))}
          onEnterKeyUp={() => setStartPosition(constrainPosition(startPosition))}
        />
        <EndPositionField
          value={endPosition}
          onChange={event => setEndPosition(event.target.value)}
          onBlur={() => setEndPosition(constrainPosition(endPosition))}
          onEnterKeyUp={() => setEndPosition(constrainPosition(endPosition))}
        />
      </div>
      {drawing.sequences.length == 0 ? null : (
        <DisplayableSequenceRange sequence={drawing.sequences[0]} style={{ marginTop: '8px' }} />
      )}
      <RemoveButton
        onClick={() => {
          try {
            removeSubsequence({
              app: props.app,
              startPosition,
              endPosition,
            });
            setErrorMessage('');
          } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : String(error));
            setErrorMessageKey(errorMessageKey + 1);
          }
        }}
      />
      {!errorMessage ? null : (
        <ErrorMessage key={errorMessageKey} style={{ marginTop: '6px' }} >
          {errorMessage}
        </ErrorMessage>
      )}
      <TrailingNotes />
    </PartialWidthContainer>
  );
}
