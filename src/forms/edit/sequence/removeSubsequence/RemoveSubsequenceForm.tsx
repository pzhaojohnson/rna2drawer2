import * as React from 'react';
import { useState, useEffect } from 'react';
import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import { TextInputField } from 'Forms/inputs/text/TextInputField';
import { DisplayableSequenceRange } from 'Forms/edit/sequence/DisplayableSequenceRange';
import errorMessageStyles from 'Forms/ErrorMessage.css';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';
import { SolidButton } from 'Forms/buttons/SolidButton';
import { DottedNote } from 'Forms/notes/DottedNote';
import type { App } from 'App';
import { numberingOffset } from 'Draw/sequences/numberingOffset';
import { atIndex } from 'Array/at';
import { isBlank } from 'Parse/isBlank';
import { cannotRemove, remove } from './remove';

export type Props = {
  app: App;

  unmount: () => void;
  history: FormHistoryInterface;
}

type Inputs = {
  // start and end positions (inclusive) of the subsequence to remove
  startPosition: string;
  endPosition: string;
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
  let constrained: Inputs = {
    startPosition: constrainPositionInput(inputs.startPosition),
    endPosition: constrainPositionInput(inputs.endPosition),
  };

  // swap if start position is greater than end position
  let startPosition = Number.parseFloat(constrained.startPosition);
  let endPosition = Number.parseFloat(constrained.endPosition);
  if (Number.isFinite(startPosition) && Number.isFinite(endPosition)) {
    if (startPosition > endPosition) {
      constrained.startPosition = endPosition.toString();
      constrained.endPosition = startPosition.toString();
    }
  }

  return constrained;
}

let prevInputs: Inputs | undefined = undefined;

export function RemoveSubsequenceForm(props: Props) {
  let drawing = props.app.strictDrawing.drawing;

  if (drawing.sequences.length > 1) {
    console.error('Unable to remove subsequences from multiple sequences.');
  }

  let seq = atIndex(drawing.sequences, 0);
  let no = !seq ? 0 : (numberingOffset(seq) ?? 0);

  let [inputs, setInputs] = useState<Inputs>(prevInputs ?? {
    startPosition: (1 + no).toString(),
    endPosition: (1 + no).toString(),
  });

  // use String object for fade in animation every time the error message is set
  let [errorMessage, setErrorMessage] = useState<String>(new String(''));

  // remember inputs
  useEffect(() => {
    return () => { prevInputs = { ...inputs }; };
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
          value={inputs.startPosition}
          onChange={event => {
            if (event.target.value.trim() != inputs.startPosition.trim()) {
              setErrorMessage(new String(''));
            }
            setInputs({ ...inputs, startPosition: event.target.value });
          }}
          onBlur={() => setInputs(constrainInputs(inputs))}
          onKeyUp={event => {
            if (event.key.toLowerCase() == 'enter') {
              setInputs(constrainInputs(inputs));
            }
          }}
          input={{ style: { width: '48px' } }}
          style={{ alignSelf: 'flex-start' }}
        />
        <TextInputField
          label='End Position'
          value={inputs.endPosition}
          onChange={event => {
            if (event.target.value.trim() != inputs.endPosition.trim()) {
              setErrorMessage(new String(''));
            }
            setInputs({ ...inputs, endPosition: event.target.value });
          }}
          onBlur={() => setInputs(constrainInputs(inputs))}
          onKeyUp={event => {
            if (event.key.toLowerCase() == 'enter') {
              setInputs(constrainInputs(inputs));
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
            if (isBlank(inputs.startPosition)) {
              setErrorMessage(new String('Specify a start position.'));
              return;
            } else if (isBlank(inputs.endPosition)) {
              setErrorMessage(new String('Specify an end position.'));
              return;
            }

            let startPosition = Number.parseFloat(inputs.startPosition);
            let endPosition = Number.parseFloat(inputs.endPosition);

            if (!Number.isFinite(startPosition)) {
              setErrorMessage(new String('Start position must be a number.'));
              return;
            } else if (!Number.isFinite(endPosition)) {
              setErrorMessage(new String('End position must be a number.'));
              return;
            }

            if (!Number.isInteger(startPosition)) {
              setErrorMessage(new String('Start position must be an integer.'));
              return;
            } else if (!Number.isInteger(endPosition)) {
              setErrorMessage(new String('End position must be an integer.'));
              return;
            }

            let message = cannotRemove(props.app.strictDrawing, { start: startPosition, end: endPosition });
            if (message) {
              setErrorMessage(new String(message));
              return;
            }

            // remove the subsequence
            props.unmount();
            props.app.pushUndo();
            remove(props.app.strictDrawing, { start: startPosition, end: endPosition });
            props.app.refresh();
          }}
        />
      </div>
      {!errorMessage.valueOf() ? null : (
        <p
          key={Math.random()}
          className={`${errorMessageStyles.errorMessage} ${errorMessageStyles.fadesIn} unselectable`}
          style={{ marginTop: '6px' }}
        >
          {errorMessage.valueOf()}
        </p>
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
