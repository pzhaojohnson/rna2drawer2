import type { App } from 'App';
import type { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';

import * as React from 'react';
import formStyles from './EditTertiaryBondsForm.css';
import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';

import { FieldLabel } from 'Forms/inputs/labels/FieldLabel';
import { StrokePicker } from './StrokePicker';
import { StrokeOpacityInput } from './StrokeOpacityInput';
import { StrokeWidthField } from './StrokeWidthField';
import { DashedField } from './DashedField';
import { BasePadding1Field } from './BasePadding1Field';
import { BasePadding2Field } from './BasePadding2Field';
import { BringToFrontButton } from './BringToFrontButton';
import { SendToBackButton } from './SendToBackButton';

function DrawingHasNoTertiaryBondsNotes() {
  return (
    <div>
      <p className={formStyles.notesText} >
        Drawing has no tertiary bonds...
      </p>
      <div style={{ height: '24px' }} />
      <p className={formStyles.notesText} >
        Add tertiary bonds using the binding tool...
      </p>
    </div>
  );
}

function NoTertiaryBondsAreSelectedNotes() {
  return (
    <div>
      <p className={formStyles.notesText} >
        No tertiary bonds are selected...
      </p>
      <div style={{ height: '24px' }} />
      <p className={formStyles.notesText} >
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
      className={formStyles.selectAllTertiaryBondsButton}
      onClick={() => {
        // set the current tool in case it is not already the editing tool
        props.app.drawingInteraction.currentTool = props.app.drawingInteraction.editingTool;
        props.app.drawingInteraction.editingTool.select([...props.app.drawing.tertiaryBonds]);
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
          <SelectAllTertiaryBondsButton app={props.app} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }} >
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
            <StrokePicker app={props.app} tertiaryBonds={props.tertiaryBonds} />
            <FieldLabel style={{ marginLeft: '10px', alignSelf: 'start', cursor: 'text' }} >
              <StrokeOpacityInput app={props.app} tertiaryBonds={props.tertiaryBonds} />
              Color
            </FieldLabel>
          </div>
          <div style={{ marginTop: '16px', display: 'flex' }} >
            <StrokeWidthField app={props.app} tertiaryBonds={props.tertiaryBonds} />
          </div>
          <div style={{ marginTop: '12px', display: 'flex' }} >
            <DashedField app={props.app} tertiaryBonds={props.tertiaryBonds} />
          </div>
          <div style={{ marginTop: '12px', display: 'flex' }} >
            <BasePadding1Field app={props.app} tertiaryBonds={props.tertiaryBonds} />
          </div>
          <div style={{ marginTop: '8px', display: 'flex' }} >
            <BasePadding2Field app={props.app} tertiaryBonds={props.tertiaryBonds} />
          </div>
          <div style={{ marginTop: '16px' }} >
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
              <BringToFrontButton app={props.app} tertiaryBonds={props.tertiaryBonds} />
              <div style={{ width: '18px' }} />
              <SendToBackButton app={props.app} tertiaryBonds={props.tertiaryBonds} />
            </div>
          </div>
        </div>
      )}
    </PartialWidthContainer>
  );
}
