import assert from 'node:assert/strict';
import test from 'node:test';
import {
  authorizeAnyActiveWorkspaceRequest,
  authorizeWorkspaceRequest
} from '../server/supabaseAuthorization.js';

const workspaceId = '11111111-1111-4111-8111-111111111111';

const createClientMock = ({
  userId = '22222222-2222-4222-8222-222222222222',
  authError = null,
  membership = { role: 'Yönetici', status: 'Aktif' },
  membershipError = null,
  memberships = null
} = {}) => {
  let clientIndex = 0;

  return () => {
    clientIndex += 1;

    if (clientIndex === 1) {
      return {
        auth: {
          getUser: async (token) => ({
            data: { user: token && userId ? { id: userId } : null },
            error: authError
          })
        }
      };
    }

    return {
      auth: { admin: {} },
      from: () => {
        const query = {
          select: () => query,
          eq: () => query,
          limit: async () => ({
            data: memberships ?? (membership ? [{ workspace_id: workspaceId, ...membership }] : []),
            error: membershipError
          }),
          maybeSingle: async () => ({ data: membership, error: membershipError })
        };

        return query;
      }
    };
  };
};

const baseOptions = {
  authorizationHeader: 'Bearer valid-token',
  workspaceId,
  supabaseUrl: 'https://example.supabase.co',
  supabaseAnonKey: 'anon',
  serviceRoleKey: 'service'
};

test('workspace authorization rejects requests without a bearer token', async () => {
  const result = await authorizeWorkspaceRequest({
    ...baseOptions,
    authorizationHeader: '',
    createClientImpl: createClientMock()
  });

  assert.equal(result.status, 401);
  assert.equal(result.admin, undefined);
});

test('workspace authorization rejects inactive or cross-workspace membership', async () => {
  const result = await authorizeWorkspaceRequest({
    ...baseOptions,
    createClientImpl: createClientMock({ membership: null })
  });

  assert.equal(result.status, 403);
  assert.equal(result.admin, undefined);
});

test('admin authorization rejects an active non-admin member', async () => {
  const result = await authorizeWorkspaceRequest({
    ...baseOptions,
    requireAdmin: true,
    createClientImpl: createClientMock({
      membership: { role: 'Ekip Üyesi', status: 'Aktif' }
    })
  });

  assert.equal(result.status, 403);
  assert.equal(result.admin, undefined);
});

test('admin authorization returns the scoped admin client for an active admin', async () => {
  const result = await authorizeWorkspaceRequest({
    ...baseOptions,
    requireAdmin: true,
    createClientImpl: createClientMock()
  });

  assert.equal(result.error, undefined);
  assert.equal(result.userId, '22222222-2222-4222-8222-222222222222');
  assert.ok(result.admin);
});

test('active-workspace authorization rejects users with no active membership', async () => {
  const result = await authorizeAnyActiveWorkspaceRequest({
    ...baseOptions,
    createClientImpl: createClientMock({ membership: null, memberships: [] })
  });

  assert.equal(result.status, 403);
});
