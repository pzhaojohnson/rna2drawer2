import { FullWidthContainer } from './FullWidthContainer';
import { renderToString } from 'react-dom/server';

it('renders contained element', () => {
  let ele = FullWidthContainer({ contained: 'a contained element' });
  expect(renderToString(ele).includes('a contained element')).toBeTruthy();
});
