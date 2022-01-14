import * as React from 'react';
import { useState } from 'react';
import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import errorMessageStyles from 'Forms/ErrorMessage.css';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';
import { SolidButton } from 'Forms/buttons/SolidButton';
import { AppInterface as App } from 'AppInterface';

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

export function BasesByCharacter(props: Props) {
  let [character, setCharacter] = useState(prevCharacter);

  // use String object to rerender every time the error message is set
  let [errorMessage, setErrorMessage] = useState<String>(new String(''));

  return (
    <PartialWidthContainer
      unmount={props.unmount}
      history={props.history}
      title='Bases by Character'
      style={{ width: '348px' }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
        <input
          type='text'
          className={textFieldStyles.input}
          value={character}
          onChange={event => {
            if (event.target.value.trim() != character.trim()) {
              setErrorMessage(new String(''));
            }
            setCharacter(event.target.value);
          }}
          onBlur={() => setCharacter(constrainCharacter(character))}
          onKeyUp={event => {
            if (event.key.toLowerCase() == 'enter') {
              setCharacter(constrainCharacter(character));
            }
          }}
          style={{ width: '12px', textAlign: 'center' }}
        />
        <div style={{ marginLeft: '8px' }} >
          <p className={`${textFieldStyles.label} unselectable`} >
            Character
          </p>
        </div>
      </div>
      <div style={{ marginTop: '24px' }} >
        <SolidButton
          text='Select'
          onClick={() => {
            if (character.length == 0) {
              setErrorMessage(new String('Specify a character.'));
              return;
            }

            let drawing = props.app.strictDrawing.drawing;
            let positions: number[] = [];
            drawing.bases().forEach((b, i) => {
              let p = i + 1;
              if (b.text.text() == character) {
                positions.push(p);
              }
            });

            if (positions.length == 0) {
              setErrorMessage(new String('No bases have the entered character.'));
              return;
            }

            props.unmount();
            props.app.strictDrawingInteraction.startAnnotating();
            let annotatingMode = props.app.strictDrawingInteraction.annotatingMode;
            annotatingMode.clearSelection();
            annotatingMode.select(positions);
            annotatingMode.requestToRenderForm();

            prevCharacter = character;
          }}
        />
      </div>
      {!errorMessage.valueOf() ? null : (
        <p
          key={Math.random()}
          className={`${errorMessageStyles.errorMessage} ${errorMessageStyles.fadesIn} unselectable`}
          style={{ marginTop: '8px' }}
        >
          {errorMessage.valueOf()}
        </p>
      )}
      <div style={{ marginTop: '16px' }} >
        <p
          className='unselectable'
          style={{ fontSize: '12px', color: 'rgba(0,0,0,0.95)' }}
        >
          <span style={{ fontWeight: 600, color: 'rgba(0,0,0,1)' }} >Note:&nbsp;</span>
          Bases with the entered character will be selected and may then be edited.
        </p>
      </div>
      <div style={{ marginTop: '6px' }} >
        <p
          className='unselectable'
          style={{ fontSize: '12px', color: 'rgba(0,0,0,0.95)' }}
        >
          <span style={{ fontWeight: 600, color: 'rgba(0,0,0,1)' }} >Note:&nbsp;</span>
          Is case-sensitive.
        </p>
      </div>
    </PartialWidthContainer>
  );
}
