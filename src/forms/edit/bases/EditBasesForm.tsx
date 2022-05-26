import type { App } from 'App';
import type { Base } from 'Draw/bases/Base';
import { CircleBaseAnnotation } from 'Draw/bases/annotate/circle/CircleBaseAnnotation';

import * as React from 'react';
import styles from './EditBasesForm.css';
import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';

import { CharacterField } from './CharacterField';
import { FillField } from './FillField';
import { FontFamilyField } from './FontFamilyField';
import { FontSizeField } from './FontSizeField';
import { BoldField } from './BoldField';
import { OutlineField } from './OutlineField';
import { RadiusField as OutlineRadiusField } from './outlines/RadiusField';
import { StrokeField as OutlineStrokeField } from './outlines/StrokeField';
import { StrokeWidthField as OutlineStrokeWidthField } from './outlines/StrokeWidthField';
import { FillField as OutlineFillField } from './outlines/FillField';
import { NumberingField } from './NumberingField';
import { ForwardBackwardButtons } from './ForwardBackwardButtons';

function DrawingHasNoBasesNotes() {
  return (
    <p className={styles.notesText} >
      Drawing has no bases...
    </p>
  );
}

export type Props = {
  app: App;

  // the bases to edit
  bases: Base[];

  unmount: () => void;
  history: FormHistoryInterface;
}

export function EditBasesForm(props: Props) {
  let outlines = props.bases.map(b => b.outline).filter(
    (o): o is CircleBaseAnnotation => o instanceof CircleBaseAnnotation
  );

  return (
    <PartialWidthContainer
      unmount={props.unmount}
      history={props.history}
      title='Bases'
      style={{ width: '324px' }}
    >
      {props.app.drawing.bases().length == 0 ? (
        <DrawingHasNoBasesNotes />
      ) : props.bases.length == 0 ? (
        <p className='unselectable' style={{ fontSize: '12px' }} >
          No bases are selected.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }} >
          {props.bases.length != 1 ? null : (
            <CharacterField {...props} base={props.bases[0]} />
          )}
          <FillField {...props} />
          <FontFamilyField {...props} />
          <FontSizeField {...props} />
          <BoldField {...props} />
          <OutlineField {...props} />
          {!props.bases.every(b => b.outline) ? null : (
            <div style={{ margin: '12px 0 0 18px', display: 'flex', flexDirection: 'column' }} >
              <OutlineFillField {...props} outlines={outlines} />
              <OutlineRadiusField {...props} outlines={outlines} />
              <OutlineStrokeField {...props} outlines={outlines} />
              <OutlineStrokeWidthField {...props} outlines={outlines} />
            </div>
          )}
          {props.bases.length != 1 ? null : (
            <NumberingField {...props} base={props.bases[0]} />
          )}
          <ForwardBackwardButtons {...props} />
        </div>
      )}
    </PartialWidthContainer>
  );
}
