export const mergeAuthoritativeServerRecords = ({
  serverRecords = [],
  localRecords = [],
  getKey = (record) => record?.id,
  isPersistedLocalRecord = (record) => Boolean(record?.supabaseId)
} = {}) => {
  const merged = [];
  const seenKeys = new Set();

  (Array.isArray(serverRecords) ? serverRecords : []).forEach((record) => {
    const key = String(getKey(record) || '').trim();

    if (!key || seenKeys.has(key)) return;
    seenKeys.add(key);
    merged.push(record);
  });

  (Array.isArray(localRecords) ? localRecords : []).forEach((record) => {
    if (isPersistedLocalRecord(record)) return;

    const key = String(getKey(record) || '').trim();

    if (!key || seenKeys.has(key)) return;
    seenKeys.add(key);
    merged.push(record);
  });

  return merged;
};
