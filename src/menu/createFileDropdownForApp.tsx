import * as React from 'react';

import Dropdown from './Dropdown';
import TopButton from './TopButton';
import DroppedButton from './DroppedButton';

import openNewTab from './openNewTab';
import renderCreateNewDrawingInApp from '../forms/renderCreateNewDrawingInApp';
import renderOpenRna2drawerInApp from '../forms/renderOpenRna2drawerInApp';

interface App {
  strictDrawing: {
    isEmpty: () => boolean;
  };
  save: () => void;
}

function createFileDropdownForApp(app: App): React.ReactElement {
  return (
    <Dropdown
      topButton={
        <TopButton
          text={'File'}
        />
      }
      droppedElements={[
        <DroppedButton
          text={'New'}
          onClick={() => {
            if (!app.strictDrawing.isEmpty()) {
              openNewTab();
              return;
            }
            renderCreateNewDrawingInApp(app);
          }}
        />,
        <DroppedButton
          text={'Open RNA2Drawer 2'}
          onClick={() => {
            if (!app.strictDrawing.isEmpty()) {
              openNewTab();
              return;
            }
            renderOpenRna2drawerInApp(app);
          }}
          disabled={!app.strictDrawing.isEmpty()}
        />,
        <DroppedButton
          text={'Save'}
          onClick={() => app.save()}
          disabled={app.strictDrawing.isEmpty()}
        />,
      ]}
    />
  );
}

export default createFileDropdownForApp;
