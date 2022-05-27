import type { App } from 'App';
import type { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';

import * as React from 'react';
import styles from './EditSecondaryBondsForm.css';
import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';

import { StrokeField } from './StrokeField';
import { BaseSpacingField } from './BaseSpacingField';
import { BasePaddingField } from './BasePaddingField';
import { StrokeWidthField } from './StrokeWidthField';
import { StrokeLinecapField } from './StrokeLinecapField';
import { DotifyAndSquarifyButtons } from './DotifyAndSquarifyButtons';
import { ForwardBackwardButtons } from './ForwardBackwardButtons';

function DrawingHasNoSecondaryBondsNotes() {
  return (
    <div>
      <p className={styles.notesText} >
        Drawing has no secondary bonds...
      </p>
      <p className={styles.notesText} style={{ marginTop: '24px' }} >
        Add secondary bonds using the binding tool...
      </p>
    </div>
  );
}

function NoSecondaryBondsAreSelectedNotes() {
  return (
    <div>
      <p className={styles.notesText} >
        No secondary bonds are selected...
      </p>
      <p className={styles.notesText} style={{ marginTop: '24px' }} >
        Select secondary bonds using the editing tool...
      </p>
    </div>
  );
}

export type Props = {
  app: App;

  // the secondary bonds to edit
  secondaryBonds: SecondaryBond[];

  unmount: () => void;
  history: FormHistoryInterface;
}

export function EditSecondaryBondsForm(props: Props) {
  return (
    <PartialWidthContainer
      unmount={props.unmount}
      history={props.history}
      title='Secondary Bonds'
      style={{ width: '324px' }}
    >
      {props.app.drawing.secondaryBonds.length == 0 ? (
        <DrawingHasNoSecondaryBondsNotes />
      ) : props.secondaryBonds.length == 0 ? (
        <NoSecondaryBondsAreSelectedNotes />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }} >
          <StrokeField {...props} />
          <BaseSpacingField {...props} />
          <BasePaddingField {...props} />
          <StrokeWidthField {...props} />
          <StrokeLinecapField {...props} />
          <DotifyAndSquarifyButtons {...props} />
          <ForwardBackwardButtons {...props} />
        </div>
      )}
    </PartialWidthContainer>
  );
}
