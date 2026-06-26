import React from 'react';

const pageItems = [
  {
    id: 'projects',
    label: 'Projeler',
    description: 'Projeler ve görev panosu',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3.75 6.75A2.25 2.25 0 0 1 6 4.5h4.05l1.5 1.8H18a2.25 2.25 0 0 1 2.25 2.25v8.7A2.25 2.25 0 0 1 18 19.5H6a2.25 2.25 0 0 1-2.25-2.25v-10.5Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
        <path d="M3.75 9.15h16.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'assigned',
    label: 'Atananlar',
    description: 'Size atanan görevler',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M9.2 12.45 11.2 14.45 15.7 9.9" stroke="currentColor" strokeWidth="2.05" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75c1.47 0 2.85.39 4.04 1.06" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" />
      </svg>
    )
  }
];

export default function MobilePageRail({ activePage = 'projects', assignedTaskCount = 0, onChange }) {
  return (
    <nav className="zrc-mobile-page-rail" aria-label="Mobil sayfalar">
      {pageItems.map((item) => {
        const isActive = item.id === activePage;
        const count = item.id === 'assigned' ? Number(assignedTaskCount || 0) : null;

        return (
          <button
            key={item.id}
            type="button"
            className={`zrc-mobile-page-rail-button ${isActive ? 'is-active' : ''}`}
            aria-label={item.description}
            aria-current={isActive ? 'page' : undefined}
            title={item.description}
            onClick={() => onChange?.(item.id)}
          >
            <span className="zrc-mobile-page-rail-icon">{item.icon}</span>
            <span className="zrc-mobile-page-rail-label">{item.label}</span>
            {count !== null && count > 0 && (
              <b className="zrc-mobile-page-rail-count">{count > 99 ? '99+' : count}</b>
            )}
          </button>
        );
      })}
    </nav>
  );
}
