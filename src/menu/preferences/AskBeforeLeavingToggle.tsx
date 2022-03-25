import * as React from 'react';
import styles from './AskBeforeLeavingToggle.css';
import type { App } from 'App';

export type Props = {
  app: App;
}

export class AskBeforeLeavingToggle extends React.Component<Props> {
  render() {
    let askBeforeLeaving = this.props.app.preferences.askBeforeLeaving;
    // will display as OFF when the askBeforeLeaving preference is false or undefined
    return (
      <div
        className={`
          ${styles.askBeforeLeavingToggle}
          ${askBeforeLeaving ? styles.on : styles.off}
        `}
        onClick={() => this.handleClick()}
      >
        <div className={`${styles.textContainer}`} >
          <p className={`${styles.text}`} >
            {`Ask Before Leaving: ${askBeforeLeaving ? 'ON' : 'OFF'}`}
          </p>
        </div>
      </div>
    );
  }

  handleClick() {
    let askBeforeLeaving = this.props.app.preferences.askBeforeLeaving;
    this.props.app.preferences.askBeforeLeaving = !askBeforeLeaving;
    this.props.app.refresh();
  }
}
