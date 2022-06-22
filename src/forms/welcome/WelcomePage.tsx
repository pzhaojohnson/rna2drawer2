import type { App } from 'App';

import * as React from 'react';
import styles from './WelcomePage.css';

import { Header } from './Header';
import { DrawingSlideshow } from './drawings/DrawingSlideshow';

import { CreateNewDrawing } from 'Forms/new/CreateNewDrawing';
import { OpenRna2drawer } from 'Forms/open/OpenRna2drawer';

interface Props {
  app: App;
}

function Description() {
  return (
    <p style={{ fontSize: '16px', fontWeight: 500, color: 'rgb(100, 100, 116)' }} >
      A web app for drawing and exploring nucleic acid structures...
    </p>
  );
}

function NewLink(props: Props) {
  return (
    <p
      className={styles.newAndOpenLinks}
      onClick={() => props.app.formContainer.renderForm(newFormProps => (
        <CreateNewDrawing app={props.app} close={newFormProps.unmount} />
      ))}
    >
      Create a New Drawing
    </p>
  );
}

function OpenLink(props: Props) {
  return (
    <p
      className={styles.newAndOpenLinks}
      onClick={() => props.app.formContainer.renderForm(openFormProps => (
        <OpenRna2drawer app={props.app} close={openFormProps.unmount} />
      ))}
    >
      Open a Saved Drawing
    </p>
  );
}

function EmailLink() {
  return (
    <a
      className={styles.helpLinks}
      href='mailto:help@rna2drawer.app'
    >
      help@rna2drawer.app
    </a>
  );
}

function GitHubPageLink() {
  return (
    <a
      className={styles.helpLinks}
      href='https://github.com/pzhaojohnson/rna2drawer2/blob/main/README.md'
    >
      GitHub page
    </a>
  );
}

function HelpLinks() {
  return (
    <div style={{ minHeight: '28px' }} >
      <p style={{ fontSize: '16px', fontWeight: 500, color: 'rgb(100, 100, 116)' }} >
        Want to learn more? Email <EmailLink /> or visit the <GitHubPageLink /> for the user guide.
      </p>
    </div>
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
      style={{ fontSize: '14px', fontWeight: 500, color: 'rgb(100, 100, 111)' }}
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
            <div style={{ marginTop: '32px' }} >
              <Description />
            </div>
            <div style={{ marginTop: '64px', display: 'flex', flexDirection: 'row' }} >
              <div style={{ margin: '0px 44px', flexGrow: 1, display: 'flex', flexDirection: 'row' }} >
                <NewLink {...props} />
                <div style={{ width: '29px' }} ></div>
                <OpenLink {...props} />
              </div>
            </div>
            <div style={{ marginTop: '64px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }} >
              <HelpLinks />
            </div>
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }} >
              <UpdatesNotice />
            </div>
          </div>
        </div>
        <div style={{ height: '48px' }} ></div>
        <Slideshow />
      </div>
    </div>
  );
}
