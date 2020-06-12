export interface FileProps {
  name: string;
  type: string;
  contents: string;
}

export function offerFileForDownload(fileProps: FileProps) {
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
  let b = new Blob(
    [fileProps.contents],
    { type: fileProps.type },
  );
  let url = URL.createObjectURL(b);
  let div = document.createElement('div');
  div.style.cssText = 'max-width: 0px; max-height: 0px';
  document.body.appendChild(div);
  let a = document.createElement('a');
  div.appendChild(a);
  a.innerHTML = '&nbsp;';
  a.href = url;
  a.download = fileProps.name;
  let me = new MouseEvent('click', {});
  a.dispatchEvent(me);
  document.body.removeChild(div);
}

export default offerFileForDownload;
