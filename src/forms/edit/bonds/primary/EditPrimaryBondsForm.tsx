import type { App } from 'App';
import { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';

import * as React from 'react';
import styles from './EditPrimaryBondsForm.css';
import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';

import { StrokeField } from './StrokeField';
import { StrokeWidthField } from './StrokeWidthField';
import { BasePaddingField } from './BasePaddingField';
import { StrokeLinecapField } from './StrokeLinecapField';
import { ForwardBackwardButtons } from './ForwardBackwardButtons';

function DrawingHasNoPrimaryBondsNotes() {
  return (
    <p className={styles.notesText} >
      Drawing has no primary bonds...
    </p>
  );
}

function NoPrimaryBondsAreSelectedNotes() {
  return (
    <div>
      <p className={styles.notesText} >
        No primary bonds are selected...
      </p>
      <p className={styles.notesText} style={{ marginTop: '24px' }} >
        Select primary bonds using the editing tool...
      </p>
    </div>
  );
}

function SelectAllPrimaryBondsButton(
  props: {
    app: App,
  },
) {
  return (
    <button
      className={styles.selectAllPrimaryBondsButton}
      onClick={() => {
        let drawing = props.app.drawing;
        let drawingInteraction = props.app.drawingInteraction;
        let editingTool = drawingInteraction.editingTool;

        drawingInteraction.currentTool = editingTool; // switch to editing tool
        editingTool.editingType = PrimaryBond; // set to edit primary bonds
        editingTool.select([...drawing.primaryBonds]); // select all primary bonds
      }}
    >
      Select All Primary Bonds
    </button>
  );
}

export type Props = {
  app: App; // a reference to the whole app

  // the primary bonds to edit
  primaryBonds: PrimaryBond[];

  unmount: () => void;
  history: FormHistoryInterface;
}

export function EditPrimaryBondsForm(props: Props) {
  return (
    <PartialWidthContainer
      unmount={props.unmount}
      history={props.history}
      title='Primary Bonds'
      style={{ width: '330px' }}
    >
      {props.app.drawing.primaryBonds.length == 0 ? (
        <DrawingHasNoPrimaryBondsNotes />
      ) : props.primaryBonds.length == 0 ? (
        <div>
          <NoPrimaryBondsAreSelectedNotes />
          <SelectAllPrimaryBondsButton {...props} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }} >
          <StrokeField {...props} />
          <StrokeWidthField {...props} />
          <BasePaddingField {...props} />
          <StrokeLinecapField {...props} />
          <ForwardBackwardButtons {...props} />
        </div>
      )}
    </PartialWidthContainer>
  );
}