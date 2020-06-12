interface Func {
  (): void;
}

export interface SvgBBox {
  width: number;
  height: number;
  w: number;
  h: number;
  x: number;
  y: number;
  cx: number;
  cy: number;
  x2: number;
  y2: number;
}

export interface SvgElementInterface {
  type: string;
  id(): string;
  id(n: null): void;
  attr(a: string): any;
  attr(o: object): void;
  css(a: string): any;
  css(o: object): void;
  bbox(): SvgBBox;
  center(cx: number, cy: number): void;
  x(): number;
  x(lx: number): void;
  y(): number;
  y(ty: number): void;
  cx(): number;
  cx(x: number): void;
  cy(): number;
  cy(y: number): void;
  dmove(dx: number, dy: number): void;
  
  mouseover(f: () => void): void;
  mouseout(f: () => void): void;
  mousedown(f: () => void): void;
  dblclick(f: () => void): void;

  insertBefore(ele: SvgElementInterface): void;
  insertAfter(ele: SvgElementInterface): void;
  remove(): void;
  root(): SvgInterface | null;
  svg(): string;
  svg(b: boolean): string;
  svg(s: string): void;
  svg(s: string, b: boolean): void;
}

export interface SvgTextAdd {
  tspan(s: string): void;
}

export interface SvgTextAddFunc {
  (add: SvgTextAdd): void;
}

export interface SvgTextInterface extends SvgElementInterface {
  text(): string;
  clear(): void;
  tspan(s: string): void;
}

export interface SvgLineInterface extends SvgElementInterface {}

export interface SvgPathInterface extends SvgElementInterface {
  array(): (string | number)[][];
  plot(d: string): void;
}

export interface SvgCircleInterface extends SvgElementInterface {}

export interface SvgRectInterface extends SvgElementInterface {}

export interface SvgInterface {
  addTo(e: HTMLElement): SvgInterface;
  attr(s: string): any;
  attr(o: object): void;
  viewbox(): {
    width: number;
    height: number;
  };
  viewbox(x: number, y: number, width: number, height: number): void;
  findOne(id: string): SvgElementInterface;
  children(): (SvgElementInterface | SvgInterface)[];
  first(): SvgInterface | SvgElementInterface;
  nested(): SvgInterface;

  text(add: SvgTextAddFunc): SvgTextInterface;
  line(x1: number, y1: number, x2: number, y2: number): SvgLineInterface;
  path(d: string): SvgPathInterface;
  circle(r: number): SvgCircleInterface;

  mousedown(f: Func): void;
  clear(): void;
  remove(): void;
  svg(): string;
  svg(b: boolean): string;
  svg(s: string): void;
  svg(s: string, b: boolean): void;
}

export default SvgInterface;
