import { formatCalendarDate, formatCalendarWeekday, formatDateForTaskModal, getQuickNoteDetail, getQuickNoteTitle } from '../../utils/dashboardHelpers';
import ZRCAppShellAutoUiBlock03 from '../blocks/ZRCAppShellAutoUiBlock03';
import ZRCAppShellAutoUiBlock06 from '../blocks/ZRCAppShellAutoUiBlock06';
import ZRCAppShellCalendarViewAyBlock2 from '../blocks/ZRCAppShellCalendarViewAyBlock2';
import ZRCAppShellCalendarViewGunBlock from '../blocks/ZRCAppShellCalendarViewGunBlock';
import ZRCAppShellCalendarViewHaftaBlock2 from '../blocks/ZRCAppShellCalendarViewHaftaBlock2';

export default function ZRCAppHomeDashboardSection({
  Ay,
  Cmt,
  Cum,
  Enter,
  Hafta,
  Paz,
  Per,
  Pzt,
  Sal,
  absolute,
  all,
  allday,
  auto,
  b,
  b8bfca,
  bg,
  black,
  bold,
  border,
  c4cbd5,
  cal,
  calendar,
  calendarDisplayOptions,
  calendarFocusedDate,
  calendarGridDays,
  calendarHeaderTitle,
  calendarMonthDate,
  calendarView,
  calendarWeekDays,
  center,
  changeCalendarView,
  createQuickNoteFromHome,
  current,
  cursor,
  custom,
  d,
  data,
  day,
  deleteQuickNoteFromHome,
  e4e9f1,
  eceff4,
  edf0f4,
  editingQuickNoteId,
  end,
  event,
  f8fbff,
  fafcff,
  fbfbfb_16px,
  fbfbfb_8px,
  fbfcfe,
  fff_0,
  fff_8px,
  fill,
  flex,
  font,
  formatMenuCalendarTaskTime,
  formatMenuCalendarWeekHeader,
  full,
  gap,
  getMenuCalendarAllDayTasks,
  getMenuCalendarTasksForDay,
  getMenuCalendarTasksForHour,
  getPremiumCalendarDotStyle,
  getPremiumCalendarLineStyle,
  getPremiumCalendarTaskStyle,
  getPremiumCalendarTaskTooltip,
  goToNextCalendarPeriod,
  goToPreviousCalendarPeriod,
  gradient,
  grid,
  h,
  head,
  hidden,
  home,
  homeAssignedTasks,
  isCalendarDisplayMenuOpen,
  isQuickNoteComposerOpen,
  isQuickNoteSearchOpen,
  isSameCalendarDay,
  items,
  justify,
  l,
  left,
  linear,
  max,
  menuCalendarHours,
  menuCalendarListGroups,
  menuEvent,
  min,
  month,
  mr,
  mt,
  onChange,
  onClick,
  onKeyDown,
  onMouseUp,
  onPointerUp,
  onSubmit,
  openHomeCalendarQuickTaskForDate,
  openHomeTaskDetail,
  openMenuCalendarTask,
  openQuickNoteComposerForEdit,
  overflow,
  pendingDeleteQuickNoteId,
  pointer,
  prev,
  pt,
  px,
  py,
  quickNoteDraft,
  quickNoteSearch,
  quickNoteTitleDraft,
  quickNotes,
  relative,
  repeat,
  repeating,
  resetQuickNoteComposer,
  right,
  rounded,
  scrollbar,
  semibold,
  setActiveContentMenu,
  setActiveMenu,
  setActiveTab,
  setCalendarDisplayOptions,
  setIsCalendarDisplayMenuOpen,
  setIsQuickNoteComposerOpen,
  setIsQuickNoteSearchOpen,
  setPendingDeleteQuickNoteId,
  setQuickNoteDraft,
  setQuickNoteSearch,
  setQuickNoteTitleDraft,
  shadow,
  shrink,
  space,
  start,
  stroke,
  strokeLinecap,
  strokeLinejoin,
  strokeWidth,
  tabIndex,
  text,
  todayStart,
  top,
  transition,
  truncate,
  viewBox,
  w,
  week,
  white,
  zrc,
}) {
  return (
          <div className="w-full h-full overflow-y-auto custom-scrollbar bg-[#f3f4f6] animate-fade-in">
            <div className="min-h-full pl-4 pr-[76px] pt-4 pb-8">
              <div className="max-w-[1560px] mx-auto grid grid-cols-[minmax(430px,0.96fr)_minmax(520px,0.78fr)] items-start gap-6">
                <div className="min-w-0">
                  <section className="mb-8">
                    <div className="h-7 mb-2 flex items-center gap-2">
                      <h2 className="text-[13px] font-bold text-[#293241] tracking-[-0.01em]">Görevlerim</h2>
                      <span className="h-[18px] min-w-[27px] px-2 rounded-full bg-[#f28b57] text-white text-[9px] font-black flex items-center justify-center leading-none">
                        {homeAssignedTasks.length}
                      </span>
                    </div>

                    <div className="zrc-home-card bg-white rounded-[13px] shadow-[0_12px_32px_rgba(30,43,70,0.06)] overflow-hidden">
                      <div className="h-[46px] px-5 border-b border-[#eef1f5] bg-[#ffffff] grid grid-cols-[36px_minmax(0,1fr)_142px] items-center">
                        <div className="text-[10.5px] font-black text-[#9aa4b2]"> </div>
                        <div className="text-[13px] font-bold text-[#8c96a6] flex items-center gap-1.5">
                          Durum / Ad
                          <span className="text-[9px] text-[#a9b2bf] leading-none">◆</span>
                        </div>
                        <div className="text-right text-[13px] font-bold text-[#8c96a6] flex items-center justify-end gap-1.5">
                          Bitiş
                          <span className="text-[9px] text-[#a9b2bf] leading-none">◆</span>
                        </div>
                      </div>

                      <div>
                        {homeAssignedTasks.length > 0 ? (
                          homeAssignedTasks.slice(0, 3).map((task, index) => (
                            <button
                              key={`home-assigned-photoshop-${task.projectName}-${task.id}`}
                              type="button"
                              onClick={() => openHomeTaskDetail(task)}
                              className="w-full h-[40px] px-5 grid grid-cols-[36px_minmax(0,1fr)_142px] items-center border-b border-[#eef1f5] hover:bg-[#fafbfc] transition-all text-left"
                            >
                              <div className="text-[12px] font-semibold text-[#8b94a3]">{index + 1}.</div>
                              <div className="min-w-0 flex items-center gap-2.5">
                                <span
                                  className="w-[10px] h-[10px] rounded-full shrink-0"
                                  style={{ backgroundColor: task.homeDate && task.homeDate < todayStart ? '#ef4444' : task.columnColor || '#f6b15f' }}
                                />
                                <span className="min-w-0 text-[13px] font-semibold text-[#3d4552] truncate tracking-[-0.01em]">
                                  {task.title}
                                </span>
                              </div>

                              <div className="text-right text-[12.5px] font-semibold text-[#444b57] truncate">
                                {task.homeDate
                                  ? `${new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long' }).format(task.homeDate)}, ${new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit' }).format(task.homeDate)}`
                                  : '-'}
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="h-[120px] flex items-center justify-center text-[12px] font-semibold text-[#98a1b2]">
                            Gösterilecek görev yok
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveContentMenu('Projeler');
                          setActiveMenu('Projeler');
                          setActiveTab('Görevler');
                        }}
                        className="h-[38px] w-full bg-[#fbfcfd] text-[12px] font-semibold text-[#a1aab8] hover:text-[#2f66cf] hover:bg-[#f8fafc] transition-all flex items-center justify-center gap-1.5"
                      >
                        <span className="text-[10px] leading-none">⌄</span>
                        Daha Fazla Göster
                      </button>
                    </div>
                  </section>

                  <section>
                    <div className="h-7 mb-2 flex items-center justify-between">
                      <h2 className="text-[13px] font-bold text-[#293241] tracking-[-0.01em]">Yapışkan Notlar</h2>

                      <div className="flex items-center gap-1.5 text-[#b7bfcc]">
                        <button
                          type="button"
                          onClick={() => setIsQuickNoteSearchOpen((prev) => !prev)}
                          className={`w-7 h-7 rounded-[7px] transition-all flex items-center justify-center ${
                            isQuickNoteSearchOpen ? 'bg-white text-[#55ace8] shadow-sm' : 'hover:bg-white hover:text-[#55ace8]'
                          }`}
                          title="Notlarda ara"
                        >
                          <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M10.8 18.2a7.4 7.4 0 1 1 0-14.8 7.4 7.4 0 0 1 0 14.8Z" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (!isQuickNoteComposerOpen) {
                              resetQuickNoteComposer();
                            }
                            setIsQuickNoteComposerOpen((prev) => !prev);
                          }}
                          className={`w-7 h-7 rounded-[7px] transition-all flex items-center justify-center ${
                            isQuickNoteComposerOpen ? 'bg-[#55ace8] text-white shadow-sm' : 'hover:bg-white hover:text-[#55ace8]'
                          }`}
                          title="Yeni hızlı not"
                        >
                          <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="zrc-home-card relative bg-white rounded-[13px] shadow-[0_12px_32px_rgba(30,43,70,0.06)] overflow-visible">
                      {(isQuickNoteSearchOpen || isQuickNoteComposerOpen) && (
                        <div className={`${isQuickNoteSearchOpen ? 'px-4 pt-4 space-y-3' : 'h-0'} relative z-[640]`}>
                          {isQuickNoteSearchOpen && (
                            <div className="h-[38px] rounded-[12px] bg-[#f7f9fc] border border-[#e7ebf1] px-3 flex items-center gap-2">
                              <svg className="w-[15px] h-[15px] text-[#9aa4b2] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M10.8 18.2a7.4 7.4 0 1 1 0-14.8 7.4 7.4 0 0 1 0 14.8Z" />
                              </svg>
                              <input
                                value={quickNoteSearch}
                                onChange={(event) => setQuickNoteSearch(event.target.value)}
                                placeholder="Notlarda hızlı ara..."
                                className="min-w-0 flex-1 h-full bg-transparent text-[12px] font-semibold text-[#3d4552] placeholder:text-[#b6beca] outline-none"
                              />
                              {quickNoteSearch.trim() && (
                                <button
                                  type="button"
                                  onClick={() => setQuickNoteSearch('')}
                                  className="w-6 h-6 rounded-full text-[#a9b2bf] hover:bg-white hover:text-[#ef4444] transition-all flex items-center justify-center"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          )}

                          <ZRCAppShellAutoUiBlock03
        createQuickNoteFromHome={typeof createQuickNoteFromHome !== 'undefined' ? createQuickNoteFromHome : undefined}
        d={typeof d !== 'undefined' ? d : undefined}
        editingQuickNoteId={typeof editingQuickNoteId !== 'undefined' ? editingQuickNoteId : undefined}
        event={typeof event !== 'undefined' ? event : undefined}
        fill={typeof fill !== 'undefined' ? fill : undefined}
        isQuickNoteComposerOpen={typeof isQuickNoteComposerOpen !== 'undefined' ? isQuickNoteComposerOpen : undefined}
        onChange={typeof onChange !== 'undefined' ? onChange : undefined}
        onClick={typeof onClick !== 'undefined' ? onClick : undefined}
        onKeyDown={typeof onKeyDown !== 'undefined' ? onKeyDown : undefined}
        onSubmit={typeof onSubmit !== 'undefined' ? onSubmit : undefined}
        quickNoteDraft={typeof quickNoteDraft !== 'undefined' ? quickNoteDraft : undefined}
        quickNoteTitleDraft={typeof quickNoteTitleDraft !== 'undefined' ? quickNoteTitleDraft : undefined}
        resetQuickNoteComposer={typeof resetQuickNoteComposer !== 'undefined' ? resetQuickNoteComposer : undefined}
        setIsQuickNoteComposerOpen={typeof setIsQuickNoteComposerOpen !== 'undefined' ? setIsQuickNoteComposerOpen : undefined}
        setQuickNoteDraft={typeof setQuickNoteDraft !== 'undefined' ? setQuickNoteDraft : undefined}
        setQuickNoteTitleDraft={typeof setQuickNoteTitleDraft !== 'undefined' ? setQuickNoteTitleDraft : undefined}
        stroke={typeof stroke !== 'undefined' ? stroke : undefined}
        strokeLinecap={typeof strokeLinecap !== 'undefined' ? strokeLinecap : undefined}
        strokeLinejoin={typeof strokeLinejoin !== 'undefined' ? strokeLinejoin : undefined}
        strokeWidth={typeof strokeWidth !== 'undefined' ? strokeWidth : undefined}
        viewBox={typeof viewBox !== 'undefined' ? viewBox : undefined}
      />
                        </div>
                      )}

                      <div className={`${
                        quickNotes.filter((note) =>
                          !quickNoteSearch.trim() ||
                          `${getQuickNoteTitle(note)} ${getQuickNoteDetail(note)}`.toLocaleLowerCase('tr-TR').includes(quickNoteSearch.trim().toLocaleLowerCase('tr-TR'))
                        ).length > 0 ? 'max-h-[330px] overflow-y-auto custom-scrollbar p-4' : 'p-4'
                      }`}>
                        {quickNotes.filter((note) =>
                          !quickNoteSearch.trim() ||
                          `${getQuickNoteTitle(note)} ${getQuickNoteDetail(note)}`.toLocaleLowerCase('tr-TR').includes(quickNoteSearch.trim().toLocaleLowerCase('tr-TR'))
                        ).length > 0 ? (
                          <div className="grid grid-cols-1 gap-2.5">
                            {quickNotes
                              .filter((note) =>
                                !quickNoteSearch.trim() ||
                                `${getQuickNoteTitle(note)} ${getQuickNoteDetail(note)}`.toLocaleLowerCase('tr-TR').includes(quickNoteSearch.trim().toLocaleLowerCase('tr-TR'))
                              )
                              .map((note) => (
                                <div
                                  key={note.id}
                                  role="button"
                                  tabIndex={0}
                                  onClick={() => openQuickNoteComposerForEdit(note)}
                                  onKeyDown={(event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                      event.preventDefault();
                                      openQuickNoteComposerForEdit(note);
                                    }
                                  }}
                                  className="min-h-[46px] rounded-[11px] bg-[#fcfdff] px-3 py-2 transition-all hover:-translate-y-[1px] hover:shadow-[0_10px_22px_rgba(30,43,70,0.06)] cursor-pointer"
                                >
                                  <div className="flex items-start gap-2">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#40aee8] shrink-0" />
                                    <div className="min-w-0 flex-1">
                                      <div className="text-[11.5px] font-black leading-5 text-[#354052] truncate">
                                        {getQuickNoteTitle(note)}
                                      </div>
                                      {getQuickNoteDetail(note) && (
                                        <div className="text-[10.5px] font-semibold leading-4 text-[#7b8799] line-clamp-2 whitespace-pre-wrap">
                                          {getQuickNoteDetail(note)}
                                        </div>
                                      )}
                                    </div>
                                    <button
                                      type="button"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        setPendingDeleteQuickNoteId(note.id);
                                      }}
                                      className="w-5 h-5 rounded-[5px] text-[#c2c8d2] hover:bg-red-50 hover:text-red-500 transition-all shrink-0"
                                    >
                                      ×
                                    </button>
                                  </div>

                                  {pendingDeleteQuickNoteId === note.id && (
                                    <div
                                      onClick={(event) => event.stopPropagation()}
                                      className="mt-2 ml-3 rounded-[10px] bg-[#fff5f5] px-2.5 py-2 flex items-center justify-between gap-2"
                                    >
                                      <span className="text-[10px] font-bold text-[#b42318]">Bu not silinsin mi?</span>
                                      <div className="flex items-center gap-1.5">
                                        <button
                                          type="button"
                                          onClick={() => setPendingDeleteQuickNoteId(null)}
                                          className="h-[24px] px-2.5 rounded-full bg-white text-[#7b8799] text-[9px] font-black hover:bg-[#f8fafc] transition-all"
                                        >
                                          Vazgeç
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => deleteQuickNoteFromHome(note.id)}
                                          className="h-[24px] px-2.5 rounded-full bg-[#ef4444] text-white text-[9px] font-black hover:bg-[#dc2626] transition-all"
                                        >
                                          Sil
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        ) : (
                          <div className="h-[296px] flex flex-col items-center justify-center text-center">
                            <div className="relative w-[244px] h-[130px] mb-5">
                              <div className="absolute left-[38px] top-[14px] w-[74px] h-[76px] bg-[#eef1f5] rounded-[2px]" />
                              <div className="absolute left-[82px] top-[0px] w-[78px] h-[62px] bg-[#f2f4f7] rounded-[2px]" />
                              <div className="absolute left-[92px] top-[52px] w-[104px] h-[70px] bg-[#fbfcfd] rounded-[2px] border border-[#eceff4]" />
                              <div className="absolute left-[112px] top-[68px] w-[58px] h-[3px] rounded bg-[#d9dee7]" />
                              <div className="absolute left-[112px] top-[86px] w-[86px] h-[3px] rounded bg-[#d9dee7]" />
                              <div className="absolute left-[112px] top-[104px] w-[58px] h-[3px] rounded bg-[#d9dee7]" />
                              <div className="absolute left-[16px] top-[42px] space-y-4">
                                <span className="block w-[4px] h-[4px] rounded-full bg-[#40aee8]" />
                                <span className="block w-[4px] h-[4px] rounded-full bg-[#40aee8]" />
                                <span className="block w-[4px] h-[4px] rounded-full bg-[#40aee8]" />
                              </div>
                              <div className="absolute right-[36px] top-[28px] w-[26px] h-[26px] rounded-full bg-[#2f3a45]" />
                              <div className="absolute right-[20px] top-[26px] w-[24px] h-[30px] rounded-full bg-[#2f3a45]" />
                              <div className="absolute right-[42px] top-[52px] w-[32px] h-[46px] bg-[#27aee9] rounded-t-[18px]" />
                              <div className="absolute right-[64px] top-[76px] w-[34px] h-[6px] bg-[#27aee9] rounded-full -rotate-[13deg]" />
                              <div className="absolute right-[42px] top-[96px] w-[8px] h-[40px] bg-[#bdc3cc] rotate-[4deg] origin-top" />
                              <div className="absolute right-[62px] top-[96px] w-[8px] h-[40px] bg-[#bdc3cc] -rotate-[14deg] origin-top" />
                              <div className="absolute right-[70px] top-[130px] w-[22px] h-[4px] bg-[#2f3a45] rounded-full" />
                              <div className="absolute right-[32px] top-[130px] w-[20px] h-[4px] bg-[#2f3a45] rounded-full" />
                            </div>
                            <div className="text-[13px] font-semibold text-[#2f3744]">
                              {quickNoteSearch.trim() ? 'Aramanızla eşleşen not yok.' : 'Görüntülenecek hiçbir notunuz yok!'}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </div>

                <section className="min-w-0">
                  <div className="h-7 mb-2 flex items-center justify-between">
                    <h2 className="text-[13px] font-bold text-[#293241] tracking-[-0.01em]">Takvimim</h2>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setIsCalendarDisplayMenuOpen((prev) => !prev);
                        }}
                        className="h-[27px] px-3 rounded-[6px] bg-[#2f66cf] text-white text-[11px] font-bold hover:bg-[#285cc0] transition-all flex items-center gap-2.5 shadow-[0_8px_18px_rgba(47,102,207,0.18)]"
                      >
                        Gösterim Şekli
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h18M6 12h12M10 19h4" />
                        </svg>
                      </button>

                      <ZRCAppShellAutoUiBlock06
        calendarDisplayOptions={typeof calendarDisplayOptions !== 'undefined' ? calendarDisplayOptions : undefined}
        d={typeof d !== 'undefined' ? d : undefined}
        fill={typeof fill !== 'undefined' ? fill : undefined}
        isCalendarDisplayMenuOpen={typeof isCalendarDisplayMenuOpen !== 'undefined' ? isCalendarDisplayMenuOpen : undefined}
        menuEvent={typeof menuEvent !== 'undefined' ? menuEvent : undefined}
        onClick={typeof onClick !== 'undefined' ? onClick : undefined}
        prev={typeof prev !== 'undefined' ? prev : undefined}
        setCalendarDisplayOptions={typeof setCalendarDisplayOptions !== 'undefined' ? setCalendarDisplayOptions : undefined}
        stroke={typeof stroke !== 'undefined' ? stroke : undefined}
        strokeLinecap={typeof strokeLinecap !== 'undefined' ? strokeLinecap : undefined}
        strokeLinejoin={typeof strokeLinejoin !== 'undefined' ? strokeLinejoin : undefined}
        strokeWidth={typeof strokeWidth !== 'undefined' ? strokeWidth : undefined}
        viewBox={typeof viewBox !== 'undefined' ? viewBox : undefined}
      />
                    </div>
                  </div>

                  <div className="zrc-home-card min-h-[660px] bg-white rounded-[13px] shadow-[0_12px_32px_rgba(30,43,70,0.06)] overflow-hidden">
                    <div className="h-[64px] px-6 border-b border-[#eceff4] flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={goToPreviousCalendarPeriod}
                          className="w-8 h-8 rounded-[6px] text-[#293241] hover:bg-[#f4f6f8] transition-all flex items-center justify-center text-[28px] leading-none"
                        >
                          ‹
                        </button>

                        <div className="min-w-[168px] text-center text-[20px] font-bold text-[#293241] capitalize tracking-[-0.02em]">
                          {calendarHeaderTitle}
                        </div>

                        <button
                          type="button"
                          onClick={goToNextCalendarPeriod}
                          className="w-8 h-8 rounded-[6px] text-[#293241] hover:bg-[#f4f6f8] transition-all flex items-center justify-center text-[28px] leading-none"
                        >
                          ›
                        </button>
                      </div>

                      <div className="h-[26px] rounded-full flex items-center gap-2">
                        {['Ay', 'Hafta', 'Gün', 'Liste'].map((viewName) => (
                          <button
                            key={`home-calendar-view-${viewName}`}
                            type="button"
                            onClick={() => changeCalendarView(viewName)}
                            className={`h-[24px] px-4 rounded-full text-[11px] font-bold transition-all ${
                              calendarView === viewName
                                ? 'bg-[#56a8e8] text-white shadow-sm'
                                : 'bg-[#f0f1f3] text-[#8f98a6] hover:bg-[#e8eaee]'
                            }`}
                          >
                            {viewName}
                          </button>
                        ))}
                      </div>
                    </div>

                                        {/* zrc-v523-block-calendarview-ay */}
                    <ZRCAppShellCalendarViewAyBlock2
                      calendarView={typeof calendarView !== 'undefined' ? calendarView : undefined}
                      Ay={typeof Ay !== 'undefined' ? Ay : undefined}
                      grid={typeof grid !== 'undefined' ? grid : undefined}
                      h={typeof h !== 'undefined' ? h : undefined}
                      bg={typeof bg !== 'undefined' ? bg : undefined}
                      white={typeof white !== 'undefined' ? white : undefined}
                      border={typeof border !== 'undefined' ? border : undefined}
                      b={typeof b !== 'undefined' ? b : undefined}
                      eceff4={typeof eceff4 !== 'undefined' ? eceff4 : undefined}
                      Pzt={typeof Pzt !== 'undefined' ? Pzt : undefined}
                      Sal={typeof Sal !== 'undefined' ? Sal : undefined}
                      Per={typeof Per !== 'undefined' ? Per : undefined}
                      Cum={typeof Cum !== 'undefined' ? Cum : undefined}
                      Cmt={typeof Cmt !== 'undefined' ? Cmt : undefined}
                      Paz={typeof Paz !== 'undefined' ? Paz : undefined}
                      home={typeof home !== 'undefined' ? home : undefined}
                      calendar={typeof calendar !== 'undefined' ? calendar : undefined}
                      head={typeof head !== 'undefined' ? head : undefined}
                      flex={typeof flex !== 'undefined' ? flex : undefined}
                      items={typeof items !== 'undefined' ? items : undefined}
                      center={typeof center !== 'undefined' ? center : undefined}
                      justify={typeof justify !== 'undefined' ? justify : undefined}
                      text={typeof text !== 'undefined' ? text : undefined}
                      font={typeof font !== 'undefined' ? font : undefined}
                      semibold={typeof semibold !== 'undefined' ? semibold : undefined}
                      repeat={typeof repeat !== 'undefined' ? repeat : undefined}
                      calendarGridDays={typeof calendarGridDays !== 'undefined' ? calendarGridDays : undefined}
                      getMenuCalendarTasksForDay={typeof getMenuCalendarTasksForDay !== 'undefined' ? getMenuCalendarTasksForDay : undefined}
                      calendarMonthDate={typeof calendarMonthDate !== 'undefined' ? calendarMonthDate : undefined}
                      isSameCalendarDay={typeof isSameCalendarDay !== 'undefined' ? isSameCalendarDay : undefined}
                      todayStart={typeof todayStart !== 'undefined' ? todayStart : undefined}
                      month={typeof month !== 'undefined' ? month : undefined}
                      tabIndex={typeof tabIndex !== 'undefined' ? tabIndex : undefined}
                      data={typeof data !== 'undefined' ? data : undefined}
                      zrc={typeof zrc !== 'undefined' ? zrc : undefined}
                      formatDateForTaskModal={typeof formatDateForTaskModal !== 'undefined' ? formatDateForTaskModal : undefined}
                      openHomeCalendarQuickTaskForDate={typeof openHomeCalendarQuickTaskForDate !== 'undefined' ? openHomeCalendarQuickTaskForDate : undefined}
                      onMouseUp={typeof onMouseUp !== 'undefined' ? onMouseUp : undefined}
                      Enter={typeof Enter !== 'undefined' ? Enter : undefined}
                      min={typeof min !== 'undefined' ? min : undefined}
                      px={typeof px !== 'undefined' ? px : undefined}
                      py={typeof py !== 'undefined' ? py : undefined}
                      left={typeof left !== 'undefined' ? left : undefined}
                      transition={typeof transition !== 'undefined' ? transition : undefined}
                      all={typeof all !== 'undefined' ? all : undefined}
                      fafcff={typeof fafcff !== 'undefined' ? fafcff : undefined}
                      overflow={typeof overflow !== 'undefined' ? overflow : undefined}
                      hidden={typeof hidden !== 'undefined' ? hidden : undefined}
                      cursor={typeof cursor !== 'undefined' ? cursor : undefined}
                      pointer={typeof pointer !== 'undefined' ? pointer : undefined}
                      fbfcfe={typeof fbfcfe !== 'undefined' ? fbfcfe : undefined}
                      start={typeof start !== 'undefined' ? start : undefined}
                      end={typeof end !== 'undefined' ? end : undefined}
                      w={typeof w !== 'undefined' ? w : undefined}
                      rounded={typeof rounded !== 'undefined' ? rounded : undefined}
                      full={typeof full !== 'undefined' ? full : undefined}
                      c4cbd5={typeof c4cbd5 !== 'undefined' ? c4cbd5 : undefined}
                      mt={typeof mt !== 'undefined' ? mt : undefined}
                      space={typeof space !== 'undefined' ? space : undefined}
                      cal={typeof cal !== 'undefined' ? cal : undefined}
                      openMenuCalendarTask={typeof openMenuCalendarTask !== 'undefined' ? openMenuCalendarTask : undefined}
                      gap={typeof gap !== 'undefined' ? gap : undefined}
                      e4e9f1={typeof e4e9f1 !== 'undefined' ? e4e9f1 : undefined}
                      l={typeof l !== 'undefined' ? l : undefined}
                      shadow={typeof shadow !== 'undefined' ? shadow : undefined}
                      getPremiumCalendarLineStyle={getPremiumCalendarLineStyle}
                      getPremiumCalendarTaskStyle={typeof getPremiumCalendarTaskStyle !== 'undefined' ? getPremiumCalendarTaskStyle : undefined}
                      getPremiumCalendarTaskTooltip={getPremiumCalendarTaskTooltip}
                      shrink={typeof shrink !== 'undefined' ? shrink : undefined}
                      getPremiumCalendarDotStyle={typeof getPremiumCalendarDotStyle !== 'undefined' ? getPremiumCalendarDotStyle : undefined}
                      black={typeof black !== 'undefined' ? black : undefined}
                      current={typeof current !== 'undefined' ? current : undefined}
                      truncate={typeof truncate !== 'undefined' ? truncate : undefined}
                      formatMenuCalendarTaskTime={typeof formatMenuCalendarTaskTime !== 'undefined' ? formatMenuCalendarTaskTime : undefined}
                      bold={typeof bold !== 'undefined' ? bold : undefined}
                      b8bfca={typeof b8bfca !== 'undefined' ? b8bfca : undefined}
                    />

                                        {/* zrc-v523-block-calendarview-hafta */}
                    <ZRCAppShellCalendarViewHaftaBlock2
                      calendarView={typeof calendarView !== 'undefined' ? calendarView : undefined}
                      Hafta={typeof Hafta !== 'undefined' ? Hafta : undefined}
                      bg={typeof bg !== 'undefined' ? bg : undefined}
                      white={typeof white !== 'undefined' ? white : undefined}
                      grid={typeof grid !== 'undefined' ? grid : undefined}
                      h={typeof h !== 'undefined' ? h : undefined}
                      border={typeof border !== 'undefined' ? border : undefined}
                      b={typeof b !== 'undefined' ? b : undefined}
                      edf0f4={typeof edf0f4 !== 'undefined' ? edf0f4 : undefined}
                      calendarWeekDays={typeof calendarWeekDays !== 'undefined' ? calendarWeekDays : undefined}
                      isSameCalendarDay={typeof isSameCalendarDay !== 'undefined' ? isSameCalendarDay : undefined}
                      todayStart={typeof todayStart !== 'undefined' ? todayStart : undefined}
                      home={typeof home !== 'undefined' ? home : undefined}
                      week={typeof week !== 'undefined' ? week : undefined}
                      head={typeof head !== 'undefined' ? head : undefined}
                      data={typeof data !== 'undefined' ? data : undefined}
                      zrc={typeof zrc !== 'undefined' ? zrc : undefined}
                      calendar={typeof calendar !== 'undefined' ? calendar : undefined}
                      formatDateForTaskModal={typeof formatDateForTaskModal !== 'undefined' ? formatDateForTaskModal : undefined}
                      openHomeCalendarQuickTaskForDate={typeof openHomeCalendarQuickTaskForDate !== 'undefined' ? openHomeCalendarQuickTaskForDate : undefined}
                      text={typeof text !== 'undefined' ? text : undefined}
                      center={typeof center !== 'undefined' ? center : undefined}
                      font={typeof font !== 'undefined' ? font : undefined}
                      bold={typeof bold !== 'undefined' ? bold : undefined}
                      transition={typeof transition !== 'undefined' ? transition : undefined}
                      all={typeof all !== 'undefined' ? all : undefined}
                      f8fbff={typeof f8fbff !== 'undefined' ? f8fbff : undefined}
                      fafcff={typeof fafcff !== 'undefined' ? fafcff : undefined}
                      formatCalendarDate={typeof formatCalendarDate !== 'undefined' ? formatCalendarDate : undefined}
                      formatCalendarWeekday={typeof formatCalendarWeekday !== 'undefined' ? formatCalendarWeekday : undefined}
                      px={typeof px !== 'undefined' ? px : undefined}
                      flex={typeof flex !== 'undefined' ? flex : undefined}
                      items={typeof items !== 'undefined' ? items : undefined}
                      getMenuCalendarAllDayTasks={typeof getMenuCalendarAllDayTasks !== 'undefined' ? getMenuCalendarAllDayTasks : undefined}
                      allday={typeof allday !== 'undefined' ? allday : undefined}
                      gap={typeof gap !== 'undefined' ? gap : undefined}
                      overflow={typeof overflow !== 'undefined' ? overflow : undefined}
                      hidden={typeof hidden !== 'undefined' ? hidden : undefined}
                      cursor={typeof cursor !== 'undefined' ? cursor : undefined}
                      pointer={typeof pointer !== 'undefined' ? pointer : undefined}
                      onPointerUp={typeof onPointerUp !== 'undefined' ? onPointerUp : undefined}
                      openMenuCalendarTask={typeof openMenuCalendarTask !== 'undefined' ? openMenuCalendarTask : undefined}
                      w={typeof w !== 'undefined' ? w : undefined}
                      full={typeof full !== 'undefined' ? full : undefined}
                      rounded={typeof rounded !== 'undefined' ? rounded : undefined}
                      left={typeof left !== 'undefined' ? left : undefined}
                      black={typeof black !== 'undefined' ? black : undefined}
                      current={typeof current !== 'undefined' ? current : undefined}
                      truncate={typeof truncate !== 'undefined' ? truncate : undefined}
                      max={typeof max !== 'undefined' ? max : undefined}
                      auto={typeof auto !== 'undefined' ? auto : undefined}
                      custom={typeof custom !== 'undefined' ? custom : undefined}
                      scrollbar={typeof scrollbar !== 'undefined' ? scrollbar : undefined}
                      menuCalendarHours={typeof menuCalendarHours !== 'undefined' ? menuCalendarHours : undefined}
                      pt={typeof pt !== 'undefined' ? pt : undefined}
                      semibold={typeof semibold !== 'undefined' ? semibold : undefined}
                      getMenuCalendarTasksForHour={typeof getMenuCalendarTasksForHour !== 'undefined' ? getMenuCalendarTasksForHour : undefined}
                      relative={typeof relative !== 'undefined' ? relative : undefined}
                      repeating={typeof repeating !== 'undefined' ? repeating : undefined}
                      linear={typeof linear !== 'undefined' ? linear : undefined}
                      gradient={typeof gradient !== 'undefined' ? gradient : undefined}
                      fff_0={typeof fff_0 !== 'undefined' ? fff_0 : undefined}
                      fff_8px={typeof fff_8px !== 'undefined' ? fff_8px : undefined}
                      fbfbfb_8px={typeof fbfbfb_8px !== 'undefined' ? fbfbfb_8px : undefined}
                      fbfbfb_16px={typeof fbfbfb_16px !== 'undefined' ? fbfbfb_16px : undefined}
                      absolute={typeof absolute !== 'undefined' ? absolute : undefined}
                      right={typeof right !== 'undefined' ? right : undefined}
                      top={typeof top !== 'undefined' ? top : undefined}
                      min={typeof min !== 'undefined' ? min : undefined}
                      e4e9f1={typeof e4e9f1 !== 'undefined' ? e4e9f1 : undefined}
                      l={typeof l !== 'undefined' ? l : undefined}
                      py={typeof py !== 'undefined' ? py : undefined}
                      shadow={typeof shadow !== 'undefined' ? shadow : undefined}
                      getPremiumCalendarLineStyle={getPremiumCalendarLineStyle}
                      getPremiumCalendarTaskStyle={typeof getPremiumCalendarTaskStyle !== 'undefined' ? getPremiumCalendarTaskStyle : undefined}
                      getPremiumCalendarTaskTooltip={getPremiumCalendarTaskTooltip}
                      formatMenuCalendarTaskTime={typeof formatMenuCalendarTaskTime !== 'undefined' ? formatMenuCalendarTaskTime : undefined}
                    />

                                        {/* zrc-v523-block-calendarview-gun */}
                    <ZRCAppShellCalendarViewGunBlock
                      calendarView={typeof calendarView !== 'undefined' ? calendarView : undefined}
                      bg={typeof bg !== 'undefined' ? bg : undefined}
                      white={typeof white !== 'undefined' ? white : undefined}
                      data={typeof data !== 'undefined' ? data : undefined}
                      zrc={typeof zrc !== 'undefined' ? zrc : undefined}
                      calendar={typeof calendar !== 'undefined' ? calendar : undefined}
                      day={typeof day !== 'undefined' ? day : undefined}
                      formatDateForTaskModal={typeof formatDateForTaskModal !== 'undefined' ? formatDateForTaskModal : undefined}
                      calendarFocusedDate={typeof calendarFocusedDate !== 'undefined' ? calendarFocusedDate : undefined}
                      openHomeCalendarQuickTaskForDate={typeof openHomeCalendarQuickTaskForDate !== 'undefined' ? openHomeCalendarQuickTaskForDate : undefined}
                      w={typeof w !== 'undefined' ? w : undefined}
                      full={typeof full !== 'undefined' ? full : undefined}
                      h={typeof h !== 'undefined' ? h : undefined}
                      grid={typeof grid !== 'undefined' ? grid : undefined}
                      border={typeof border !== 'undefined' ? border : undefined}
                      b={typeof b !== 'undefined' ? b : undefined}
                      edf0f4={typeof edf0f4 !== 'undefined' ? edf0f4 : undefined}
                      fafcff={typeof fafcff !== 'undefined' ? fafcff : undefined}
                      transition={typeof transition !== 'undefined' ? transition : undefined}
                      all={typeof all !== 'undefined' ? all : undefined}
                      flex={typeof flex !== 'undefined' ? flex : undefined}
                      items={typeof items !== 'undefined' ? items : undefined}
                      center={typeof center !== 'undefined' ? center : undefined}
                      justify={typeof justify !== 'undefined' ? justify : undefined}
                      text={typeof text !== 'undefined' ? text : undefined}
                      font={typeof font !== 'undefined' ? font : undefined}
                      bold={typeof bold !== 'undefined' ? bold : undefined}
                      formatCalendarWeekday={typeof formatCalendarWeekday !== 'undefined' ? formatCalendarWeekday : undefined}
                      px={typeof px !== 'undefined' ? px : undefined}
                      cursor={typeof cursor !== 'undefined' ? cursor : undefined}
                      pointer={typeof pointer !== 'undefined' ? pointer : undefined}
                      getMenuCalendarAllDayTasks={typeof getMenuCalendarAllDayTasks !== 'undefined' ? getMenuCalendarAllDayTasks : undefined}
                      home={typeof home !== 'undefined' ? home : undefined}
                      allday={typeof allday !== 'undefined' ? allday : undefined}
                      openMenuCalendarTask={typeof openMenuCalendarTask !== 'undefined' ? openMenuCalendarTask : undefined}
                      mr={typeof mr !== 'undefined' ? mr : undefined}
                      rounded={typeof rounded !== 'undefined' ? rounded : undefined}
                      e4e9f1={typeof e4e9f1 !== 'undefined' ? e4e9f1 : undefined}
                      l={typeof l !== 'undefined' ? l : undefined}
                      left={typeof left !== 'undefined' ? left : undefined}
                      black={typeof black !== 'undefined' ? black : undefined}
                      current={typeof current !== 'undefined' ? current : undefined}
                      truncate={typeof truncate !== 'undefined' ? truncate : undefined}
                      shadow={typeof shadow !== 'undefined' ? shadow : undefined}
                      getPremiumCalendarLineStyle={getPremiumCalendarLineStyle}
                      getPremiumCalendarTaskStyle={typeof getPremiumCalendarTaskStyle !== 'undefined' ? getPremiumCalendarTaskStyle : undefined}
                      getPremiumCalendarTaskTooltip={getPremiumCalendarTaskTooltip}
                      max={typeof max !== 'undefined' ? max : undefined}
                      overflow={typeof overflow !== 'undefined' ? overflow : undefined}
                      auto={typeof auto !== 'undefined' ? auto : undefined}
                      custom={typeof custom !== 'undefined' ? custom : undefined}
                      scrollbar={typeof scrollbar !== 'undefined' ? scrollbar : undefined}
                      menuCalendarHours={typeof menuCalendarHours !== 'undefined' ? menuCalendarHours : undefined}
                      getMenuCalendarTasksForHour={typeof getMenuCalendarTasksForHour !== 'undefined' ? getMenuCalendarTasksForHour : undefined}
                      pt={typeof pt !== 'undefined' ? pt : undefined}
                      semibold={typeof semibold !== 'undefined' ? semibold : undefined}
                      relative={typeof relative !== 'undefined' ? relative : undefined}
                      repeating={typeof repeating !== 'undefined' ? repeating : undefined}
                      linear={typeof linear !== 'undefined' ? linear : undefined}
                      gradient={typeof gradient !== 'undefined' ? gradient : undefined}
                      fff_0={typeof fff_0 !== 'undefined' ? fff_0 : undefined}
                      fff_8px={typeof fff_8px !== 'undefined' ? fff_8px : undefined}
                      fbfbfb_8px={typeof fbfbfb_8px !== 'undefined' ? fbfbfb_8px : undefined}
                      fbfbfb_16px={typeof fbfbfb_16px !== 'undefined' ? fbfbfb_16px : undefined}
                      absolute={typeof absolute !== 'undefined' ? absolute : undefined}
                      right={typeof right !== 'undefined' ? right : undefined}
                      top={typeof top !== 'undefined' ? top : undefined}
                      min={typeof min !== 'undefined' ? min : undefined}
                      py={typeof py !== 'undefined' ? py : undefined}
                      hidden={typeof hidden !== 'undefined' ? hidden : undefined}
                      formatMenuCalendarTaskTime={typeof formatMenuCalendarTaskTime !== 'undefined' ? formatMenuCalendarTaskTime : undefined}
                    />

                    {calendarView === 'Liste' && (
                      <div className="bg-white min-h-[590px]">
                        {menuCalendarListGroups.length > 0 ? (
                          menuCalendarListGroups.map((group) => (
                            <div key={`home-list-group-${group.day.toISOString()}`}>
                              <button
                                type="button"
                                data-zrc-calendar-day={formatDateForTaskModal(group.day)}
                                onClick={(event) => openHomeCalendarQuickTaskForDate(group.day, event)}
                                className="w-full h-[30px] px-3.5 bg-[#f1f3f6] border-b border-[#d6dce5] hover:bg-[#e9edf3] transition-all flex items-center justify-between"
                              >
                                <div className="text-[10.5px] font-bold text-[#374151] capitalize">
                                  {new Intl.DateTimeFormat('tr-TR', { weekday: 'long' }).format(group.day)}
                                </div>
                                <div className="text-[10px] font-bold text-[#374151]">
                                  {formatMenuCalendarWeekHeader(group.day)}
                                </div>
                              </button>

                              {group.tasks.map((task) => (
                                  <button
                                    key={`home-list-task-${group.day.toISOString()}-${task.projectName}-${task.id}`}
                                    type="button"
                                    onClick={() => openMenuCalendarTask(task)}
                                    data-zrc-calendar-tooltip={getPremiumCalendarTaskTooltip(task)}
                                    aria-label={getPremiumCalendarTaskTooltip(task)}
                                    className="zrc-calendar-task-line w-full h-[4px] border-b border-[#edf0f4] border-l-[3px] text-left transition-all hover:brightness-95"
                                    style={getPremiumCalendarLineStyle(task)}
                                  >
                                  <span className="sr-only">{getPremiumCalendarTaskTooltip(task)}</span>
                                </button>
                              ))}
                            </div>
                          ))
                        ) : (
                          <div className="h-[240px] flex items-center justify-center text-[11px] font-semibold text-[#9aa3b1]">
                            Bu aralıkta planlı görev yok.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
  );
}
