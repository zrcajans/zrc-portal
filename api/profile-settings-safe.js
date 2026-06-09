import { createClient } from '@supabase/supabase-js';

function sendJson(res, statusCode, payload) {
  res.status(statusCode).json(payload);
}

function getEnvValue(name) {
  return process.env[name] || '';
}

function cleanString(value, maxLength = 500) {
  return String(value || '').trim().slice(0, maxLength);
}

function isObject(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function normalizeText(value = '') {
  return String(value || '')
    .toLocaleLowerCase('tr-TR')
    .replaceAll('ı', 'i')
    .replaceAll('ş', 's')
    .replaceAll('ğ', 'g')
    .replaceAll('ü', 'u')
    .replaceAll('ö', 'o')
    .replaceAll('ç', 'c');
}

function isAdminRole(role = '') {
  const normalized = normalizeText(role);

  return (
    normalized.includes('patron') ||
    normalized.includes('yonetici') ||
    normalized.includes('admin') ||
    normalized.includes('owner')
  );
}

function isSensitiveKey(key = '') {
  const normalized = normalizeText(key);

  return (
    normalized.includes('password') ||
    normalized.includes('sifre') ||
    normalized.includes('token') ||
    normalized.includes('secret') ||
    normalized.includes('service_role') ||
    normalized.includes('apikey') ||
    normalized.includes('authorization')
  );
}

function stripSensitive(value, depth = 0) {
  if (depth > 7) return null;

  if (Array.isArray(value)) {
    return value.slice(0, 500).map((item) => stripSensitive(item, depth + 1));
  }

  if (!isObject(value)) {
    if (typeof value === 'string') return value.slice(0, 25000);
    return value;
  }

  const clean = {};

  Object.entries(value).forEach(([key, item]) => {
    if (isSensitiveKey(key)) return;
    clean[key] = stripSensitive(item, depth + 1);
  });

  return clean;
}

function sanitizeProfileDraft(profileDraft = {}) {
  const clean = {
    firstName: cleanString(profileDraft.firstName, 80) || 'ZRC',
    lastName: cleanString(profileDraft.lastName, 80),
    email: cleanString(profileDraft.email, 180),
    title: cleanString(profileDraft.title, 120),
    language: cleanString(profileDraft.language, 40) || 'Türkçe',
    status: cleanString(profileDraft.status, 80) || 'Hiçbiri',
    dateFormat: cleanString(profileDraft.dateFormat, 80),
    timeFormat: cleanString(profileDraft.timeFormat, 80),
    timezone: cleanString(profileDraft.timezone, 80),
    avatarDataUrl: cleanString(profileDraft.avatarDataUrl, 1500000)
  };

  if (clean.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)) {
    throw new Error('Geçerli bir e-posta adresi yazılmalı.');
  }

  return clean;
}

async function verifyRequester({ userClient, admin, workspaceId }) {
  const { data: authData, error: authError } = await userClient.auth.getUser();

  if (authError || !authData?.user?.id) {
    return {
      errorStatus: 401,
      error: 'Oturum doğrulanamadı.'
    };
  }

  const userId = authData.user.id;

  const { data: membership, error: membershipError } = await admin
    .from('workspace_members')
    .select('role, status, username, customer_id')
    .eq('workspace_id', workspaceId)
    .eq('user_id', userId)
    .maybeSingle();

  if (membershipError) {
    return {
      errorStatus: 500,
      error: `Üyelik kontrolü yapılamadı: ${membershipError.message}`
    };
  }

  if (!membership || membership.status !== 'Aktif') {
    return {
      errorStatus: 403,
      error: 'Bu işlem için aktif çalışma alanı üyesi olmalısın.'
    };
  }

  return {
    userId,
    membership
  };
}

async function readPreferences(admin, userId) {
  const { data, error } = await admin
    .from('user_preferences')
    .select('preferences')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) return {};
  return isObject(data?.preferences) ? data.preferences : {};
}

async function writePreferences(admin, { userId, workspaceId, preferences }) {
  const { error } = await admin
    .from('user_preferences')
    .upsert(
      {
        user_id: userId,
        workspace_id: workspaceId,
        preferences,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'user_id' }
    );

  if (error) throw error;
}

