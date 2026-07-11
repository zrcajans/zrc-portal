import { createAvatarFromName, getAvatarCandidate } from './avatarHelpers.jsx';
import { sanitizeTeamMemberCredentials } from './credentialSafetyHelpers.js';

export const teamRoleOptions = ['Yönetici', 'Ekip Üyesi', 'Müşteri/Misafir'];

export const normalizeTeamRole = (role = '') => {
  const cleanRole = String(role || '').trim();

  if (cleanRole === 'Yönetici') return 'Yönetici';
  if (cleanRole === 'Müşteri/Misafir' || cleanRole === 'Müşteri' || cleanRole === 'Misafir') return 'Müşteri/Misafir';

  return 'Ekip Üyesi';
};

export const normalizeCredentialText = (value = '') =>
  String(value || '')
    .trim()
    .toLocaleLowerCase('tr-TR')
    .replaceAll('ı', 'i')
    .replaceAll('ğ', 'g')
    .replaceAll('ü', 'u')
    .replaceAll('ş', 's')
    .replaceAll('ö', 'o')
    .replaceAll('ç', 'c')
    .replace(/[^a-z0-9._-]/g, '');

export const isLegacyDemoTeamMemberRecord = (member = {}) => {
  const id = String(member.id || '');
  const username = normalizeCredentialText(member.username || '');
  const name = normalizeCredentialText(member.name || '');
  const email = normalizeCredentialText(member.email || '');

  return (
    ['user-2', 'user-3', 'user-4', 'user-5'].includes(id) ||
    ['ahmet', 'zeynep', 'can', 'misafir'].includes(username) ||
    ['ahmetyilmaz', 'zeynepkaya', 'canoz', 'demomisafir'].includes(name) ||
    ['ahmet@zrcajans.com', 'zeynep@zrcajans.com', 'can@zrcajans.com', 'misafir@orneksirket.com'].includes(email)
  );
};

export const isZrcAjansIdentityRecord = (record = {}) => {
  const id = String(record.id || record.userId || '');
  const username = normalizeCredentialText(record.username || '');
  const name = normalizeCredentialText(record.name || record.fullName || record.displayName || '');
  const email = normalizeCredentialText(record.email || '');

  return (
    id === 'user-1' ||
    username === 'zrcajans' ||
    name === 'zrcajans' ||
    email === 'info@zrcajans.com'
  );
};

export const createUsernameFromMember = (member = {}) => {
  const emailName = String(member.email || '').split('@')[0];

  return normalizeCredentialText(member.username || emailName || member.name || member.id || 'kullanici');
};

export const normalizeTeamMember = (member = {}) => sanitizeTeamMemberCredentials({
  ...member,
  role: normalizeTeamRole(member.role),
  avatar: getAvatarCandidate(member) || createAvatarFromName(member.name),
  username: createUsernameFromMember(member),
  customerId: member.customerId || member.linkedCustomerId || ''
});

export const normalizeCustomerRecord = (customer = {}) => ({
  ...customer,
  accountUserId: customer.accountUserId || customer.linkedUserId || ''
});

export const getTeamRoleTone = (role = '') => {
  const normalizedRole = normalizeTeamRole(role);

  if (normalizedRole === 'Yönetici') return 'bg-[#ff3600] border-[#ff3600] text-white';
  if (normalizedRole === 'Müşteri/Misafir') return 'bg-violet-50 border-violet-100 text-violet-600';

  return 'bg-blue-50 border-blue-100 text-blue-600';
};

export const getPermissionsForRole = (role = '') => {
  const normalizedRole = normalizeTeamRole(role);

  if (normalizedRole === 'Yönetici') {
    return {
      manageProjects: true,
      manageProjectSettings: true,
      manageColumns: true,
      createTasks: true,
      editTasks: true,
      deleteTasks: true,
      manageTeam: true,
      manageCustomers: true,
      manageFiles: true,
      comment: true,
      message: true,
      viewAllTasks: true
    };
  }

  if (normalizedRole === 'Ekip Üyesi') {
    return {
      manageProjects: false,
      manageProjectSettings: false,
      manageColumns: false,
      createTasks: true,
      editTasks: true,
      deleteTasks: false,
      manageTeam: false,
      manageCustomers: false,
      manageFiles: true,
      comment: true,
      message: true,
      viewAllTasks: true
    };
  }

  return {
    manageProjects: false,
    manageProjectSettings: false,
    manageColumns: false,
    createTasks: false,
    editTasks: false,
    deleteTasks: false,
    manageTeam: false,
    manageCustomers: false,
    manageFiles: false,
    comment: true,
    message: true,
    viewAllTasks: false
  };
};

export const getAccountTypeFromRole = (role = '') => {
  const normalizedRole = normalizeTeamRole(role);

  if (normalizedRole === 'Yönetici') return 'Patron';
  if (normalizedRole === 'Müşteri/Misafir') return 'Müşteri';

  return 'Ekip Üyesi';
};

export const getStartPanelForAccountType = () => ({
  menu: 'Ana Sayfa',
  content: 'Ana Sayfa',
  tab: 'Görevler'
});

export const createDefaultTeamMembers = () => [
  { id: 'user-1', name: 'ZRC AJANS', email: 'info@zrcajans.com', username: 'zrcajans', role: 'Yönetici', avatar: 'ZRC', status: 'Aktif' }
];

export const createDefaultCustomers = () => [];
