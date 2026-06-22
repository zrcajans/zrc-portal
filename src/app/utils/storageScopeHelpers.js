export const ACTIVE_STORAGE_SCOPE_KEY = 'zrc-active-storage-scope';
export const ANONYMOUS_STORAGE_SCOPE = 'anonymous';

const getBrowserStorage = () => {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
};

const normalizeScopePart = (value) => encodeURIComponent(String(value || '').trim().slice(0, 200));

export const createStorageScope = ({ workspaceId, userId } = {}) => {
  const workspacePart = normalizeScopePart(workspaceId);
  const userPart = normalizeScopePart(userId);

  return workspacePart && userPart ? `${workspacePart}--${userPart}` : '';
};

export const getActiveStorageScope = (storage = getBrowserStorage()) => {
  if (!storage) return '';

  try {
    const scope = String(storage.getItem(ACTIVE_STORAGE_SCOPE_KEY) || '').trim();
    return scope.includes('--') && scope.length <= 500 ? scope : '';
  } catch {
    return '';
  }
};

export const getActiveStorageWorkspaceId = (storage = getBrowserStorage()) => {
  const scope = getActiveStorageScope(storage);
  const encodedWorkspaceId = scope.split('--')[0] || '';

  if (!encodedWorkspaceId) return '';

  try {
    return decodeURIComponent(encodedWorkspaceId);
  } catch {
    return '';
  }
};

export const activateStorageScope = ({ workspaceId, userId } = {}, storage = getBrowserStorage()) => {
  const scope = createStorageScope({ workspaceId, userId });

  if (!scope || !storage) {
    return { ok: false, changed: false, scope: '' };
  }

  try {
    const changed = getActiveStorageScope(storage) !== scope;

    if (changed) {
      storage.setItem(ACTIVE_STORAGE_SCOPE_KEY, scope);
    }

    return { ok: true, changed, scope };
  } catch {
    return { ok: false, changed: false, scope: '' };
  }
};

export const clearActiveStorageScope = (storage = getBrowserStorage()) => {
  if (!storage) return false;

  try {
    storage.removeItem(ACTIVE_STORAGE_SCOPE_KEY);
    return true;
  } catch {
    return false;
  }
};

export const getScopedStorageKey = (baseKey, storage = getBrowserStorage()) => {
  const cleanBaseKey = String(baseKey || '').trim();
  const scope = getActiveStorageScope(storage) || ANONYMOUS_STORAGE_SCOPE;

  return cleanBaseKey ? `${cleanBaseKey}:${scope}` : '';
};