async function appendAudit(admin, { userId, workspaceId, membership, action }) {
  const current = await readPreferences(admin, userId);
  const previousAudit = Array.isArray(current.settingsAuditLog) ? current.settingsAuditLog : [];

  const entry = {
    type: 'profile-settings-safe-action',
    action,
    at: new Date().toISOString(),
    role: membership.role || '',
    username: membership.username || '',
    via: 'api/profile-settings-safe'
  };

  const next = {
    ...current,
    settingsAuditLog: [entry, ...previousAudit].slice(0, 120),
    updatedAt: new Date().toISOString()
  };

  await writePreferences(admin, {
    userId,
    workspaceId,
    preferences: next
  });

  return next;
}

async function safeCount(admin, tableName, filter = null) {
  try {
    let query = admin.from(tableName).select('*', { count: 'exact', head: true });

    if (filter?.column && filter?.value) {
      query = query.eq(filter.column, filter.value);
    }

    const { count, error } = await query;

    if (error) {
      return {
        table: tableName,
        ok: false,
        error: error.message
      };
    }

    return {
      table: tableName,
      ok: true,
      count: count || 0
    };
  } catch (error) {
    return {
      table: tableName,
      ok: false,
      error: error?.message || 'Bilinmeyen hata'
    };
  }
}

async function healthCheck(admin, workspaceId) {
  const checks = [];

  checks.push(await safeCount(admin, 'workspaces'));
  checks.push(await safeCount(admin, 'workspace_members', { column: 'workspace_id', value: workspaceId }));
  checks.push(await safeCount(admin, 'profiles'));
  checks.push(await safeCount(admin, 'projects', { column: 'workspace_id', value: workspaceId }));
  checks.push(await safeCount(admin, 'tasks', { column: 'workspace_id', value: workspaceId }));
  checks.push(await safeCount(admin, 'board_columns', { column: 'workspace_id', value: workspaceId }));
  checks.push(await safeCount(admin, 'files', { column: 'workspace_id', value: workspaceId }));
  checks.push(await safeCount(admin, 'customers', { column: 'workspace_id', value: workspaceId }));
  checks.push(await safeCount(admin, 'user_preferences'));

  return {
    ok: checks.every((item) => item.ok),
    checkedAt: new Date().toISOString(),
    checks
  };
}

async function saveProfile(admin, { userId, workspaceId, membership, body }) {
  const cleanDraft = sanitizeProfileDraft(body.profileDraft || {});
  const cleanPreferences = stripSensitive(body.profilePreferences || {});

  const displayName = `${cleanDraft.firstName || ''} ${cleanDraft.lastName || ''}`.trim() || 'Kullanıcı';

  const { error: profileError } = await admin
    .from('profiles')
    .upsert(
      {
        id: userId,
        display_name: displayName,
        email: cleanDraft.email || '',
        title: cleanDraft.title || '',
        status: 'Aktif',
        avatar_url: cleanDraft.avatarDataUrl || null
      },
      { onConflict: 'id' }
    );

  if (profileError) throw profileError;

  const current = await readPreferences(admin, userId);
  const previousAudit = Array.isArray(current.settingsAuditLog) ? current.settingsAuditLog : [];

  const nextPreferences = {
    ...current,
    profileDraft: cleanDraft,
    profilePreferences: {
      ...(isObject(current.profilePreferences) ? current.profilePreferences : {}),
      ...(isObject(cleanPreferences) ? cleanPreferences : {}),
      lastServerSavedAt: new Date().toISOString()
    },
    settingsSecurity: {
      role: membership.role || '',
      status: membership.status || '',
      username: membership.username || '',
      selfOnly: true,
      lastSavedAt: new Date().toISOString(),
      via: 'api/profile-settings-safe'
    },
    settingsAuditLog: [
      {
        type: 'profile-save',
        at: new Date().toISOString(),
        role: membership.role || '',
        username: membership.username || ''
      },
      ...previousAudit
    ].slice(0, 120),
    updatedAt: new Date().toISOString()
  };

  await writePreferences(admin, {
    userId,
    workspaceId,
    preferences: nextPreferences
  });

  return {
    ok: true,
    savedAt: nextPreferences.updatedAt,
    profile: stripSensitive({
      displayName,
      email: cleanDraft.email,
      title: cleanDraft.title,
      language: cleanDraft.language,
      status: cleanDraft.status
    })
  };
}

