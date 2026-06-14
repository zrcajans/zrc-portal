export const HIDDEN_DEFAULT_PROJECTS = ['Çalışma', 'Calisma', 'E-Ticaret Arayüz Tasarımı'];

export function getVisibleMobileProjects({ visibleProjectNames = [], projects = [] } = {}) {
  return Array.from(
    new Set([
      ...(Array.isArray(visibleProjectNames) ? visibleProjectNames : []),
      ...(Array.isArray(projects) ? projects : [])
    ])
  ).filter((project) => project && !HIDDEN_DEFAULT_PROJECTS.includes(String(project).trim()));
}

export function getMobileProjectLabel(selectedProject = '') {
  return HIDDEN_DEFAULT_PROJECTS.includes(String(selectedProject || '').trim())
    ? 'Proje seç'
    : selectedProject || 'Proje seç';
}

export function getSafeMobileProjectName(selectedProject = '') {
  return HIDDEN_DEFAULT_PROJECTS.includes(String(selectedProject || '').trim())
    ? ''
    : selectedProject || '';
}
