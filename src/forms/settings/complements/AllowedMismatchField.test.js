import AllowedMismatchField from './AllowedMismatchField';
import App from '../../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';

let app = new App(() => NodeSVG());
let mode = app.strictDrawingInteraction.foldingMode;

it('displays value as percentage', () => {
  mode.allowedMismatch = 0.56;
  let field = AllowedMismatchField(app);
  expect(field.props.initialValue).toBe(56);
});

describe('checkValue callback', () => {
  let field = AllowedMismatchField(app);

  it('does not allow negative values', () => {
    expect(field.props.checkValue(-1)).toBeTruthy();
    expect(field.props.checkValue(0)).toBeFalsy(); // allows zero
  });

  it('does not allow values greater than 100', () => {
    expect(field.props.checkValue(101)).toBeTruthy();
    expect(field.props.checkValue(100)).toBeFalsy(); // allows 100
  });
});

describe('set callback', () => {
  it('converts percentage value to proportion', () => {
    mode.allowedMismatch = 0.3;
    let field = AllowedMismatchField(app);
    field.props.set(85);
    expect(mode.allowedMismatch).toBe(0.85);
  });
});
