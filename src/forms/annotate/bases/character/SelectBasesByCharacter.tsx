import * as React from 'react';
import { useState } from 'react';
import { AppInterface as App } from '../../../../AppInterface';
import { ClosableContainer } from '../../../containers/ClosableContainer';
import { CharacterField } from './CharacterField';
import { ErrorMessage } from '../../../ErrorMessage';
import { ActionButton } from '../../../buttons/ActionButton';
import { positionsWithCharacter } from './positionsWithCharacter';

interface Props {
  app: App;
  close: () => void;
}

let lastEntered = 'A';

export function SelectBasesByCharacter(props: Props): React.ReactElement {
  let [character, setCharacter] = useState(lastEntered);
  let [inputIsValid, setInputIsValid] = useState(true);
  let [errorMessage, setErrorMessage] = useState<string[]>([]);
  return (
    <ClosableContainer
      title={'Select Bases by Character'}
      close={props.close}
      contained={
        <div>
          <CharacterField
            initialValue={character}
            onInput={() => setErrorMessage([])}
            onValidInput={() => setInputIsValid(true)}
            onInvalidInput={() => setInputIsValid(false)}
            set={c => {
              setCharacter(c);
              lastEntered = c;
            }}
          />
          <div style={{ marginTop: errorMessage.join('') ? '12px' : '18px' }} >
            {errorMessage.join('') ? <ErrorMessage message={errorMessage.join('')} /> : null}
          </div>
          <div style={{ marginTop: '6px' }} >
            <ActionButton
              text={'Select'}
              onClick={() => {
                let drawing = props.app.strictDrawing.drawing;
                let ps = positionsWithCharacter(drawing, character);
                if (ps.length == 0) {
                  setErrorMessage(['No bases have the entered character.']);
                } else {
                  props.close();
                  props.app.strictDrawingInteraction.startAnnotating();
                  let annotatingMode = props.app.strictDrawingInteraction.annotatingMode;
                  annotatingMode.clearSelection();
                  annotatingMode.select(ps);
                  annotatingMode.requestToRenderForm();
                }
              }}
              disabled={!inputIsValid}
            />
          </div>
          <p style={{ marginTop: '16px' }} >
            <span style={{ fontWeight: 600}} >Note:&nbsp;</span>
            Once selected, bases can be edited (e.g., colored and circled).
          </p>
        </div>
      }
    />
  );
}
