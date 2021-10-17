import * as React from 'react';
import { useState } from 'react';
import { SketchPicker, ColorResult } from 'react-color';
import styles from './ColorPicker.css';
import * as SVG from '@svgdotjs/svg.js';
import { parseColors } from './parseColors';
import { FiniteList } from './FiniteList';

const colorsPerRow = 8;

let fixedColors = parseColors([
  '#800000', '#FF0000', '#F5A623', '#FFF000', '#C56200', '#8B572A', '#194D33', '#228B22',
  '#7ED321', '#B8E986', '#FDA1FF', '#BD10E0', '#9013FE', '#4A148C', '#111DD6', '#009CE0',
  '#73D8FF', '#50E3C2', '#000000', '#4A4A4A', '#9B9B9B', '#D3D3D3', '#FFFFFF',
]);

let recentColors = new FiniteList<SVG.Color>(
  (2 * colorsPerRow) + (colorsPerRow - (fixedColors.length % colorsPerRow))
);

export type Value = {
  color: SVG.Color;
  alpha?: number;
}

function toRgba(v: Value): string {
  return `rgba(${v.color.r}, ${v.color.g}, ${v.color.b}, ${v.alpha ?? 1})`;
}

// returns undefined if unable to convert to a value
function toValue(result: ColorResult): Value | undefined {
  try {
    let rgb = result.rgb;
    return {
      color: new SVG.Color(rgb.r, rgb.g, rgb.b, 'rgb'),
      alpha: rgb.a,
    };
  } catch (error) {
    console.error(error);
    console.error(`Unable to process color result: ${result}.`);
  }
}

type SwatchProps = {
  value?: Value;
  onClick: () => void;
}

function Swatch(props: SwatchProps) {
  return (
    <div
      className={styles.swatch}
      onClick={() => props.onClick()}
    >
      <div
        className={styles.swatchColoring}
        style={{
          background: props.value ? toRgba(props.value) : 'rgba(255,255,255,0)',
        }}
      />
    </div>
  );
}

export type CloseEvent = {
  target: {
    value: Value | undefined;
  }
}

export type Props = {
  value?: Value;
  onClose?: (event: CloseEvent) => void;
  disableAlpha?: boolean;
}

export function ColorPicker(props: Props) {
  let [value, setValue] = useState<Value | undefined>(props.value);
  let [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <div style={{ display: 'inline-block' }} >
        <Swatch
          value={value}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      {!isOpen ? null : (
        <div style={{ position: 'absolute', zIndex: 2 }} >
          <div
            onClick={() => {
              setIsOpen(false);

              if (props.onClose) {
                props.onClose({ target: { value: value } });
              }

              // only on close to avoid remembering too many colors
              if (value) {
                recentColors.push(value.color);
              }
            }}
            style={{ position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px' }}
          />
          <SketchPicker
            presetColors={fixedColors.concat(recentColors.values()).map(c => c.toHex())}
            color={value ? toRgba(value) : undefined}
            onChange={result => {
              let v = toValue(result);
              if (v) {
                setValue(v);
              }
            }}
            disableAlpha={props.disableAlpha}
          />
        </div>
      )}
    </div>
  );
}
