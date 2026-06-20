import assert from 'node:assert/strict';
import test from 'node:test';
import {
  sanitizeClientPreferences,
  sanitizeProfileCredentials,
  sanitizeTeamMemberCredentials
} from '../src/utils/credentialSafetyHelpers.js';

test('team member sanitization never retains a client-side password', () => {
  const member = sanitizeTeamMemberCredentials({
    id: 'member-1',
    name: 'Test User',
    username: 'test-user',
    password: 'should-not-survive'
  });

  assert.equal(Object.hasOwn(member, 'password'), false);
});

test('profile and preference sanitization removes authentication secrets', () => {
  const profile = sanitizeProfileCredentials({ password: 'one', newPassword: 'two', token: 'three' });
  const preferences = sanitizeClientPreferences({ theme: 'light', serviceRoleKey: 'secret' });

  assert.equal(profile.password, '');
  assert.equal(profile.newPassword, '');
  assert.equal(Object.hasOwn(profile, 'token'), false);
  assert.deepEqual(preferences, { theme: 'light' });
});
