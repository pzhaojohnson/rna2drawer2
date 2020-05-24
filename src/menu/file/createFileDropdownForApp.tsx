import * as React from 'react';

import Dropdown from '../Dropdown';
import TopButton from '../TopButton';

import createNewButtonForApp from './createNewButtonForApp';
import createOpenRna2drawerButtonForApp from './createOpenRna2drawerButtonForApp';
import createSaveButtonForApp from './createSaveButtonForApp';

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
        createNewButtonForApp(app),
        createOpenRna2drawerButtonForApp(app),
        createSaveButtonForApp(app),
      ]}
    />
  );
}

export default createFileDropdownForApp;
