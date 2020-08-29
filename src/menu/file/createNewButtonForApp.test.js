import createNewButtonForApp from './createNewButtonForApp';

jest.mock('../openNewTab');
import openNewTab from '../openNewTab';

import DroppedButton from '../DroppedButton';
import { CreateNewDrawing } from '../../forms/new/CreateNewDrawing';

let app = {
  strictDrawing: {
    isEmpty: () => true,
  },
  renderForm: () => {},
};

it('returns a dropped button', () => {
  let nb = createNewButtonForApp(app);
  expect(nb.type).toBe(DroppedButton);
});

it('passes a key', () => {
  let nb = createNewButtonForApp(app);
  expect(nb.key).toBeTruthy();
});

describe('onClick callback', () => {
  openNewTab.mockImplementation(() => {});

  it('when drawing is empty', () => {
    jest.clearAllMocks();
    app.strictDrawing.isEmpty = () => true;
    app.renderForm = jest.fn();
    let nb = createNewButtonForApp(app);
    nb.props.onClick();
    expect(openNewTab.mock.calls.length).toBe(0);
    let form = app.renderForm.mock.calls[0][0]();
    expect(form.type).toBe(CreateNewDrawing);
  });

  it('when drawing is not empty', () => {
    jest.clearAllMocks();
    app.strictDrawing.isEmpty = () => false;
    let nb = createNewButtonForApp(app);
    nb.props.onClick();
    expect(openNewTab.mock.calls.length).toBe(1);
  });
});
