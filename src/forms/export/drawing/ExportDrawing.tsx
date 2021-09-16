import * as React from 'react';
import { useState } from 'react';
import styles from './ExportDrawing.css';
import { CloseButton } from 'Forms/buttons/CloseButton';
import { Title, TitleUnderline } from './Title';
import { ExportedBaseFontSizeField } from './ExportedBaseFontSizeField';
import { SolidButton } from 'Forms/buttons/SolidButton';
import { PptxNotes } from './PptxNotes';

import { AppInterface as App } from 'AppInterface';
import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { atPosition } from 'Array/at';
import { parseNumber } from 'Parse/svg/number';
import { exportDrawing } from 'Export/export';

// returns undefined if the drawing has no bases or if the font size
// of the first base is unparsable
function firstBaseFontSize(drawing: Drawing): number | undefined {
  let firstBase = atPosition(drawing.bases(), 1);
  if (firstBase) {
    let n = parseNumber(firstBase.text.attr('font-size'));
    if (n) {
      return n.convert('px').valueOf();
    }
  }
}

type Inputs = {
  exportedBaseFontSize: string;
}

let lastExportedInputs = {
  exportedBaseFontSize: '6.0',
};

function exportedBaseFontSizeIsValid(value: string): boolean {
  let n = Number(value);
  return Number.isFinite(n) && n > 0;
}

function inputsAreValid(inputs: Inputs): boolean {
  return exportedBaseFontSizeIsValid(inputs.exportedBaseFontSize);
}

export type Props = {
  app: App;
  format: 'svg' | 'pptx'; // the format to export the drawing in
  close: () => void;
}

export function ExportDrawing(props: Props) {
  let [inputs, setInputs] = useState<Inputs>({ ...lastExportedInputs });
  return (
    <div
      className={styles.form}
      style={{ position: 'relative', width: '400px', height: '100%', overflow: 'auto' }}
    >
      <div style={{ position: 'absolute', top: '0px', right: '0px' }} >
        <CloseButton
          onClick={() => props.close()}
        />
      </div>
      <div style={{ margin: '16px 32px 0 32px' }} >
        <Title
          text={`Export ${props.format.toUpperCase()}`}
        />
      </div>
      <div style={{ margin: '8px 16px 0px 16px' }} >
        <TitleUnderline />
      </div>
      <div style={{ margin: '24px 40px 0 40px' }} >
        <ExportedBaseFontSizeField
          value={inputs.exportedBaseFontSize}
          onChange={value => setInputs({ ...inputs, exportedBaseFontSize: value })}
          errorMessage={exportedBaseFontSizeIsValid(inputs.exportedBaseFontSize) ? undefined : (
            'Font size of bases must be a positive number.'
          )}
        />
      </div>
      <div style={{ margin: '24px 40px 0 40px' }} >
        <SolidButton
          text='Export'
          onClick={() => {
            let exportedBaseFontSize = Number(inputs.exportedBaseFontSize);
            let drawing = props.app.strictDrawing.drawing;
            exportDrawing(drawing, {
              name: document.title ? document.title : 'Drawing',
              format: props.format,
              scale: exportedBaseFontSize / (firstBaseFontSize(drawing) ?? exportedBaseFontSize),
            });
            lastExportedInputs = { ...inputs };
          }}
          disabled={!inputsAreValid(inputs)}
        />
      </div>
      {props.format != 'pptx' ? null : (
        <div style={{ margin: '16px 40px 0 40px' }} >
          <PptxNotes />
        </div>
      )}
    </div>
  );
}
