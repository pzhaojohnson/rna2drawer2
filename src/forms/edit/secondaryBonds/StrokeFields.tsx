import * as React from 'react';
import { AppInterface as App } from '../../../AppInterface';
import { SecondaryBondInterface as SecondaryBond } from '../../../draw/StraightBondInterface';
import { ColorField } from '../../fields/color/ColorField';
import * as Svg from '@svgdotjs/svg.js';
import { parseColor } from '../../../parse/parseColor';
import { areAllSameColor } from '../../fields/color/areAllSameColor';
import { getAtIndex } from '../../../array/getAtIndex';

export function getAutBonds(app: App): SecondaryBond[] {
  let bs = [] as SecondaryBond[];
  app.strictDrawing.drawing.forEachSecondaryBond(sb => {
    if (sb.isAUT()) {
      bs.push(sb);
    }
  });
  return bs;
}

export function getGcBonds(app: App): SecondaryBond[] {
  let bs = [] as SecondaryBond[];
  app.strictDrawing.drawing.forEachSecondaryBond(sb => {
    if (sb.isGC()) {
      bs.push(sb);
    }
  });
  return bs;
}

export function getGutBonds(app: App): SecondaryBond[] {
  let bs = [] as SecondaryBond[];
  app.strictDrawing.drawing.forEachSecondaryBond(sb => {
    if (sb.isGUT()) {
      bs.push(sb);
    }
  });
  return bs;
}

export function getOtherBonds(app: App): SecondaryBond[] {
  let bs = [] as SecondaryBond[];
  app.strictDrawing.drawing.forEachSecondaryBond(sb => {
    if (!sb.isAUT() && !sb.isGC() && !sb.isGUT()) {
      bs.push(sb);
    }
  });
  return bs;
}

function getStrokes(sbs: SecondaryBond[]): Svg.Color[] {
  let ss = [] as Svg.Color[];
  sbs.forEach(sb => {
    let s = parseColor(sb.stroke);
    if (s) {
      ss.push(s);
    }
  });
  return ss;
}

interface Props {
  name: string;
  getBonds: () => SecondaryBond[];
  pushUndo: () => void;
  changed: () => void;
}

function StrokeField(props: Props): React.ReactElement | null {
  let bs = props.getBonds();
  let initialValue = undefined;
  if (bs.length > 0) {
    let currSs = getStrokes(bs);
    let first = getAtIndex(currSs, 0);
    if (areAllSameColor(currSs) && first) {
      initialValue = { color: first.toHex(), opacity: 1 };
    }
  }
  return bs.length == 0 ? null : (
    <ColorField
      name={props.name}
      initialValue={initialValue}
      set={co => {
        let s = parseColor(co.color);
        if (s) {
          let bs = props.getBonds();
          if (bs.length > 0) {
            let currSs = getStrokes(bs);
            let first = getAtIndex(currSs, 0);
            if (!areAllSameColor(currSs) || (first && s.toHex() != first.toHex())) {
              props.pushUndo();
              bs.forEach(b => {
                if (s) {
                  b.stroke = s.toHex();
                }
              });
              props.changed();
            }
          }
        }
      }}
      disableAlpha={true}
    />
  );
}

export function AutStrokeField(props: { app: App }): React.ReactElement | null {
  return (
    <StrokeField
      name='AUT Bonds'
      getBonds={() => getAutBonds(props.app)}
      pushUndo={() => props.app.pushUndo()}
      changed={() => props.app.drawingChangedNotByInteraction()}
    />
  );
}

export function GcStrokeField(props: { app: App }): React.ReactElement | null {
  return (
    <StrokeField
      name='GC Bonds'
      getBonds={() => getGcBonds(props.app)}
      pushUndo={() => props.app.pushUndo()}
      changed={() => props.app.drawingChangedNotByInteraction()}
    />
  );
}

export function GutStrokeField(props: { app: App }): React.ReactElement | null {
  return (
    <StrokeField
      name='GUT Bonds'
      getBonds={() => getGutBonds(props.app)}
      pushUndo={() => props.app.pushUndo()}
      changed={() => props.app.drawingChangedNotByInteraction()}
    />
  );
}

export function OtherStrokeField(props: { app: App }): React.ReactElement | null {
  return (
    <StrokeField
      name='Other Bonds'
      getBonds={() => getOtherBonds(props.app)}
      pushUndo={() => props.app.pushUndo()}
      changed={() => props.app.drawingChangedNotByInteraction()}
    />
  );
}
