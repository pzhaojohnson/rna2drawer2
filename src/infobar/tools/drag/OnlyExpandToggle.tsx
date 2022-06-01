import type { App } from 'App';

import { userIsTyping } from 'Utilities/userIsTyping';

import * as React from 'react';
import { useEffect } from 'react';

import styles from './OnlyExpandToggle.css';

const toggleMessage = document.createElement('p');
toggleMessage.className = styles.toggleMessage;
toggleMessage.textContent = 'Toggle (E) to disable condensing of linker regions.';

const untoggleMessage = document.createElement('p');
untoggleMessage.className = styles.toggleMessage;
untoggleMessage.textContent = 'Untoggle (E) to enable condensing of linker regions.';

function Check() {
  return (
    <svg
      className={styles.check}
      width="10.5px"
      height="10.5px"
      viewBox="0 0 96 96"
      xmlns="http://www.w3.org/2000/svg"
      overflow="hidden"
    >
      <path
        d="M86.1 15.8 34.9 64.2 10.3 39 1.8 47.1 34.5 80.7 43.1 72.7 94.2 24.2Z"
        stroke="#0D0D63"
        strokeWidth="2.25"
        fill="#0D0D63"
      />
    </svg>
  );
}

export type Props = {
  app: App; // a reference to the whole app
};

export function OnlyExpandToggle(props: Props) {
  let drawingInteraction = props.app.drawingInteraction;
  let draggingTool = drawingInteraction.draggingTool;

  let toggle = () => {
    draggingTool.condenseLinkers = !draggingTool.condenseLinkers;
    props.app.refresh();
  };

  let handleKeyDown = (event: KeyboardEvent) => {
    if (event.key.toLowerCase() == 'e' && !event.repeat && !userIsTyping()) {
      toggle();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div
      className={`
        ${styles.onlyExpandToggle}
        ${draggingTool.condenseLinkers ? styles.untoggled : styles.toggled}
      `}
      onClick={toggle}
      onMouseEnter={() => {
        drawingInteraction.overlaidMessageContainer.clear();
        let message = draggingTool.condenseLinkers ? toggleMessage : untoggleMessage;
        drawingInteraction.overlaidMessageContainer.append(message);
        drawingInteraction.overlaidMessageContainer.placeOver(props.app.strictDrawing.drawing);
      }}
      onMouseLeave={() => {
        drawingInteraction.overlaidMessageContainer.clear();
      }}
    >
      <p className={styles.text} >
        Only Expand
      </p>
      <div className={styles.spacer} />
      <Check />
    </div>
  );
}
