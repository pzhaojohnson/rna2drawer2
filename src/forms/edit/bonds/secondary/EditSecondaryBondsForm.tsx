import type { App } from 'App';
import type { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';

import * as React from 'react';
import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';

import colorFieldStyles from 'Forms/inputs/color/ColorField.css';
import {
  AUTStrokePicker,
  GCStrokePicker,
  GUTStrokePicker,
  OtherStrokePicker,
} from './StrokePicker';
import {
  AUTStrokeOpacityInput,
  GCStrokeOpacityInput,
  GUTStrokeOpacityInput,
  OtherStrokeOpacityInput,
} from './StrokeOpacityInput';
import { BaseSpacingField } from './BaseSpacingField';
import { BasePaddingField } from './BasePaddingField';
import { StrokeWidthField } from './StrokeWidthField';
import { StrokeLinecapField } from './StrokeLinecapField';
import { DotifyAndSquarifyButtons } from './DotifyAndSquarifyButtons';
import { BringToFrontButton } from './BringToFrontButton';
import { SendToBackButton } from './SendToBackButton';

export type Props = {
  app: App;

  // the secondary bonds to edit
  secondaryBonds: SecondaryBond[];

  unmount: () => void;
  history: FormHistoryInterface;
}

function numAUTBonds(secondaryBonds: SecondaryBond[]): number {
  return secondaryBonds.filter(sb => sb.type == 'AUT').length;
}

function numGCBonds(secondaryBonds: SecondaryBond[]): number {
  return secondaryBonds.filter(sb => sb.type == 'GC').length;
}

function numGUTBonds(secondaryBonds: SecondaryBond[]): number {
  return secondaryBonds.filter(sb => sb.type == 'GUT').length;
}

function numOtherBonds(secondaryBonds: SecondaryBond[]): number {
  return secondaryBonds.filter(sb => sb.type == 'other').length;
}

export function EditSecondaryBondsForm(props: Props) {
  return (
    <PartialWidthContainer
      unmount={props.unmount}
      history={props.history}
      title='Secondary Bonds'
      style={{ width: '324px' }}
    >
      {props.secondaryBonds.length == 0 ? (
        <p className='unselectable' style={{ fontSize: '12px' }} >
          No secondary bonds to edit.
        </p>
      ) : (
        <div>
          {numAUTBonds(props.secondaryBonds) == 0 ? null : (
            <div style={{ paddingBottom: '8px' }} >
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                <AUTStrokePicker app={props.app} secondaryBonds={props.secondaryBonds} />
                <div style={{ marginLeft: '10px' }} >
                  <AUTStrokeOpacityInput app={props.app} secondaryBonds={props.secondaryBonds} />
                </div>
                <div style={{ marginLeft: '8px' }} >
                  <p className={`${colorFieldStyles.label} unselectable`} >
                    AU and AT Color
                  </p>
                </div>
              </div>
            </div>
          )}
          {numGCBonds(props.secondaryBonds) == 0 ? null : (
            <div style={{ paddingBottom: '8px' }} >
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                <GCStrokePicker app={props.app} secondaryBonds={props.secondaryBonds} />
                <div style={{ marginLeft: '10px' }} >
                  <GCStrokeOpacityInput app={props.app} secondaryBonds={props.secondaryBonds} />
                </div>
                <div style={{ marginLeft: '8px' }} >
                  <p className={`${colorFieldStyles.label} unselectable`} >
                    GC Color
                  </p>
                </div>
              </div>
            </div>
          )}
          {numGUTBonds(props.secondaryBonds) == 0 ? null : (
            <div style={{ paddingBottom: '8px' }} >
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                <GUTStrokePicker app={props.app} secondaryBonds={props.secondaryBonds} />
                <div style={{ marginLeft: '10px' }} >
                  <GUTStrokeOpacityInput app={props.app} secondaryBonds={props.secondaryBonds} />
                </div>
                <div style={{ marginLeft: '8px' }} >
                  <p className={`${colorFieldStyles.label} unselectable`} >
                    GU and GT Color
                  </p>
                </div>
              </div>
            </div>
          )}
          {numOtherBonds(props.secondaryBonds) == 0 ? null : (
            <div style={{ paddingBottom: '8px' }} >
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                <OtherStrokePicker app={props.app} secondaryBonds={props.secondaryBonds} />
                <div style={{ marginLeft: '10px' }} >
                  <OtherStrokeOpacityInput app={props.app} secondaryBonds={props.secondaryBonds} />
                </div>
                <div style={{ marginLeft: '8px' }} >
                  <p className={`${colorFieldStyles.label} unselectable`} >
                    Noncanonical Color
                  </p>
                </div>
              </div>
            </div>
          )}
          <div style={{ marginTop: '8px' }} >
            <BaseSpacingField app={props.app} />
          </div>
          <div style={{ marginTop: '8px' }} >
            <BasePaddingField app={props.app} secondaryBonds={props.secondaryBonds} />
          </div>
          <div style={{ marginTop: '8px' }} >
            <StrokeWidthField app={props.app} secondaryBonds={props.secondaryBonds} />
          </div>
          <div style={{ marginTop: '16px' }} >
            <StrokeLinecapField app={props.app} secondaryBonds={props.secondaryBonds} />
          </div>
          <div style={{ margin: '8px 0px 0px 40px' }} >
            <DotifyAndSquarifyButtons app={props.app} secondaryBonds={props.secondaryBonds} />
          </div>
          <div style={{ marginTop: '16px' }} >
            <div style={{ display: 'flex', flexDirection: 'row' }} >
              <BringToFrontButton app={props.app} secondaryBonds={props.secondaryBonds} />
              <div style={{ width: '18px' }} />
              <SendToBackButton app={props.app} secondaryBonds={props.secondaryBonds} />
            </div>
          </div>
        </div>
      )}
    </PartialWidthContainer>
  );
}
