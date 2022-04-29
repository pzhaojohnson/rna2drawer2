import type { App } from 'App';
import type { Drawing } from 'Draw/Drawing';
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
import { pointsToPixels } from 'Export/units';

// the underlying exportDrawing function
import { exportDrawing as _exportDrawing } from 'Export/export';

// returns undefined if the font size of the base cannot be interpreted
function fontSizeOfBase(b: Base): number | undefined {
  let n = interpretNumber(b.text.attr('font-size'));
  if (n) {
    return n.convert('px').valueOf();
  }
}

function fontSizeOfFirstBase(drawing: Drawing): number | undefined {
  let firstBase: Base | undefined = drawing.bases()[0];
  return firstBase ? fontSizeOfBase(firstBase) : undefined;
}

/**
 * Exports the drawing of the app in SVG or PPTX format.
 */
export function exportDrawing(
  args: {
    app: App, // a reference to the whole app
    format: 'svg' | 'pptx', // the format to export in
    exportedFontSizeOfBases: string,
  },
): void | never {
  if (isBlank(args.exportedFontSizeOfBases)) {
    throw new Error('Specify a font size for bases.');
  }

  let exportedFontSizeOfBases = Number.parseFloat(args.exportedFontSizeOfBases);

  if (!Number.isFinite(exportedFontSizeOfBases)) {
    throw new Error('Font size must be a number.');
  } else if (exportedFontSizeOfBases < 1) {
    // 1 is the minimum font size in PowerPoint
    throw new Error('Font size must be at least 1.');
  }

  if (args.format == 'pptx') {
    exportedFontSizeOfBases = pointsToPixels(exportedFontSizeOfBases);
  }

  // assumes all bases have the same font size
  let fontSizeOfBases = fontSizeOfFirstBase(args.app.strictDrawing.drawing);

  // no scaling if the font size of bases is undefined
  fontSizeOfBases = fontSizeOfBases ?? exportedFontSizeOfBases;

  try {
    _exportDrawing(args.app.strictDrawing.drawing, {
      name: document.title ? document.title : 'Drawing',
      format: args.format,
      scale: exportedFontSizeOfBases / fontSizeOfBases,
    });
  } catch {
    throw new Error('There was an error exporting the drawing.');
  }
}

function ExportedFontSizeOfBasesField(
  props: {
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => void,
    onKeyUp: (event: React.KeyboardEvent<HTMLInputElement>) => void,
  },
) {
  return (
    <TextInputField
      label='Exported Font Size of Bases'
      value={props.value}
      onChange={props.onChange}
      onBlur={props.onBlur}
      onKeyUp={props.onKeyUp}
      input={{ style: { width: '5ch' } }}
      style={{ alignSelf: 'flex-start' }}
    />
  );
}

function ExportButton(
  props: {
    onClick: () => void,
  },
) {
  return (
    <SolidButton
      text='Export'
      onClick={props.onClick}
      style={{ marginTop: '32px' }}
    />
  );
}

function PptxNotes() {
  return (
    <div style={{ marginTop: '16px' }} >
      <DottedNote>
        Exported PPTX files require PowerPoint 2016 or later to open.
      </DottedNote>
      <DottedNote style={{ marginTop: '12px' }} >
        Large structures may take a while to export.
      </DottedNote>
    </div>
  );
}

export type Props = {
  app: App;

  // the format to export the drawing in
  format: 'svg' | 'pptx';

  unmount: () => void;
  history: FormHistoryInterface;
}

function constrainFontSize(value: string): string {
  let n = Number.parseFloat(value);
  if (Number.isFinite(n)) {
    n = round(n, 1); // match PowerPoint font size precision
    return n.toString();
  } else {
    return value.trim();
  }
}

let prevInputs = {
  exportedFontSizeOfBases: '6',
};

export function ExportDrawingForm(props: Props) {
  let [exportedFontSizeOfBases, setExportedFontSizeOfBases] = useState(prevInputs.exportedFontSizeOfBases);

  let [errorMessage, setErrorMessage] = useState('');

  // should be incremented every time the error message is set
  // (to trigger error message animations)
  let [errorMessageKey, setErrorMessageKey] = useState(0);

  // remember inputs
  useEffect(() => {
    return () => {
      prevInputs = { exportedFontSizeOfBases };
    };
  });

  return (
    <PartialWidthContainer
      unmount={props.unmount}
      history={props.history}
      title={`Export ${props.format.toUpperCase()}`}
      style={{ width: '368px' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }} >
        <ExportedFontSizeOfBasesField
          value={exportedFontSizeOfBases}
          onChange={event => setExportedFontSizeOfBases(event.target.value)}
          onBlur={() => setExportedFontSizeOfBases(constrainFontSize(exportedFontSizeOfBases))}
          onKeyUp={event => {
            if (event.key.toLowerCase() == 'enter') {
              setExportedFontSizeOfBases(constrainFontSize(exportedFontSizeOfBases));
            }
          }}
        />
        <div style={{ marginTop: '6px' }} >
          <p style={{ fontSize: '14px', fontStyle: 'italic', fontWeight: 600, color: '#9797ac' }} >
            Use to scale the exported drawing.
          </p>
        </div>
      </div>
      <ExportButton
        onClick={() => {
          try {
            exportDrawing({
              app: props.app,
              format: props.format,
              exportedFontSizeOfBases,
            });
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
      {props.format == 'pptx' ? <PptxNotes /> : null}
    </PartialWidthContainer>
  );
}