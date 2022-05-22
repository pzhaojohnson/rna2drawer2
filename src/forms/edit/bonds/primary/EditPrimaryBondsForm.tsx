import type { App } from 'App';
import { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';

import * as React from 'react';
import formStyles from './EditPrimaryBondsForm.css';
import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';

import colorFieldStyles from 'Forms/inputs/color/ColorField.css';
import { StrokePicker } from './StrokePicker';
import { StrokeOpacityInput } from './StrokeOpacityInput';
import { StrokeWidthField } from './StrokeWidthField';
import { BasePaddingField } from './BasePaddingField';
import { StrokeLinecapField } from './StrokeLinecapField';
import { ForwardAndBackwardButtons } from './ForwardAndBackwardButtons';

function DrawingHasNoPrimaryBondsNotes() {
  return (
    <p className={formStyles.notesText} >
      Drawing has no primary bonds...
    </p>
  );
}

function NoPrimaryBondsAreSelectedNotes() {
  return (
    <div>
      <p className={formStyles.notesText} >
        No primary bonds are selected...
      </p>
      <p className={formStyles.notesText} style={{ marginTop: '24px' }} >
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
      className={formStyles.selectAllPrimaryBondsButton}
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
      style={{ width: '328px' }}
    >
      {props.app.drawing.primaryBonds.length == 0 ? (
        <DrawingHasNoPrimaryBondsNotes />
      ) : props.primaryBonds.length == 0 ? (
        <div>
          <NoPrimaryBondsAreSelectedNotes />
          <SelectAllPrimaryBondsButton app={props.app} />
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
            <StrokePicker app={props.app} primaryBonds={props.primaryBonds} />
            <div style={{ marginLeft: '10px' }} >
              <StrokeOpacityInput app={props.app} primaryBonds={props.primaryBonds} />
            </div>
            <div style={{ marginLeft: '8px' }} >
              <p className={`${colorFieldStyles.label} unselectable`} >
                Color
              </p>
            </div>
          </div>
          <div style={{ marginTop: '16px' }} >
            <StrokeWidthField app={props.app} primaryBonds={props.primaryBonds} />
          </div>
          <div style={{ marginTop: '8px' }} >
            <BasePaddingField app={props.app} primaryBonds={props.primaryBonds} />
          </div>
          <div style={{ marginTop: '14px' }} >
            <StrokeLinecapField app={props.app} primaryBonds={props.primaryBonds} />
          </div>
          <div style={{ marginTop: '14px' }} >
            <ForwardAndBackwardButtons app={props.app} primaryBonds={props.primaryBonds} />
          </div>
        </div>
      )}
    </PartialWidthContainer>
  );
}
