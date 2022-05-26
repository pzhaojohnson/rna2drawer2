import type { App } from 'App';
import type { Base } from 'Draw/bases/Base';
import type { CircleBaseAnnotation } from 'Draw/bases/annotate/circle/CircleBaseAnnotation';

import * as React from 'react';
import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';

import { CharacterField } from './CharacterField';
import { NumberingField } from './NumberingField';
import { FillField } from './FillField';
import { OutlineField, allHaveOutlines } from './OutlineField';
import { RadiusField as OutlineRadiusField } from './outlines/RadiusField';
import { StrokeField as OutlineStrokeField } from './outlines/StrokeField';
import { StrokeWidthField as OutlineStrokeWidthField } from './outlines/StrokeWidthField';
import { FillField as OutlineFillField } from './outlines/FillField';
import { ForwardBackwardButtons } from './ForwardBackwardButtons';

export type Props = {
  app: App;

  // the bases to edit
  bases: Base[];

  unmount: () => void;
  history: FormHistoryInterface;
}

function outlines(bases: Base[]): CircleBaseAnnotation[] {
  let os: CircleBaseAnnotation[] = [];
  bases.forEach(b => {
    if (b.outline) {
      os.push(b.outline);
    }
  });
  return os;
}

export function EditBasesForm(props: Props) {
  let os = outlines(props.bases);
  return (
    <PartialWidthContainer
      unmount={props.unmount}
      history={props.history}
      title='Bases'
      style={{ width: '324px' }}
    >
      {props.bases.length == 0 ? (
        <p className='unselectable' style={{ fontSize: '12px' }} >
          No bases are selected.
        </p>
      ) : (
        <div>
          {props.bases.length != 1 ? null : (
            <div style={{ marginBottom: '16px' }} >
              <CharacterField app={props.app} base={props.bases[0]} />
              <NumberingField {...props} base={props.bases[0]} />
            </div>
          )}
          <FillField {...props} />
          <div style={{ marginTop: '16px' }} >
            <OutlineField app={props.app} bases={props.bases} />
          </div>
          {!allHaveOutlines(props.bases) ? null : (
            <div style={{ margin: '12px 0px 0px 16px' }} >
              <OutlineRadiusField app={props.app} outlines={os} />
              <OutlineStrokeField {...props} outlines={os} />
              <div style={{ marginTop: '8px' }} >
                <OutlineStrokeWidthField app={props.app} outlines={os} />
              </div>
              <OutlineFillField {...props} outlines={os} />
            </div>
          )}
          <ForwardBackwardButtons {...props} />
        </div>
      )}
    </PartialWidthContainer>
  );
}
