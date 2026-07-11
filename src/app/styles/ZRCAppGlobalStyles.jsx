export function ZRCAppGlobalStyles() {
  return <style>
      {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght=400;500;600;700;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #f5f6f8; overflow: hidden; }
        .apple-dock-effect { transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.25s, color 0.25s, box-shadow 0.3s, border-color 0.25s ease; }
        .hover-grow:hover { transform: scale(1.12); }
        .apple-dock-btn:hover:not(.active-menu-btn) { background-color: transparent !important; color: #ffffff !important; }
        .active-menu-btn:hover { background-color: #ffffff !important; color: #ff3600 !important; }
        .mac-genie-panel { transform-origin: 0% 30%; transition: transform 0.35s cubic-bezier(0.25, 0.8, 0.15, 1), opacity 0.3s; }
        .genie-collapsed { transform: perspective(1000px) scaleX(0) scaleY(0.01) skewY(8deg); opacity: 0; visibility: hidden; }
        .genie-expanded { transform: perspective(1000px) scaleX(1) scaleY(1) skewY(0deg); opacity: 1; visibility: visible; }
        @keyframes overlayFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes overlayFadeOut { from { opacity: 1; } to { opacity: 0; } }
        .animate-overlay-in { animation: overlayFadeIn 0.2s ease-out forwards; }
        .animate-overlay-out { animation: overlayFadeOut 0.2s ease-in forwards; }
        @keyframes modalScaleIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes modalScaleOut { from { opacity: 1; transform: scale(1) translateY(0); } to { opacity: 0; transform: scale(0.95) translateY(10px); } }
        .animate-modal { animation: modalScaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-modal-out { animation: modalScaleOut 0.2s ease-in forwards; }
        @keyframes premiumFade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: premiumFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes zrcNotePop { from { opacity: 0; transform: translateY(-10px) scale(0.96) rotate(-1.5deg); } to { opacity: 1; transform: translateY(0) scale(1) rotate(-1deg); } }
        @keyframes zrcSoftFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
        .zrc-home-card { transition: transform 0.22s ease, box-shadow 0.22s ease; }
        .zrc-home-card:hover { transform: translateY(-2px); box-shadow: 0 16px 38px rgba(30,43,70,0.085); }
        .zrc-note-composer-float { animation: zrcNotePop 0.24s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .zrc-note-mini-float { animation: zrcSoftFloat 2.8s ease-in-out infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.12); border-radius: 4px; }
        .task-menu-item { display: flex; align-items: center; padding: 10px 14px; cursor: pointer; transition: background-color 0.15s ease; color: #3f3f46; font-size: 13px; font-weight: 500; gap: 10px; width: 100%; user-select: none; }
        .task-menu-item:hover { background-color: #f4f4f5; }
        .task-menu-item svg { color: #71717a; flex-shrink: 0; }
        .task-menu-item.danger { color: #dc2626; border-top: 1px solid #f3f4f6; }
        .task-menu-item.danger:hover { background-color: #fef2f2; }
        .task-menu-item.danger svg { color: #dc2626; }
        .rte-btn { padding: 4px 8px; border-radius: 4px; color: #4b5563; font-weight: bold; font-size: 11.5px; transition: background-color 0.15s; cursor: pointer; }
        .rte-btn:hover { background-color: #e5e7eb; }
        [contenteditable=true]:empty:before { content: attr(placeholder); color: #9ca3af; pointer-events: none; display: block; }
        .zrc-calendar-task-line { overflow: visible !important; }
        .zrc-calendar-task-line[data-zrc-line-start="true"]::before,
        .zrc-calendar-task-line[data-zrc-line-end="true"]::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 5px;
          height: 5px;
          border-radius: 9999px;
          background: var(--zrc-calendar-line-end-color);
          filter: brightness(0.68);
          transform: translateY(-50%);
          pointer-events: none;
        }
        .zrc-calendar-task-line[data-zrc-line-start="true"]::before { left: -2px; }
        .zrc-calendar-task-line[data-zrc-line-end="true"]::after { right: -2px; }
        .zrc-calendar-task-line:not([data-zrc-fixed-tooltip="true"])::after {
          content: attr(data-zrc-calendar-tooltip);
          position: absolute;
          left: 0;
          top: calc(100% + 6px);
          z-index: 80;
          width: max-content;
          max-width: 240px;
          padding: 5px 8px;
          border: 1px solid rgba(148, 163, 184, 0.25);
          border-radius: 5px;
          background: rgba(30, 41, 59, 0.78);
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.13);
          color: rgba(255, 255, 255, 0.9);
          font-size: 10px;
          font-weight: 600;
          line-height: 1.25;
          white-space: normal;
          overflow-wrap: anywhere;
          pointer-events: none;
          opacity: 0;
          transform: translateY(-2px);
          transition: opacity 140ms ease, transform 140ms ease;
        }
        .zrc-calendar-task-line:not([data-zrc-fixed-tooltip="true"]):hover::after,
        .zrc-calendar-task-line:not([data-zrc-fixed-tooltip="true"]):focus-visible::after { opacity: 1; transform: translateY(0); }
      `}
    </style>;
}
