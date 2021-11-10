type BlobDownloadOptions = {

  // the name for the download
  name: string;
}

function offerBlobForDownload(blob: Blob, options: BlobDownloadOptions) {
  let url = URL.createObjectURL(blob);

  let div = document.createElement('div');
  div.style.cssText = 'max-width: 0px; max-height: 0px';
  document.body.appendChild(div);

  let a = document.createElement('a');
  div.appendChild(a);
  a.innerHTML = '&nbsp;';
  a.href = url;
  a.download = options.name;

  let me = new MouseEvent('click', {});
  a.dispatchEvent(me);

  document.body.removeChild(div);
}

export type FileProps = {
  name: string;
  type: string;
  contents: string;
}

export function offerFileForDownload(fileProps: FileProps) {
  let blob = new Blob(
    [fileProps.contents],
    { type: fileProps.type },
  );
  offerBlobForDownload(
    blob,
    { name: fileProps.name },
  );
}
