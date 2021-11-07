import * as React from 'react';
import formStyles from './EditDrawingTitle.css';
import { CloseButton } from 'Forms/buttons/CloseButton';
import { AppInterface as App } from 'AppInterface';
import { DrawingTitleInput } from './DrawingTitleInput';

export type Props = {
  app: App;

  unmount: () => void;
}

function Title() {
  return (
    <p
      className='unselectable'
      style={{ fontSize: '24px', color: 'rgba(0,0,0,1)' }}
    >
      Drawing Title
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
        borderColor: 'rgba(0,0,0,0.2)',
      }}
    />
  );
}

export function EditDrawingTitle(props: Props) {
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
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }} >
          <DrawingTitleInput app={props.app} />
        </div>
        <div style={{ marginTop: '8px' }} >
          <p
            className='unselectable'
            style={{ fontSize: '12px', fontStyle: 'italic', color: 'rgba(0,0,0,0.625)' }}
          >
            Defaults to the sequence ID.
          </p>
        </div>
      </div>
    </div>
  );
}
