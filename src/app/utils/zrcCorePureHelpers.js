import { formatZrcDate, formatZrcDateTime, formatZrcTime } from '../../utils/dateDisplayHelpers';
import { createAvatarFromName } from '../../utils/avatarHelpers';
import { normalizeCredentialText, normalizeCustomerRecord, normalizeTeamMember } from '../../utils/teamHelpers';

export const formatDateStringShort = (dateStr) => {
    return formatZrcDate(dateStr, { fallback: '' });
  };

export const getTaskCardDateParts = (task = {}) => {
    const startDate = formatDateStringShort(task.startDate || task.start || task.baslangicTarihi || '');
    const endDate = formatDateStringShort(
      task.endDate ||
      task.dueDate ||
      task.deadline ||
      task.bitisTarihi ||
      task.date ||
      ''
    );

    return {
      startDate,
      endDate,
      hasAnyDate: Boolean(startDate || endDate)
    };
  };

export const isSupabaseUuid = (value = '') =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(value || ''));

export const getSafeSupabasePriority = (priority = '') => {
    const cleanPriority = String(priority || '').trim();
    return ['Düşük', 'Normal', 'Yüksek', 'Acil'].includes(cleanPriority) ? cleanPriority : 'Normal';
  };

export const getPlainTaskDescription = (value) => {
    if (!value) return '';

    if (typeof value === 'string') {
      return value === '[object Object]' ? '' : value;
    }

    if (Array.isArray(value)) {
      return value.map(getPlainTaskDescription).filter(Boolean).join('\n');
    }

    if (typeof value === 'object') {
      if (typeof value.text === 'string') return value.text;
      if (typeof value.plainText === 'string') return value.plainText;
      if (typeof value.description === 'string') return value.description;
      if (typeof value.content === 'string') return value.content;

      if (Array.isArray(value.blocks)) {
        return value.blocks.map(getPlainTaskDescription).filter(Boolean).join('\n');
      }

      if (Array.isArray(value.children)) {
        return value.children.map(getPlainTaskDescription).filter(Boolean).join('\n');
      }

      return '';
    }

    return '';
  };

export const formatSupabaseDateTimeParts = (value = '') => {
    const safeValue = value || new Date();

    return {
      date: formatZrcDate(safeValue, { fallback: '' }),
      time: formatZrcTime(safeValue, { fallback: '' })
    };
  };

export const mapSupabaseStepToLocalStep = (step = {}) => ({
    id: `supabase-step-${step.id}`,
    supabaseId: step.id,
    text: step.text || '',
    completed: step.is_completed === true
  });

export const getSupabaseFileTypeLabel = (fileName = '') => {
    const extension = String(fileName || '').split('.').pop()?.toLowerCase();

    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension)) return 'Görsel';
    if (['mp4', 'mov', 'avi', 'mkv'].includes(extension)) return 'Video';
    if (['pdf'].includes(extension)) return 'PDF';
    if (['doc', 'docx'].includes(extension)) return 'Word';
    if (['xls', 'xlsx'].includes(extension)) return 'Excel';
    if (['ppt', 'pptx'].includes(extension)) return 'Sunum';

    return extension ? extension.toUpperCase() : 'Dosya';
  };

