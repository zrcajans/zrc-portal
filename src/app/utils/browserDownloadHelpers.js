export const triggerBrowserDownload = (
  blob,
  fileName,
  {
    documentRef = globalThis.document,
    urlApi = globalThis.URL,
    schedule = globalThis.setTimeout,
    revokeDelay = 1000
  } = {}
) => {
  if (!blob || !documentRef?.body || typeof urlApi?.createObjectURL !== 'function') return false;

  const objectUrl = urlApi.createObjectURL(blob);
  const link = documentRef.createElement('a');

  link.href = objectUrl;
  link.download = String(fileName || 'dosya');
  documentRef.body.appendChild(link);

  try {
    link.click();
  } finally {
    link.remove();
    schedule(() => urlApi.revokeObjectURL(objectUrl), revokeDelay);
  }

  return true;
};
