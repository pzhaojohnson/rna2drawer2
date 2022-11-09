import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

import styles from './DrawingSlideshow.css';

import drawingSrc1 from './drawing1.svg';
import drawingSrc2 from './drawing2.svg';
import drawingSrc3 from './drawing3.svg';
import drawingSrc4 from './drawing4.svg';
import drawingSrc5 from './drawing5.svg';
import drawingSrc6 from './drawing6.svg';
import drawingSrc7 from './drawing7.svg';
import drawingSrc8 from './drawing8.svg';

// necessary for unit testing with Jest
// (if using the URL.createObjectURL method)
if (URL.createObjectURL == undefined) {
  console.error('URL.createObjectURL static method is undefined.');
  Object.defineProperty(URL, 'createObjectURL', { value: () => {} });
  console.error('Placeholder function assigned to URL.createObjectURL.');
}

// number of seconds that each drawing is shown in the slideshow
const interval = 6;

function DrawingImg(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      {...props}
      style={{
        width: '760px', // default width
        opacity: 0, // prevents flashing of drawing at end of animation
        animation: `${styles.drawingFadeInAndOut} ${interval}s ease-in-out`,
        ...props.style,
      }}
    />
  );
}

let drawingImg1 = (
  <DrawingImg
    src={drawingSrc1}
    alt='Example Drawing 1'
    style={{
      width: '740px',
    }}
  />
);

let drawingImg2 = (
  <DrawingImg
    src={drawingSrc2}
    alt='Example Drawing 2'
    style={{
      width: '860px',
    }}
  />
);

let drawingImg3 = (
  <DrawingImg
    src={drawingSrc3}
    alt='Example Drawing 3'
    style={{
      width: '880px',
      marginLeft: '4px',
    }}
  />
);

let drawingImg4 = (
  <DrawingImg
    src={drawingSrc4}
    alt='Example Drawing 4'
    style={{
      width: '510px',
      marginLeft: '50px',
    }}
  />
);

let drawingImg5 = (
  <DrawingImg
    src={drawingSrc5}
    alt='Example Drawing 5'
    style={{
      width: '740px',
    }}
  />
);

let drawingImg6 = (
  <DrawingImg
    src={drawingSrc6}
    alt='Example Drawing 6'
    style={{
      width: '740px',
    }}
  />
);

let drawingImg7 = (
  <DrawingImg
    src={drawingSrc7}
    alt='Example Drawing 7'
    style={{
      width: '720px',
      marginLeft: '6px',
    }}
  />
);

let drawingImg8 = (
  <DrawingImg
    src={drawingSrc8}
    alt='Example Drawing 8'
    style={{
      width: '920px',
    }}
  />
);

let drawingImgs = [
  drawingImg1,
  drawingImg2,
  drawingImg3,
  drawingImg4,
  drawingImg5,
  drawingImg6,
  drawingImg7,
  drawingImg8,
];

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

export function DrawingSlideshow() {
  let initialDrawingIndex = pickRandomIndex(drawingImgs.length);
  let [drawingIndex, setDrawingIndex] = useState(initialDrawingIndex);

  let drawingImg = drawingImgs[drawingIndex];

  // should be incremented every time the drawing changes
  // to trigger animations
  let [drawingKey, setDrawingKey] = useState(0);

  useEffect(() => {
    let nextDrawingIndex = pickRandomIndex(drawingImgs.length, drawingIndex);

    let timeoutId = setTimeout(
      () => {
        setDrawingIndex(nextDrawingIndex);
        setDrawingKey(drawingKey + 1);
      },
      1000 * interval,
    );

    return () => clearTimeout(timeoutId);
  });

  return (
    <div className={styles.drawingSlideshow} >
      <div key={drawingKey} >
        {drawingImg}
      </div>
    </div>
  );
}
