import * as React from 'react';
import { useState } from 'react';
import { AppInterface as App } from '../../../../AppInterface';
import { ClosableContainer } from '../../../containers/ClosableContainer';
import { TextField } from '../../../fields/text/TextField';
import { ErrorMessage } from '../../../ErrorMessage';
import { ActionButton } from '../../../buttons/ActionButton';

interface Props {
  app: App;
  close: () => void;
}

let lastSelected = 'A';

export function SelectBasesByCharacter(props: Props): React.ReactElement {
  let [character, setCharacter] = useState(lastSelected);
  let [errorMessage, setErrorMessage] = useState<string[]>([]);
  return (
    <ClosableContainer
      title={'Select Bases by Character'}
      close={props.close}
      contained={
        <div>
          <TextField
            name={'Character'}
            initialValue={character}
            set={s => setCharacter(s)}
          />
          <div style={{ marginTop: '18px' }} >
            {errorMessage.join('') ? <ErrorMessage message={errorMessage.join('')} /> : null}
          </div>
          <div style={{ marginTop: '6px' }} >
            <ActionButton
              text={'Select'}
              onClick={() => {
                let c = character.trim();
                if (c.length == 0) {
                  setErrorMessage(['No character entered.']);
                  return;
                } else if (c.length > 1) {
                  setErrorMessage(['Multiple characters entered.']);
                  return;
                }
                let ps = [] as number[];
                props.app.strictDrawing.drawing.forEachBase((b, p) => {
                  if (b.character == character) {
                    ps.push(p);
                  }
                });
                if (ps.length == 0) {
                  setErrorMessage(['No bases have the entered character.']);
                  return;
                }
                props.close();
                props.app.strictDrawingInteraction.startAnnotating();
                let annotatingMode = props.app.strictDrawingInteraction.annotatingMode;
                annotatingMode.clearSelection();
                annotatingMode.select(ps);
                annotatingMode.requestToRenderForm();
                lastSelected = character;
              }}
            />
          </div>
        </div>
      }
    />
  );
}
