import * as React from 'react';
import { CloseButton } from 'Forms/buttons/CloseButton';
import formStyles from './EditBases.css';
import colorFieldStyles from 'Forms/fields/color/ColorField.css';

import { AppInterface as App } from 'AppInterface';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import { CircleBaseAnnotationInterface as CircleBaseAnnotation } from 'Draw/bases/annotate/circle/CircleBaseAnnotationInterface';

import { CharacterField } from './CharacterField';
import { FillPicker } from './FillPicker';
import { FillOpacityInput } from './FillOpacityInput';
import { BringToFrontButton } from './BringToFrontButton';
import { SendToBackButton } from './SendToBackButton';
import { OutlineField, allHaveOutlines } from './OutlineField';
import { RadiusField as OutlineRadiusField } from './outlines/RadiusField';
import { StrokePicker as OutlineStrokePicker } from './outlines/StrokePicker';
import { StrokeOpacityInput as OutlineStrokeOpacityInput } from './outlines/StrokeOpacityInput';
import { StrokeWidthField as OutlineStrokeWidthField } from './outlines/StrokeWidthField';
import { FillPicker as OutlineFillPicker } from './outlines/FillPicker';
import { FillOpacityInput as OutlineFillOpacityInput } from './outlines/FillOpacityInput';

export type Props = {
  app: App;

  // the bases to edit
  bases: Base[];

  unmount: () => void;
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

function Title() {
  return (
    <p
      className='unselectable'
      style={{ fontSize: '24px', color: 'rgba(0,0,0,1)' }}
    >
      Bases
    </p>
  );
}

function TitleUnderline() {
  return (
    <div
      style={{
        height: '0px',
        borderWidth: '0px 0px 1px 0px',
        borderStyle: 'solid',
        borderColor: 'rgba(0,0,0,0.175)',
      }}
    />
  );
}

export function EditBases(props: Props) {
  let os = outlines(props.bases);
  return (
    <div
      className={formStyles.form}
      style={{ position: 'relative', width: '324px', height: '100%', overflow: 'auto' }}
    >
      <div style={{ position: 'absolute', top: '0px', right: '0px' }} >
        <CloseButton
          onClick={() => props.unmount()}
        />
      </div>
      <div style={{ margin: '16px 32px 0px 32px' }} >
        <Title />
      </div>
      <div style={{ margin: '8px 16px 0px 16px' }} >
        <TitleUnderline />
      </div>
      <div style={{ margin: '24px 40px 0px 40px' }} >
        {props.bases.length == 0 ? (
          <p className='unselectable' style={{ fontSize: '12px' }} >
            No bases are selected.
          </p>
        ) : (
          <div>
            {props.bases.length != 1 ? null : (
              <div style={{ marginBottom: '16px' }} >
                <CharacterField app={props.app} base={props.bases[0]} />
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
              <FillPicker app={props.app} bases={props.bases} />
              <div style={{ marginLeft: '10px' }} >
                <FillOpacityInput app={props.app} bases={props.bases} />
              </div>
              <div style={{ marginLeft: '8px' }} >
                <p className={`${colorFieldStyles.label} unselectable`} >
                  Color
                </p>
              </div>
            </div>
            <div style={{ marginTop: '16px' }} >
              <OutlineField app={props.app} bases={props.bases} />
            </div>
            {!allHaveOutlines(props.bases) ? null : (
              <div style={{ margin: '12px 0px 0px 16px' }} >
                <OutlineRadiusField app={props.app} outlines={os} />
                <div style={{ marginTop: '8px' }} >
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                    <OutlineStrokePicker app={props.app} outlines={os} />
                    <div style={{ marginLeft: '10px' }} >
                      <OutlineStrokeOpacityInput app={props.app} outlines={os} />
                    </div>
                    <div style={{ marginLeft: '8px' }} >
                      <p className={`${colorFieldStyles.label} unselectable`} >
                        Line Color
                      </p>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '8px' }} >
                  <OutlineStrokeWidthField app={props.app} outlines={os} />
                </div>
                <div style={{ marginTop: '8px' }} >
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                    <OutlineFillPicker app={props.app} outlines={os} />
                    <div style={{ marginLeft: '10px' }} >
                      <OutlineFillOpacityInput app={props.app} outlines={os} />
                    </div>
                    <div style={{ marginLeft: '8px' }} >
                      <p className={`${colorFieldStyles.label} unselectable`} >
                        Fill
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div style={{ marginTop: '16px' }} >
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                <BringToFrontButton app={props.app} bases={props.bases} />
                <div style={{ width: '16px' }} />
                <SendToBackButton app={props.app} bases={props.bases} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
