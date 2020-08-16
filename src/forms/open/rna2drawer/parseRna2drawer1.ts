import * as Svg from '@svgdotjs/svg.js';
import { splitLines } from '../../../parse/splitLines';
import parseDotBracket from '../../../parse/parseDotBracket';

interface TertiaryInteraction {
  side1: [number, number];
  side2: [number, number];
  color: Svg.Color;
}

interface BaseOutline {
  relativeRadius: number;
  stroke: Svg.Color;
  strokeOpacity: number;
  strokeWidth: number;
  fill: Svg.Color;
  fillOpacity: number;
}

export interface Rna2drawer1 {
  sequenceId: string;
  characters: string;
  secondaryPartners: (number | null)[];
  tertiaryInteractions: TertiaryInteraction[],
  numberingOffset: number;
  numberingAnchor: number;
  numberingIncrement: number;
  baseColors: Svg.Color[];
  baseOutlines: (BaseOutline | null)[];
}

function colorFromName(name: string): Svg.Color | null {
  let div = document.createElement('div');
  div.style.height = '0px';
  document.appendChild(div);
  let color = null;
  try {
    div.style.color = name;
    div.style.opacity = '1'; // prevent computed color from being 'transparent'
    let computed = window.getComputedStyle(div).color;
    color = new Svg.Color(computed);
  } catch (err) {
    color = null;
  }
  document.removeChild(div);
  return color;
}

function parseSequenceId(saved: string): string | null {
  let line = splitLines(saved)[0];
  if (line) {
    let id = line.substring(1).trim();
    return id ? id : 'Unnamed Sequence';
  }
  return null;
}

function parseCharacters(saved: string): string | null {
  let line = splitLines(saved)[1];
  return line ? line : null;
}

function parseSecondaryPartners(saved: string): (number | null)[] | null {
  let line = splitLines(saved)[2];
  if (line) {
    let partners = parseDotBracket(line)?.secondaryPartners;
    if (partners) {
      return partners;
    }
  }
  return null;
}

function parseSavedTertiaryInteraction(savedTertiaryInteraction: string): TertiaryInteraction | null {
  let props = savedTertiaryInteraction.split(',');
  let [p51, p31] = props[0].split(':');
  let [p52, p32] = props[1].split(':');
  let color = props[2] ? colorFromName(props[2]) : null;
  if (!color) {
    return null;
  }
  let ti = {
    side1: [
      p51 ? Number.parseInt(p51) : NaN,
      p31 ? Number.parseInt(p31) : NaN,
    ] as [number, number],
    side2: [
      p52 ? Number.parseInt(p52) : NaN,
      p32 ? Number.parseInt(p32) : NaN,
    ] as [number, number],
    color: color,
  };
  let allFinite = true;
  ti.side1.concat(ti.side2).forEach(n => {
    if (!Number.isFinite(n)) {
      allFinite = false;
    }
  });
  if (allFinite && ti.color) {
    return ti;
  }
  return null;
}

function parseTertiaryInteractions(saved: string): TertiaryInteraction[] | null {
  let line = splitLines(saved).find(l => l.split(' ')[0] == 'tert_inters');
  if (line) {
    let savedTertiaryInteractions = line.split(' ')[1].split(';');
    let tertiaryInteractions = [] as TertiaryInteraction[];
    let allParsable = true;
    savedTertiaryInteractions.forEach(sti => {
      let ti = parseSavedTertiaryInteraction(sti);
      if (ti) {
        tertiaryInteractions.push(ti);
      } else {
        allParsable = false;
      }
    });
    if (allParsable) {
      return tertiaryInteractions;
    }
  }
  return null;
}

function parseNumberingOffset(saved: string): number | null {
  let line = splitLines(saved).find(l => l.split(' ')[0] == 'misc_seq_num_offset');
  if (line) {
    let offset = Number.parseInt(line.split(' ')[1], 10);
    if (Number.isFinite(offset)) {
      return offset;
    }
  }
  return null;
}

function parseNumberingAnchor(saved: string): number | null {
  let line = splitLines(saved).find(l => l.split(' ')[0] == 'misc_numbering_start');
  if (line) {
    let anchor = Number.parseInt(line.split(' ')[1], 10);
    if (Number.isFinite(anchor)) {
      return anchor;
    }
  }
  return null;
}

function parseNumberingIncrement(saved: string): number | null {
  let line = splitLines(saved).find(l => l.split(' ')[0] == 'misc_numbering_increment');
  if (line) {
    let increment = Number.parseInt(line.split(' ')[1], 10);
    if (Number.isFinite(increment)) {
      return increment;
    }
  }
  return null;
}

function parseBaseColors(saved: string): Svg.Color[] | null {
  let line = splitLines(saved).find(l => l.split(' ')[0] == 'base_colors');
  if (line) {
    let names = line.split(' ')[1].split(',');
    let colors = [] as Svg.Color[];
    names.forEach(nm => {
      let c = colorFromName(nm);
      if (c) {
        colors.push(c);
      }
    });
    // check that all names were parsable
    if (colors.length == names.length) {
      return colors;
    }
  }
  return null;
}

function parseBaseOutline(savedOutline: string): BaseOutline | null {
  let props = savedOutline.split(',');
  let stroke = props[0] ? colorFromName(props[0]) : new Svg.Color('#00ffff');
  if (!stroke) {
    return null;
  }
  let strokeOpacity = props[0] ? 1 : 0;
  let strokeWidth = Number.parseFloat(props[1]);
  if (!Number.isFinite(strokeWidth)) {
    return null;
  }
  let fill = props[2] ? colorFromName(props[2]) : new Svg.Color('#00ffff');
  if (!fill) {
    return null;
  }
  let fillOpacity = props[2] ? 1 : 0;
  let relativeRadius = Number.parseFloat(props[3]);
  if (!Number.isFinite(relativeRadius)) {
    return null;
  }
  return {
    relativeRadius: relativeRadius,
    stroke: stroke,
    strokeOpacity: strokeOpacity,
    strokeWidth: strokeWidth,
    fill: fill,
    fillOpacity: fillOpacity,
  };
}

function parseBaseOutlines(saved: string): (BaseOutline | null)[] | null {
  let line = splitLines(saved).find(l => l.split(' ')[0] == 'base_outlines');
  if (line) {
    let savedOutlines = line.split(' ')[1].split(';');
    let outlines = [] as (BaseOutline | null)[];
    let allParsable = true;
    savedOutlines.forEach(so => {
      let o = parseBaseOutline(so);
      if (o) {
        outlines.push(o.strokeOpacity > 0 || o.fillOpacity > 0 ? o : null);
      } else {
        allParsable = false;
      }
    });
    if (allParsable) {
      return outlines;
    }
  }
  return null;
}

/**
 * Returns null if unable to parse.
 */
export function parseRna2drawer1(saved: string): Rna2drawer1 | null {
  let lines = splitLines(saved);

  return null;
}

export default parseRna2drawer1;
