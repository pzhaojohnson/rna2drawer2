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
import { TextInputField } from 'Forms/inputs/text/TextInputField';
import { DisplayableSequenceRange } from 'Forms/edit/sequence/DisplayableSequenceRange';
import { SolidButton } from 'Forms/buttons/SolidButton';
import { ErrorMessage as _ErrorMessage } from 'Forms/ErrorMessage';
import { DottedNote } from 'Forms/notes/DottedNote';

import { ApplySubstructureForm } from 'Forms/edit/substructures/ApplySubstructureForm';

import { isBlank } from 'Parse/isBlank';
import { cannotInsert, insert } from './insert';

function InsertPositionField(
  props: {
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => void,
    onKeyUp: (event: React.KeyboardEvent<HTMLInputElement>) => void,
  },
) {
  return (
    <TextInputField
      label='Position to Insert At'
      value={props.value}
      onChange={props.onChange}
      onBlur={props.onBlur}
      onKeyUp={props.onKeyUp}
      input={{ style: { width: '48px' } }}
      style={{ marginTop: '24px', alignSelf: 'start' }}
    />
  );
}

function ErrorMessage(
  props: {
    textContent?: string,
  },
) {
  return (
    <div style={{ marginTop: '6px' }} >
      <_ErrorMessage
        message={props.textContent}
      />
    </div>
  );
}

function ExplanatoryNote() {
  return (
    <div style={{ marginTop: '18px' }} >
      <DottedNote>
        The subsequence will be inserted beginning at the specified position.
      </DottedNote>
    </div>
  );
}

function ApplySubstructureNote() {
  return (
    <div style={{ marginTop: '8px' }} >
      <DottedNote>
        A substructure can be applied after inserting a subsequence.
      </DottedNote>
    </div>
  );
}

function BaseNumberingNote() {
  return (
    <div style={{ marginTop: '8px' }} >
      <DottedNote>
        Base numbering must be updated manually after inserting a subsequence.
      </DottedNote>
    </div>
  );
}

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

function ApplySubstructureLink(
  props: {
    onClick: () => void,
  },
) {
  return (
    <p
      className={styles.applySubstructureLink}
      onClick={props.onClick}
    >
      Have a substructure too?
    </p>
  );
}

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
      title='Insert Subsequence'
      style={{ width: '372px' }}
    >
      <SubsequenceField
        value={inputs.subsequence}
        onChange={event => {
          if (event.target.value.trim() != inputs.subsequence.trim()) {
            setErrorMessage(new String(''));
          }
          setInputs({ ...inputs, subsequence: event.target.value });
        }}
        onBlur={() => setInputs(constrainInputs(inputs))}
      />
      <div style={{ margin: '8px 0px 0px 8px', display: 'flex', flexDirection: 'column' }} >
        <CheckboxField
          label='Ignore Numbers'
          checked={inputs.ignoreNumbers}
          onChange={event => {
            setErrorMessage(new String(''));
            setInputs({ ...inputs, ignoreNumbers: event.target.checked });
          }}
          style={{ alignSelf: 'start' }}
        />
        <div style={{ height: '6px' }} />
        <CheckboxField
          label='Ignore Non-AUGCT Letters'
          checked={inputs.ignoreNonAUGCTLetters}
          onChange={event => {
            setErrorMessage(new String(''));
            setInputs({ ...inputs, ignoreNonAUGCTLetters: event.target.checked });
          }}
          style={{ alignSelf: 'start' }}
        />
        <div style={{ height: '6px' }} />
        <CheckboxField
          label='Ignore Non-Alphanumerics'
          checked={inputs.ignoreNonAlphanumerics}
          onChange={event => {
            setErrorMessage(new String(''));
            setInputs({ ...inputs, ignoreNonAlphanumerics: event.target.checked });
          }}
          style={{ alignSelf: 'start' }}
        />
      </div>
      <InsertPositionField
        value={inputs.positionToInsertAt}
        onChange={event => {
          if (event.target.value.trim() != inputs.positionToInsertAt.trim()) {
            setErrorMessage(new String(''));
          }
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
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
          <SolidButton
            text='Insert'
            onClick={() => {
              if (isBlank(inputs.positionToInsertAt)) {
                setErrorMessage(new String('Specify a position to insert at.'));
                return;
              }

              let positionToInsertAt = Number.parseFloat(inputs.positionToInsertAt);

              if (!Number.isFinite(positionToInsertAt)) {
                setErrorMessage(new String('Position to insert at must be a number.'));
                return;
              } else if (!Number.isInteger(positionToInsertAt)) {
                setErrorMessage(new String('Position to insert at must be an integer.'));
                return;
              }

              let values = {
                subsequence: inputs.subsequence,
                insertPosition: positionToInsertAt,
                ignoreNumbers: inputs.ignoreNumbers,
                ignoreNonAugctLetters: inputs.ignoreNonAUGCTLetters,
                ignoreNonAlphanumerics: inputs.ignoreNonAlphanumerics,
              };

              let message = cannotInsert(props.app.strictDrawing, values);
              if (message) {
                setErrorMessage(new String(message));
                return;
              }

              // insert the subsequence
              props.app.pushUndo();
              insert(props.app.strictDrawing, values);
              props.app.refresh();
            }}
          />
          <ApplySubstructureLink
            onClick={() => {
              props.app.formContainer.renderForm(formProps => (
                <ApplySubstructureForm
                  {...formProps}
                  app={props.app}
                  substructure=''
                  startPosition={inputs.positionToInsertAt ? inputs.positionToInsertAt : undefined}
                />
              ));
            }}
          />
        </div>
      </div>
      {!errorMessage.valueOf() ? null : (
        <ErrorMessage textContent={errorMessage.valueOf()} />
      )}
      <ExplanatoryNote />
      <ApplySubstructureNote />
      <BaseNumberingNote />
    </PartialWidthContainer>
  );
}
