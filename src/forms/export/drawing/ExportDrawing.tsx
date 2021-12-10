import * as React from 'react';
import { useState, useEffect } from 'react';
import formStyles from './ExportDrawing.css';
import textFieldStyles from 'Forms/fields/text/TextField.css';
import errorMessageStyles from 'Forms/ErrorMessage.css';
import { CloseButton } from 'Forms/buttons/CloseButton';
import { SolidButton } from 'Forms/buttons/SolidButton';

import { AppInterface as App } from 'AppInterface';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import { atPosition } from 'Array/at';
import { isBlank } from 'Parse/isBlank';
import { parseNumber } from 'Parse/svg/number';
import { round } from 'Math/round';
import { pointsToPixels } from 'Export/units'
import { exportDrawing } from 'Export/export';

// returns undefined if the font size of the base cannot be parsed
function fontSize(b: Base): number | undefined {
  let n = parseNumber(b.text.attr('font-size'));
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
    // font sizes can only be so precise in applications such as PowerPoint
    n = round(n, 1);
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
    <div
      className={formStyles.form}
      style={{ position: 'relative', width: '368px', height: '100%', overflow: 'auto' }}
    >
      <div style={{ position: 'absolute', top: '0px', right: '0px' }} >
        <CloseButton
          onClick={() => props.unmount()}
        />
      </div>
      <div style={{ margin: '16px 32px 0px 32px' }} >
        <p className={`${formStyles.title} unselectable`} >
          {`Export ${props.format.toUpperCase()}`}
        </p>
      </div>
      <div style={{ margin: '8px 16px 0px 16px' }} >
        <div className={formStyles.titleUnderline} />
      </div>
      <div style={{ margin: '24px 40px 0px 40px' }} >
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
      <div style={{ margin: '32px 40px 0px 40px' }} >
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
            style={{ marginTop: '4px' }}
          >
            {errorMessage.valueOf()}
          </p>
        )}
      </div>
      {props.format != 'pptx' ? null : (
        <div style={{ margin: '16px 40px 0px 40px' }} >
          <PptxNotes />
        </div>
      )}
      <div style={{ height: '8px' }} /> {/* bottom spacer */}
    </div>
  );
}
