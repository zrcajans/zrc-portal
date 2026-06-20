const isUuid = (value = '') =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    String(value || '')
  );

export const getPersistedTaskChildId = (item = {}, prefix = '') => {
  if (isUuid(item?.supabaseId)) return item.supabaseId;

  const rawId = String(item?.id || '');
  const candidate = prefix && rawId.startsWith(prefix) ? rawId.slice(prefix.length) : '';
  return isUuid(candidate) ? candidate : '';
};

export const getClientGeneratedTaskChildId = (item = {}) =>
  isUuid(item?.id) && !item?.supabaseId ? item.id : null;
