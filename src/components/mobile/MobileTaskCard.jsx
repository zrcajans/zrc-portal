import React, { useEffect, useRef, useState } from 'react';

export default function MobileTaskCard({
  task,
  normalizeColumnTitleForDisplay,
  renderProfileAvatar,
  createAvatarFromName,
  getMobileTaskCardAssignees,
  moveMobileTaskToActiveColumn,
  allBoardColumns,
  setMobileActiveColumnId
}) {
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
  const columnDropdownRef = useRef(null);

  useEffect(() => {
    if (!isColumnMenuOpen) return undefined;

    const closeOnOutsideTap = (event) => {
      if (!columnDropdownRef.current) return;

      if (!columnDropdownRef.current.contains(event.target)) {
        setIsColumnMenuOpen(false);
      }
    };

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setIsColumnMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', closeOnOutsideTap);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideTap);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isColumnMenuOpen]);

  const normalizeTitle =
    typeof normalizeColumnTitleForDisplay === 'function'
      ? normalizeColumnTitleForDisplay
      : (value) => value || '';

  const columnTitle = task.columnTitle || task.status || '';
  const currentColumnId = String(task.columnId || '').trim();
  const taskTitle = task.title || 'Adsız görev';
  const assignees =
    typeof getMobileTaskCardAssignees === 'function'
      ? getMobileTaskCardAssignees(task)
      : [];

  const columnOptions = (Array.isArray(allBoardColumns) ? allBoardColumns : [])
    .filter((column) => column && column.id)
    .filter((column) => String(column.id || '').trim() !== currentColumnId);

  const handleMoveToColumn = async (event, targetColumn) => {
    event.stopPropagation();

    if (!targetColumn?.id) return;

    if (typeof moveMobileTaskToActiveColumn === 'function') {
      await moveMobileTaskToActiveColumn(task, targetColumn.id);
    }

    if (typeof setMobileActiveColumnId === 'function') {
      setMobileActiveColumnId(targetColumn.id);
    }

    setIsColumnMenuOpen(false);
  };

  return (
    <div className="zrc-mobile-task-card">
      <div className="zrc-mobile-task-card-top">
        <div className="zrc-mobile-task-status">
          <span style={{ backgroundColor: task.columnColor || '#ff5b1f' }} />
          <small>{columnTitle || 'Görev'}</small>
        </div>
      </div>

      <h3>{taskTitle}</h3>

      {task.description && (
        <p>{task.description}</p>
      )}

      <div className="zrc-mobile-task-date-row">
        {(task.startDate || task.start_date) && (
          <span>Başlangıç: {task.startDate || task.start_date}</span>
        )}
        <span>Bitiş: {task.dueDate || task.due_date || task.endDate || task.end_date || 'Tarih yok'}</span>
      </div>

      {assignees.length > 0 && (
        <div className="zrc-mobile-task-assignees" aria-label="Görevli kişiler">
          {assignees.slice(0, 4).map((person) => (
            <div
              key={person.id || person.email || person.name}
              className="zrc-mobile-task-assignee-avatar"
              title={person.name}
            >
              {renderProfileAvatar(person.avatar, createAvatarFromName(person.name))}
            </div>
          ))}

          {assignees.length > 4 && (
            <div className="zrc-mobile-task-assignee-avatar zrc-mobile-task-assignee-more">
              +{assignees.length - 4}
            </div>
          )}
        </div>
      )}

      {columnOptions.length > 0 && (
        <div
          ref={columnDropdownRef}
          className={`zrc-mobile-task-action-row zrc-mobile-task-column-dropdown ${isColumnMenuOpen ? 'is-open' : ''}`}
        >
          <button
            type="button"
            className="zrc-mobile-task-move-btn"
            onClick={(event) => {
              event.stopPropagation();
              setIsColumnMenuOpen((prev) => !prev);
            }}
          >
            <span>Taşı</span>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d={isColumnMenuOpen ? 'M6 14l6-6 6 6' : 'M6 10l6 6 6-6'}
                stroke="currentColor"
                strokeWidth="3.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {isColumnMenuOpen && (
            <div className="zrc-mobile-task-column-menu" onClick={(event) => event.stopPropagation()}>
              <div className="zrc-mobile-task-column-menu-head">
                <small>Kolona aktar</small>
                <button
                  type="button"
                  className="zrc-mobile-task-column-menu-close"
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsColumnMenuOpen(false);
                  }}
                  aria-label="Kapat"
                >
                  ×
                </button>
              </div>

              <div className="zrc-mobile-task-column-menu-list">
                {columnOptions.map((column) => {
                  const title = normalizeTitle(column.title || 'Kolon');
                  const taskCount = Array.isArray(column.tasks) ? column.tasks.length : 0;

                  return (
                    <button
                      key={column.id}
                      type="button"
                      className="zrc-mobile-task-column-menu-item"
                      onClick={(event) => handleMoveToColumn(event, column)}
                    >
                      <span>
                        <i style={{ backgroundColor: column.color || '#94a3b8' }} />
                        {title}
                      </span>
                      <em>{taskCount}</em>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
