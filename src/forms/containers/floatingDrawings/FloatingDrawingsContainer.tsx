import * as React from 'react';
import styles from './FloatingDrawingsContainer.css';
import lowerLeftDrawing from './lowerLeftDrawing.svg';
import upperRightDrawing from './upperRightDrawing.svg';

const drawingsOpacity = 0.125;

function LowerLeftDrawing() {
  return (
    <div
      style={{
        width: '939px',
        height: '1390px',
        overflow: 'hidden'
      }}
    >
      <img
        src={lowerLeftDrawing}
        alt='Lower Left Drawing'
        style={{
          position: 'relative',
          top: '-635px',
          left: '-645px',
          width: '2217px',
          opacity: drawingsOpacity,
        }}
      />
    </div>
  );
}

function UpperRightDrawing() {
  return (
    <div
      style={{
        width: '531px',
        height: '575px',
        overflow: 'hidden'
      }}
    >
      <img
        src={upperRightDrawing}
        alt='Upper Right Drawing'
        style={{
          position: 'relative',
          top: '-640px',
          left: '-650px',
          width: '1811px',
          opacity: drawingsOpacity,
        }}
      />
    </div>
  );
}

interface Props {
  contained: React.ReactElement;
}

export function FloatingDrawingsContainer(props: Props): React.ReactElement {
  // floating animation is choppy on Firefox
  let browserIsFirefox = window.navigator.userAgent.toLowerCase().includes('firefox');
  return (
    <div
      className={styles.container}
      style={{
        width: '100vw',
        height: '100%',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
      }}
    >
      <div style={{ flexGrow: 1, flexBasis: '0px', display: 'flex', alignItems: 'stretch' }} >
        <div style={{ marginRight: '96px', flexGrow: 1, display: 'flex', flexDirection: 'column' }} >
          <div style={{ flexGrow: 1, flexBasis: '0px' }} ></div>
          <div style={{ flexGrow: 1, flexBasis: '0px', overflow: 'hidden', position: 'relative' }} >
            <div
              className={browserIsFirefox ? undefined : styles.lowerLeftFloater}
              style={{ position: 'absolute', top: '0px', right: '0px' }}
            >
              <LowerLeftDrawing />
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }} >
        <div style={{ margin: '24px 0px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }} >
          {props.contained}
        </div>
      </div>
      <div style={{ flexGrow: 1, flexBasis: '0px', display: 'flex', flexDirection: 'column' }} >
        <div style={{ marginLeft: '48px', flexGrow: 1, display: 'flex', flexDirection: 'column' }} >
          <div style={{ flexGrow: 1, flexBasis: '0px', overflow: 'hidden', position: 'relative' }} >
            <div
              className={browserIsFirefox ? undefined : styles.upperRightFloater}
              style={{ position: 'absolute', bottom: '0px', left: '0px' }}
            >
              <UpperRightDrawing />
            </div>
          </div>
          <div style={{ height: '48px' }} ></div>
          <div style={{ flexGrow: 1, flexBasis: '0px' }} ></div>
        </div>
      </div>
    </div>
  );
}
