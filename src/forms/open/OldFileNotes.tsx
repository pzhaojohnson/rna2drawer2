import * as React from 'react';
import styles from './OldFileNotes.css';

function Disclaimer() {
  return (
    <div className={styles.disclaimer} >
      <div className={styles.solidDot} />
      <div style={{ minWidth: '10px' }} />
      <p className={styles.disclaimerText} >
        Not all aspects of a drawing from the first version of RNA2Drawer
        (before the web app) will be preserved -
        <span style={{ fontWeight: 700, fontStyle: 'italic', color: '#101010' }}>
          &nbsp;The following will be preserved...
        </span>
      </p>
    </div>
  );
}

function PreservedAspect(
  props: {
    children?: React.ReactNode,
  },
) {
  return (
    <div className={styles.preservedAspect} >
      <div className={styles.hollowDot} />
      <div style={{ width: '8px' }} />
      <p className={styles.preservedAspectText} >
        {props.children}
      </p>
    </div>
  );
}

export function OldFileNotes() {
  return (
    <div className={styles.oldFileNotes} >
      <Disclaimer />
      <div style={{ margin: '15px 0px 0px 60px' }} >
        <PreservedAspect>The sequence and its ID</PreservedAspect>
        <PreservedAspect>The secondary structure</PreservedAspect>
        <PreservedAspect>Tertiary interactions and their colors</PreservedAspect>
        <PreservedAspect>Base numbering and the numbering offset</PreservedAspect>
        <PreservedAspect>Base colors and outlines</PreservedAspect>
      </div>
    </div>
  );
}
