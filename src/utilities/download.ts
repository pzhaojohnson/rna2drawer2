export interface FileProps {
  name: string;
  type: string;
  contents: string;
}

export function download(fileProps: FileProps) {
  if (!fileProps.name) {
    console.error('Missing file name.');
    return;
  } else if (!fileProps.type) {
    console.error('Missing file type.');
    return;
  } else if (!fileProps.contents) {
    console.error('Missing file contents.');
    return;
  }
  let blob = new Blob(
    [fileProps.contents],
    { type: fileProps.type },
  );
  offerBlobForDownload(blob, fileProps.name);
}

function offerBlobForDownload(blob: Blob, downloadName: string) {
  let url = URL.createObjectURL(blob);
  let div = document.createElement('div');
  div.style.cssText = 'max-width: 0px; max-height: 0px';
  document.body.appendChild(div);
  let a = document.createElement('a');
  div.appendChild(a);
  a.innerHTML = '&nbsp;';
  a.href = url;
  a.download = downloadName;
  let me = new MouseEvent('click', {});
  a.dispatchEvent(me);
  document.body.removeChild(div);
}
