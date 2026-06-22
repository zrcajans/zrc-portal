import assert from 'node:assert/strict';
import test from 'node:test';
import { syncCustomerAccountLink } from '../server/teamCustomerLink.js';

const createAdmin = (results = []) => {
  const calls = [];

  return {
    calls,
    from(table) {
      const call = { table, filters: [] };
      calls.push(call);

      const query = {
        update(payload) {
          call.payload = payload;
          return query;
        },
        eq(column, value) {
          call.filters.push(['eq', column, value]);
          return query;
        },
        is(column, value) {
          call.filters.push(['is', column, value]);
          return query;
        },
        or(value) {
          call.filters.push(['or', value]);
          return query;
        },
        select(value) {
          call.select = value;
          return query;
        },
        maybeSingle() {
          return Promise.resolve(results[calls.length - 1] || { data: null, error: null });
        },
        then(resolve, reject) {
          return Promise.resolve(results[calls.length - 1] || { data: null, error: null }).then(resolve, reject);
        }
      };

      return query;
    }
  };
};

test('customer account link is scoped, cleared, and reassigned', async () => {
  const admin = createAdmin([
    { error: null },
    { data: { id: 'customer-2' }, error: null }
  ]);

  const result = await syncCustomerAccountLink({
    admin,
    workspaceId: 'workspace-1',
    userId: 'user-1',
    nextCustomerId: 'customer-2',
    previousCustomerIds: ['customer-1']
  });

  assert.deepEqual(result, { ok: true });
  assert.deepEqual(admin.calls[0], {
    table: 'customers',
    payload: { account_user_id: null },
    filters: [
      ['eq', 'workspace_id', 'workspace-1'],
      ['eq', 'account_user_id', 'user-1']
    ]
  });
  assert.deepEqual(admin.calls[1].filters, [
    ['eq', 'workspace_id', 'workspace-1'],
    ['eq', 'id', 'customer-2'],
    ['or', 'account_user_id.is.null,account_user_id.eq.user-1']
  ]);
});

test('failed reassignment restores the previous customer link', async () => {
  const admin = createAdmin([
    { error: null },
    { data: null, error: { message: 'conflict' } },
    { data: { id: 'customer-1' }, error: null }
  ]);

  const result = await syncCustomerAccountLink({
    admin,
    workspaceId: 'workspace-1',
    userId: 'user-1',
    nextCustomerId: 'customer-2',
    previousCustomerIds: ['customer-1', 'customer-1']
  });

  assert.equal(result.ok, false);
  assert.match(result.error, /geri yüklendi/);
  assert.equal(admin.calls.length, 3);
  assert.deepEqual(admin.calls[2].filters, [
    ['eq', 'workspace_id', 'workspace-1'],
    ['eq', 'id', 'customer-1'],
    ['is', 'account_user_id', null]
  ]);
});
