import * as React from 'react';

export function PptxNotes() {
  return (
    <div>
      <p className='unselectable' style={{ fontSize: '12px' }} >
        <span style={{ fontWeight: 600, color: 'rgba(0,0,0,1)' }} >Note:&nbsp;</span>
        Exported PPTX files require PowerPoint 2016 or later to open.
      </p>
      <p className='unselectable' style={{ marginTop: '8px', fontSize: '12px' }} >
        <span style={{ fontWeight: 600, color: 'rgba(0,0,0,1)' }} >Note:&nbsp;</span>
        Large structures may take a while to export.
      </p>
    </div>
  );
}
