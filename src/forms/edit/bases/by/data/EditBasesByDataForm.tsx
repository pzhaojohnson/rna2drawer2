import type { App } from 'App';

import { Base } from 'Draw/bases/Base';

import { numberingOffset } from 'Draw/sequences/numberingOffset';

import { atIndex } from 'Array/at';
import { isBlank } from 'Parse/isBlank';

import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';

import textFieldStyles from 'Forms/inputs/text/TextField.css';
import errorMessageStyles from 'Forms/ErrorMessage.css';

import { SolidButton } from 'Forms/buttons/SolidButton';

import { DottedNote } from 'Forms/notes/DottedNote';

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
  min: string;
  max: string;
}

let prevInputs: Inputs = {
  data: [0.5, 1.25, 0.25, -0.25, 0.75, -0.1, 0.9, -0.6, 0.8, 1.75, 0.6].join('\n'),
  startPosition: '1',
  min: '0',
  max: '1',
};

// splits on whitespace, commas and semicolons
function splitData(data: string): string[] {
  return data.split(/[\s|,|;]+/);
}

function formatData(data: string): string {
  let vs = splitData(data);

  // remove empty strings
  vs = vs.filter(v => v.length > 0);

  // one value per line
  return vs.join('\n');
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

function constrainMin(min: string): string {
  let n = Number.parseFloat(min);
  if (Number.isFinite(n)) {
    return n.toString();
  } else {
    return min.trim();
  }
}

function constrainMax(max: string): string {
  let n = Number.parseFloat(max);
  if (Number.isFinite(n)) {
    return n.toString();
  } else {
    return max.trim();
  }
}

function constrainInputs(inputs: Inputs): Inputs {
  let constrained: Inputs = {
    data: formatData(inputs.data),
    startPosition: constrainStartPosition(inputs.startPosition),
    min: constrainMin(inputs.min),
    max: constrainMax(inputs.max),
  };
  let min = Number.parseFloat(constrained.min);
  let max = Number.parseFloat(constrained.max);
  if (Number.isFinite(min) && Number.isFinite(max)) {
    if (min > max) {
      constrained.min = max.toString();
      constrained.max = min.toString();
    }
  }
  return constrained;
}

export function EditBasesByDataForm(props: Props) {
  let drawing = props.app.strictDrawing.drawing;
  if (drawing.sequences.length == 0) {
    console.error('Drawing has no sequences.');
  } else if (drawing.sequences.length > 1) {
    console.error('Unable to handle multiple sequences.');
  }
  let seq = atIndex(drawing.sequences, 0);

  let [inputs, setInputs] = useState<Inputs>(prevInputs);

  // use String object to rerender every time the error message is set
  let [errorMessage, setErrorMessage] = useState<String>(new String(''));

  // remember inputs between mountings
  useEffect(() => {
    return () => { prevInputs = inputs; }
  });

  function SequenceBounds() {
    let no = !seq ? 0 : (numberingOffset(seq) ?? 0);
    return !seq ? null : (
      <div style={{ marginTop: '6px' }} >
        {seq.length != 1 ? null : (
          <p className='unselectable' style={{ fontSize: '12px', color: 'rgba(0,0,0,0.95)' }} >
            <span style={{ fontWeight: 600, color: 'rgb(0,0,0)' }} >
              {no + 1}&nbsp;
            </span>
            is the first and last position of the sequence.
          </p>
        )}
        {seq.length <= 1 ? null : (
          <div>
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
      </div>
    );
  }

  return (
    <PartialWidthContainer
      unmount={props.unmount}
      history={props.history}
      title='Bases by Data'
      style={{ width: '386px' }}
    >
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }} >
        <p className='unselectable' style={{ fontSize: '12px', color: 'rgba(0,0,0,0.95)' }} >
          Data
        </p>
        <textarea
          value={inputs.data}
          onChange={event => {
            if (event.target.value.trim() != inputs.data.trim()) {
              setErrorMessage(new String(''));
            }
            setInputs({ ...inputs, data: event.target.value });
          }}
          onBlur={() => setInputs(constrainInputs(inputs))}
          rows={12}
          placeholder='...delimit by whitespace, commas and semicolons'
          spellCheck={false}
          style={{ marginTop: '4px' }}
        />
        <div style={{ marginTop: '4px' }} >
          <p className='unselectable' style={{ fontSize: '14px', fontStyle: 'italic', color: 'rgb(115 115 115)' }} >
            A list of numbers (e.g., SHAPE reactivities).
          </p>
        </div>
      </div>
      <div style={{ marginTop: '20px' }} >
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
          <input
            type='text'
            className={textFieldStyles.input}
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
            style={{ width: '48px' }}
          />
          <div style={{ marginLeft: '8px' }} >
            <p className={`${textFieldStyles.label} unselectable`} >
              Start Position
            </p>
          </div>
        </div>
        <div style={{ marginTop: '4px' }} >
          <p className='unselectable' style={{ fontSize: '14px', fontStyle: 'italic', color: 'rgb(115 115 115)' }} >
            The position of the base where the data starts.
          </p>
        </div>
        <SequenceBounds />
      </div>
      <div style={{ marginTop: '20px' }} >
        <p className='unselectable' style={{ fontSize: '12px', color: 'rgba(0,0,0,0.95)' }} >
          Range to Select
        </p>
        <div style={{ margin: '6px 0px 0px 8px' }} >
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
            <input
              type='text'
              className={textFieldStyles.input}
              value={inputs.min}
              onChange={event => {
                if (event.target.value.trim() != inputs.min.trim()) {
                  setErrorMessage(new String(''));
                }
                setInputs({ ...inputs, min: event.target.value });
              }}
              onBlur={() => setInputs(constrainInputs(inputs))}
              onKeyUp={event => {
                if (event.key.toLowerCase() == 'enter') {
                  setInputs(constrainInputs(inputs));
                }
              }}
              style={{ width: '42px' }}
            />
            <div style={{ marginLeft: '8px' }} >
              <p className={`${textFieldStyles.label} unselectable`} >
                Minimum Value
              </p>
            </div>
          </div>
          <div style={{ marginTop: '8px' }} >
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
              <input
                type='text'
                className={textFieldStyles.input}
                value={inputs.max}
                onChange={event => {
                  if (event.target.value.trim() != inputs.max.trim()) {
                    setErrorMessage(new String(''));
                  }
                  setInputs({ ...inputs, max: event.target.value });
                }}
                onBlur={() => setInputs(constrainInputs(inputs))}
                onKeyUp={event => {
                  if (event.key.toLowerCase() == 'enter') {
                    setInputs(constrainInputs(inputs));
                  }
                }}
                style={{ width: '42px' }}
              />
              <div style={{ marginLeft: '8px' }} >
                <p className={`${textFieldStyles.label} unselectable`} >
                  Maximum Value
                </p>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '4px' }} >
          <p className='unselectable' style={{ fontSize: '14px', fontStyle: 'italic', color: 'rgb(115 115 115)' }} >
            Bases with values in the range will be selected.
          </p>
        </div>
      </div>
      <div style={{ marginTop: '28px' }} >
        <SolidButton
          text='Select'
          onClick={() => {
            let vs = splitData(inputs.data);
            vs = vs.filter(v => v.length > 0); // remove empty strings
            let data = vs.map(v => Number.parseFloat(v));

            if (data.length == 0) {
              setErrorMessage(new String('No data entered.'));
              return;
            } else if (data.some(v => !Number.isFinite(v))) {
              setErrorMessage(new String('All data values must be numbers.'));
              return;
            }

            if (isBlank(inputs.startPosition)) {
              setErrorMessage(new String('Specify a start position.'));
              return;
            }
            let startPosition = Number.parseFloat(inputs.startPosition);
            if (!Number.isFinite(startPosition)) {
              setErrorMessage(new String('Start position must be a number.'));
              return;
            } else if (!Number.isInteger(startPosition)) {
              setErrorMessage(new String('Start position must be an integer.'));
              return;
            }

            if (isBlank(inputs.min)) {
              setErrorMessage(new String('Specify a minimum value to select.'));
              return;
            }
            let min = Number.parseFloat(inputs.min);
            if (!Number.isFinite(min)) {
              setErrorMessage(new String('Minimum value to select must be a number.'));
              return;
            }

            if (isBlank(inputs.max)) {
              setErrorMessage(new String('Specify a maximum value to select.'));
              return;
            }
            let max = Number.parseFloat(inputs.max);
            if (!Number.isFinite(max)) {
              setErrorMessage(new String('Maximum value to select must be a number.'));
              return;
            }

            let drawing = props.app.strictDrawing.drawing;
            if (drawing.sequences.length == 0 || drawing.bases().length == 0) {
              setErrorMessage('Drawing has no bases.');
              return;
            }
            let seq = drawing.sequences[0];

            // account for numbering offset
            let no = numberingOffset(seq) ?? 0;
            startPosition -= no;

            if (startPosition < 1 || startPosition > seq.length) {
              setErrorMessage(new String('Start position is out of range.'));
              return;
            }

            if (startPosition + data.length - 1 > seq.length) {
              setErrorMessage(new String('Data go beyond the end of the sequence.'));
              return;
            }

            let positions: number[] = [];
            data.forEach((v, i) => {
              if (v >= min && v <= max) {
                positions.push(startPosition + i);
              }
            });

            if (positions.length == 0) {
              setErrorMessage(new String('No data values in the entered range.'));
              return;
            }

            // all positions should be in the sequence range given the checks above
            let bases = positions.map(p => seq.atPosition(p)).filter(
              (b): b is Base => b instanceof Base
            );

            // close the form and select bases
            props.unmount();
            let drawingInteraction = props.app.strictDrawingInteraction;
            drawingInteraction.currentTool = drawingInteraction.editingTool;
            drawingInteraction.editingTool.editingType = Base;
            drawingInteraction.editingTool.select(bases);
            drawingInteraction.editingTool.renderForm();
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
      <DottedNote style={{ marginTop: '12px' }} >
        Bases with values in the entered range will be selected and may then be edited.
      </DottedNote>
      <DottedNote style={{ margin: '6px 0 8px 0' }} >
        The range is inclusive.
      </DottedNote>
    </PartialWidthContainer>
  );
}