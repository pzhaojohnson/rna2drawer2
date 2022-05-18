import * as React from 'react';
import styles from './OldFileNotes.css';

function Disclaimer() {
  return (
    <div className={styles.disclaimer} >
      <p className={styles.disclaimerText} >
        Old drawings from the first version of RNA2Drawer (before the web app) will not be perfectly preserved.
      </p>
    </div>
  );
}

function PreservedAspectsLeadingText() {
  return (
    <p className={styles.preservedAspectsLeadingText} >
      Only the following will be preserved for these drawings...
    </p>
  );
}

function PreservedAspect(
  props: {
    children?: React.ReactNode,
  },
) {
  return (
    <div className={styles.preservedAspect} >
      <div className={styles.solidDot} />
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
      <PreservedAspectsLeadingText />
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
