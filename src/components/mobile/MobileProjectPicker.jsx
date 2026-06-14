import React from 'react';

const HIDDEN_DEFAULT_PROJECTS = ['Çalışma', 'Calisma', 'E-Ticaret Arayüz Tasarımı'];

const getVisibleMobileProjects = ({ visibleProjectNames = [], projects = [] }) =>
  Array.from(
    new Set([
      ...(Array.isArray(visibleProjectNames) ? visibleProjectNames : []),
      ...(Array.isArray(projects) ? projects : [])
    ])
  ).filter((project) => project && !HIDDEN_DEFAULT_PROJECTS.includes(String(project).trim()));

const getMobileProjectLabel = (selectedProject = '') =>
  HIDDEN_DEFAULT_PROJECTS.includes(String(selectedProject || '').trim())
    ? 'Proje seç'
    : selectedProject || 'Proje seç';

export default function MobileProjectPicker({
  selectedProject,
  visibleProjectNames,
  projects,
  isOpen,
  setIsOpen,
  onSelectProject
}) {
  const projectLabel = getMobileProjectLabel(selectedProject);
  const mobileProjects = getVisibleMobileProjects({ visibleProjectNames, projects });

  return (
    <div className="zrc-mobile-project-picker">
      <button
        type="button"
        className="zrc-mobile-project-picker-btn"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div>
          <small>Proje seçimi</small>
          <strong>{projectLabel}</strong>
        </div>
        <span>{isOpen ? '⌃' : '⌄'}</span>
      </button>

      {isOpen && (
        <div className="zrc-mobile-project-picker-panel">
          {mobileProjects.map((project) => {
            const isActiveProject = project === selectedProject;

            return (
              <button
                key={project}
                type="button"
                className={`zrc-mobile-project-option ${isActiveProject ? 'is-active' : ''}`}
                onClick={() => onSelectProject(project)}
              >
                <strong>{project}</strong>
                <small>{isActiveProject ? 'Açık proje' : 'Projeyi aç'}</small>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
