const defaultNormalizeTitle = (value = '') => String(value || '').trim();

export const getColumnPersistencePosition = (
  columns = [],
  columnData = {},
  normalizeTitle = defaultNormalizeTitle
) => {
  const targetTitle = normalizeTitle(columnData?.title || '');
  const existingIndex = (columns || []).findIndex((column) =>
    column?.id === columnData?.id || normalizeTitle(column?.title || '') === targetTitle
  );

  if (existingIndex >= 0) return existingIndex;

  const requestedPosition = Number(columnData?.position);
  if (Number.isInteger(requestedPosition) && requestedPosition >= 0) {
    return Math.min(requestedPosition, columns.length);
  }

  return columns.length;
};
