export const tryAcquireActionLock = (lockRef, actionKey) => {
  const cleanActionKey = String(actionKey || '').trim();

  if (!cleanActionKey || !lockRef?.current || typeof lockRef.current.has !== 'function') return false;
  if (lockRef.current.has(cleanActionKey)) return false;

  lockRef.current.add(cleanActionKey);
  return true;
};

export const releaseActionLock = (lockRef, actionKey) => {
  if (!lockRef?.current || typeof lockRef.current.delete !== 'function') return false;

  return lockRef.current.delete(String(actionKey || '').trim());
};
