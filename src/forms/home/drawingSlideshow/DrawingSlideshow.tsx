import * as React from 'react';
import { useState, useEffect } from 'react';
import styles from './DrawingSlideshow.css';
import { v1 as uuidv1 } from 'uuid';

import drawing1 from './drawing1.svg';
import drawing2 from './drawing2.svg';
import drawing3 from './drawing3.svg';
import drawing4 from './drawing4.svg';
import drawing5 from './drawing5.svg';
import drawing6 from './drawing6.svg';
import drawing7 from './drawing7.svg';
import drawing8 from './drawing8.svg';

const drawings = [
  drawing1,
  drawing2,
  drawing3,
  drawing4,
  drawing5,
  drawing6,
  drawing7,
  drawing8,
];

function pickRandomIndex() {
  return Math.floor(Math.random() * drawings.length);
}

interface Props {
  style?: {
    width?: string,
  }
}

export function DrawingSlideshow(props: Props) {
  let [index, setIndex] = useState(pickRandomIndex());
  let interval = 6;
  useEffect(() => {
    let nextIndex = pickRandomIndex();
    if (nextIndex == index) {
      nextIndex++;
    }
    if (nextIndex >= drawings.length) {
      nextIndex = 0;
    }
    let timeoutId = setTimeout(() => setIndex(nextIndex), 1000 * interval);
    return () => clearTimeout(timeoutId);
  });
  return (
    <img
      key={uuidv1()}
      src={drawings[index]}
      alt='Drawing'
      style={{
        ...(props.style ?? {}),
        opacity: 0,
        animation: `${styles.enterAndLeave} ${interval}s ease-in-out`
      }}
    />
  );
}
