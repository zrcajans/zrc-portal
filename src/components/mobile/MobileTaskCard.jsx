import { useEffect, useRef, useState } from 'react';
import { formatZrcDate } from '../../utils/dateDisplayHelpers';

export default function MobileTaskCard({
  task,
  normalizeColumnTitleForDisplay,
  renderProfileAvatar,
  createAvatarFromName,
  getMobileTaskCardAssignees,
  moveMobileTaskToActiveColumn,
  allBoardColumns,
  onMobileTaskMoveToast,
  onOpenTaskDetail
}) {
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [columnMenuPlacement, setColumnMenuPlacement] = useState('down');
  const columnDropdownRef = useRef(null);
  const moveButtonRef = useRef(null);

  const updateColumnMenuPlacement = () => {
    if (!moveButtonRef.current || typeof window === 'undefined') {
      setColumnMenuPlacement('down');
      return;
    }

    const rect = moveButtonRef.current.getBoundingClientRect();
    const bottomSafeSpace = 190;
    const neededMenuHeight = 230;
    const availableBelow = window.innerHeight - rect.bottom - bottomSafeSpace;

    setColumnMenuPlacement(availableBelow < neededMenuHeight ? 'up' : 'down');
  };

  useEffect(() => {
    if (!isColumnMenuOpen) return undefined;

    updateColumnMenuPlacement();

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

    const updateOnScrollOrResize = () => {
      updateColumnMenuPlacement();
    };

    document.addEventListener('pointerdown', closeOnOutsideTap);
    document.addEventListener('keydown', closeOnEscape);
    window.addEventListener('resize', updateOnScrollOrResize);
    window.addEventListener('scroll', updateOnScrollOrResize, true);

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideTap);
      document.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('resize', updateOnScrollOrResize);
      window.removeEventListener('scroll', updateOnScrollOrResize, true);
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

  // zrc-mobile-task-local-detail-v1
  const openTaskDetails = () => {
    setIsTaskDetailOpen(true);
  };

  const closeTaskDetails = () => {
    setIsTaskDetailOpen(false);
  };

  const handleTaskCardKeyDown = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openTaskDetails();
  };

  const handleMoveToColumn = async (event, targetColumn) => {
    event.stopPropagation();

    if (!targetColumn?.id) return;

    const targetTitle = normalizeTitle(targetColumn.title || 'Kolon');

    if (typeof moveMobileTaskToActiveColumn !== 'function') return;

    const moved = await moveMobileTaskToActiveColumn(task, targetColumn.id);
    if (!moved) return;

    setIsColumnMenuOpen(false);

    if (typeof onMobileTaskMoveToast === 'function') {
      onMobileTaskMoveToast(`Görev ${targetTitle} kolonuna aktarıldı.`);
    }
  };

  const taskDescription = String(task.description || task.detail || '').trim();
  const taskStartDate = formatZrcDate(task.startDate || task.start_date, { fallback: '' });
  const taskDueDate = formatZrcDate(
    task.dueDate || task.due_date || task.endDate || task.end_date,
    { fallback: '' }
  );
  const taskSteps = Array.isArray(task.steps)
    ? task.steps
    : (Array.isArray(task.taskSteps) ? task.taskSteps : []);

  return (
    <>
      <div
        className="zrc-mobile-task-card"
        role="button"
        tabIndex={0}
        aria-label={`${taskTitle} görev detayını aç`}
        onClick={openTaskDetails}
        onKeyDown={handleTaskCardKeyDown}
      >
      <div className="zrc-mobile-task-card-top">
        <div className="zrc-mobile-task-status">
          <span style={{ backgroundColor: task.columnColor || '#ff5b1f' }} />
          <small>{columnTitle || 'Görev'}</small>
        </div>
      </div>

      <h3>{taskTitle}</h3>

      <div className="zrc-mobile-task-date-row">
        {(task.startDate || task.start_date) && (
          <span>Başlangıç: {formatZrcDate(task.startDate || task.start_date, { fallback: 'Tarih yok' })}</span>
        )}
        <span>Bitiş: {formatZrcDate(task.dueDate || task.due_date || task.endDate || task.end_date, { fallback: 'Tarih yok' })}</span>
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
          className={`zrc-mobile-task-action-row zrc-mobile-task-column-dropdown ${isColumnMenuOpen ? 'is-open' : ''} is-${columnMenuPlacement}`}
        >
          <button
            ref={moveButtonRef}
            type="button"
            className="zrc-mobile-task-move-btn"
            onClick={(event) => {
              event.stopPropagation();

              if (!isColumnMenuOpen) {
                window.requestAnimationFrame(updateColumnMenuPlacement);
              }

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

      {isTaskDetailOpen && (
        <div
          className="zrc-mobile-task-detail-backdrop"
          role="presentation"
          onClick={closeTaskDetails}
        >
          <section
            className="zrc-mobile-task-detail-sheet"
            role="dialog"
            aria-modal="true"
            aria-label={`${taskTitle} görev detayı`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="zrc-mobile-task-detail-sheet-head">
              <div className="zrc-mobile-task-detail-sheet-status">
                <i style={{ backgroundColor: task.columnColor || '#3b82f6' }} />
                <span>{columnTitle || 'Görev detayı'}</span>
              </div>

              <button
                type="button"
                className="zrc-mobile-task-detail-sheet-close"
                aria-label="Görev detayını kapat"
                onClick={closeTaskDetails}
              >
                ×
              </button>
            </div>

            <h2>{taskTitle}</h2>

            {taskDescription ? (
              <div className="zrc-mobile-task-detail-block">
                <strong>Açıklama</strong>
                <p>{taskDescription}</p>
              </div>
            ) : (
              <div className="zrc-mobile-task-detail-block is-empty">
                <strong>Açıklama</strong>
                <p>Bu görev için açıklama eklenmemiş.</p>
              </div>
            )}

            <div className="zrc-mobile-task-detail-meta-grid">
              <div>
                <small>Başlangıç</small>
                <b>{taskStartDate || 'Belirtilmedi'}</b>
              </div>
              <div>
                <small>Bitiş</small>
                <b>{taskDueDate || 'Belirtilmedi'}</b>
              </div>
            </div>

            <div className="zrc-mobile-task-detail-block">
              <strong>Görevliler</strong>
              {assignees.length > 0 ? (
                <div className="zrc-mobile-task-detail-assignees">
                  {assignees.map((person) => (
                    <span key={person.id || person.email || person.name}>
                      {person.name || 'İsimsiz kullanıcı'}
                    </span>
                  ))}
                </div>
              ) : (
                <p>Görevli kişi yok.</p>
              )}
            </div>

            {taskSteps.length > 0 && (
              <div className="zrc-mobile-task-detail-block">
                <strong>Adımlar</strong>
                <ul className="zrc-mobile-task-detail-steps">
                  {taskSteps.map((step, index) => (
                    <li key={step.id || `${step.title || step.text || 'adim'}-${index}`}>
                      {step.title || step.text || step.name || `Adım ${index + 1}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
