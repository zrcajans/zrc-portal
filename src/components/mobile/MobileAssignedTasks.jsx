import React from 'react';
import { formatZrcDateTime } from '../../utils/dateDisplayHelpers';

const getTaskDeadlineLabel = (task = {}) => {
  const value = task.homeDate || task.calendarEndDate || task.calendarStartDate || task.dueDate || task.due_date || task.endDate || task.end_date;
  return formatZrcDateTime(value, { fallback: 'Bitiş tarihi yok' });
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
        <div>
          <small>ANA SAYFA</small>
          <h2 id="zrc-mobile-assigned-tasks-title">Size Atanan Görevler</h2>
        </div>
        <b aria-label={`${safeTasks.length} görev`}>{safeTasks.length}</b>
      </div>

      {safeTasks.length > 0 ? (
        <div className="zrc-mobile-assigned-tasks-list">
          {safeTasks.map((task) => {
            const isOverdue = isOverdueTask(task);
            const statusColor = isOverdue ? '#ef4444' : task.columnColor || '#f6b15f';
            const projectName = String(task.projectName || 'Proje').trim();
            const statusName = String(task.columnTitle || task.status || 'Görev').trim();

            return (
              <button
                key={`mobile-assigned-${task.projectName || ''}-${task.id || task.supabaseId || task.title}`}
                type="button"
                className="zrc-mobile-assigned-task-item"
                onClick={() => onOpenTask?.(task)}
              >
                <span className="zrc-mobile-assigned-task-status" style={{ backgroundColor: statusColor }} aria-hidden="true" />
                <span className="zrc-mobile-assigned-task-main">
                  <strong>{task.title || 'Adsız görev'}</strong>
                  <span>{projectName} · {statusName || 'Görev'}</span>
                </span>
                <span className={`zrc-mobile-assigned-task-date ${isOverdue ? 'is-overdue' : ''}`}>
                  {getTaskDeadlineLabel(task)}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="zrc-mobile-assigned-empty">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m7.75 12.2 2.65 2.65 5.85-6.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.7" />
          </svg>
          <strong>Şu an size atanmış açık görev yok.</strong>
          <span>Yeni görev atandığında burada görünecek.</span>
        </div>
      )}
    </section>
  );
}
