interface Func {
  (): void;
}

export interface SvgInterface {
  addTo(e: HTMLElement): SvgInterface;
  attr(s: string): any;
  attr(o: object): void;
  viewbox(): {
    width: number;
    height: number;
  };
  viewbox(x: number, y: number, width: number, height: number): void;
  mousedown(f: Func): void;
  clear(): void;
  svg(): string;
  svg(b: boolean): string;
  svg(s: string): void;
  svg(s: string, b: boolean): void;
  first(): SvgInterface;
}

export default SvgInterface;
