import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const normalizeText = (value = '') =>
  String(value || '').trim().toLowerCase();

const normalizeUsername = (value = '') => {
  const raw = normalizeText(value);

  return raw
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9@._-]+/g, '')
    .slice(0, 120);
};

const isUuid = (value) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ''));

const unique = (arr) =>
  arr
    .map((value) => String(value || '').trim())
    .filter(Boolean)
    .filter((value, index, list) => list.indexOf(value) === index);

const isProtectedAccount = (member = {}, value = '') => {
  const role = normalizeText(member.role || member.type || '');
  const email = normalizeText(member.email || value);
  const username = normalizeText(member.username || value);
  const name = normalizeText(member.name || member.fullName || member.full_name || '');

  if (role.includes('yönetici') || role.includes('yonetici') || role.includes('admin')) return true;
  if (email === 'info@zrcajans.com') return true;
  if (username === 'info@zrcajans.com') return true;
  if (name.includes('zrc babaa')) return true;

  return false;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({
      ok: false,
      error: 'Supabase service role env eksik.'
    });
  }

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const body = req.body || {};
  const member = body.member || {};
  const customer = body.customer || {}; // zrc-customer-body-candidates-v1
  const workspaceId = String(body.workspaceId || '').trim();

  const idCandidates = unique([
    body.userId,
    member.userId,
    member.user_id,
    member.authUserId,
    member.auth_user_id,
    member.supabaseUserId,
    member.supabase_user_id,
    member.profileId,
    member.profile_id,
    member.id,
    customer.accountUserId,
    customer.account_user_id,
    customer.userId,
    customer.user_id,
    customer.authUserId,
    customer.auth_user_id,
    customer.supabaseUserId,
    customer.supabase_user_id,
    customer.id
  ]).filter(isUuid);

  const rawTextCandidates = unique([
    body.username,
    member.username,
    member.email,
    member.name,
    member.fullName,
    member.full_name,
    customer.username,
    customer.userName,
    customer.email,
    customer.mail,
    customer.name,
    customer.title,
    customer.customerName,
    customer.fullName,
    customer.full_name
  ]);

  const usernameCandidates = unique([
    ...rawTextCandidates.map(normalizeText),
    ...rawTextCandidates.map(normalizeUsername),
    ...rawTextCandidates.map((value) => {
      const v = normalizeUsername(value);
      return v && !v.startsWith('@') && !v.includes('@') ? `@${v}` : v;
    }),
    ...rawTextCandidates.map((value) => {
      const v = normalizeUsername(value);
      return v.startsWith('@') ? v.slice(1) : v;
    })
  ]);

  const emailCandidates = usernameCandidates.filter((value) => value.includes('@'));

  const customerCandidates = unique([
    body.customerId,
    member.customerId,
    member.customer_id,
    customer.id,
    customer.customerId,
    customer.customer_id
  ]);

  const deletedRows = [];
  const deletedAuthUsers = [];
  const attempts = [];

  const ignoreMissingColumn = (error) => {
    const msg = String(error?.message || '').toLowerCase();

    return (
      msg.includes('column') ||
      msg.includes('schema cache') ||
      msg.includes('does not exist') ||
      msg.includes('not found')
    );
  };

  const deleteFrom = async (table, column, value, workspaceScoped = false) => {
    if (!value) return;

    attempts.push(`${table}.${column}:${value}`);

    let query = admin.from(table).delete();

    if (workspaceScoped && workspaceId) {
      query = query.eq('workspace_id', workspaceId);
    }

    const { data, error } = await query.eq(column, value).select('*');

    if (error) {
      if (ignoreMissingColumn(error)) return;
      throw new Error(`${table}.${column} silme hatası: ${error.message}`);
    }

    if (Array.isArray(data) && data.length > 0) {
      deletedRows.push(...data.map((row) => ({ table, ...row })));
    }
  };

  const findAuthUsersByEmail = async () => {
    const matches = [];
    const emailSet = new Set(emailCandidates.map(normalizeText));

    if (emailSet.size === 0) return matches;

    for (let page = 1; page <= 20; page += 1) {
      const { data, error } = await admin.auth.admin.listUsers({
        page,
        perPage: 1000
      });

      if (error) {
        throw new Error(`Auth kullanıcı listesi okunamadı: ${error.message}`);
      }

      const users = data?.users || [];

      for (const user of users) {
        const email = normalizeText(user.email || '');
        if (email && emailSet.has(email)) {
          matches.push(user);
        }
      }

      if (users.length < 1000) break;
    }

    return matches;
  };

  const deleteAuthUserById = async (userId, source = 'id') => {
    if (!userId || !isUuid(userId)) return;

    if (isProtectedAccount(member, userId)) {
      attempts.push(`auth.users:${userId}:protected-skipped`);
      return;
    }

    attempts.push(`auth.users.${source}:${userId}`);

    const { error } = await admin.auth.admin.deleteUser(userId, false);

    if (error) {
      throw new Error(`Auth kullanıcısı silinemedi (${userId}): ${error.message}`);
    }

    deletedAuthUsers.push(userId);
  };

  try {
    for (const id of idCandidates) {
      await deleteFrom('workspace_members', 'user_id', id, true);
      await deleteFrom('workspace_members', 'id', id, true);
      await deleteFrom('profiles', 'id', id, false);
      await deleteFrom('profiles', 'user_id', id, false);
    }

    for (const value of usernameCandidates) {
      await deleteFrom('workspace_members', 'username', value, true);
      await deleteFrom('workspace_members', 'email', value, true);
      await deleteFrom('profiles', 'username', value, false);
      await deleteFrom('profiles', 'email', value, false);
      await deleteFrom('profiles', 'full_name', value, false);
      await deleteFrom('profiles', 'name', value, false);
    }

    for (const customerId of customerCandidates) {
      await deleteFrom('workspace_members', 'customer_id', customerId, true);
    }

    const authIdsFromDeletedRows = unique(
      deletedRows.flatMap((row) => [
        row.user_id,
        row.id,
        row.auth_user_id,
        row.supabase_user_id,
        row.profile_id
      ])
    ).filter(isUuid);

    const authIds = unique([...idCandidates, ...authIdsFromDeletedRows]).filter(isUuid);

    for (const authId of authIds) {
      await deleteAuthUserById(authId, 'id');
    }

    const authUsersByEmail = await findAuthUsersByEmail();

    for (const user of authUsersByEmail) {
      if (isProtectedAccount(member, user.email)) {
        attempts.push(`auth.users.email:${user.email}:protected-skipped`);
        continue;
      }

      await deleteAuthUserById(user.id, 'email');
    }

    return res.status(200).json({
      ok: true,
      deletedCount: deletedRows.length,
      deletedAuthUserCount: deletedAuthUsers.length,
      deletedRows,
      deletedAuthUsers,
      attempts,
      note:
        deletedAuthUsers.length > 0
          ? 'Portal kaydı ve Supabase Auth kullanıcısı silindi.'
          : deletedRows.length > 0
            ? 'Portal kaydı silindi. Eşleşen Auth kullanıcısı bulunamadı.'
            : 'Veritabanında eşleşen kayıt bulunamadı; UI/local silmeye izin verildi.'
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error?.message || 'Bilinmeyen silme hatası',
      attempts
    });
  }
}
