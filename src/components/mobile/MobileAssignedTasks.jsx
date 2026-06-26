import React from 'react';
import { formatZrcDateTime } from '../../utils/dateDisplayHelpers';

const getTaskDeadlineLabel = (task = {}) => {
  const value = task.homeDate || task.calendarEndDate || task.calendarStartDate || task.dueDate || task.due_date || task.endDate || task.end_date;
  return formatZrcDateTime(value, { fallback: '-' });
};

const isOverdueTask = (task = {}) => {
  const value = task.homeDate || task.calendarEndDate || task.calendarStartDate || task.dueDate || task.due_date || task.endDate || task.end_date;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  return date < todayStart;
};

export default function MobileAssignedTasks({ tasks = [], onOpenTask }) {
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  return (
    <section className="zrc-mobile-assigned-tasks" aria-labelledby="zrc-mobile-assigned-tasks-title">
      <div className="zrc-mobile-assigned-tasks-head">
        <h2 id="zrc-mobile-assigned-tasks-title">Size Atanan Görevler</h2>
        <b aria-label={`${safeTasks.length} görev`}>{safeTasks.length}</b>
      </div>

      <div className="zrc-mobile-assigned-card">
        <div className="zrc-mobile-assigned-table-head" aria-hidden="true">
          <span />
          <span>
            Durum / Ad
            <i>◆</i>
          </span>
          <span>
            Bitiş
            <i>◆</i>
          </span>
        </div>

        {safeTasks.length > 0 ? (
          <div className="zrc-mobile-assigned-tasks-list">
            {safeTasks.map((task, index) => {
              const isOverdue = isOverdueTask(task);
              const statusColor = isOverdue ? '#ef4444' : task.columnColor || '#f6b15f';
              const deadlineLabel = getTaskDeadlineLabel(task);

              return (
                <button
                  key={`mobile-assigned-${task.projectName || ''}-${task.id || task.supabaseId || task.title}`}
                  type="button"
                  className="zrc-mobile-assigned-task-row"
                  onClick={() => onOpenTask?.(task)}
                >
                  <span className="zrc-mobile-assigned-task-order">{index + 1}.</span>
                  <span className="zrc-mobile-assigned-task-title">
                    <span className="zrc-mobile-assigned-task-status" style={{ backgroundColor: statusColor }} aria-hidden="true" />
                    <strong>{task.title || 'Adsız görev'}</strong>
                  </span>
                  <span className={`zrc-mobile-assigned-task-date ${isOverdue ? 'is-overdue' : ''}`} title={deadlineLabel}>
                    {deadlineLabel}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="zrc-mobile-assigned-empty">Gösterilecek görev yok</div>
        )}
      </div>
    </section>
  );
}
