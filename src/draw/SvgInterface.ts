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

export interface SvgTextAdd {
  tspan(s: string): void;
}

export interface SvgTextAddFunc {
  (add: SvgTextAdd): void;
}

export interface SvgTextInterface {
  type: string;
  id(): string;
  id(n: null): void;
  attr(a: string): any;
  attr(o: object): void;
  css(a: string): string;
  css(o: object): void;
  bbox(): SvgBBox;
  center(cx: number, cy: number): void;
  x(): number;
  x(lx: number): void;
  y(): number;
  y(ly: number): void;
  cx(): number;
  cx(x: number): void;
  cy(): number;
  cy(y: number): void;
  dmove(dx: number, dy: number): void;
  text(): string;
  
  mouseover(f: () => void): void;
  mouseout(f: () => void): void;
  mousedown(f: () => void): void;
  dblclick(f: () => void): void;
  
  insertBefore(ele: SvgElementInterface): void;
  insertAfter(ele: SvgElementInterface): void;
  clear(): void;
  tspan(s: string): void;
  remove(): void;
  root(): (SvgInterface | null);
}

export interface SvgLineInterface {
  type: string;
  id(): string;
  id(n: null): void;
  attr(a: string): any;
  attr(o: object): void;
  insertBefore(ele: SvgElementInterface): void;
  insertAfter(ele: SvgElementInterface): void;
  remove(): void;
}

export interface SvgPathInterface {
  type: string;
  id(): string;
  id(n: null): void;
  array(): (string | number)[][];
  plot(d: string): void;
  attr(a: string): any;
  attr(o: object): void;
  css(s: string): any;
  css(o: object): void;
  mouseover(f: () => void): void;
  mouseout(f: () => void): void;
  mousedown(f: () => void): void;
  dblclick(f: () => void): void;
  insertBefore(ele: SvgElementInterface): void;
  insertAfter(ele: SvgElementInterface): void;
  remove(): void;
  root(): (SvgInterface | null);
}

export interface SvgCircleInterface {
  readonly type: string;
  id(): string;
  id(n: null): void;
  attr(a: string): any;
  attr(o: object): void;
  insertBefore(ele: SvgElementInterface): void;
  insertAfter(ele: SvgElementInterface): void;
  remove(): void;
}

export type SvgElementInterface = SvgTextInterface
  | SvgLineInterface
  | SvgPathInterface
  | SvgCircleInterface;

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

  text(add: SvgTextAddFunc): SvgTextInterface;
  line(x1: number, y1: number, x2: number, y2: number): SvgLineInterface;
  path(d: string): SvgPathInterface;
  circle(r: number): SvgCircleInterface;

  mousedown(f: Func): void;
  clear(): void;
  svg(): string;
  svg(b: boolean): string;
  svg(s: string): void;
  svg(s: string, b: boolean): void;
  first(): SvgInterface;
}

export default SvgInterface;
