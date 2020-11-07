import App from '../../../App';
import NodeSVG from '../../../draw/NodeSVG';
import { ByCharacterButton } from './ByCharacterButton';
import { SelectBasesByCharacter } from '../../../forms/annotate/bases/character/SelectBasesByCharacter';

it('onClick callback opens form', () => {
  let app = new App(() => NodeSVG());
  let b = ByCharacterButton({ app: app });
  let spy = jest.spyOn(app, 'renderForm');
  b.props.onClick();
  expect(spy.mock.calls[0][0]().type).toBe(SelectBasesByCharacter);
});
