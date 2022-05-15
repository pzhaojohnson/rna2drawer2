import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

import styles from './DrawingSlideshow.css';

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

/**
 * Picks a random index less than the given ceiling
 * and that is not the given previous index if specified.
 *
 * It is undefined what index is returned when the ceiling is 1
 * and the previous index is 0.
 */
function pickRandomIndex(ceiling: number, previous?: number): number {
  let index = Math.floor(Math.random() * ceiling);
  if (index == previous) {
    index++;
  }
  if (index >= ceiling) {
    index = 0;
  }
  return index;
}

interface Props {
  style?: React.CSSProperties;
}

export function DrawingSlideshow(props: Props) {
  let [drawingIndex, setDrawingIndex] = useState(pickRandomIndex(drawingURLs.length));
  let drawingURL = drawingURLs[drawingIndex];

  // should be incremented every time the drawing changes
  // to trigger animations
  let [key, setKey] = useState(0);

  let interval = 6;

  useEffect(() => {
    let nextDrawingIndex = pickRandomIndex(drawingURLs.length, drawingIndex);

    let timeoutId = setTimeout(
      () => {
        setDrawingIndex(nextDrawingIndex);
        setKey(key + 1);
      },
      1000 * interval,
    );

    return () => clearTimeout(timeoutId);
  });

  return (
    <img
      key={key}
      src={drawingURL}
      alt='Example Drawing'
      style={{
        ...props.style,
        opacity: 0, // prevents flashing of drawing at end of animation
        animation: `${styles.fadeInAndOut} ${interval}s ease-in-out`
      }}
    />
  );
}