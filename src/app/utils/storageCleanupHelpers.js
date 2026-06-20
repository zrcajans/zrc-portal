export const getSafeWorkspaceStoragePaths = (files = [], workspaceId = '') => {
  const workspacePrefix = `${String(workspaceId || '').trim()}/`;

  if (workspacePrefix === '/') return [];

  return Array.from(
    new Set(
      (Array.isArray(files) ? files : [])
        .filter((file) => file?.bucket === 'project-files')
        .map((file) => String(file?.storage_path || file?.storagePath || '').trim())
        .filter((path) => path.startsWith(workspacePrefix))
    )
  );
};

export const chunkValues = (values = [], chunkSize = 100) => {
  const safeValues = Array.isArray(values) ? values : [];
  const safeChunkSize = Number.isInteger(chunkSize) && chunkSize > 0 ? chunkSize : 100;
  const chunks = [];

  for (let index = 0; index < safeValues.length; index += safeChunkSize) {
    chunks.push(safeValues.slice(index, index + safeChunkSize));
  }

  return chunks;
};
