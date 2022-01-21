import { NodeSVG } from 'Draw/svg/NodeSVG';

import { SVGElementWrapper } from './SVGElementWrapper';

let container = null;
let svg = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);
});

afterEach(() => {
  svg.clear();
  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

describe('SVGElementWrapper class', () => {
  it('provides reference to wrapped element', () => {
    let element = svg.rect(10, 20);
    let wrapper = new SVGElementWrapper(element);
    expect(wrapper.wrapped).toBe(element);
  });

  test('method forwarding', () => {
    [
      {
        name: 'root',
        args: [],
      },
      {
        name: 'attr',
        args: [],
      },
      {
        name: 'attr',
        args: ['stroke'],
      },
      {
        name: 'attr',
        args: ['stroke', '#123456'],
      },
      {
        name: 'attr',
        args: [{ 'fill': 'blue' }],
      },
      {
        name: 'css',
        args: ['cursor'],
      },
      {
        name: 'css',
        args: [{ 'cursor': 'pointer' }],
      },
      {
        name: 'id',
        args: [],
      },
      {
        name: 'id',
        args: ['asdfQWER'],
      },
      {
        name: 'cx',
        args: [],
      },
      {
        name: 'cx',
        args: [52],
      },
      {
        name: 'cy',
        args: [],
      },
      {
        name: 'cy',
        args: [1002],
      },
      {
        name: 'front',
        args: [],
      },
      {
        name: 'back',
        args: [],
      },
      {
        name: 'position',
        args: [],
      },
      {
        name: 'remove',
        args: [],
      },
      {
        name: 'svg',
        args: [],
      },
    ].forEach(({ name, args }) => {
      let element = svg.circle(50);
      let wrapper = new SVGElementWrapper(element);

      let spy = jest.spyOn(element, name);
      expect(spy).not.toHaveBeenCalled();
      let result = wrapper[name](...args);

      // could have been called more than once
      // if the wrapped method uses recursion
      expect(spy).toHaveBeenCalled();

      // the first call should be the forwarded call
      expect(spy.mock.calls[0]).toEqual(args); // arguments were forwarded
      expect(result).toBe(spy.mock.results[0].value); // result was relayed
    });
  });
});
