import type { App } from 'App';

import { DisplayableSequenceRange } from 'Forms/edit/sequence/DisplayableSequenceRange';

import { splitDataNonempty } from './splitDataNonempty';
import { selectBasesWithValuesInRange } from './selectBasesWithValuesInRange';

import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';

import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';
import { FieldDescription } from 'Forms/inputs/labels/FieldDescription';

import { DataField } from './DataField';
import { StartPositionField } from './StartPositionField';
import { MinValueField } from './MinValueField';
import { MaxValueField } from './MaxValueField';

import { SelectButton } from './SelectButton';
import { ErrorMessage } from 'Forms/ErrorMessage';

import { DottedNote } from 'Forms/notes/DottedNote';

function DataFieldDescription() {
  return (
    <FieldDescription style={{ margin: '6px 0 0 18px' }} >
      ...a list of numbers (e.g., SHAPE reactivities)
    </FieldDescription>
  );
}

function StartPositionFieldDescription() {
  return (
    <FieldDescription style={{ margin: '6px 0 0 18px' }} >
      ...the sequence position where the data start
    </FieldDescription>
  );
}

function TrailingNotes() {
  return (
    <div style={{ margin: '18px 0 12px 0' }} >
      <DottedNote>
        Enter data for a set of consecutive bases in the drawing.
        (One value per base.)
      </DottedNote>
      <DottedNote style={{ marginTop: '8px' }} >
        Bases with values in the range of data to select
        will be selected and may then be edited.
      </DottedNote>
      <DottedNote style={{ marginTop: '8px' }} >
        The range of data to select is inclusive.
      </DottedNote>
      <DottedNote style={{ marginTop: '8px' }} >
        Come back to this form to select and edit bases
        with values in other ranges of data.
      </DottedNote>
    </div>
  );
}

export type Props = {
  app: App;

  unmount: () => void;
  history: FormHistoryInterface;
}

type Inputs = {
  data: string;

  // the position of the base that the data starts at
  startPosition: string;

  // bases with values in this range (inclusive) will be selected
  minValue: string;
  maxValue: string;
}

let prevInputs: Inputs = {
  data: [0.5, 1.25, 0.25, -0.25, 0.75, -0.1, 0.9, -0.6, 0.8, 1.75, 0.6].join('\n') + '\n',
  startPosition: '1',
  minValue: '0',
  maxValue: '1',
};

function formatData(data: string): string {
  let vs = splitDataNonempty(data);

  // one value per line
  let formattedData = vs.join('\n');

  // avoid a blank first line
  if (vs.length > 0) {
    formattedData += '\n'; // add trailing newline
  }

  return formattedData;
}

function constrainStartPosition(startPosition: string): string {
  let n = Number.parseFloat(startPosition);
  if (Number.isFinite(n)) {
    n = Math.floor(n); // make an integer
    return n.toString();
  } else {
    return startPosition.trim();
  }
}

function constrainMinValue(minValue: string): string {
  let n = Number.parseFloat(minValue);
  if (Number.isFinite(n)) {
    return n.toString();
  } else {
    return minValue.trim();
  }
}

function constrainMaxValue(maxValue: string): string {
  let n = Number.parseFloat(maxValue);
  if (Number.isFinite(n)) {
    return n.toString();
  } else {
    return maxValue.trim();
  }
}

function constrainInputs(inputs: Inputs): Inputs {
  let constrained: Inputs = {
    data: formatData(inputs.data),
    startPosition: constrainStartPosition(inputs.startPosition),
    minValue: constrainMinValue(inputs.minValue),
    maxValue: constrainMaxValue(inputs.maxValue),
  };
  let minValue = Number.parseFloat(constrained.minValue);
  let maxValue = Number.parseFloat(constrained.maxValue);
  if (Number.isFinite(minValue) && Number.isFinite(maxValue)) {
    if (minValue > maxValue) {
      constrained.minValue = maxValue.toString();
      constrained.maxValue = minValue.toString();
    }
  }
  return constrained;
}

export function EditBasesWithValuesInRangeForm(props: Props) {
  let seq = props.app.strictDrawing.layoutSequence();

  let [inputs, setInputs] = useState<Inputs>(prevInputs);

  let [errorMessage, setErrorMessage] = useState('');

  // to be incremented every time the error message is set
  // (to trigger error message animations)
  let [errorMessageKey, setErrorMessageKey] = useState(0);

  // remember inputs between mountings
  useEffect(() => {
    return () => { prevInputs = inputs; }
  });

  return (
    <PartialWidthContainer
      unmount={props.unmount}
      history={props.history}
      title='Bases by Data'
      style={{ width: '396px' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }} >
        <DataField
          value={inputs.data}
          onChange={event => setInputs({ ...inputs, data: event.target.value })}
          onBlur={() => setInputs(constrainInputs(inputs))}
        />
        <DataFieldDescription />
        <StartPositionField
          value={inputs.startPosition}
          onChange={event => setInputs({ ...inputs, startPosition: event.target.value })}
          onBlur={() => setInputs(constrainInputs(inputs))}
          onEnterKeyUp={() => setInputs(constrainInputs(inputs))}
        />
        <StartPositionFieldDescription />
        <DisplayableSequenceRange sequence={seq} style={{ margin: '6px 0 32px 3px' }} />
        <FieldLabel>Range of Data to Select:</FieldLabel>
        <MinValueField
          value={inputs.minValue}
          onChange={event => setInputs({ ...inputs, minValue: event.target.value })}
          onBlur={() => setInputs(constrainInputs(inputs))}
          onEnterKeyUp={() => setInputs(constrainInputs(inputs))}
        />
        <MaxValueField
          value={inputs.maxValue}
          onChange={event => setInputs({ ...inputs, maxValue: event.target.value })}
          onBlur={() => setInputs(constrainInputs(inputs))}
          onEnterKeyUp={() => setInputs(constrainInputs(inputs))}
        />
        <SelectButton
          onClick={() => {
            try {
              let app = props.app;
              selectBasesWithValuesInRange({ app, ...inputs });
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
      </div>
    </PartialWidthContainer>
  );
}
