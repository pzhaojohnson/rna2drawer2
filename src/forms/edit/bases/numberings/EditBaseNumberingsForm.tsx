import type { App } from 'App';
import { BaseNumbering } from 'Draw/bases/number/BaseNumbering';

import * as React from 'react';
import styles from './EditBaseNumberings.css';
import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';

import { NumberingOffsetField } from './NumberingOffsetField';
import { NumberingAnchorField } from './NumberingAnchorField';
import { NumberingIncrementField } from './NumberingIncrementField';
import { FontFamilyField } from './FontFamilyField';
import { FontSizeField } from './FontSizeField';
import { BoldField } from './BoldField';
import { ColorField } from './ColorField';
import { LineWidthField } from './LineWidthField';
import { LineLengthField } from './LineLengthField';
import { BasePaddingField } from './BasePaddingField';

function DrawingHasNoBaseNumberingsNotes() {
  return (
    <div style={{ marginTop: '24px' }} >
      <p className={styles.notesText} >
        Drawing has no numberings...
      </p>
      <p className={styles.notesText} style={{ marginTop: '14px' }} >
        Add numberings by adjusting the numbering anchor and increment...
      </p>
    </div>
  );
}

function NoBaseNumberingsAreSelectedNotes() {
  return (
    <div style={{ marginTop: '24px' }} >
      <p className={styles.notesText} >
        No numberings are selected...
      </p>
      <p className={styles.notesText} style={{ marginTop: '14px' }} >
        Select numberings using the editing tool...
      </p>
    </div>
  );
}

function SelectAllBaseNumberingsButton(
  props: {
    app: App,
  },
) {
  return (
    <button
      className={styles.selectAllBaseNumberingsButton}
      onClick={() => {
        let drawing = props.app.drawing;
        let drawingInteraction = props.app.drawingInteraction;
        let editingTool = drawingInteraction.editingTool;

        let allBaseNumberings = drawing.bases().map(b => b.numbering).filter(
          (bn): bn is BaseNumbering => bn instanceof BaseNumbering
        );

        drawingInteraction.currentTool = editingTool; // switch to the editing tool
        editingTool.editingType = BaseNumbering; // set to edit base numberings
        editingTool.select(allBaseNumberings);
      }}
    >
      Select All Numberings
    </button>
  );
}

export interface Props {
  unmount: () => void;
  history: FormHistoryInterface;

  // a reference to the whole app
  app: App;

  // the base numberings to edit
  baseNumberings: BaseNumbering[];
}

export function EditBaseNumberingsForm(props: Props) {
  let numBaseNumberingsInDrawing = props.app.drawing.bases().filter(b => b.numbering).length;

  return (
    <PartialWidthContainer
      unmount={props.unmount}
      history={props.history}
      title='Numberings'
      style={{ width: '324px' }}
    >
      {props.baseNumberings.length != 0 ? null : (
        <div style={{ display: 'flex', flexDirection: 'column' }} >
          <NumberingOffsetField {...props} />
          <NumberingAnchorField {...props} />
          <NumberingIncrementField {...props} />
        </div>
      )}
      {numBaseNumberingsInDrawing == 0 ? (
        <DrawingHasNoBaseNumberingsNotes />
      ) : props.baseNumberings.length == 0 ? (
        <div>
          <NoBaseNumberingsAreSelectedNotes />
          <SelectAllBaseNumberingsButton {...props} />
        </div>
      ) : (
        <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column' }} >
          <FontFamilyField {...props} />
          <FontSizeField {...props} />
          <BoldField {...props} />
          <ColorField {...props} />
          <LineWidthField {...props} />
          <LineLengthField {...props} />
          <BasePaddingField {...props} />
        </div>
      )}
    </PartialWidthContainer>
  );
}
