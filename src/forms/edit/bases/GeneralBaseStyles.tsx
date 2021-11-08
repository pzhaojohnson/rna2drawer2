import * as React from 'react';
import { CloseButton } from 'Forms/buttons/CloseButton';
import formStyles from './GeneralBaseStyles.css';
import { AppInterface as App } from 'AppInterface';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import { FontFamilyField } from './FontFamilyField';
import { FontSizeField } from './FontSizeField';
import { BoldField } from './BoldField';
import { WidthField } from './WidthField';
import { HeightField } from './HeightField';

export type Props = {
  app: App;

  // the bases to edit
  bases: Base[];

  unmount: () => void;
}

function Title() {
  return (
    <p
      className='unselectable'
      style={{ fontSize: '24px', color: 'rgba(0,0,0,1)' }}
    >
      General Base Styles
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

export function GeneralBaseStyles(props: Props) {
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
          <p className={'unselectable'} style={{ fontSize: '12px' }} >
            No bases are selected.
          </p>
        ) : (
          <div>
            <FontFamilyField app={props.app} bases={props.bases} />
            <div style={{ marginTop: '8px' }} >
              <FontSizeField app={props.app} bases={props.bases} />
            </div>
            <div style={{ marginTop: '8px' }} >
              <BoldField app={props.app} bases={props.bases} />
            </div>
            <div style={{ marginTop: '16px' }} >
              <WidthField app={props.app} />
            </div>
            <div style={{ marginTop: '8px' }} >
              <HeightField app={props.app} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
