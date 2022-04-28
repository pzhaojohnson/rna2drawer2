import type { App } from 'App';
import { Base } from 'Draw/bases/Base';

import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';

import { TextInputField } from 'Forms/inputs/text/TextInputField';

import { SolidButton } from 'Forms/buttons/SolidButton';
import { ErrorMessage } from 'Forms/ErrorMessage';

import { DottedNote } from 'Forms/notes/DottedNote';

function CharacterField(
  props: {
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => void,
    onKeyUp: (event: React.KeyboardEvent<HTMLInputElement>) => void,
  },
) {
  return (
    <TextInputField
      label='Character'
      value={props.value}
      onChange={props.onChange}
      onBlur={props.onBlur}
      onKeyUp={props.onKeyUp}
      input={{ style: { width: '12px', textAlign: 'center' } }}
    />
  );
}

function SubmitButton(
  props: {
    onClick: () => void,
  },
) {
  return (
    <SolidButton
      text='Select'
      onClick={props.onClick}
      style={{ marginTop: '24px' }}
    />
  );
}

export type Props = {
  app: App;

  unmount: () => void;
  history: FormHistoryInterface;
}

let prevCharacter = 'A';

function constrainCharacter(c: string): string {

  // no extra whitespace
  c = c.trim();

  // limit to one character
  if (c.length > 1) {
    return c.charAt(0);
  } else {
    return c;
  }
}

export function EditBasesByCharacterForm(props: Props) {
  let [character, setCharacter] = useState(prevCharacter);

  let [errorMessage, setErrorMessage] = useState('');

  // should be incremented every time the error message is set
  // (to trigger error message animations)
  let [errorMessageKey, setErrorMessageKey] = useState(0);

  useEffect(() => {
    return () => { prevCharacter = character; }
  });

  return (
    <PartialWidthContainer
      unmount={props.unmount}
      history={props.history}
      title='Bases by Character'
      style={{ width: '348px' }}
    >
      <CharacterField
        value={character}
        onChange={event => setCharacter(event.target.value)}
        onBlur={() => setCharacter(constrainCharacter(character))}
        onKeyUp={event => {
          if (event.key.toLowerCase() == 'enter') {
            setCharacter(constrainCharacter(character));
          }
        }}
      />
      <SubmitButton
        onClick={() => {
          if (character.length == 0) {
            setErrorMessage('Specify a character.');
            setErrorMessageKey(errorMessageKey + 1);
            return;
          }

          let drawing = props.app.strictDrawing.drawing;
          let bases = drawing.bases().filter(b => b.text.text() == character);

          if (bases.length == 0) {
            setErrorMessage('No bases have the entered character.');
            setErrorMessageKey(errorMessageKey + 1);
            return;
          }

          props.unmount();
          let drawingInteraction = props.app.strictDrawingInteraction;
          drawingInteraction.currentTool = drawingInteraction.editingTool;
          drawingInteraction.editingTool.editingType = Base;
          drawingInteraction.editingTool.select(bases);
          drawingInteraction.editingTool.renderForm();
        }}
      />
      {!errorMessage.valueOf() ? null : (
        <ErrorMessage key={errorMessageKey} style={{ marginTop: '8px' }} >
          {errorMessage.valueOf()}
        </ErrorMessage>
      )}
      <DottedNote style={{ marginTop: '16px' }} >
        Bases with the entered character will be selected and may then be edited.
      </DottedNote>
      <DottedNote style={{ marginTop: '12px' }} >
        Is case-sensitive.
      </DottedNote>
    </PartialWidthContainer>
  );
}
