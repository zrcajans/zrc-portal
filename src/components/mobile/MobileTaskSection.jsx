import React, { useEffect, useMemo, useRef, useState } from 'react';
import MobileTaskList from './MobileTaskList';
import { getSafeMobileProjectName } from '../../utils/mobileProjectHelpers';


// zrc-mobile-create-button-active-column-color-v1
const zrcNormalizeMobileColumnColor = (color = '') => {
  const cleanColor = String(color || '').trim();

  if (/^#[0-9a-f]{3}$/i.test(cleanColor)) {
    return `#${cleanColor[1]}${cleanColor[1]}${cleanColor[2]}${cleanColor[2]}${cleanColor[3]}${cleanColor[3]}`;
  }

  if (/^#[0-9a-f]{6}$/i.test(cleanColor)) return cleanColor;

  return '#ff5b1f';
};

const zrcMobileHexToRgb = (hexColor = '#ff5b1f') => {
  const normalizedColor = zrcNormalizeMobileColumnColor(hexColor).replace('#', '');

  return {
    r: parseInt(normalizedColor.slice(0, 2), 16),
    g: parseInt(normalizedColor.slice(2, 4), 16),
    b: parseInt(normalizedColor.slice(4, 6), 16)
  };
};

const zrcGetMobileCreateButtonTextColor = (hexColor = '#ff5b1f') => {
  const { r, g, b } = zrcMobileHexToRgb(hexColor);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.68 ? '#182033' : '#ffffff';
};

const zrcGetMobileCreateButtonShadow = (hexColor = '#ff5b1f') => {
  const { r, g, b } = zrcMobileHexToRgb(hexColor);

  return `0 14px 28px rgba(${r}, ${g}, ${b}, 0.26)`;
};



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

  const zrcMobileCreateTaskButtonColor = zrcNormalizeMobileColumnColor(activeMobileColumn?.color);
  const zrcMobileCreateTaskButtonTextColor = zrcGetMobileCreateButtonTextColor(zrcMobileCreateTaskButtonColor);
  const zrcMobileCreateTaskButtonShadow = zrcGetMobileCreateButtonShadow(zrcMobileCreateTaskButtonColor);

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
          style={{
            '--zrc-mobile-create-task-color': zrcMobileCreateTaskButtonColor,
            '--zrc-mobile-create-task-text': zrcMobileCreateTaskButtonTextColor,
            '--zrc-mobile-create-task-shadow': zrcMobileCreateTaskButtonShadow
          }}
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

            return (
              <button
                key={column.id}
                type="button"
                className={`zrc-mobile-column-capsule-item ${isActiveColumn ? 'is-active' : ''}`}
                onClick={() => setSelectedMobileColumnId(column.id)}
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
