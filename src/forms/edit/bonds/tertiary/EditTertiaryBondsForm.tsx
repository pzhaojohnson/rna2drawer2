import type { App } from 'App';
import { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';

import * as React from 'react';
import styles from './EditTertiaryBondsForm.css';
import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';

import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';
import { StrokePicker } from './StrokePicker';
import { StrokeOpacityInput } from './StrokeOpacityInput';
import { StrokeWidthField } from './StrokeWidthField';
import { DashedField } from './DashedField';
import { BasePadding1Field } from './BasePadding1Field';
import { BasePadding2Field } from './BasePadding2Field';
import { ForwardBackwardButtons } from './ForwardBackwardButtons';

function DrawingHasNoTertiaryBondsNotes() {
  return (
    <div>
      <p className={styles.notesText} >
        Drawing has no tertiary bonds...
      </p>
      <div style={{ height: '24px' }} />
      <p className={styles.notesText} >
        Add tertiary bonds using the binding tool...
      </p>
    </div>
  );
}

function NoTertiaryBondsAreSelectedNotes() {
  return (
    <div>
      <p className={styles.notesText} >
        No tertiary bonds are selected...
      </p>
      <div style={{ height: '24px' }} />
      <p className={styles.notesText} >
        Select tertiary bonds using the editing tool...
      </p>
    </div>
  );
}

function SelectAllTertiaryBondsButton(
  props: {
    app: App,
  },
) {
  return (
    <p
      className={styles.selectAllTertiaryBondsButton}
      onClick={() => {
        let drawing = props.app.drawing;
        let drawingInteraction = props.app.drawingInteraction;
        let editingTool = drawingInteraction.editingTool;

        drawingInteraction.currentTool = editingTool; // switch to editing tool
        editingTool.editingType = TertiaryBond; // set to edit tertiary bonds
        editingTool.select([...drawing.tertiaryBonds]); // select all tertiary bonds
      }}
    >
      Select All Tertiary Bonds
    </p>
  );
}

export type Props = {
  app: App; // a reference to the whole app

  // the tertiary bonds to edit
  tertiaryBonds: TertiaryBond[];

  unmount: () => void;
  history: FormHistoryInterface;
}

export function EditTertiaryBondsForm(props: Props) {
  return (
    <PartialWidthContainer
      unmount={props.unmount}
      history={props.history}
      title='Tertiary Bonds'
      style={{ width: '324px' }}
    >
      {props.app.drawing.tertiaryBonds.length == 0 ? (
        <DrawingHasNoTertiaryBondsNotes />
      ) : props.tertiaryBonds.length == 0 ? (
        <div>
          <NoTertiaryBondsAreSelectedNotes />
          <SelectAllTertiaryBondsButton {...props} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }} >
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
            <StrokePicker {...props} />
            <FieldLabel style={{ marginLeft: '10px', alignSelf: 'start', cursor: 'text' }} >
              <StrokeOpacityInput {...props} />
              Color
            </FieldLabel>
          </div>
          <div style={{ marginTop: '14px', display: 'flex' }} >
            <StrokeWidthField {...props} />
          </div>
          <div style={{ marginTop: '14px', display: 'flex' }} >
            <DashedField {...props} />
          </div>
          <div style={{ marginTop: '14px', display: 'flex' }} >
            <BasePadding1Field {...props} />
          </div>
          <div style={{ marginTop: '10px', display: 'flex' }} >
            <BasePadding2Field {...props} />
          </div>
          <div style={{ marginTop: '18px' }} >
            <ForwardBackwardButtons {...props} />
          </div>
        </div>
      )}
    </PartialWidthContainer>
  );
}
