import { AppInterface as App } from '../../AppInterface';
import * as React from 'react';
import styles from './HomePage.css';
import { Underline } from '../containers/Underline';
import { CreateNewDrawing } from '../new/CreateNewDrawing';
import { OpenRna2drawer } from '../open/OpenRna2drawer';
import { DrawingSlideshow } from './drawingSlideshow/DrawingSlideshow';

interface Props {
  app: App;
}

function Header() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }} >
      <div style={{ margin: '0px 60px', display: 'flex', flexDirection: 'row' }} >
        <p style={{ fontSize: '32px', color: 'rgba(0,0,0,1)' }} >RNA2Drawer</p>
        <div style={{ flexGrow: 1 }} ></div>
        <div style={{ display: 'flex', flexDirection: 'column' }} >
          <div style={{ flexGrow: 1 }} ></div>
          <p style={{ fontSize: '12px' }} ><em>Last Updated on Nov. 29, 2020</em></p>
        </div>
      </div>
      <Underline margin={'8px 0px 0px 0px'} />
    </div>
  );
}

function Description() {
  return (
    <p style={{ fontSize: '16px' }} >
      A tool for drawing and exploring nucleic acid structures...
    </p>
  );
}

const newAndOpenLinkStyles = {
  fontSize: '24px',
  color: 'rgba(0,0,255,0.8)',
  cursor: 'pointer',
};

function NewLink(props: Props) {
  return (
    <p
      className={styles.newAndOpenLinks}
      style={{ ...newAndOpenLinkStyles }}
      onClick={() => props.app.renderForm(close => (
        <CreateNewDrawing app={props.app} close={close ?? (() => props.app.unmountCurrForm())} />
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
        <OpenRna2drawer app={props.app} close={close ?? (() => props.app.unmountCurrForm())} />
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
      href='https://github.com/pzhaojohnson/rna2drawer2#rna2drawer-2'
    >
      GitHub page
    </a>
  );
}

function HelpLinks() {
  return (
    <div style={{ minHeight: '28px' }} >
      <p style={{ fontSize: '16px' }} >
        Questions? Email <EmailLink /> or visit the <GitHubPageLink />.
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
        height: '1600px',
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
          style={{ marginTop: '120px', width: '960px', display: 'flex', flexDirection: 'column' }}
        >
          <Header />
          <div style={{ margin: '0px 84px', display: 'flex', flexDirection: 'column' }} >
            <div style={{ marginTop: '24px' }} >
              <Description />
            </div>
            <div style={{ marginTop: '60px', display: 'flex', flexDirection: 'row' }} >
              <div style={{ margin: '0px 60px', flexGrow: 1, display: 'flex', flexDirection: 'row' }} >
                <NewLink {...props} />
                <div style={{ flexGrow: 1 }} ></div>
                <OpenLink {...props} />
              </div>
            </div>
            <div style={{ marginTop: '60px' }} >
              <HelpLinks />
            </div>
          </div>
        </div>
        <div style={{ height: '60px' }} ></div>
        <Slideshow />
      </div>
    </div>
  );
}
