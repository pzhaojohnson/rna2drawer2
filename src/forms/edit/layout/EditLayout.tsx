import * as React from 'react';
import { CloseButton } from 'Forms/buttons/CloseButton';
import styles from './EditLayout.css';
import { AppInterface as App } from 'AppInterface';
import { RotationField } from './RotationField';
import { FlatOutermostLoopField } from './FlatOutermostLoopField';
import { hasFlatOutermostLoop } from './hasFlatOutermostLoop';
import { TerminiGapField } from './TerminiGapField';

function Title() {
  return (
    <p
      className='unselectable'
      style={{ fontSize: '24px', color: 'rgba(0,0,0,1)' }}
    >
      Layout
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

export type Props = {
  app: App;
  unmount: () => void;
}

export function EditLayout(props: Props) {
  return (
    <div
      className={styles.form}
      style={{
        position: 'relative',
        width: '324px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
      }}
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
      <div style={{ margin: '24px 40px 8px 40px' }} >
        <RotationField app={props.app} />
        <div style={{ marginTop: '12px' }} >
          <FlatOutermostLoopField app={props.app} />
        </div>
        {hasFlatOutermostLoop(props.app.strictDrawing) ? null : (
          <div style={{ marginTop: '12px' }} >
            <TerminiGapField app={props.app} />
          </div>
        )}
      </div>
    </div>
  );
}
