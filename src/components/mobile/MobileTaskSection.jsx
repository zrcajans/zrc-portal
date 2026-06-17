import React from 'react';
import MobileTaskList from './MobileTaskList';
import { getMobileProjectLabel, getSafeMobileProjectName } from '../../utils/mobileProjectHelpers';

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
  const safeProjectName = getSafeMobileProjectName(selectedProject);

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
