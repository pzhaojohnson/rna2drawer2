import * as React from 'react';
import { InfoLink } from 'Forms/info/InfoLink';

export type Props = {
  style?: React.CSSProperties;
};

export function StrokeDasharrayInfoLink(props: Props) {
  return (
    <InfoLink
      href='https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray'
      title='Learn about dash arrays.'
      style={props.style}
    />
  );
}
