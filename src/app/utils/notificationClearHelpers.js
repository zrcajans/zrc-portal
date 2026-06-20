export const isNotificationClearAllActivityLog = (log = {}) =>
  log.type === 'notification_clear_all' ||
  log.payload?.zrcNotificationClearAll === true ||
  Boolean(log.payload?.clearAllToken);

export const getNotificationClearTokensForUser = (logs = [], currentUserId = '') => {
  const cleanCurrentUserId = String(currentUserId || '').trim();
  const tokens = [];

  if (!cleanCurrentUserId) return tokens;

  (Array.isArray(logs) ? logs : []).forEach((log) => {
    if (!isNotificationClearAllActivityLog(log)) return;

    const payload = log.payload || {};
    const clearedByUserId = String(payload.clearedByUserId || '').trim();

    if (!clearedByUserId || clearedByUserId !== cleanCurrentUserId) return;

    const clearedAt =
      payload.clearedBefore ||
      payload.notificationClearAllAt ||
      payload.notificationsClearAllAt ||
      log.created_at ||
      '';

    if (!clearedAt) return;

    tokens.push(`clear-all:${clearedAt}`);
    tokens.push(`cleared-before:${clearedAt}`);
  });

  return Array.from(new Set(tokens));
};
