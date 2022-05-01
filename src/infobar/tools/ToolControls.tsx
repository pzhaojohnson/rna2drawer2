import type { App } from 'App';

import * as React from 'react';
import { useState } from 'react';
import { ToolSelect } from 'Infobar/tools/ToolSelect';
import { BindingToolControls } from 'Infobar/tools/bind/BindingToolControls';
import { EditingToolControls } from 'Infobar/tools/edit/EditingToolControls';

export type Props = {

  // a reference to the whole app
  app: App;
}

export function ToolControls(props: Props) {
  let [toolSelectIsOpen, setToolSelectIsOpen] = useState(false);

  let strictDrawingInteraction = props.app.strictDrawingInteraction;
  let currentTool = strictDrawingInteraction.currentTool;
  let bindingTool = strictDrawingInteraction.bindingTool;
  let editingTool = strictDrawingInteraction.editingTool;

  return (
    <div
      style={{
        alignSelf: 'stretch',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <ToolSelect
        app={props.app}
        onOpen={() => setToolSelectIsOpen(true)}
        onClose={() => setToolSelectIsOpen(false)}
      />
      {toolSelectIsOpen ? (
        null
      ) : (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
          <div style={{ width: '2px' }} />
          {currentTool == bindingTool ? (
            <BindingToolControls app={props.app} />
          ) : currentTool == editingTool ? (
            <EditingToolControls app={props.app} />
          ) : (
            null
          )}
        </div>
      )}
    </div>
  );
}
