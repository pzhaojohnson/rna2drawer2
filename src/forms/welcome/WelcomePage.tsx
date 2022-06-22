import type { App } from 'App';

import * as React from 'react';
import styles from './WelcomePage.css';

import { Header } from './Header';
import { DrawingSlideshow } from './drawings/DrawingSlideshow';

import { CreateNewDrawing } from 'Forms/new/CreateNewDrawing';
import { OpenRna2drawer } from 'Forms/open/OpenRna2drawer';

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;
}

function AppDescription() {
  return (
    <p className={styles.appDescription} >
      A web app for drawing and exploring nucleic acid structures...
    </p>
  );
}

function NewButton(props: Props) {
  return (
    <p
      className={styles.newAndOpenButtons}
      onClick={() => props.app.formContainer.renderForm(formProps => (
        <CreateNewDrawing app={props.app} close={formProps.unmount} />
      ))}
    >
      Create a New Drawing
    </p>
  );
}

function OpenButton(props: Props) {
  return (
    <p
      className={styles.newAndOpenButtons}
      onClick={() => props.app.formContainer.renderForm(formProps => (
        <OpenRna2drawer app={props.app} close={formProps.unmount} />
      ))}
    >
      Open a Saved Drawing
    </p>
  );
}

function HelpEmailLink() {
  return (
    <a
      className={styles.moreInfoLinks}
      href='mailto:help@rna2drawer.app'
    >
      help@rna2drawer.app
    </a>
  );
}

function GitHubLink() {
  return (
    <a
      className={styles.moreInfoLinks}
      href='https://github.com/pzhaojohnson/rna2drawer2/blob/main/README.md'
    >
      GitHub page
    </a>
  );
}

function MoreInfo() {
  return (
    <p style={{ marginTop: '64px', alignSelf: 'center', fontSize: '16px', fontWeight: 500, color: 'rgb(100, 100, 116)' }} >
      Want to learn more? Email <HelpEmailLink /> or visit the <GitHubLink /> for the user guide.
    </p>
  );
}

function UpdatesLink() {
  return (
    <a
      className={styles.updatesLink}
      href='https://github.com/pzhaojohnson/rna2drawer2/releases'
    >
      Latest Updates
    </a>
  );
}

function UpdatesNotice() {
  return (
    <p
      className={styles.updatesNotice}
      style={{ marginTop: '8px', alignSelf: 'center', fontSize: '14px', fontWeight: 500, color: 'rgb(100, 100, 111)' }}
    >
      See the <UpdatesLink />! <em style={{ color: 'rgb(109, 109, 124)' }} >(Dec. 14, 2021)</em>
    </p>
  );
}

function Slideshow() {
  return (
    <div
      className={styles.slideshow}
      style={{
        marginTop: '48px',
        width: '960px',
        height: '1520px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <DrawingSlideshow style={{ width: '760px' }} />
    </div>
  );
}

export function WelcomePage(props: Props): React.ReactElement {
  return (
    <div style={{ width: '100vw', height: '100%', overflow: 'auto' }} >
      <div style={{ margin: '0px auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
        <div
          className={styles.onTop}
          style={{ marginTop: '128px', width: '960px', display: 'flex', flexDirection: 'column' }}
        >
          <Header />
          <div style={{ margin: '0px 96px', display: 'flex', flexDirection: 'column' }} >
            <AppDescription />
            <div style={{ margin: '64px 44px 0', flexGrow: 1, display: 'flex', flexDirection: 'row' }} >
              <NewButton {...props} />
              <div style={{ width: '29px' }} ></div>
              <OpenButton {...props} />
            </div>
            <MoreInfo />
            <UpdatesNotice />
          </div>
        </div>
        <Slideshow />
      </div>
    </div>
  );
}
