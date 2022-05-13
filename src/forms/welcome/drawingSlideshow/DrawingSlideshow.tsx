import * as React from 'react';
import { useState, useEffect } from 'react';
import styles from './DrawingSlideshow.css';
import { v1 as uuidv1 } from 'uuid';

import { drawingString1 } from './drawing1';
import { drawingString2 } from './drawing2';
import { drawingString3 } from './drawing3';
import { drawingString4 } from './drawing4';
import { drawingString5 } from './drawing5';
import { drawingString6 } from './drawing6';
import { drawingString7 } from './drawing7';
import { drawingString8 } from './drawing8';

let drawingStrings = [
  drawingString1,
  drawingString2,
  drawingString3,
  drawingString4,
  drawingString5,
  drawingString6,
  drawingString7,
  drawingString8,
];

// necessary for unit testing with Jest
if (URL.createObjectURL == undefined) {
  console.error('URL.createObjectURL static method is undefined.');
  Object.defineProperty(URL, 'createObjectURL', { value: () => {} });
  console.error('Placeholder function assigned to URL.createObjectURL.');
}

let drawingURLs = (
  drawingStrings.map(drawingString => (
    URL.createObjectURL(
      new Blob([drawingString], { type: 'image/svg+xml' })
    )
  ))
);

function pickRandomIndex() {
  return Math.floor(Math.random() * drawingStrings.length);
}

interface Props {
  style?: {
    width?: string,
  }
}

export function DrawingSlideshow(props: Props) {
  let [index, setIndex] = useState(pickRandomIndex());

  let drawingURL = drawingURLs[index];

  let interval = 6;

  useEffect(() => {
    let nextIndex = pickRandomIndex();
    if (nextIndex == index) {
      nextIndex++;
    }
    if (nextIndex >= drawingStrings.length) {
      nextIndex = 0;
    }
    let timeoutId = setTimeout(() => setIndex(nextIndex), 1000 * interval);
    return () => clearTimeout(timeoutId);
  });

  return (
    <img
      key={uuidv1()}
      src={drawingURL}
      alt='Drawing'
      style={{
        ...(props.style ?? {}),
        opacity: 0,
        animation: `${styles.enterAndLeave} ${interval}s ease-in-out`
      }}
    />
  );
}
