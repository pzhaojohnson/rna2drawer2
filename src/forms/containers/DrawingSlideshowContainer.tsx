import * as React from 'react';
import styles from './DrawingSlideshowContainer.css';
import { DrawingSlideshow } from '../drawingSlideshow/DrawingSlideshow';

interface Props {
  contained: React.ReactElement;
}

export function DrawingSlideshowContainer(props: Props): React.ReactElement {
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
        <div style={{ marginRight: '144px', flexGrow: 1, display: 'flex', flexDirection: 'column' }} >
          <div style={{ flexGrow: 1, flexBasis: '0px' }} ></div>
          <div style={{ height: '72px' }} ></div>
          <div style={{ flexGrow: 1, flexBasis: '0px', overflow: 'hidden', position: 'relative' }} >
            <div style={{ position: 'absolute', top: '0px', right: '0px', opacity: 0.5 }} >
              <DrawingSlideshow style={{ width: '720px' }} />
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
        <div style={{ marginLeft: '144px', flexGrow: 1, display: 'flex', flexDirection: 'column' }} >
          <div style={{ flexGrow: 1, flexBasis: '0px', overflow: 'hidden', position: 'relative' }} >
            <div style={{ position: 'absolute', bottom: '0px', left: '0px', opacity: 0.5 }} >
              <DrawingSlideshow style={{ width: '720px' }} />
            </div>
          </div>
          <div style={{ height: '72px' }} ></div>
          <div style={{ flexGrow: 1, flexBasis: '0px' }} ></div>
        </div>
      </div>
    </div>
  );
}
