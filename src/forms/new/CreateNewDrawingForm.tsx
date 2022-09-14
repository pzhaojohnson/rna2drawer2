import type { App } from 'App';

import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

import styles from './CreateNewDrawingForm.css';

import { FloatingDrawingsContainer } from 'Forms/containers/floating-drawings/FloatingDrawingsContainer';

import { FormatSelect } from './FormatSelect';
import type { Format } from './FormatSelect';

import { EnterDotBracketSection } from 'Forms/new/dot-bracket/EnterDotBracketSection';
import { OpenCTFileSection } from 'Forms/new/ct/OpenCTFileSection';

function Title() {
  return (
    <p className={styles.title} >
      Create a New Drawing
    </p>
  );
}

function HeaderUnderline() {
  return (
    <div className={styles.headerUnderline} />
  );
}

function Header(
  props: {
    children: React.ReactNode,
  },
) {
  return (
    <div className={styles.header} >
      <div style={{ display: 'flex', alignItems: 'center' }} >
        <Title />
        <div style={{ flexGrow: 1 }} />
        {props.children}
      </div>
      <HeaderUnderline />
    </div>
  );
}

// keeps track of whether the form is mounted or not
let isMounted = false;

// to be remembered between mountings and unmountings
let lastFormat: Format = 'Dot-Bracket';

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;

  /**
   * A callback to close the form.
   *
   * Is called when the drawing of the app has been successfully
   * initialized with the structure input by the user.
   */
  close: () => void;
};

export function CreateNewDrawingForm(props: Props) {
  let [format, setFormat] = useState<Format>(lastFormat);

  let formatSelect = (
    <FormatSelect
      value={format}
      onChange={event => setFormat(event.target.value)}
    />
  );

  let header = (
    <Header>
      {formatSelect}
    </Header>
  );

  let bodyStyle = {
    animation: isMounted ? `${styles.bodyEnter} 0.5s` : undefined,
  };

  let bodyKey = format; // for animations when the format changes

  let body = (
    <div key={bodyKey} className={styles.body} style={bodyStyle} >
      {format == 'CT' ? (
        <OpenCTFileSection app={props.app} close={props.close} />
      ): (
        <EnterDotBracketSection app={props.app} close={props.close} />
      )}
    </div>
  );

  useEffect(() => {
    isMounted = true;

    return () => {
      isMounted = false;
      lastFormat = format;
    };
  });

  return (
    <FloatingDrawingsContainer
      contained={
        <div>
          {header}
          {body}
        </div>
      }
    />
  );
}
