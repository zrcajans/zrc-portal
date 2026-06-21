import assert from 'node:assert/strict';
import test from 'node:test';
import { createZRCProjectSettingsActions } from '../src/app/actions/zrcProjectSettingsActions.js';
import { releaseActionLock, tryAcquireActionLock } from '../src/app/utils/asyncActionLock.js';

const createDeps = (overrides = {}) => ({
  requirePermission: () => true,
  selectedProject: 'Eski Proje',
  projectSettingsDraft: {
    title: 'Yeni Proje',
    description: 'Açıklama',
    customer: '',
    customerId: '',
    teamMemberIds: ['member-2'],
    status: 'Aktif',
    color: '#ff3600'
  },
  getCustomerByName: () => null,
  createDefaultProjectSettings: (title) => ({ title, teamMemberIds: ['member-1'], teamHistory: [] }),
  projectSettings: { 'Eski Proje': { teamMemberIds: ['member-1'], teamHistory: [] } },
  projectTeamAssignableMembers: [{ id: 'member-1' }, { id: 'member-2' }],
  getTeamMemberNameById: (id) => id,
  createProjectTeamHistoryEntry: (type) => ({ type }),
  projects: ['Eski Proje'],
  setProjectSettings: () => {},
  syncProjectTasksWithTeam: () => {},
  createActivityNotification: () => {},
  isCurrentSupabaseUserId: () => false,
  setProjects: () => {},
  setProjectBoards: () => {},
  setSelectedProject: () => {},
  saveProjectSettingsToSupabase: async () => false,
  loadWorkspaceStructureFromSupabase: async () => {},
  updateProjectStatusInSupabase: async () => false,
  setProjectSettingsDraft: () => {},
  deleteProjectFromSupabase: async () => false,
  setActivityNotifications: () => {},
  setActiveTab: () => {},
  projectMutationLockRef: { current: new Set() },
  tryAcquireActionLock,
  releaseActionLock,
  ...overrides
});

test('failed project settings persistence blocks all local mutations and activity', async () => {
  let localMutationCount = 0;
  let activityCount = 0;
  let taskSyncCount = 0;
  const trackMutation = () => { localMutationCount += 1; };
  const previousWindow = globalThis.window;
  globalThis.window = { zrcAlert: async () => {} };

  try {
    const deps = createDeps({
      setProjectSettings: trackMutation,
      setProjects: trackMutation,
      setProjectBoards: trackMutation,
      setSelectedProject: trackMutation,
      createActivityNotification: () => { activityCount += 1; },
      syncProjectTasksWithTeam: () => { taskSyncCount += 1; }
    });

    const result = await createZRCProjectSettingsActions(deps).handleSaveProjectSettings();

    assert.equal(result, false);
    assert.equal(localMutationCount, 0);
    assert.equal(activityCount, 0);
    assert.equal(taskSyncCount, 0);
  } finally {
    globalThis.window = previousWindow;
  }
});

test('duplicate project saves share one in-flight persistence request', async () => {
  let resolveSave;
  let saveCallCount = 0;
  const saveResult = new Promise((resolve) => { resolveSave = resolve; });
  const previousWindow = globalThis.window;
  globalThis.window = { zrcAlert: async () => {} };

  try {
    const deps = createDeps({
      projectSettingsDraft: {
        title: 'Eski Proje',
        description: '',
        customer: '',
        customerId: '',
        teamMemberIds: ['member-1'],
        status: 'Aktif',
        color: '#ff3600'
      },
      saveProjectSettingsToSupabase: async () => {
        saveCallCount += 1;
        return saveResult;
      }
    });
    const actions = createZRCProjectSettingsActions(deps);

    const firstSave = actions.handleSaveProjectSettings();
    const duplicateSave = await actions.handleSaveProjectSettings();

    assert.equal(duplicateSave, false);
    assert.equal(saveCallCount, 1);

    resolveSave(true);
    assert.equal(await firstSave, true);
    assert.equal(deps.projectMutationLockRef.current.size, 0);
  } finally {
    globalThis.window = previousWindow;
  }
});
