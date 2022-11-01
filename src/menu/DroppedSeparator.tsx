import * as React from 'react';

export function DroppedSeparator() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }} >
      <div
        style={{
          height: '0px',
          borderWidth: '0px 0px 1px 0px',
          borderStyle: 'solid',
          borderColor: 'rgba(215, 215, 228, 0.82)',
          margin: '0px 14px',
        }}
      />
    </div>
  );
}