async function exportData(admin, { userId, workspaceId, membership }) {
  const adminRole = isAdminRole(membership.role);

  const { data: profile } = await admin
    .from('profiles')
    .select('id, display_name, email, title, status, avatar_url, created_at, updated_at')
    .eq('id', userId)
    .maybeSingle();

  const { data: preferences } = await admin
    .from('user_preferences')
    .select('workspace_id, preferences, updated_at')
    .eq('user_id', userId)
    .maybeSingle();

  const payload = {
    app: 'ZRC Portal',
    exportedAt: new Date().toISOString(),
    exportScope: adminRole ? 'workspace-lite' : 'self',
    requester: {
      userId,
      workspaceId,
      role: membership.role || '',
      status: membership.status || '',
      username: membership.username || ''
    },
    self: stripSensitive({
      profile,
      preferences
    })
  };

  if (!adminRole) return payload;

  const workspaceTables = {};

  const tableFilters = [
    ['workspace_members', 'id, workspace_id, user_id, role, status, username, customer_id, created_at, updated_at'],
    ['projects', '*'],
    ['tasks', '*'],
    ['board_columns', '*'],
    ['files', '*'],
    ['customers', '*']
  ];

  for (const [table, columns] of tableFilters) {
    const { data, error } = await admin
      .from(table)
      .select(columns)
      .eq('workspace_id', workspaceId)
      .limit(1500);

    workspaceTables[table] = {
      ok: !error,
      error: error?.message || null,
      rows: stripSensitive(data || [])
    };
  }

  payload.workspace = workspaceTables;

  return payload;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Sadece POST isteği desteklenir.' });
  }

  const supabaseUrl = getEnvValue('VITE_SUPABASE_URL');
  const supabaseAnonKey = getEnvValue('VITE_SUPABASE_PUBLISHABLE_KEY');
  const serviceRoleKey = getEnvValue('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
    return sendJson(res, 500, {
      error: 'Vercel ortam değişkenleri eksik.'
    });
  }

  const authorizationHeader = req.headers.authorization || '';

  if (!authorizationHeader.startsWith('Bearer ')) {
    return sendJson(res, 401, { error: 'Oturum tokenı bulunamadı.' });
  }

  const body = typeof req.body === 'object' && req.body !== null ? req.body : {};
  const workspaceId = cleanString(body.workspaceId, 120);
  const action = cleanString(body.action, 80);

  if (!workspaceId) {
    return sendJson(res, 400, { error: 'Workspace bilgisi eksik.' });
  }

  if (!action) {
    return sendJson(res, 400, { error: 'İşlem türü eksik.' });
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

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  const verified = await verifyRequester({ userClient, admin, workspaceId });

  if (verified.error) {
    return sendJson(res, verified.errorStatus || 403, { error: verified.error });
  }

  const { userId, membership } = verified;

  try {
    if (action === 'save-profile') {
      const result = await saveProfile(admin, {
        userId,
        workspaceId,
        membership,
        body
      });

      return sendJson(res, 200, result);
    }

    if (action === 'health-check') {
      await appendAudit(admin, { userId, workspaceId, membership, action });
      const result = await healthCheck(admin, workspaceId);

      return sendJson(res, 200, {
        ok: result.ok,
        membership: {
          role: membership.role || '',
          status: membership.status || '',
          username: membership.username || '',
          admin: isAdminRole(membership.role)
        },
        ...result
      });
    }

    if (action === 'export-data') {
      await appendAudit(admin, { userId, workspaceId, membership, action });
      const result = await exportData(admin, {
        userId,
        workspaceId,
        membership
      });

      return sendJson(res, 200, {
        ok: true,
        ...result
      });
    }

    if (action === 'feature-status') {
      await appendAudit(admin, { userId, workspaceId, membership, action });

      return sendJson(res, 200, {
        ok: true,
        status: 'backend_required',
        feature: cleanString(body.feature, 120),
        message: 'Bu özellik için ayrıca güvenli backend bağlantısı gerekir. Sahte aktif yapılmadı; talep kayda alındı.'
      });
    }

    return sendJson(res, 400, {
      error: `Desteklenmeyen işlem: ${action}`
    });
  } catch (error) {
    return sendJson(res, 500, {
      error: error?.message || 'Bilinmeyen hata'
    });
  }
}
