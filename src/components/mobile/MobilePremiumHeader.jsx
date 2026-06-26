import React from 'react';

const navItems = [
  {
    id: 'assigned',
    label: 'Atananlar',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M9.2 12.45 11.2 14.45 15.7 9.9" stroke="currentColor" strokeWidth="2.05" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20.25 12c0 4.56-3.69 8.25-8.25 8.25S3.75 16.56 3.75 12 7.44 3.75 12 3.75c1.47 0 2.85.39 4.04 1.06" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'projects',
    label: 'Projeler',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3.75 6.75A2.25 2.25 0 0 1 6 4.5h4.05l1.5 1.8H18a2.25 2.25 0 0 1 2.25 2.25v8.7A2.25 2.25 0 0 1 18 19.5H6a2.25 2.25 0 0 1-2.25-2.25v-10.5Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
        <path d="M3.75 9.15h16.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      </svg>
    )
  }
];

export default function MobilePremiumHeader({
  activePage = 'projects',
  assignedTaskCount = 0,
  unreadNotificationCount = 0,
  onChangePage,
  onToggleNotifications
}) {
  return (
    <header className="zrc-mobile-premium-head">
      <nav className="zrc-mobile-top-page-nav" aria-label="Mobil sayfalar">
        {navItems.map((item) => {
          const isActive = item.id === activePage;
          const count = item.id === 'assigned' ? Number(assignedTaskCount || 0) : 0;

          return (
            <button
              key={item.id}
              type="button"
              className={`zrc-mobile-top-page-nav-button ${isActive ? 'is-active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => onChangePage?.(item.id)}
            >
              <span className="zrc-mobile-top-page-nav-icon">{item.icon}</span>
              <span className="zrc-mobile-top-page-nav-label">{item.label}</span>
              {item.id === 'assigned' && count > 0 && (
                <b className="zrc-mobile-top-page-nav-count">{count > 99 ? '99+' : count}</b>
              )}
            </button>
          );
        })}

        <button
          type="button"
          className="zrc-mobile-top-page-nav-button zrc-mobile-top-page-nav-notification"
          aria-label="Bildirimler"
          onClick={onToggleNotifications}
        >
          <span className="zrc-mobile-top-page-nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 7-3 9h18c0-2-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 21h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <span className="zrc-mobile-top-page-nav-label">Bildirim</span>
          {unreadNotificationCount > 0 && (
            <b className="zrc-mobile-top-page-nav-count">{unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}</b>
          )}
        </button>
      </nav>
    </header>
  );
}
