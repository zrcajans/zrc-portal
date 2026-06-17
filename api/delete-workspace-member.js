import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const normalizeCredentialText = (value = '') =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9._-]+/g, '')
    .slice(0, 80);

const isUuid = (value) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ''));

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({
      ok: false,
      error: 'Supabase service role env eksik. SUPABASE_URL/VITE_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli.'
    });
  }

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const body = req.body || {};
  const workspaceId = String(body.workspaceId || '').trim();
  const member = body.member || {};

  if (!workspaceId || !isUuid(workspaceId)) {
    return res.status(400).json({ ok: false, error: 'Geçersiz workspaceId' });
  }

  const possibleUserIds = [
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
    .filter(Boolean)
    .filter(isUuid)
    .filter((value, index, arr) => arr.indexOf(value) === index);

  const possibleUsernames = [
    body.username,
    member.username,
    member.email,
    member.name
  ]
    .map(normalizeCredentialText)
    .filter(Boolean)
    .filter((value, index, arr) => arr.indexOf(value) === index);

  const possibleCustomerIds = [
    body.customerId,
    member.customerId,
    member.customer_id
  ]
    .map((value) => String(value || '').trim())
    .filter(Boolean)
    .filter((value, index, arr) => arr.indexOf(value) === index);

  const deletedRows = [];
  const attempts = [];

  const runDelete = async (label, column, value) => {
    if (!value) return;

    attempts.push(`${column}:${value}`);

    const { data, error } = await admin
      .from('workspace_members')
      .delete()
      .eq('workspace_id', workspaceId)
      .eq(column, value)
      .select('workspace_id,user_id,username,customer_id,role,status');

    if (error) {
      throw new Error(`${label} silme hatası: ${error.message}`);
    }

    if (Array.isArray(data) && data.length > 0) {
      deletedRows.push(...data);
    }
  };

  try {
    for (const userId of possibleUserIds) {
      await runDelete('user_id', 'user_id', userId);
    }

    for (const username of possibleUsernames) {
      await runDelete('username', 'username', username);
    }

    for (const customerId of possibleCustomerIds) {
      await runDelete('customer_id', 'customer_id', customerId);
    }

    const uniqueDeleted = new Map(
      deletedRows.map((row) => [`${row.workspace_id}:${row.user_id}:${row.username}:${row.customer_id}`, row])
    );

    if (uniqueDeleted.size === 0) {
      return res.status(404).json({
        ok: false,
        error: 'Veritabanında silinecek workspace_members kaydı bulunamadı. UI silme engellendi.',
        attempts
      });
    }

    return res.status(200).json({
      ok: true,
      deletedCount: uniqueDeleted.size,
      deletedRows: Array.from(uniqueDeleted.values()),
      attempts
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error?.message || 'Bilinmeyen silme hatası',
      attempts
    });
  }
}
