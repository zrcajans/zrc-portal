import { authorizeWorkspaceRequest, isSupabaseUuid } from '../server/supabaseAuthorization.js';

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
    .replace(/[^a-z0-9._-]/g, '')
    .slice(0, 120);

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

  const body = typeof req.body === 'object' && req.body !== null ? req.body : {};
  const workspaceId = String(body.workspaceId || '').trim();
  const name = String(body.name || '').trim().slice(0, 120);
  const username = normalizeCredentialText(body.username || name);
  const password = String(body.password || '').trim();
  const role = normalizeRole(body.role);
  const customerId = role === 'Müşteri/Misafir' ? String(body.customerId || '').trim() : '';

  if (!name) {
    return sendJson(res, 400, { error: 'Ad Soyad boş olamaz.' });
  }

  if (!username || username.length < 3) {
    return sendJson(res, 400, { error: 'Kullanıcı adı en az 3 karakter olmalı.' });
  }

  if (password.length < 8) {
    return sendJson(res, 400, { error: 'Şifre en az 8 karakter olmalı.' });
  }

  if (role === 'Müşteri/Misafir' && !isSupabaseUuid(customerId)) {
    return sendJson(res, 400, { error: 'Müşteri/Misafir rolü için geçerli müşteri gerekli.' });
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
    return sendJson(res, authorization.status, { error: authorization.error });
  }

  const admin = authorization.admin;

  const { data: existingUsername, error: duplicateError } = await admin
    .from('workspace_members')
    .select('user_id')
    .eq('workspace_id', workspaceId)
    .eq('username', username)
    .maybeSingle();

  if (duplicateError) {
    return sendJson(res, 500, { error: 'Kullanıcı adı kontrolü yapılamadı.' });
  }

  if (existingUsername?.user_id) {
    return sendJson(res, 409, { error: 'Bu kullanıcı adı zaten kullanılıyor.' });
  }

  if (customerId) {
    const { data: customer, error: customerError } = await admin
      .from('customers')
      .select('id, account_user_id')
      .eq('workspace_id', workspaceId)
      .eq('id', customerId)
      .maybeSingle();

    if (customerError) {
      return sendJson(res, 500, { error: 'Bağlı müşteri doğrulanamadı.' });
    }

    if (!customer) {
      return sendJson(res, 400, { error: 'Bağlı müşteri bu workspace içinde bulunamadı.' });
    }

    if (customer.account_user_id) {
      return sendJson(res, 409, { error: 'Bu müşteri zaten başka bir giriş hesabına bağlı.' });
    }
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

    return sendJson(res, 500, { error: 'Supabase Auth kullanıcısı oluşturulamadı.' });
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
    await admin.auth.admin.deleteUser(userId, false);
    return sendJson(res, 500, { error: 'Profil kaydı oluşturulamadı; giriş hesabı geri alındı.' });
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
    await admin.from('profiles').delete().eq('id', userId);
    await admin.auth.admin.deleteUser(userId, false);
    return sendJson(res, 500, { error: 'Workspace üyeliği oluşturulamadı; giriş hesabı geri alındı.' });
  }

  if (customerId) {
    const { data: linkedCustomer, error: customerLinkError } = await admin
      .from('customers')
      .update({ account_user_id: userId })
      .eq('id', customerId)
      .eq('workspace_id', workspaceId)
      .is('account_user_id', null)
      .select('id')
      .maybeSingle();

    if (customerLinkError || !linkedCustomer) {
      await admin
        .from('workspace_members')
        .delete()
        .eq('workspace_id', workspaceId)
        .eq('user_id', userId);
      await admin.from('profiles').delete().eq('id', userId);
      await admin.auth.admin.deleteUser(userId, false);

      return sendJson(res, 409, {
        error: 'Müşteri hesabı bağlanamadı; oluşturulan giriş hesabı geri alındı.'
      });
    }
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
