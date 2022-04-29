import type { App } from 'App';
import type { Base } from 'Draw/bases/Base';

import * as React from 'react';
import { useState, useEffect } from 'react';

import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';

import { TextInputField } from 'Forms/inputs/text/TextInputField';

import { SolidButton } from 'Forms/buttons/SolidButton';
import { ErrorMessage } from 'Forms/ErrorMessage';

import { DottedNote } from 'Forms/notes/DottedNote';

import { isBlank } from 'Parse/isBlank';
import { interpretNumber } from 'Draw/svg/interpretNumber';

import { round } from 'Math/round';
import { pointsToPixels } from 'Export/units'

import { atPosition } from 'Array/at';

import { exportDrawing } from 'Export/export';

function FontSizeOfBasesToExportField(
  props: {
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => void,
    onKeyUp: (event: React.KeyboardEvent<HTMLInputElement>) => void,
  },
) {
  return (
    <TextInputField
      label='Font Size of Bases to Export'
      value={props.value}
      onChange={props.onChange}
      onBlur={props.onBlur}
      onKeyUp={props.onKeyUp}
      input={{ style: { width: '32px' } }}
      style={{ alignSelf: 'flex-start' }}
    />
  );
}

function PptxNotes() {
  return (
    <div>
      <DottedNote>
        Exported PPTX files require PowerPoint 2016 or later to open.
      </DottedNote>
      <DottedNote style={{ marginTop: '12px' }} >
        Large structures may take a while to export.
      </DottedNote>
    </div>
  );
}

// returns undefined if the font size of the base cannot be parsed
function fontSizeOfBase(b: Base): number | undefined {
  let n = interpretNumber(b.text.attr('font-size'));
  if (n) {
    return n.convert('px').valueOf();
  }
}

export type Props = {
  app: App;

  // the format to export the drawing in
  format: 'svg' | 'pptx';

  unmount: () => void;
  history: FormHistoryInterface;
}

type Inputs = {
  fontSizeOfBasesToExport: string;
}

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

let prevInputs: Inputs = {
  fontSizeOfBasesToExport: '6',
};

export function ExportDrawingForm(props: Props) {
  let [inputs, setInputs] = useState<Inputs>({ ...prevInputs });

  let [errorMessage, setErrorMessage] = useState('');

  // should be incremented every time the error message is set
  // (to trigger error message animations)
  let [errorMessageKey, setErrorMessageKey] = useState(0);

  // remember inputs
  useEffect(() => {
    return () => { prevInputs = { ...inputs }; };
  });

  let submit = (): void | never => {
    if (isBlank(inputs.fontSizeOfBasesToExport)) {
      throw new Error('Specify the font size of bases to export.');
    }

    let fontSizeOfBasesToExport = Number.parseFloat(inputs.fontSizeOfBasesToExport);

    if (!Number.isFinite(fontSizeOfBasesToExport)) {
      throw new Error('Font size of bases must be a number.');
    } else if (fontSizeOfBasesToExport < 1) {
      // 1 is the minimum font size in PowerPoint
      throw new Error('Font size of bases must be at least 1.');
    }

    if (props.format == 'pptx') {
      fontSizeOfBasesToExport = pointsToPixels(fontSizeOfBasesToExport);
    }

    let drawing = props.app.strictDrawing.drawing;

    let firstBase = atPosition(drawing.bases(), 1);
    let fontSizeOfFirstBase = firstBase ? fontSizeOfBase(firstBase) : undefined;

    try {
      exportDrawing(drawing, {
        name: document.title ? document.title : 'Drawing',
        format: props.format,

        // assumes all bases have the same font size
        scale: fontSizeOfBasesToExport / (fontSizeOfFirstBase ?? fontSizeOfBasesToExport),
      });
    } catch { throw new Error('There was an error exporting the drawing.'); }
  };

  return (
    <PartialWidthContainer
      unmount={props.unmount}
      history={props.history}
      title={`Export ${props.format.toUpperCase()}`}
      style={{ width: '368px' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }} >
        <FontSizeOfBasesToExportField
          value={inputs.fontSizeOfBasesToExport}
          onChange={event => {
            setInputs({ ...inputs, fontSizeOfBasesToExport: event.target.value });
          }}
          onBlur={() => setInputs(constrainInputs(inputs))}
          onKeyUp={event => {
            if (event.key.toLowerCase() == 'enter') {
              setInputs(constrainInputs(inputs));
            }
          }}
        />
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
              submit();
              setErrorMessage('');
            } catch (error) {
              setErrorMessage(error instanceof Error ? error.message : String(error));
              setErrorMessageKey(errorMessageKey + 1);
            }
          }}
        />
        {!errorMessage ? null : (
          <ErrorMessage key={errorMessageKey} style={{ marginTop: '6px' }} >
            {errorMessage}
          </ErrorMessage>
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
