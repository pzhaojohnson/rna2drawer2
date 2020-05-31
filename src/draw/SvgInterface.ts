interface Func {
  (): void;
}

export interface SvgTextAdd {
  tspan(s: string): void;
}

export interface SvgTextAddFunc {
  (add: SvgTextAdd): void;
}

export interface SvgTextInterface {
  id(): string;
  id(n: null): void;
  attr(a: string): any;
  attr(o: object): void;
  text(): string;
  insertBefore(ele: SvgElementInterface): void;
  insertAfter(ele: SvgElementInterface): void;
  clear(): void;
  tspan(s: string): void;
  remove(): void;
}

export interface SvgLineInterface {
  id(): string;
  id(n: null): void;
  attr(a: string): any;
  attr(o: object): void;
  insertBefore(ele: SvgElementInterface): void;
  insertAfter(ele: SvgElementInterface): void;
  remove(): void;
}

export interface SvgCircleInterface {
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
