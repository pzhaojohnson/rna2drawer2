import * as SVG from '@svgdotjs/svg.js';

function colorsAreEqual(color1: SVG.Color, color2: SVG.Color): boolean {
  return color1.toHex().toLowerCase() == color2.toHex().toLowerCase();
}

function hasColor(colors: SVG.Color[], color: SVG.Color): boolean {
  return colors.find(c => colorsAreEqual(c, color)) ? true : false;
}

export type ConstructorArguments = {
  fixedColors: SVG.Color[];

  // the maximum number of recent colors
  maxRecentColors: number;
}

export class PresetColorsList {
  _fixedColors: SVG.Color[];

  _recentColors: SVG.Color[];
  readonly maxRecentColors: number;

  constructor(args: ConstructorArguments) {
    this._fixedColors = args.fixedColors;

    this._recentColors = [];
    this.maxRecentColors = args.maxRecentColors;
  }

  values(): SVG.Color[] {
    return this._fixedColors.concat(this._recentColors);
  }

  remember(color: SVG.Color) {
    if (!hasColor(this._fixedColors, color)) {
      if (hasColor(this._recentColors, color)) {
        this._recentColors = this._recentColors.filter(c => !colorsAreEqual(c, color));
      }
      this._recentColors.push(color);
      if (this._recentColors.length > this.maxRecentColors) {
        this._recentColors.shift();
      }
    }
  }
}
