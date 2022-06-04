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
import { TextInputField } from 'Forms/inputs/text/TextInputField';
import { FieldDescription } from 'Forms/inputs/labels/FieldDescription';

import { SolidButton } from 'Forms/buttons/SolidButton';
import { ErrorMessage } from 'Forms/ErrorMessage';

import { DottedNote } from 'Forms/notes/DottedNote';

function TrailingNotes() {
  return (
    <div style={{ margin: '16px 0 12px 0' }} >
      <DottedNote>
        Enter data for a set of consecutive bases in the drawing.
        (One value per base.)
      </DottedNote>
      <DottedNote style={{ marginTop: '8px' }} >
        Bases with values in the specified range of data to select
        will be selected and may then be edited.
      </DottedNote>
      <DottedNote style={{ marginTop: '8px' }} >
        The range of data to select is inclusive.
      </DottedNote>
      <DottedNote style={{ marginTop: '8px' }} >
        Come back to this form to select bases with values
        in other ranges of data.
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
  data: [0.5, 1.25, 0.25, -0.25, 0.75, -0.1, 0.9, -0.6, 0.8, 1.75].join('\n') + '\n',
  startPosition: '1',
  minValue: '0',
  maxValue: '1',
};

function formatData(data: string): string {
  let vs = splitDataNonempty(data);

  // one value per line and a trailing newline
  return vs.join('\n') + '\n';
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

  // use String object to rerender every time the error message is set
  let [errorMessage, setErrorMessage] = useState<String>(new String(''));

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
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }} >
        <FieldLabel style={{ display: 'flex', flexDirection: 'column', cursor: 'text' }} >
          Data
          <textarea
            value={inputs.data}
            onChange={event => {
              if (event.target.value.trim() != inputs.data.trim()) {
                setErrorMessage(new String(''));
              }
              setInputs({ ...inputs, data: event.target.value });
            }}
            onBlur={() => setInputs(constrainInputs(inputs))}
            rows={11}
            placeholder='...delimit by whitespace, commas and semicolons'
            spellCheck={false}
            style={{ marginTop: '4px' }}
          />
        </FieldLabel>
        <FieldDescription style={{ margin: '6px 0 0 16px' }} >
          ...a list of numbers (e.g., SHAPE reactivities)
        </FieldDescription>
      </div>
      <div style={{ marginTop: '24px' }} >
        <TextInputField
          label='Start Position of Data'
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
          input={{ style: { width: '8ch' } }}
        />
        <FieldDescription style={{ margin: '6px 0 0 16px' }} >
          ...the sequence position where the data start
        </FieldDescription>
        <DisplayableSequenceRange sequence={seq} style={{ margin: '6px 0 0 3px' }} />
      </div>
      <div style={{ marginTop: '24px' }} >
        <FieldLabel>Range of Data to Select:</FieldLabel>
        <div style={{ margin: '8px 0px 0px 8px' }} >
          <TextInputField
            label='Minimum Value'
            value={inputs.minValue}
            onChange={event => {
              if (event.target.value.trim() != inputs.minValue.trim()) {
                setErrorMessage(new String(''));
              }
              setInputs({ ...inputs, minValue: event.target.value });
            }}
            onBlur={() => setInputs(constrainInputs(inputs))}
            onKeyUp={event => {
              if (event.key.toLowerCase() == 'enter') {
                setInputs(constrainInputs(inputs));
              }
            }}
            input={{ style: { width: '7ch' } }}
          />
          <TextInputField
            label='Maximum Value'
            value={inputs.maxValue}
            onChange={event => {
              if (event.target.value.trim() != inputs.maxValue.trim()) {
                setErrorMessage(new String(''));
              }
              setInputs({ ...inputs, maxValue: event.target.value });
            }}
            onBlur={() => setInputs(constrainInputs(inputs))}
            onKeyUp={event => {
              if (event.key.toLowerCase() == 'enter') {
                setInputs(constrainInputs(inputs));
              }
            }}
            input={{ style: { width: '7ch' } }}
            style={{ marginTop: '8px' }}
          />
        </div>
      </div>
      <div style={{ marginTop: '32px' }} >
        <SolidButton
          text='Select'
          onClick={() => {
            try {
              let app = props.app;
              selectBasesWithValuesInRange({ app, ...inputs });
            } catch (error) {
              setErrorMessage(new String(
                error instanceof Error ? error.message : error
              ));
            }
          }}
        />
      </div>
      {!errorMessage.valueOf() ? null : (
        <ErrorMessage key={Math.random()} style={{ marginTop: '6px' }} >
          {errorMessage.valueOf()}
        </ErrorMessage>
      )}
      <TrailingNotes />
    </PartialWidthContainer>
  );
}
