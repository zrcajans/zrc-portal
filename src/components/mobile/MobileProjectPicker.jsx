import React from 'react';
import { getMobileProjectLabel, getVisibleMobileProjects } from '../../utils/mobileProjectHelpers';

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
        className="zrc-mobile-project-picker-btn zrc-mobile-project-picker-soft-v2"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div>
          <small>Proje seçimi</small>
          <strong>{projectLabel}</strong>
        </div>
        <span className="zrc-mobile-project-picker-arrow-gray-v3">{isOpen ? '⌃' : '⌄'}</span>
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
