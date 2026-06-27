import React, { useEffect, useMemo, useRef, useState } from 'react';
import MobileTaskList from './MobileTaskList';
import { getSafeMobileProjectName } from '../../utils/mobileProjectHelpers';
import { getReadableColumnColor, getReadableColumnMutedColor } from '../../utils/colorHelpers';



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
  setIsMobileTaskWizardOpen,
  onOpenTaskDetail,
  onUpdateTaskDescription
}) {
  const safeProjectName = getSafeMobileProjectName(selectedProject);
  const [selectedMobileColumnId, setSelectedMobileColumnId] = useState('');
  const [mobileTaskMoveToast, setMobileTaskMoveToast] = useState('');
  const mobileTaskMoveToastTimerRef = useRef(null);

  const mobileColumns = useMemo(
    () => (Array.isArray(boardColumns) ? boardColumns : []).filter((column) => column && column.id),
    [boardColumns]
  );

  useEffect(() => {
    if (mobileColumns.length === 0) {
      if (selectedMobileColumnId) setSelectedMobileColumnId('');
      return;
    }

    const hasSelectedColumn = mobileColumns.some((column) => column.id === selectedMobileColumnId);

    if (!selectedMobileColumnId || !hasSelectedColumn) {
      setSelectedMobileColumnId(mobileColumns[0].id);
    }
  }, [mobileColumns, selectedMobileColumnId]);

  useEffect(() => () => {
    if (mobileTaskMoveToastTimerRef.current) {
      window.clearTimeout(mobileTaskMoveToastTimerRef.current);
    }
  }, []);

  const activeMobileColumn = mobileColumns.find((column) => column.id === selectedMobileColumnId) || mobileColumns[0] || null;
  const visibleMobileColumns = activeMobileColumn ? [activeMobileColumn] : [];

  const showMobileTaskMoveToast = (message = 'Görev başka kolona aktarıldı.') => {
    setMobileTaskMoveToast(message);

    if (mobileTaskMoveToastTimerRef.current) {
      window.clearTimeout(mobileTaskMoveToastTimerRef.current);
    }

    mobileTaskMoveToastTimerRef.current = window.setTimeout(() => {
      setMobileTaskMoveToast('');
    }, 2400);
  };

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
    <div className="zrc-mobile-task-section zrc-mobile-task-section-with-column-capsule">
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
        boardColumns={visibleMobileColumns}
        allBoardColumns={mobileColumns}
        normalizeColumnTitleForDisplay={normalizeColumnTitleForDisplay}
        renderProfileAvatar={renderProfileAvatar}
        createAvatarFromName={createAvatarFromName}
        getMobileTaskCardAssignees={getMobileTaskCardAssignees}
        moveMobileTaskToActiveColumn={moveMobileTaskToActiveColumn}
        setMobileActiveColumnId={setSelectedMobileColumnId}
        onMobileTaskMoveToast={showMobileTaskMoveToast}
        onOpenTaskDetail={onOpenTaskDetail}
        onUpdateTaskDescription={onUpdateTaskDescription}
      />

      {mobileTaskMoveToast && (
        <div className="zrc-mobile-task-move-toast" role="status" aria-live="polite">
          {mobileTaskMoveToast}
        </div>
      )}

      {mobileColumns.length > 0 && (
        <nav className="zrc-mobile-column-capsule" aria-label="Mobil kolon seçimi">
          {mobileColumns.map((column) => {
            const isActiveColumn = column.id === activeMobileColumn?.id;
            const columnTitle = normalizeColumnTitleForDisplay(column.title);
            const taskCount = Array.isArray(column.tasks) ? column.tasks.length : 0;
            // zrc-mobile-capsule-colors-v1: masaüstündeki kolon başlığıyla aynı renk mantığı.
            const columnColor = column.color || '#94a3b8';
            const columnTextColor = getReadableColumnColor(columnColor);
            const columnMutedColor = getReadableColumnMutedColor(columnColor);
            const mobileCapsuleTitle = String(
              column.title || column.name || column.label || column.column_name || ''
            ).trim();
            const mobileCapsuleTitleLength = mobileCapsuleTitle.length;
            const mobileCapsuleTitleSize =
              mobileCapsuleTitleLength > 22 ? '8px'
                : mobileCapsuleTitleLength > 18 ? '9px'
                  : mobileCapsuleTitleLength > 14 ? '10px'
                    : mobileCapsuleTitleLength > 11 ? '11px'
                      : '12px';

            const mobileCapsuleStyle = {
              '--zrc-mobile-column-color': columnColor,
              '--zrc-mobile-column-text-color': columnTextColor,
              '--zrc-mobile-column-muted-color': columnMutedColor,
              '--zrc-mobile-column-title-size': mobileCapsuleTitleSize
            };

            return (
              <button
                key={column.id}
                type="button"
                className={`zrc-mobile-column-capsule-item ${isActiveColumn ? 'is-active' : ''}`}
                style={mobileCapsuleStyle}
                onClick={(event) => {
                  // zrc-mobile-capsule-scroll-into-view-v1
                  const capsuleButton = event.currentTarget;
                  setSelectedMobileColumnId(column.id);

                  requestAnimationFrame(() => {
                    capsuleButton?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'nearest',
                      inline: 'center'
                    });
                  });
                }}
              >
                <span className="zrc-mobile-column-capsule-title">{columnTitle}</span>
                <span className="zrc-mobile-column-capsule-count">{taskCount}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
