import { authorizeWorkspaceRequest, isSupabaseUuid } from '../server/supabaseAuthorization.js';

const normalizeCredentialText = (value = '') =>
  String(value || '')
    .trim()
    .toLocaleLowerCase('tr-TR')
    .replace(/\s+/g, '')
    .slice(0, 120);

const normalizeTeamRole = (role = '') => {
  const cleanRole = String(role || '').trim();

  if (cleanRole === 'Yönetici') return 'Yönetici';
  if (cleanRole === 'Müşteri/Misafir' || cleanRole === 'Müşteri' || cleanRole === 'Misafir') return 'Müşteri/Misafir';

  return 'Ekip Üyesi';
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Sadece POST desteklenir.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
    return res.status(500).json({ error: 'Supabase servis bilgileri eksik.' });
  }

  const body = req.body || {};
  const workspaceId = String(body.workspaceId || '').trim();
  const userId = String(body.userId || body.memberId || '').trim();
  const name = String(body.name || '').trim().slice(0, 120);
  const username = normalizeCredentialText(body.username || name);
  const role = normalizeTeamRole(body.role || 'Ekip Üyesi');
  const status = String(body.status || 'Aktif').trim() === 'Pasif' ? 'Pasif' : 'Aktif';
  const customerId = isSupabaseUuid(body.customerId) ? String(body.customerId).trim() : null;

  if (!isSupabaseUuid(workspaceId)) {
    return res.status(400).json({ error: 'Geçerli workspace bulunamadı.' });
  }

  if (!isSupabaseUuid(userId)) {
    return res.status(400).json({ error: 'Geçerli kullanıcı bulunamadı.' });
  }

  if (!name) {
    return res.status(400).json({ error: 'Ad Soyad boş olamaz.' });
  }

  if (!username || username.length < 3) {
    return res.status(400).json({ error: 'Kullanıcı adı en az 3 karakter olmalı.' });
  }

  if (role === 'Müşteri/Misafir' && !customerId) {
    return res.status(400).json({ error: 'Müşteri/Misafir rolü için bağlı müşteri gerekli.' });
  }

  const authorization = await authorizeWorkspaceRequest({
    authorizationHeader: req.headers.authorization || '',
    workspaceId,
    supabaseUrl,
    supabaseAnonKey,
    serviceRoleKey,
    requireAdmin: true
  });

  if (authorization.error) {
    return res.status(authorization.status).json({ error: authorization.error });
  }

  const supabaseAdmin = authorization.admin;
  const { data: currentMember, error: currentMemberError } = await supabaseAdmin
    .from('workspace_members')
    .select('user_id, role, status, username, customer_id')
    .eq('workspace_id', workspaceId)
    .eq('user_id', userId)
    .maybeSingle();

  if (currentMemberError) {
    return res.status(500).json({ error: 'Ekip üyesi doğrulanamadı.' });
  }

  if (!currentMember) {
    return res.status(404).json({ error: 'Bu workspace içinde ekip üyesi bulunamadı.' });
  }

  if (customerId) {
    const { data: customer, error: customerError } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('workspace_id', workspaceId)
      .eq('id', customerId)
      .maybeSingle();

    if (customerError) {
      return res.status(500).json({ error: 'Bağlı müşteri doğrulanamadı.' });
    }

    if (!customer) {
      return res.status(400).json({ error: 'Bağlı müşteri bu workspace içinde bulunamadı.' });
    }
  }

  const removesActiveAdmin =
    currentMember.role === 'Yönetici' &&
    currentMember.status === 'Aktif' &&
    (role !== 'Yönetici' || status !== 'Aktif');

  if (removesActiveAdmin) {
    const { count, error: adminCountError } = await supabaseAdmin
      .from('workspace_members')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .eq('role', 'Yönetici')
      .eq('status', 'Aktif');

    if (adminCountError) {
      return res.status(500).json({ error: 'Yönetici sayısı doğrulanamadı.' });
    }

    if ((count || 0) <= 1) {
      return res.status(409).json({ error: 'Son aktif yöneticinin rolü veya durumu değiştirilemez.' });
    }
  }

  const { data: duplicateUsername, error: duplicateError } = await supabaseAdmin
    .from('workspace_members')
    .select('user_id')
    .eq('workspace_id', workspaceId)
    .eq('username', username)
    .neq('user_id', userId)
    .limit(1);

  if (duplicateError) {
    return res.status(500).json({ error: 'Kullanıcı adı doğrulanamadı.' });
  }

  if (Array.isArray(duplicateUsername) && duplicateUsername.length > 0) {
    return res.status(409).json({ error: 'Bu kullanıcı adı başka bir hesapta kullanılıyor.' });
  }

  const { data: previousProfile } = await supabaseAdmin
    .from('profiles')
    .select('display_name')
    .eq('id', userId)
    .maybeSingle();

  const { data: updatedMember, error: memberError } = await supabaseAdmin
    .from('workspace_members')
    .update({
      username,
      role,
      status,
      customer_id: role === 'Müşteri/Misafir' ? customerId : null
    })
    .eq('workspace_id', workspaceId)
    .eq('user_id', userId)
    .select('workspace_id, user_id, role, status, username, customer_id')
    .single();

  if (memberError) {
    return res.status(500).json({ error: 'Ekip üyesi güncellenemedi.' });
  }

  if (removesActiveAdmin) {
    const { count: remainingAdminCount, error: remainingAdminError } = await supabaseAdmin
      .from('workspace_members')
      .select('*', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .eq('role', 'Yönetici')
      .eq('status', 'Aktif');

    if (remainingAdminError || (remainingAdminCount || 0) === 0) {
      const { error: restoreError } = await supabaseAdmin
        .from('workspace_members')
        .update({
          username: currentMember.username,
          role: currentMember.role,
          status: currentMember.status,
          customer_id: currentMember.customer_id
        })
        .eq('workspace_id', workspaceId)
        .eq('user_id', userId);

      if (restoreError) {
        return res.status(500).json({
          error: 'Son yönetici koruması doğrulanamadı ve değişiklik geri alınamadı.'
        });
      }

      return res.status(409).json({
        error: 'Son aktif yöneticinin rolü veya durumu değiştirilemez.'
      });
    }
  }

  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({ display_name: name })
    .eq('id', userId);

  if (profileError) {
    const { error: rollbackError } = await supabaseAdmin
      .from('workspace_members')
      .update({
        username: currentMember.username,
        role: currentMember.role,
        status: currentMember.status,
        customer_id: currentMember.customer_id
      })
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId);

    if (rollbackError) {
      return res.status(500).json({
        error: 'Profil güncellenemedi ve ekip üyesi değişikliği geri alınamadı.'
      });
    }

    if (previousProfile?.display_name) {
      await supabaseAdmin
        .from('profiles')
        .update({ display_name: previousProfile.display_name })
        .eq('id', userId);
    }

    return res.status(500).json({ error: 'Profil güncellenemedi; ekip üyesi değişikliği geri alındı.' });
  }

  return res.status(200).json({
    ok: true,
    member: {
      id: updatedMember.user_id,
      workspaceId: updatedMember.workspace_id,
      name,
      username: updatedMember.username,
      role: updatedMember.role,
      status: updatedMember.status,
      customerId: updatedMember.customer_id || ''
    }
  });
}
