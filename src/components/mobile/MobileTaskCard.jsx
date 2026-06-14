import React from 'react';

export default function MobileTaskCard({
  task,
  normalizeColumnTitleForDisplay,
  renderProfileAvatar,
  createAvatarFromName,
  getMobileTaskCardAssignees,
  moveMobileTaskToActiveColumn
}) {
  const columnTitle = task.columnTitle || task.status || '';
  const taskTitle = task.title || 'Adsız görev';
  const assignees =
    typeof getMobileTaskCardAssignees === 'function'
      ? getMobileTaskCardAssignees(task)
      : [];

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

      {normalizeColumnTitleForDisplay(columnTitle) !== 'Aktif' && (
        <div className="zrc-mobile-task-action-row">
          <button
            type="button"
            className="zrc-mobile-task-active-btn"
            onClick={(event) => {
              event.stopPropagation();

              if (typeof moveMobileTaskToActiveColumn === 'function') {
                moveMobileTaskToActiveColumn(task);
              }
            }}
          >
            Aktife Al
          </button>
        </div>
      )}
    </div>
  );
}
