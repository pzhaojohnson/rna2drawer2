import * as React from 'react';
import blackCrossMark from './blackCrossMark.svg';
import grayCrossMark from './grayCrossMark.svg';
import whiteCrossMark from './whiteCrossMark.svg';

interface Props {
  position: 'absolute';
  top: string;
  right: string;
  onClick: () => void;
}

export class CloseButton extends React.Component {
  static defaultProps: Props;

  props!: Props;
  state: {
    hovered: boolean;
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      hovered: false,
    };
  }

  _crossMark(): React.ReactElement {
    let src = this.state.hovered ? whiteCrossMark : grayCrossMark;
    return (
      <img
        className={'unselectable'}
        src={src}
        alt={'Cross'}
        style={{ height: '18px' }}
      />
    );
  }

  render(): React.ReactElement {
    return (
      <div
        onMouseEnter={() => this.onMouseEnter()}
        onMouseLeave={() => this.onMouseLeave()}
        onClick={() => this.onClick()}
        style={{
          position: this.props.position,
          top: this.props.top,
          right: this.props.right,
          width: '27px',
          height: '27px',
          backgroundColor: this.state.hovered ? 'rgb(238,23,23)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {this._crossMark()}
      </div>
    );
  }

  onMouseEnter() {
    this.setState({ hovered: true });
  }

  onMouseLeave() {
    this.setState({ hovered: false });
  }

  onClick() {
    if (this.props.onClick) {
      this.props.onClick();
    }
  }
}

CloseButton.defaultProps = {
  position: 'absolute',
  top: '0px',
  right: '0px',
  onClick: () => {},
};

export default CloseButton;
