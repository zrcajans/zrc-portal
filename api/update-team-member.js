import { createClient } from '@supabase/supabase-js';

const normalizeCredentialText = (value = '') =>
  String(value || '')
    .trim()
    .toLocaleLowerCase('tr-TR')
    .replace(/\s+/g, '');

const normalizeTeamRole = (role = '') => {
  const cleanRole = String(role || '').trim();

  if (cleanRole === 'Yönetici') return 'Yönetici';
  if (cleanRole === 'Müşteri/Misafir' || cleanRole === 'Müşteri' || cleanRole === 'Misafir') return 'Müşteri/Misafir';

  return 'Ekip Üyesi';
};

const isSupabaseUuid = (value = '') =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(value || '').trim());

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Sadece POST desteklenir.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: 'Supabase servis bilgileri eksik.' });
  }

  const body = req.body || {};
  const workspaceId = String(body.workspaceId || '').trim();
  const userId = String(body.userId || body.memberId || '').trim();
  const name = String(body.name || '').trim();
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

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  const { data: duplicateUsername, error: duplicateError } = await supabaseAdmin
    .from('workspace_members')
    .select('user_id')
    .eq('workspace_id', workspaceId)
    .eq('username', username)
    .neq('user_id', userId)
    .limit(1);

  if (duplicateError) {
    return res.status(500).json({ error: duplicateError.message });
  }

  if (Array.isArray(duplicateUsername) && duplicateUsername.length > 0) {
    return res.status(409).json({ error: 'Bu kullanıcı adı başka bir hesapta kullanılıyor.' });
  }

  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({
      display_name: name
    })
    .eq('id', userId);

  if (profileError) {
    return res.status(500).json({ error: profileError.message });
  }

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
    return res.status(500).json({ error: memberError.message });
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
