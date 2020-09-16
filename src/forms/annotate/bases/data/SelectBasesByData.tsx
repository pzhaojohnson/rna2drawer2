import * as React from 'react';
import { useState } from 'react';
import { AppInterface as App } from '../../../../AppInterface';
import { ClosableContainer } from '../../../containers/ClosableContainer';
import { StartPositionField } from './StartPositionField';
import { DataField } from './DataField';
import { DataRangeField } from './DataRangeField';
import { ErrorMessage } from '../../../ErrorMessage';
import { ActionButton } from '../../../buttons/ActionButton';
import { positionsToSelect } from './positionsToSelect';

interface Props {
  app: App;
  close: () => void;
}

let lastEntered = {
  startPosition: 1,
  data: [0.5, 1.25, 0.25, -0.25, 0.75, -0.1, 0.9, -0.6, 0.8],
  dataRange: {
    min: 0,
    max: 1,
  }
};

export function SelectBasesByData(props: Props): React.ReactElement {
  let [startPosition, setStartPosition] = useState(lastEntered.startPosition);
  let [startPositionIsValid, setStartPositionIsValid] = useState(true);
  let [data, setData] = useState(lastEntered.data);
  let [dataIsValid, setDataIsValid] = useState(true);
  let [dataRange, setDataRange] = useState(lastEntered.dataRange);
  let [dataRangeIsValid, setDataRangeIsValid] = useState(true);
  let [errorMessage, setErrorMessage] = useState<string[]>([]);
  return (
    <ClosableContainer
      close={props.close}
      title={'Select Bases by Data'}
      contained={
        <div style={{ display: 'flex', flexDirection: 'column' }} >
          <StartPositionField
            initialValue={startPosition}
            onInput={() => setErrorMessage([])}
            onValidInput={() => setStartPositionIsValid(true)}
            onInvalidInput={() => setStartPositionIsValid(false)}
            set={sp => {
              setStartPosition(sp);
              lastEntered.startPosition = sp;
            }}
          />
          <div style={{ marginTop: '12px' }} >
            <DataField
              initialValue={data}
              onInput={() => setErrorMessage([])}
              onValidInput={() => setDataIsValid(true)}
              onInvalidInput={() => setDataIsValid(false)}
              set={d => {
                setData(d);
                lastEntered.data = d;
              }}
            />
          </div>
          <div style={{ marginTop: '16px' }} >
            <DataRangeField
              initialValue={dataRange}
              onInput={() => setErrorMessage([])}
              onValidInput={() => setDataRangeIsValid(true)}
              onInvalidInput={() => setDataRangeIsValid(false)}
              set={r => {
                setDataRange(r);
                lastEntered.dataRange = r;
              }}
            />
          </div>
          <div style={{ marginTop: errorMessage.join('') ? '12px' : '18px' }} >
            {errorMessage.join('') ? <ErrorMessage message={errorMessage.join('')} /> : null}
          </div>
          <div style={{ marginTop: '6px' }} >
            <ActionButton
              text={'Select'}
              onClick={() => {
                let ps = positionsToSelect(props.app.strictDrawing.drawing, {
                  startPosition: startPosition,
                  data: data,
                  dataRange: dataRange,
                });
                if (typeof ps == 'string') {
                  setErrorMessage([ps]);
                } else if (ps.length == 0) {
                  setErrorMessage(['No data in entered range.']);
                } else {
                  props.close();
                  props.app.strictDrawingInteraction.startAnnotating();
                  let annotatingMode = props.app.strictDrawingInteraction.annotatingMode;
                  annotatingMode.clearSelection();
                  annotatingMode.select(ps);
                  annotatingMode.requestToRenderForm();
                }
              }}
              disabled={!startPositionIsValid || !dataIsValid || !dataRangeIsValid}
            />
          </div>
          <p style={{ marginTop: '16px' }} >
            <b>Note:</b> This forms allows selecting bases in one range of data.
            Once selected, the bases can be annotated (e.g., colored and circled).
          </p>
          <p style={{ marginTop: '6px' }} >
            To select and annotate bases in another range of data, come back to this form and enter the other range of data.
          </p>
        </div>
      }
    />
  );
}
