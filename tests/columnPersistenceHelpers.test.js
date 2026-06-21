import assert from 'node:assert/strict';
import test from 'node:test';
import { getColumnPersistencePosition } from '../src/app/utils/columnPersistenceHelpers.js';

const columns = [
  { id: 'first', title: 'İlk' },
  { id: 'second', title: 'İkinci' }
];

test('existing columns retain their current database position', () => {
  assert.equal(getColumnPersistencePosition(columns, { id: 'second', title: 'Değişti' }), 1);
});

test('new columns append instead of being persisted at position zero', () => {
  assert.equal(getColumnPersistencePosition(columns, { id: 'new', title: 'Yeni' }), 2);
});

test('an explicit insertion position is bounded by the board size', () => {
  assert.equal(getColumnPersistencePosition(columns, { id: 'new', title: 'Yeni', position: 1 }), 1);
  assert.equal(getColumnPersistencePosition(columns, { id: 'new', title: 'Yeni', position: 99 }), 2);
});
