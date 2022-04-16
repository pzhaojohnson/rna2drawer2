import * as React from 'react';
import { useState, useEffect } from 'react';
import formStyles from './InsertSubsequence.css';
import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import textFieldStyles from 'Forms/inputs/text/TextField.css';
import { Checkbox } from 'Forms/inputs/checkbox/Checkbox';
import checkboxFieldStyles from 'Forms/inputs/checkbox/CheckboxField.css';
import errorMessageStyles from 'Forms/ErrorMessage.css';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';
import { SolidButton } from 'Forms/buttons/SolidButton';
import type { App } from 'App';
import { numberingOffset } from 'Draw/sequences/numberingOffset';
import { atIndex } from 'Array/at';
import { isBlank } from 'Parse/isBlank';
import { cannotInsert, insert } from './insert';
import { ApplySubstructureForm } from 'Forms/edit/substructures/ApplySubstructureForm';

export type Props = {
  app: App;

  unmount: () => void;
  history: FormHistoryInterface;
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
      className={formStyles.applySubstructureLink}
      onClick={props.onClick}
    >
      Have a substructure too?
    </p>
  );
}

function ApplySubstructureNote() {
  return (
    <p className='unselectable' style={{ marginTop: '8px' }} >
      <span style={{ fontWeight: 600, color: 'black' }} >
        Note:&nbsp;
      </span>
      A substructure can be applied after inserting a subsequence.
    </p>
  );
}

export function InsertSubsequence(props: Props) {
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
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }} >
        <p className='unselectable' style={{ fontSize: '12px', color: 'rgba(0,0,0,0.95)' }} >
          Subsequence
        </p>
        <textarea
          value={inputs.subsequence}
          onChange={event => {
            if (event.target.value.trim() != inputs.subsequence.trim()) {
              setErrorMessage(new String(''));
            }
            setInputs({ ...inputs, subsequence: event.target.value });
          }}
          onBlur={() => setInputs(constrainInputs(inputs))}
          rows={9}
          placeholder='...an RNA or DNA subsequence "CUGCCA"'
          style={{ marginTop: '4px' }}
        />
      </div>
      <div style={{ margin: '8px 0px 0px 8px' }} >
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
          <Checkbox
            checked={inputs.ignoreNumbers}
            onChange={event => {
              setErrorMessage(new String(''));
              setInputs({ ...inputs, ignoreNumbers: event.target.checked });
            }}
          />
          <div style={{ marginLeft: '6px' }} >
            <p className={`${checkboxFieldStyles.label} unselectable`} >
              Ignore Numbers
            </p>
          </div>
        </div>
        <div style={{ marginTop: '6px' }} >
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
            <Checkbox
              checked={inputs.ignoreNonAUGCTLetters}
              onChange={event => {
                setErrorMessage(new String(''));
                setInputs({ ...inputs, ignoreNonAUGCTLetters: event.target.checked });
              }}
            />
            <div style={{ marginLeft: '6px' }} >
              <p className={`${checkboxFieldStyles.label} unselectable`} >
                Ignore Non-AUGCT Letters
              </p>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '6px' }} >
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
            <Checkbox
              checked={inputs.ignoreNonAlphanumerics}
              onChange={event => {
                setErrorMessage(new String(''));
                setInputs({ ...inputs, ignoreNonAlphanumerics: event.target.checked });
              }}
            />
            <div style={{ marginLeft: '6px' }} >
              <p className={`${checkboxFieldStyles.label} unselectable`} >
                Ignore Non-Alphanumerics
              </p>
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: '24px' }} >
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
          <input
            type='text'
            className={textFieldStyles.input}
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
            style={{ width: '48px' }}
          />
          <div style={{ marginLeft: '8px' }} >
            <p className={`${textFieldStyles.label} unselectable`} >
              Position to Insert At
            </p>
          </div>
        </div>
      </div>
      {!(seq && seq.length == 1) ? null : (
        <div style={{ marginTop: '8px' }} >
          <p className='unselectable' style={{ fontSize: '12px', color: 'rgba(0,0,0,0.95)' }} >
            <span style={{ fontWeight: 600, color: 'rgb(0,0,0)' }} >
              {no + 1}&nbsp;
            </span>
            is the first and last position of the sequence.
          </p>
        </div>
      )}
      {!(seq && seq.length > 1) ? null : (
        <div style={{ marginTop: '8px' }} >
          {no == 0 ? null : (
            <div style={{ marginBottom: '4px' }} >
              <p className='unselectable' style={{ fontSize: '12px', color: 'rgba(0,0,0,0.95)' }} >
                <span style={{ fontWeight: 600, color: 'rgba(0,0,0,1)' }} >
                  {no + 1}&nbsp;
                </span>
                is the first position of the sequence.
              </p>
            </div>
          )}
          <p className='unselectable' style={{ fontSize: '12px', color: 'rgba(0,0,0,0.95)' }} >
            <span style={{ fontWeight: 600, color: 'rgba(0,0,0,1)' }} >
              {seq.length + no}&nbsp;
            </span>
            is the last position of the sequence.
          </p>
        </div>
      )}
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
              props.unmount();
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
        <p
          key={Math.random()}
          className={`${errorMessageStyles.errorMessage} ${errorMessageStyles.fadesIn} unselectable`}
          style={{ marginTop: '6px' }}
        >
          {errorMessage.valueOf()}
        </p>
      )}
      <div style={{ marginTop: '18px' }} >
        <p className='unselectable' style={{ fontSize: '12px', color: 'rgba(0,0,0,0.95)' }} >
          <span style={{ fontWeight: 600, color: 'rgba(0,0,0,1)' }} >Note:&nbsp;</span>
          The subsequence will be inserted beginning at the specified position.
        </p>
      </div>
      <ApplySubstructureNote />
      <div style={{ marginTop: '8px' }} >
        <p className='unselectable' style={{ fontSize: '12px', color: 'rgba(0,0,0,0.95)' }} >
          <span style={{ fontWeight: 600, color: 'rgba(0,0,0,1)' }} >Note:&nbsp;</span>
          Base numbering must be updated manually after inserting a subsequence.
        </p>
      </div>
    </PartialWidthContainer>
  );
}
