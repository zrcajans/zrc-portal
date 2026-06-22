const uniqueIds = (ids = []) => [...new Set((ids || []).filter(Boolean))];

export async function syncCustomerAccountLink({
  admin,
  workspaceId,
  userId,
  nextCustomerId = '',
  previousCustomerIds = []
}) {
  const { error: unlinkError } = await admin
    .from('customers')
    .update({ account_user_id: null })
    .eq('workspace_id', workspaceId)
    .eq('account_user_id', userId);

  if (unlinkError) {
    return { ok: false, error: 'Önceki müşteri hesabı bağlantısı kaldırılamadı.' };
  }

  if (!nextCustomerId) return { ok: true };

  const { data: linkedCustomer, error: linkError } = await admin
    .from('customers')
    .update({ account_user_id: userId })
    .eq('workspace_id', workspaceId)
    .eq('id', nextCustomerId)
    .or(`account_user_id.is.null,account_user_id.eq.${userId}`)
    .select('id')
    .maybeSingle();

  if (!linkError && linkedCustomer) return { ok: true };

  let restoreFailed = false;

  for (const customerId of uniqueIds(previousCustomerIds)) {
    const { data: restoredCustomer, error: restoreError } = await admin
      .from('customers')
      .update({ account_user_id: userId })
      .eq('workspace_id', workspaceId)
      .eq('id', customerId)
      .is('account_user_id', null)
      .select('id')
      .maybeSingle();

    if (restoreError || !restoredCustomer) restoreFailed = true;
  }

  return {
    ok: false,
    error: restoreFailed
      ? 'Müşteri hesabı bağlanamadı ve önceki bağlantı geri yüklenemedi.'
      : 'Müşteri hesabı bağlanamadı; önceki bağlantı geri yüklendi.'
  };
}
