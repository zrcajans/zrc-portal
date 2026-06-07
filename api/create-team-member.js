import { createClient } from '@supabase/supabase-js';

const normalizeCredentialText = (value = '') =>
  String(value || '')
    .trim()
    .toLocaleLowerCase('tr-TR')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9._-]/g, '');

const normalizeRole = (role = '') => {
  const cleanRole = String(role || '').trim();

  if (cleanRole === 'Yönetici') return 'Yönetici';
  if (cleanRole === 'Müşteri/Misafir') return 'Müşteri/Misafir';

  return 'Ekip Üyesi';
};

const createAvatarFromName = (name = '') => {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const initials = parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toLocaleUpperCase('tr-TR'))
    .join('');

  return initials || 'ZR';
};

const sendJson = (res, statusCode, payload) => {
  res.status(statusCode).json(payload);
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Sadece POST isteği desteklenir.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
    return sendJson(res, 500, {
      error:
        'Vercel ortam değişkenleri eksik. SUPABASE_SERVICE_ROLE_KEY, VITE_SUPABASE_URL ve VITE_SUPABASE_PUBLISHABLE_KEY kontrol edilmeli.'
    });
  }

  const authorizationHeader = req.headers.authorization || '';

  if (!authorizationHeader.startsWith('Bearer ')) {
    return sendJson(res, 401, { error: 'Yönetici oturumu bulunamadı.' });
  }

  const body = typeof req.body === 'object' && req.body !== null ? req.body : {};
  const workspaceId = String(body.workspaceId || '').trim();
  const name = String(body.name || '').trim();
  const username = normalizeCredentialText(body.username || name);
  const password = String(body.password || '').trim();
  const role = normalizeRole(body.role);
  const customerId = String(body.customerId || '').trim();

  if (!workspaceId) {
    return sendJson(res, 400, { error: 'Workspace bilgisi eksik.' });
  }

  if (!name) {
    return sendJson(res, 400, { error: 'Ad Soyad boş olamaz.' });
  }

  if (!username || username.length < 3) {
    return sendJson(res, 400, { error: 'Kullanıcı adı en az 3 karakter olmalı.' });
  }

  if (password.length < 4) {
    return sendJson(res, 400, { error: 'Şifre en az 4 karakter olmalı.' });
  }

  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: authorizationHeader
      }
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  const { data: authData, error: authError } = await userClient.auth.getUser();

  if (authError || !authData?.user?.id) {
    return sendJson(res, 401, { error: 'Yönetici oturumu doğrulanamadı.' });
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  const { data: requesterMembership, error: requesterError } = await admin
    .from('workspace_members')
    .select('role, status')
    .eq('workspace_id', workspaceId)
    .eq('user_id', authData.user.id)
    .maybeSingle();

  if (requesterError) {
    return sendJson(res, 500, { error: `Yetki kontrolü yapılamadı: ${requesterError.message}` });
  }

  if (
    !requesterMembership ||
    requesterMembership.status !== 'Aktif' ||
    requesterMembership.role !== 'Yönetici'
  ) {
    return sendJson(res, 403, { error: 'Bu işlemi sadece aktif Yönetici hesabı yapabilir.' });
  }

  const { data: existingUsername, error: duplicateError } = await admin
    .from('workspace_members')
    .select('user_id')
    .eq('workspace_id', workspaceId)
    .eq('username', username)
    .maybeSingle();

  if (duplicateError) {
    return sendJson(res, 500, { error: `Kullanıcı adı kontrolü yapılamadı: ${duplicateError.message}` });
  }

  if (existingUsername?.user_id) {
    return sendJson(res, 409, { error: 'Bu kullanıcı adı zaten kullanılıyor.' });
  }

  const email = `${username}@zrc.local`;

  const { data: createdUserData, error: createUserError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      display_name: name,
      username,
      role,
      workspace_id: workspaceId
    }
  });

  if (createUserError || !createdUserData?.user?.id) {
    const message = createUserError?.message || 'Supabase Auth kullanıcısı oluşturulamadı.';

    if (message.toLocaleLowerCase('tr-TR').includes('already')) {
      return sendJson(res, 409, { error: 'Bu kullanıcı adı için giriş hesabı zaten var.' });
    }

    return sendJson(res, 500, { error: message });
  }

  const userId = createdUserData.user.id;
  const avatar = createAvatarFromName(name);

  const { error: profileError } = await admin
    .from('profiles')
    .upsert(
      {
        id: userId,
        display_name: name,
        email,
        avatar_url: avatar
      },
      { onConflict: 'id' }
    );

  if (profileError) {
    return sendJson(res, 500, { error: `Profil kaydı oluşturulamadı: ${profileError.message}` });
  }

  const membershipPayload = {
    workspace_id: workspaceId,
    user_id: userId,
    role,
    status: 'Aktif',
    username
  };

  if (customerId) {
    membershipPayload.customer_id = customerId;
  }

  const { error: membershipError } = await admin
    .from('workspace_members')
    .insert(membershipPayload);

  if (membershipError) {
    return sendJson(res, 500, { error: `Workspace üyeliği oluşturulamadı: ${membershipError.message}` });
  }

  if (customerId) {
    await admin
      .from('customers')
      .update({ account_user_id: userId })
      .eq('id', customerId)
      .eq('workspace_id', workspaceId);
  }

  return sendJson(res, 200, {
    member: {
      id: userId,
      workspaceId,
      name,
      email,
      username,
      password: '',
      role,
      customerId,
      avatar,
      status: 'Aktif',
      authProvider: 'supabase'
    }
  });
}
