import * as React from 'react';
import { useState, useEffect } from 'react';
import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import { TextInputField } from 'Forms/inputs/text/TextInputField';
import { DisplayableSequenceRange } from 'Forms/edit/sequence/DisplayableSequenceRange';
import { ErrorMessage } from 'Forms/ErrorMessage';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';
import { SolidButton } from 'Forms/buttons/SolidButton';
import { DottedNote } from 'Forms/notes/DottedNote';
import type { App } from 'App';
import { atIndex } from 'Array/at';
import { isBlank } from 'Parse/isBlank';
import { cannotRemove, remove } from './remove';

/**
 * Removes the specified subsequence from the first sequence
 * in the drawing of the app.
 */
export function removeSubsequence(
  args: {
    app: App, // a reference to the whole app
    startPosition: string, // start position of the subsequence to remove
    endPosition: string, // end position of the subsequence to remove
  },
): void | never {
  if (isBlank(args.startPosition)) {
    throw new Error('Specify a start position.');
  } else if (isBlank(args.endPosition)) {
    throw new Error('Specify an end position.');
  }

  let startPosition = Number.parseFloat(args.startPosition);
  let endPosition = Number.parseFloat(args.endPosition);

  if (!Number.isFinite(startPosition)) {
    throw new Error('Start position must be a number.');
  } else if (!Number.isFinite(endPosition)) {
    throw new Error('End position must be a number.');
  }

  if (!Number.isInteger(startPosition)) {
    throw new Error('Start position must be an integer.');
  } else if (!Number.isInteger(endPosition)) {
    throw new Error('End position must be an integer.');
  }

  let message = cannotRemove(args.app.strictDrawing, { start: startPosition, end: endPosition });
  if (message) {
    throw new Error(message);
  }

  // remove the subsequence
  args.app.pushUndo();
  remove(args.app.strictDrawing, { start: startPosition, end: endPosition });
  args.app.refresh();
}

export type Props = {
  app: App;

  unmount: () => void;
  history: FormHistoryInterface;
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

  if (drawing.sequences.length > 1) {
    console.error('Unable to remove subsequences from multiple sequences.');
  }

  let seq = atIndex(drawing.sequences, 0);

  let [startPosition, setStartPosition] = useState(prevInputs.startPosition);
  let [endPosition, setEndPosition] = useState(prevInputs.endPosition);

  // use String object for fade in animation every time the error message is set
  let [errorMessage, setErrorMessage] = useState<String>(new String(''));

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
      style={{ width: '372px' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }} >
        <TextInputField
          label='Start Position'
          value={startPosition}
          onChange={event => setStartPosition(event.target.value)}
          onBlur={() => setStartPosition(constrainPosition(startPosition))}
          onKeyUp={event => {
            if (event.key.toLowerCase() == 'enter') {
              setStartPosition(constrainPosition(startPosition));
            }
          }}
          input={{ style: { width: '48px' } }}
          style={{ alignSelf: 'flex-start' }}
        />
        <TextInputField
          label='End Position'
          value={endPosition}
          onChange={event => setEndPosition(event.target.value)}
          onBlur={() => setEndPosition(constrainPosition(endPosition))}
          onKeyUp={event => {
            if (event.key.toLowerCase() == 'enter') {
              setEndPosition(constrainPosition(endPosition));
            }
          }}
          input={{ style: { width: '48px' } }}
          style={{ alignSelf: 'flex-start', marginTop: '8px' }}
        />
      </div>
      {!seq ? null : (
        <DisplayableSequenceRange sequence={seq} style={{ marginTop: '8px' }} />
      )}
      <div style={{ marginTop: '28px' }} >
        <SolidButton
          text='Remove'
          onClick={() => {
            try {
              removeSubsequence({
                app: props.app,
                startPosition,
                endPosition,
              });
              props.unmount();
            } catch (error) {
              setErrorMessage(
                new String(error instanceof Error ? error.message : String(error))
              );
            }
          }}
        />
      </div>
      {!errorMessage.valueOf() ? null : (
        <ErrorMessage key={Math.random()} style={{ marginTop: '6px' }} >
          {errorMessage.valueOf()}
        </ErrorMessage>
      )}
      <DottedNote style={{ marginTop: '16px' }} >
        Bases between and including the start and end positions will be removed.
      </DottedNote>
      <DottedNote style={{ marginTop: '12px' }} >
        Base numbering must be updated manually after removing a subsequence.
      </DottedNote>
    </PartialWidthContainer>
  );
}
