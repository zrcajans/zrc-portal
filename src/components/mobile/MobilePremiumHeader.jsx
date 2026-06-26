import React from 'react';

export default function MobilePremiumHeader({
  unreadNotificationCount = 0,
  onToggleNotifications,
  title = 'Projeler',
  kicker = 'ZRC Mobil'
}) {
  return (
    <div className="zrc-mobile-premium-head">
      <div className="zrc-mobile-brand-wrap">
        <img className="zrc-mobile-brand-logo" src="/zrc-logo.png" alt="ZRC" />
      </div>

      <div>
        <div className="zrc-mobile-premium-kicker">{kicker}</div>
        <h1>{title}</h1>
      </div>

      <button
        type="button"
        className="zrc-mobile-notification-btn"
        onClick={onToggleNotifications}
      >
        Bildirim
        {unreadNotificationCount > 0 && <b>{unreadNotificationCount}</b>}
      </button>
    </div>
  );
}
