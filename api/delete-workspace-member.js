import { authorizeWorkspaceRequest, isSupabaseUuid } from '../server/supabaseAuthorization.js';

const normalizeUsername = (value = '') =>
  String(value || '')
    .trim()
    .toLocaleLowerCase('tr-TR')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9@._-]+/g, '')
    .slice(0, 120);

const parseBody = (req) => {
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }

  return req.body && typeof req.body === 'object' ? req.body : {};
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Sadece POST desteklenir.' });
  }

  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const body = parseBody(req);
  const member = body.member && typeof body.member === 'object' ? body.member : {};
  const workspaceId = String(body.workspaceId || '').trim();

  const authorization = await authorizeWorkspaceRequest({
    authorizationHeader: req.headers.authorization || '',
    workspaceId,
    supabaseUrl,
    supabaseAnonKey,
    serviceRoleKey,
    requireAdmin: true
  });

  if (authorization.error) {
    return res.status(authorization.status).json({ ok: false, error: authorization.error });
  }

  const admin = authorization.admin;
  const requestedUserId = [
    body.userId,
    member.userId,
    member.user_id,
    member.authUserId,
    member.auth_user_id,
    member.supabaseUserId,
    member.supabase_user_id,
    member.profileId,
    member.profile_id,
    member.id
  ]
    .map((value) => String(value || '').trim())
    .find(isSupabaseUuid);
  const requestedUsername = normalizeUsername(
    body.username || member.username || member.email || ''
  );

  if (!requestedUserId && !requestedUsername) {
    return res.status(400).json({ ok: false, error: 'Silinecek ekip üyesi doğrulanamadı.' });
  }

  let targetQuery = admin
    .from('workspace_members')
    .select('user_id, role, status, username, customer_id')
    .eq('workspace_id', workspaceId);

  targetQuery = requestedUserId
    ? targetQuery.eq('user_id', requestedUserId)
    : targetQuery.eq('username', requestedUsername);

  const { data: targetMember, error: targetError } = await targetQuery.maybeSingle();

  if (targetError) {
    return res.status(500).json({ ok: false, error: 'Ekip üyesi doğrulanamadı.' });
  }

  if (!targetMember?.user_id) {
    return res.status(404).json({ ok: false, error: 'Bu workspace içinde ekip üyesi bulunamadı.' });
  }

  if (targetMember.role === 'Yönetici' && targetMember.status === 'Aktif') {
    const { count, error: adminCountError } = await admin
      .from('workspace_members')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .eq('role', 'Yönetici')
      .eq('status', 'Aktif');

    if (adminCountError) {
      return res.status(500).json({ ok: false, error: 'Yönetici sayısı doğrulanamadı.' });
    }

    if ((count || 0) <= 1) {
      return res.status(409).json({ ok: false, error: 'Son aktif yönetici silinemez.' });
    }
  }

  const { data: deletedMembership, error: deleteError } = await admin
    .from('workspace_members')
    .delete()
    .eq('workspace_id', workspaceId)
    .eq('user_id', targetMember.user_id)
    .select('user_id')
    .maybeSingle();

  if (deleteError) {
    return res.status(500).json({ ok: false, error: 'Workspace üyeliği silinemedi.' });
  }

  if (!deletedMembership) {
    return res.status(409).json({ ok: false, error: 'Workspace üyeliği başka bir işlem tarafından değiştirildi.' });
  }

  if (targetMember.role === 'Yönetici' && targetMember.status === 'Aktif') {
    const { count: remainingAdminCount, error: remainingAdminError } = await admin
      .from('workspace_members')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .eq('role', 'Yönetici')
      .eq('status', 'Aktif');

    if (remainingAdminError || (remainingAdminCount || 0) === 0) {
      const { error: restoreError } = await admin
        .from('workspace_members')
        .upsert(
          {
            workspace_id: workspaceId,
            user_id: targetMember.user_id,
            role: targetMember.role,
            status: targetMember.status,
            username: targetMember.username,
            customer_id: targetMember.customer_id
          },
          { onConflict: 'workspace_id,user_id' }
        );

      if (restoreError) {
        return res.status(500).json({
          ok: false,
          error: 'Son yönetici koruması doğrulanamadı ve üyelik geri yüklenemedi.'
        });
      }

      return res.status(409).json({ ok: false, error: 'Son aktif yönetici silinemez.' });
    }
  }

  const { error: customerUnlinkError } = await admin
    .from('customers')
    .update({ account_user_id: null })
    .eq('workspace_id', workspaceId)
    .eq('account_user_id', targetMember.user_id);

  const { data: remainingMemberships, error: remainingError } = await admin
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', targetMember.user_id)
    .limit(1);

  let authDeleted = false;
  let authCleanupPending = Boolean(remainingError);

  if (!remainingError && (remainingMemberships || []).length === 0) {
    const { error: authDeleteError } = await admin.auth.admin.deleteUser(
      targetMember.user_id,
      false
    );

    authDeleted = !authDeleteError;
    authCleanupPending = Boolean(authDeleteError);
  }

  return res.status(200).json({
    ok: true,
    membershipDeleted: true,
    authDeleted,
    authCleanupPending,
    customerCleanupPending: Boolean(customerUnlinkError)
  });
}
