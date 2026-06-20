const CLIENT_SECRET_FIELDS = [
  'password',
  'currentPassword',
  'newPassword',
  'repeatPassword',
  'token',
  'secret',
  'serviceRoleKey'
];

export const stripClientSecrets = (value = {}) => {
  const sanitized = { ...(value || {}) };

  CLIENT_SECRET_FIELDS.forEach((field) => {
    delete sanitized[field];
  });

  return sanitized;
};

export const sanitizeTeamMemberCredentials = (member = {}) => stripClientSecrets(member);

export const sanitizeProfileCredentials = (profile = {}) => ({
  ...stripClientSecrets(profile),
  password: '',
  currentPassword: '',
  newPassword: '',
  repeatPassword: ''
});

export const sanitizeClientPreferences = (preferences = {}) => stripClientSecrets(preferences);
