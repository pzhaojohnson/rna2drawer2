import * as React from 'react';
import { SecondaryBondInterface as SecondaryBond } from 'Draw/bonds/straight/StraightBondInterface';
import { ColorField } from '../../fields/color/ColorField';
import { FieldProps as SpecificFieldProps } from './FieldProps';
import { atIndex } from 'Array/at';
import * as Svg from '@svgdotjs/svg.js';
import { parseColor } from '../../../parse/parseColor';

function getFirstStroke(sbs: SecondaryBond[]): Svg.Color | undefined {
  let first = atIndex(sbs, 0);
  if (first) {
    return parseColor(first.stroke);
  }
}

interface GeneralFieldProps {
  name: string;
  getSecondaryBonds: () => SecondaryBond[];
  pushUndo: () => void;
  changed: () => void;
}

function StrokeField(props: GeneralFieldProps): React.ReactElement | null {
  let sbs = props.getSecondaryBonds();
  if (sbs.length == 0) {
    return null;
  } else {
    let firstStroke = getFirstStroke(sbs);
    return (
      <ColorField
        name={props.name}
        initialValue={firstStroke ? { color: firstStroke.toHex(), opacity: 1 } : undefined}
        set={co => {
          let parsed = parseColor(co.color);
          if (parsed) {
            let s = parsed;
            let sbs = props.getSecondaryBonds();
            if (sbs.length > 0) {
              if (s.toHex() != getFirstStroke(sbs)?.toHex()) {
                props.pushUndo();
                sbs.forEach(sb => {
                  sb.stroke = s.toHex();
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
}

export function AutStrokeField(props: SpecificFieldProps): React.ReactElement | null {
  return (
    <StrokeField
      name='AUT Color'
      getSecondaryBonds={() => props.getSecondaryBondsByType().aut}
      pushUndo={props.pushUndo}
      changed={props.changed}
    />
  );
}

export function GcStrokeField(props: SpecificFieldProps): React.ReactElement | null {
  return (
    <StrokeField
      name='GC Color'
      getSecondaryBonds={() => props.getSecondaryBondsByType().gc}
      pushUndo={props.pushUndo}
      changed={props.changed}
    />
  );
}

export function GutStrokeField(props: SpecificFieldProps): React.ReactElement | null {
  return (
    <StrokeField
      name='GUT Color'
      getSecondaryBonds={() => props.getSecondaryBondsByType().gut}
      pushUndo={props.pushUndo}
      changed={props.changed}
    />
  );
}

export function OtherStrokeField(props: SpecificFieldProps): React.ReactElement | null {
  return (
    <StrokeField
      name='Noncanonical Color'
      getSecondaryBonds={() => props.getSecondaryBondsByType().other}
      pushUndo={props.pushUndo}
      changed={props.changed}
    />
  );
}
