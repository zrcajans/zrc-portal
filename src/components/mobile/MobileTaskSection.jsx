import React from 'react';
import MobileTaskList from './MobileTaskList';

const HIDDEN_DEFAULT_PROJECTS = ['Çalışma', 'Calisma', 'E-Ticaret Arayüz Tasarımı'];

const getMobileProjectLabel = (selectedProject = '') =>
  HIDDEN_DEFAULT_PROJECTS.includes(String(selectedProject || '').trim())
    ? 'Proje seç'
    : selectedProject || 'Proje seç';

export default function MobileTaskSection({
  selectedProject,
  boardColumns,
  normalizeColumnTitleForDisplay,
  renderProfileAvatar,
  createAvatarFromName,
  getMobileTaskCardAssignees,
  moveMobileTaskToActiveColumn,
  setMobileTaskWizardData,
  setMobileTaskWizardStep,
  setIsMobileTaskWizardOpen
}) {
  const projectLabel = getMobileProjectLabel(selectedProject);
  const safeProjectName = HIDDEN_DEFAULT_PROJECTS.includes(String(selectedProject || '').trim())
    ? ''
    : selectedProject || '';

  const openTaskWizard = () => {
    setMobileTaskWizardData((prev) => ({
      ...prev,
      projectName: safeProjectName,
      taskTitle: '',
      startDate: '',
      endDate: '',
      assigneeIds: [],
      assignees: []
    }));

    setMobileTaskWizardStep(1);
    setIsMobileTaskWizardOpen(true);
  };

  return (
    <div className="zrc-mobile-task-section">
      <div className="zrc-mobile-task-section-head">
        <div>
          <small>Seçili proje</small>
          <h2>{projectLabel}</h2>
        </div>

        <button
          type="button"
          className="zrc-mobile-create-task-btn"
          onClick={openTaskWizard}
        >
          Görev Oluştur
        </button>
      </div>

      <MobileTaskList
        boardColumns={boardColumns}
        normalizeColumnTitleForDisplay={normalizeColumnTitleForDisplay}
        renderProfileAvatar={renderProfileAvatar}
        createAvatarFromName={createAvatarFromName}
        getMobileTaskCardAssignees={getMobileTaskCardAssignees}
        moveMobileTaskToActiveColumn={moveMobileTaskToActiveColumn}
      />
    </div>
  );
}
