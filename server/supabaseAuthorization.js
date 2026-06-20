import { createClient } from '@supabase/supabase-js';

export const isSupabaseUuid = (value = '') =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value || '').trim()
  );

const readBearerToken = (authorizationHeader = '') => {
  const match = /^Bearer\s+([^\s]+)$/i.exec(String(authorizationHeader || '').trim());
  return match?.[1] || '';
};

export async function authenticateServerRequest({
  authorizationHeader,
  supabaseUrl,
  supabaseAnonKey,
  serviceRoleKey,
  createClientImpl = createClient
}) {
  const token = readBearerToken(authorizationHeader);

  if (!token) {
    return { status: 401, error: 'Oturum bulunamadı.' };
  }

  if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
    return { status: 500, error: 'Supabase sunucu yapılandırması eksik.' };
  }

  const userClient = createClientImpl(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  const { data: authData, error: authError } = await userClient.auth.getUser(token);

  if (authError || !authData?.user?.id) {
    return { status: 401, error: 'Oturum doğrulanamadı.' };
  }

  const admin = createClientImpl(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  return {
    admin,
    userId: authData.user.id
  };
}

export async function authorizeWorkspaceRequest({
  authorizationHeader,
  workspaceId,
  supabaseUrl,
  supabaseAnonKey,
  serviceRoleKey,
  requireAdmin = false,
  createClientImpl = createClient
}) {
  if (!isSupabaseUuid(workspaceId)) {
    return { status: 400, error: 'Geçerli workspace bulunamadı.' };
  }

  const authentication = await authenticateServerRequest({
    authorizationHeader,
    supabaseUrl,
    supabaseAnonKey,
    serviceRoleKey,
    createClientImpl
  });

  if (authentication.error) return authentication;

  const { admin, userId } = authentication;
  const { data: membership, error: membershipError } = await admin
    .from('workspace_members')
    .select('role, status')
    .eq('workspace_id', workspaceId)
    .eq('user_id', userId)
    .maybeSingle();

  if (membershipError) {
    return { status: 500, error: 'Workspace yetkisi doğrulanamadı.' };
  }

  if (!membership || membership.status !== 'Aktif') {
    return { status: 403, error: 'Bu workspace için aktif üyelik bulunamadı.' };
  }

  if (requireAdmin && membership.role !== 'Yönetici') {
    return { status: 403, error: 'Bu işlemi sadece aktif Yönetici hesabı yapabilir.' };
  }

  return {
    admin,
    userId,
    membership
  };
}

export async function authorizeAnyActiveWorkspaceRequest(options) {
  const authentication = await authenticateServerRequest(options);

  if (authentication.error) return authentication;

  const { admin, userId } = authentication;
  const { data: memberships, error: membershipError } = await admin
    .from('workspace_members')
    .select('workspace_id, role, status')
    .eq('user_id', userId)
    .eq('status', 'Aktif')
    .limit(1);

  if (membershipError) {
    return { status: 500, error: 'Workspace yetkisi doğrulanamadı.' };
  }

  const membership = memberships?.[0];

  if (!membership?.workspace_id) {
    return { status: 403, error: 'Aktif workspace üyeliği bulunamadı.' };
  }

  return {
    admin,
    userId,
    membership
  };
}
