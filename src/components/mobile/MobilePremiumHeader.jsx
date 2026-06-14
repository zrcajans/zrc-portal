import React from 'react';

export default function MobilePremiumHeader({
  unreadNotificationCount = 0,
  onToggleNotifications
}) {
  return (
    <div className="zrc-mobile-premium-head">
      <div className="zrc-mobile-brand-wrap">
        <img className="zrc-mobile-brand-logo" src="/zrc-logo.png" alt="ZRC" />
      </div>

      <div>
        <div className="zrc-mobile-premium-kicker">ZRC Mobil</div>
        <h1>Projeler</h1>
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
