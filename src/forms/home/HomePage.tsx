import { AppInterface as App } from '../../AppInterface';
import * as React from 'react';
import styles from './HomePage.css';
import { CreateNewDrawing } from '../new/CreateNewDrawing';
import { OpenRna2drawer } from '../open/OpenRna2drawer';
import { DrawingSlideshow } from './drawingSlideshow/DrawingSlideshow';

interface Props {
  app: App;
}

function Header() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }} >
      <div style={{ margin: '0px 64px', display: 'flex', flexDirection: 'row' }} >
        <p style={{ fontSize: '32px', color: 'rgba(0,0,0,1)' }} >RNA2Drawer</p>
        <div style={{ flexGrow: 1 }} ></div>
        <div style={{ display: 'flex', flexDirection: 'column' }} >
          <div style={{ flexGrow: 1 }} ></div>
          <p style={{ fontSize: '12px', fontStyle: 'italic', color: 'rgb(42 42 42)', textAlign: 'right' }} >
            Developed by Philip Johnson and Anne Simon
          </p>
          <p style={{ marginTop: '4px', fontSize: '12px', fontStyle: 'italic', color: 'rgb(42 42 42)', textAlign: 'right' }} >
            Last Updated on Dec. 14, 2021
          </p>
        </div>
      </div>
      <div style={{ marginTop: '8px' }} >
        <div className={styles.underline} />
      </div>
    </div>
  );
}

function Description() {
  return (
    <p style={{ fontSize: '16px', color: 'rgb(32 32 32)' }} >
      A web app for drawing and exploring nucleic acid structures...
    </p>
  );
}

const newAndOpenLinkStyles = {
  fontSize: '24px',
  color: 'rgb(23 15 216)',
  cursor: 'pointer',
};

function NewLink(props: Props) {
  return (
    <p
      className={styles.newAndOpenLinks}
      style={{ ...newAndOpenLinkStyles }}
      onClick={() => props.app.renderForm(close => (
        <CreateNewDrawing app={props.app} close={close} />
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
      style={{ ...newAndOpenLinkStyles }}
      onClick={() => props.app.renderForm(close => (
        <OpenRna2drawer app={props.app} close={close} />
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
      <p style={{ fontSize: '16px', color: 'rgb(32 32 32)' }} >
        Questions or comments? Email <EmailLink /> or visit the <GitHubPageLink /> for the user guide.
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
    <div
      className={styles.updatesNotice}
      style={{
        border: '2px dotted rgb(225 225 225)',
        borderRadius: '21px',
        height: '42px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <p style={{ margin: '0px 21px', fontSize: '14px', color: 'rgb(32 32 32)' }} >
        See the <UpdatesLink />! <em>(Dec. 14, 2021)</em>
      </p>
    </div>
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

export function HomePage(props: Props): React.ReactElement {
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
              <div style={{ margin: '0px 64px', flexGrow: 1, display: 'flex', flexDirection: 'row' }} >
                <NewLink {...props} />
                <div style={{ flexGrow: 1 }} ></div>
                <OpenLink {...props} />
              </div>
            </div>
            <div style={{ marginTop: '64px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }} >
              <HelpLinks />
            </div>
            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }} >
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
