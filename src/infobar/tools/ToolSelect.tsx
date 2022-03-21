import { AppInterface as App } from 'AppInterface';

import { Tool } from 'Draw/interact/StrictDrawingInteraction';
import { DraggingTool } from 'Draw/interact/drag/DraggingTool';
import { BindingTool } from 'Draw/interact/bind/BindingTool';
import { FlatteningTool } from 'Draw/interact/flatten/FlatteningTool';
import { FlippingTool } from 'Draw/interact/flip/FlippingTool';
import { EditingTool } from 'Draw/interact/edit/EditingTool';

import * as React from 'react';
import styles from './ToolSelect.css';

export type ToolSelectProps = {

  // a reference to the whole app
  app: App;

  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
};

function nameOfTool(tool: Tool): string {
  if (tool instanceof DraggingTool) {
    return 'Drag';
  } else if (tool instanceof BindingTool) {
    return 'Bind';
  } else if (tool instanceof FlatteningTool) {
    return 'Flatten';
  } else if (tool instanceof FlippingTool) {
    return 'Flip';
  } else if (tool instanceof EditingTool) {
    return 'Edit';
  } else {
    return 'Unknown';
  }
}

type ToolLabelProps = {
  onClick?: () => void;
}

function ToolLabel(props: ToolLabelProps) {
  return (
    <p className={styles.toolLabel} onClick={props.onClick} >
      Tool:
    </p>
  );
}

type CurrentToolViewProps = {
  currentTool: Tool;
};

function CurrentToolView(props: CurrentToolViewProps) {
  return (
    <p className={styles.currentToolView} >
      {nameOfTool(props.currentTool)}
    </p>
  );
}

type ToolButtonProps = {
  toolName: string;
  isToggled: boolean;
  onClick: () => void;
};

function ToolButton(props: ToolButtonProps) {
  return (
    <p
      className={`
        ${styles.toolButton}
        ${props.isToggled ? styles.toggledToolButton : styles.untoggledToolButton}
      `}
      onClick={props.onClick}
    >
      {props.toolName}
    </p>
  );
}

export class ToolSelect extends React.Component<ToolSelectProps> {
  state: {
    isOpen: boolean;
  };

  constructor(props: ToolSelectProps) {
    super(props);

    this.state = {
      isOpen: props.isOpen ?? false,
    };
  }

  render() {
    let strictDrawingInteraction = this.props.app.strictDrawingInteraction;

    let tools = [
      strictDrawingInteraction.draggingTool,
      strictDrawingInteraction.bindingTool,
      strictDrawingInteraction.flatteningTool,
      strictDrawingInteraction.flippingTool,
      strictDrawingInteraction.editingTool,
    ];
    let currentTool = strictDrawingInteraction.currentTool;

    return (
      <div
        className={`
          ${styles.toolSelect}
          ${this.state.isOpen ? styles.openToolSelect : styles.closedToolSelect}
        `}
        onClick={() => {
          if (!this.state.isOpen) {
            this.open();
          }
        }}
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
      >
        <ToolLabel
          onClick={!this.state.isOpen ? undefined : () => this.close()}
        />
        {!this.state.isOpen ? (
          <CurrentToolView currentTool={currentTool} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
            <div style={{ width: '4px' }} />
            <ToolButton
              toolName={nameOfTool(currentTool)}
              isToggled={true}
              onClick={() => this.close()}
            />
            {tools.filter(tool => tool != currentTool).map((tool, i) => (
              <ToolButton
                key={i}
                toolName={nameOfTool(tool)}
                isToggled={false}
                onClick={() => this.select(tool)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  open() {
    this.setState({ isOpen: true });
    if (this.props.onOpen) {
      this.props.onOpen();
    }
  }

  close() {
    this.setState({ isOpen: false });
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  toggle() {
    if (this.state.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  select(tool: Tool) {
    this.props.app.strictDrawingInteraction.currentTool = tool;
    this.close();
  }
}
