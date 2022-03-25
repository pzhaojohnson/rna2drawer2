import * as React from 'react';
import { useState, useEffect } from 'react';
import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import errorMessageStyles from 'Forms/ErrorMessage.css';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';
import { SolidButton } from 'Forms/buttons/SolidButton';

import type { App } from 'App';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import { atPosition } from 'Array/at';
import { isBlank } from 'Parse/isBlank';
import { interpretNumber } from 'Draw/svg/interpretNumber';
import { round } from 'Math/round';
import { pointsToPixels } from 'Export/units'
import { exportDrawing } from 'Export/export';

// returns undefined if the font size of the base cannot be parsed
function fontSize(b: Base): number | undefined {
  let n = interpretNumber(b.text.attr('font-size'));
  if (n) {
    return n.convert('px').valueOf();
  }
}

type Inputs = {
  fontSizeOfBasesToExport: string;
}

let prevInputs: Inputs = {
  fontSizeOfBasesToExport: '6',
};

function constrainFontSizeInput(value: string): string {
  let n = Number.parseFloat(value);
  if (Number.isFinite(n)) {
    n = round(n, 1); // match PowerPoint font size precision
    return n.toString();
  } else {
    return value.trim();
  }
}

function constrainInputs(inputs: Inputs): Inputs {
  return {
    fontSizeOfBasesToExport: constrainFontSizeInput(inputs.fontSizeOfBasesToExport),
  };
}

export type Props = {
  app: App;

  // the format to export the drawing in
  format: 'svg' | 'pptx';

  unmount: () => void;
  history: FormHistoryInterface;
}

function PptxNotes() {
  return (
    <div>
      <p className='unselectable' style={{ fontSize: '12px', color: 'rgba(0,0,0,0.95)' }} >
        <span style={{ fontWeight: 600, color: 'rgba(0,0,0,1)' }} >Note:&nbsp;</span>
        Exported PPTX files require PowerPoint 2016 or later to open.
      </p>
      <p className='unselectable' style={{ marginTop: '8px', fontSize: '12px', color: 'rgba(0,0,0,0.95)' }} >
        <span style={{ fontWeight: 600, color: 'rgba(0,0,0,1)' }} >Note:&nbsp;</span>
        Large structures may take a while to export.
      </p>
    </div>
  );
}

export function ExportDrawing(props: Props) {
  let [inputs, setInputs] = useState<Inputs>({ ...prevInputs });

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
      title={`Export ${props.format.toUpperCase()}`}
      style={{ width: '368px' }}
    >
      <div>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
          <input
            type='text'
            className={textFieldStyles.input}
            value={inputs.fontSizeOfBasesToExport}
            onChange={event => {
              if (event.target.value.trim() != inputs.fontSizeOfBasesToExport.trim()) {
                setErrorMessage(new String(''));
              }
              setInputs({ ...inputs, fontSizeOfBasesToExport: event.target.value });
            }}
            onBlur={() => setInputs(constrainInputs(inputs))}
            onKeyUp={event => {
              if (event.key.toLowerCase() == 'enter') {
                setInputs(constrainInputs(inputs));
              }
            }}
            style={{ width: '32px' }}
          />
          <div style={{ marginLeft: '8px' }} >
            <p className={`${textFieldStyles.label} unselectable`} style={{ color: 'rgba(0,0,0,0.95)' }} >
              Font Size of Bases to Export
            </p>
          </div>
        </div>
        <div style={{ marginTop: '6px' }} >
          <p style={{ fontSize: '14px', fontStyle: 'italic', color: 'rgb(115 115 115)' }} >
            Use to scale the exported drawing.
          </p>
        </div>
      </div>
      <div style={{ marginTop: '32px' }} >
        <SolidButton
          text='Export'
          onClick={() => {
            try {
              if (isBlank(inputs.fontSizeOfBasesToExport)) {
                setErrorMessage(new String('Specify the font size of bases to export.'));
                return;
              }

              let fontSizeOfBasesToExport = Number.parseFloat(inputs.fontSizeOfBasesToExport);

              if (!Number.isFinite(fontSizeOfBasesToExport)) {
                setErrorMessage(new String('Font size of bases must be a number.'));
                return;
              } else if (fontSizeOfBasesToExport < 1) {
                // 1 is the minimum font size in PowerPoint
                setErrorMessage(new String('Font size of bases must be at least 1.'));
                return;
              }

              if (props.format == 'pptx') {
                fontSizeOfBasesToExport = pointsToPixels(fontSizeOfBasesToExport);
              }

              let drawing = props.app.strictDrawing.drawing;

              let firstBase = atPosition(drawing.bases(), 1);
              let fontSizeOfFirstBase = firstBase ? fontSize(firstBase) : undefined;

              exportDrawing(drawing, {
                name: document.title ? document.title : 'Drawing',
                format: props.format,

                // assumes all bases have the same font size
                scale: fontSizeOfBasesToExport / (fontSizeOfFirstBase ?? fontSizeOfBasesToExport),
              });

              setErrorMessage(new String(''));

            } catch (error) {
              console.error(error);
              setErrorMessage(new String('There was an error exporting the drawing.'));
            }
          }}
        />
        {!errorMessage.valueOf() ? null : (
          <p
            key={Math.random()}
            className={`${errorMessageStyles.errorMessage} ${errorMessageStyles.fadesIn} unselectable`}
            style={{ marginTop: '6px' }}
          >
            {errorMessage.valueOf()}
          </p>
        )}
      </div>
      {props.format != 'pptx' ? null : (
        <div style={{ marginTop: '16px' }} >
          <PptxNotes />
        </div>
      )}
    </PartialWidthContainer>
  );
}