export const sanitizeStorageFileName = (fileName = 'dosya') =>
    String(fileName || 'dosya')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ı/g, 'i')
      .replace(/İ/g, 'I')
      .replace(/ğ/g, 'g')
      .replace(/Ğ/g, 'G')
      .replace(/ü/g, 'u')
      .replace(/Ü/g, 'U')
      .replace(/ş/g, 's')
      .replace(/Ş/g, 'S')
      .replace(/ö/g, 'o')
      .replace(/Ö/g, 'O')
      .replace(/ç/g, 'c')
      .replace(/Ç/g, 'C')
      .replace(/[^a-zA-Z0-9._-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 140) || 'dosya';

export const mapSupabaseCustomerToLocal = (customer = {}) =>
    normalizeCustomerRecord({
      id: customer.id,
      supabaseId: customer.id,
      name: customer.name || 'Müşteri',
      contact: customer.contact_name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      note: customer.note || '',
      status: customer.status || 'Aktif',
      accountUserId: customer.account_user_id || ''
    });

export const mapSupabaseWorkspaceMemberToLocal = (member = {}) => {
    const profile = Array.isArray(member.profiles) ? member.profiles[0] : member.profiles;
    const memberName = profile?.display_name || member.username || profile?.email || 'Kullanıcı';

    return normalizeTeamMember({
      id: member.user_id,
      workspaceId: member.workspace_id,
      name: memberName,
      email: profile?.email || '',
      username: member.username || profile?.email || '',
      password: '',
      role: member.role || 'Ekip Üyesi',
      customerId: member.customer_id || '',
      avatar: profile?.avatar_url || createAvatarFromName(memberName),
      status: member.status || 'Aktif'
    });
  };

export const normalizeProjectNameList = (projectList = []) =>
    Array.from(
      new Set(
        (Array.isArray(projectList) ? projectList : [])
          .map((projectName) => String(projectName || '').trim())
          .filter(Boolean)
      )
    );

export const mergeUniqueByKey = (existingItems = [], incomingItems = [], getKey = (item) => item?.id) => {
    const seenKeys = new Set();
    const result = [];

    [...incomingItems, ...existingItems].forEach((item) => {
      const key = getKey(item) || item?.id || JSON.stringify(item);

      if (seenKeys.has(key)) return;

      seenKeys.add(key);
      result.push(item);
    });

    return result;
  };

export const sanitizeProfileDraftForSafeApi = (draft = {}) => ({
    ...draft,
    firstName: String(draft.firstName || '').trim(),
    lastName: String(draft.lastName || '').trim(),
    email: String(draft.email || '').trim(),
    title: String(draft.title || '').trim(),
    language: draft.language || 'Türkçe',
    status: draft.status || 'Hiçbiri',
    dateFormat: draft.dateFormat || 'DD/MM/YYYY (30/05/2026)',
    timeFormat: draft.timeFormat || '24-Saat Formatı (02:21)',
    timezone: draft.timezone || 'UTC+03:00',
    password: '',
    currentPassword: '',
    newPassword: '',
    repeatPassword: ''
  });

export const sanitizeProfilePreferencesForSafeApi = (preferences = {}) => {
    const clone = { ...(preferences || {}) };

    delete clone.password;
    delete clone.currentPassword;
    delete clone.newPassword;
    delete clone.repeatPassword;
    delete clone.token;
    delete clone.secret;
    delete clone.serviceRoleKey;

    return clone;
  };

export const mapSupabaseQuickNoteToLocal = (note = {}) => ({
    id: `supabase-note-${note.id}`,
    supabaseId: note.id,
    text: note.text || '',
    createdAt: note.created_at || new Date().toISOString()
  });

export const createSupabaseHealthRow = (key, label, state, detail = '') => ({
    key,
    label,
    state,
    detail,
    checkedAt: new Date().toISOString()
  });

export const getSupabaseHealthStateClass = (state = 'idle') => {
    if (state === 'ok') return 'bg-emerald-50 border-emerald-100 text-emerald-700';
    if (state === 'warning') return 'bg-zinc-100 border-zinc-200 text-zinc-700';
    if (state === 'error') return 'bg-red-50 border-red-100 text-red-600';

    return 'bg-slate-50 border-slate-100 text-slate-600';
  };

export const formatSupabaseDateForLocalTask = (value = '') => {
    const cleanValue = String(value || '').trim();
    return formatZrcDate(cleanValue, { fallback: cleanValue });
  };

export const getIdentityValuesFromRecord = (record = {}) =>
    [
      record.id,
      record.userId,
      record.senderId,
      record.ownerId,
      record.creatorId,
      record.createdById,
      record.memberId,
      record.name,
      record.fullName,
      record.author,
      record.sender,
      record.actor,
      record.email,
      record.username
    ]
      .filter(Boolean)
      .map((value) => normalizeCredentialText(value));

export const getActivityDateLabel = (createdAt) => {
    return formatZrcDateTime(createdAt || new Date(), { fallback: 'Şimdi' });
  };

export const isReportTaskCompleted = (task) => {
    const statusText = String(task.status || '').toLocaleLowerCase('tr-TR');
    return task.completed === true || statusText.includes('tamam');
  };

export const getReportPriorityStyle = (priority) => {
    if (priority === 'Acil') return 'bg-red-50 text-red-600 border-red-100';
    if (priority === 'Yüksek') return 'bg-zinc-100 text-zinc-700 border-orange-100';
    if (priority === 'Düşük') return 'bg-emerald-50 text-emerald-600 border-emerald-100';

    return 'bg-zinc-100 text-zinc-700 border-blue-100';
  };
