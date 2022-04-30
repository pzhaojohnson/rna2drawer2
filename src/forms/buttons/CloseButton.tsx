import * as React from 'react';

function CrossMark(
  props: {
    color: string,
  },
) {
  return (
    <svg width="16px" height="16px" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" overflow="hidden" >
      <defs>
        <clipPath id="clip0" >
          <rect x="592" y="312" width="96" height="96" />
        </clipPath>
      </defs>
      <g clipPath="url(#clip0)" transform="translate(-592 -312)" >
        <path
          d="M608.707 391.707 639 361.414 670.293 392.707 671.707 391.293 640.414 360 671.707 328.707 670.293 327.293 639 358.586 608.707 328.293 607.293 329.707 637.586 360 607.293 390.293 608.707 391.707Z"
          stroke={props.color} strokeWidth="0.333333" fill={props.color}
        />
      </g>
    </svg>
  );
}

interface Props {
  onClick: () => void;
}

export class CloseButton extends React.Component<Props> {
  state: {
    hovered: boolean;
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      hovered: false,
    };
  }

  render(): React.ReactElement {
    return (
      <div
        onMouseEnter={() => this.onMouseEnter()}
        onMouseLeave={() => this.onMouseLeave()}
        onClick={this.props.onClick}
        style={{
          width: '24px',
          height: '24px',
          backgroundColor: this.state.hovered ? 'rgb(238,23,23)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CrossMark color={this.state.hovered ? '#ffffff' : '#2a2a2a'} />
      </div>
    );
  }

  onMouseEnter() {
    this.setState({ hovered: true });
  }

  onMouseLeave() {
    this.setState({ hovered: false });
  }
}
