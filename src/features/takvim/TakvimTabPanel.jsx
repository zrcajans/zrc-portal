import React from 'react';

import TakvimTabPanelCalendarViewGunBlock from './blocks/TakvimTabPanelCalendarViewGunBlock';
import TakvimTabPanelCalendarViewAyBlock from './blocks/TakvimTabPanelCalendarViewAyBlock';
export default function TakvimTabPanel(props) {
  const {
    activeTab,
    Takvim,
    w,
    full,
    flex,
    bg,
    f5f6f8,
    overflow,
    auto,
    custom,
    scrollbar,
    animate,
    fade,
    px,
    py,
    max,
    mx,
    items,
    center,
    justify,
    end,
    mb,
    relative,
    setIsCalendarDisplayMenuOpen,
    prev,
    h,
    rounded,
    text,
    white,
    font,
    black,
    hover,
    shadow,
    transition,
    all,
    gap,
    none,
    currentColor,
    round,
    M3,
    isCalendarDisplayMenuOpen,
    absolute,
    right,
    top,
    border,
    zinc,
    z,
    hideLongTasks,
    Uzun,
    Gizle,
    hideCompletedTasks,
    hideArchivedTasks,
    item,
    setCalendarDisplayOptions,
    prevOptions,
    left,
    colors,
    calendarDisplayOptions,
    transparent,
    M5,
    bold,
    hidden,
    b,
    between,
    goToPreviousCalendarPeriod,
    tracking,
    tight,
    capitalize,
    min,
    calendarHeaderTitle,
    goToNextCalendarPeriod,
    goToCurrentCalendarPeriod,
    Ay,
    Hafta,
    Liste,
    view,
    pressed,
    calendarView,
    changeCalendarView,
    blue,
    sm,
    grid,
    Pzt,
    Sal,
    Per,
    Cum,
    Cmt,
    Paz,
    dayName,
    last,
    calendarGridDays,
    day,
    getTasksForCalendarDay,
    calendarMonthDate,
    isSameCalendarDay,
    todayStart,
    data,
    calendar,
    formatDateForTaskModal,
    zrc,
    group,
    canCreateTaskFromCalendar,
    cursor,
    pointer,
    ekle,
    openTaskModalForCalendarDay,
    inset,
    events,
    leading,
    space,
    task,
    onMouseDown,
    openTaskDetail,
    truncate,
    getCalendarTaskBarStyle,
    getPremiumCalendarTaskStyle,
    calendarWeekDays,
    week,
    mt,
    uppercase,
    formatCalendarWeekday,
    handleCalendarDayClick,
    calendarFocusedDate,
    tabIndex,
    formatCalendarFullDate,
    calendarDayHelperText,
    Bu,
    Ekle,
    selectedDayCalendarTasks,
    l,
    getRoleAwareTaskMeta,
    shrink,
    Normal,
    dashed,
    yok,
    fbfcfd,
    calendarTasks,
    list,
    col,
    formatCalendarDate,
    Takvimde,
    Tarihi,
    olan,
    burada,
    listelenir
  } = props;

  return (
    activeTab === 'Takvim' && (
                  <div className="w-full flex-1 bg-[#f5f6f8] overflow-y-auto custom-scrollbar animate-fade-in">
                    <div className="px-7 py-4 max-w-[1210px] mx-auto">
                      <div className="flex items-center justify-end mb-3">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setIsCalendarDisplayMenuOpen((prev) => !prev);
                            }}
                            className="h-8 px-3.5 rounded-full bg-[#2563eb] text-white text-[10.5px] font-black hover:bg-[#1d4ed8] shadow-[0_8px_18px_rgba(37,99,235,0.18)] transition-all flex items-center gap-2"
                          >
                            <span>Gösterim Şekli</span>
                            <svg className="w-3.5 h-3.5 opacity-90" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M7 12h10M10 18h4" />
                            </svg>
                          </button>

                          {isCalendarDisplayMenuOpen && (
                            <div
                              onClick={(event) => event.stopPropagation()}
                              className="absolute right-0 top-[38px] w-[230px] bg-white border border-zinc-200 rounded-[8px] shadow-[0_18px_50px_rgba(15,23,42,0.16)] p-2 z-[520] animate-fade-in"
                            >
                              {[
                                { key: 'hideLongTasks', label: 'Uzun Süreli Görevleri Gizle' },
                                { key: 'hideCompletedTasks', label: 'Tamamlanmış Görevleri Gizle' },
                                { key: 'hideArchivedTasks', label: 'Arşivlenmiş Görevleri Gizle' }
                              ].map((item) => (
                                <button
                                  key={item.key}
                                  type="button"
                                  onClick={() =>
                                    setCalendarDisplayOptions((prevOptions) => ({
                                      ...prevOptions,
                                      [item.key]: !prevOptions[item.key]
                                    }))
                                  }
                                  className="w-full h-7 rounded-[6px] px-1.5 flex items-center gap-2 text-left hover:bg-zinc-50 transition-colors"
                                >
                                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                    calendarDisplayOptions[item.key]
                                      ? 'bg-[#46b16f] border-[#46b16f] text-white'
                                      : 'bg-white border-zinc-300 text-transparent'
                                  }`}>
                                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  </span>

                                  <span className="text-[10.5px] font-bold text-zinc-500">{item.label}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-white border border-zinc-200/70 rounded-[14px] shadow-[0_10px_32px_rgba(15,23,42,0.045)] overflow-hidden">
                        <div className="h-[50px] px-5 border-b border-zinc-100 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <button
                              type="button"
                              onClick={goToPreviousCalendarPeriod}
                              className="w-8 h-8 rounded-full text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-all flex items-center justify-center"
                            >
                              ‹
                            </button>

                            <h3 className="text-[15px] font-black text-zinc-800 tracking-tight capitalize min-w-[170px]">
                              {calendarHeaderTitle}
                            </h3>

                            <button
                              type="button"
                              onClick={goToNextCalendarPeriod}
                              className="w-8 h-8 rounded-full text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-all flex items-center justify-center"
                            >
                              ›
                            </button>

                            <button
                              type="button"
                              onClick={goToCurrentCalendarPeriod}
                              className="h-6 px-3 rounded-full bg-zinc-100 text-[9.5px] font-black text-zinc-400 hover:text-zinc-700 transition-all"
                            >
                              Bugün
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {['Ay', 'Hafta', 'Gün', 'Liste'].map((view) => (
                              <button
                                key={view}
                                type="button"
                                aria-pressed={calendarView === view}
                                onClick={() => changeCalendarView(view)}
                                className={`h-6 px-3 rounded-full text-[9.5px] font-black transition-all ${
                                  calendarView === view
                                    ? 'bg-blue-500 text-white shadow-sm'
                                    : 'bg-zinc-100 text-zinc-400 hover:text-zinc-700'
                                }`}
                              >
                                {view}
                              </button>
                            ))}
                          </div>
                        </div>

                        {(calendarView === 'Ay' || calendarView === 'Hafta') && (
                          <div className="grid grid-cols-7 h-7 border-b border-zinc-100 bg-white">
                            {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((dayName) => (
                              <div
                                key={dayName}
                                className="px-3 flex items-center justify-center text-[10px] font-black text-zinc-400 border-r border-zinc-100 last:border-r-0"
                              >
                                {dayName}
                              </div>
                            ))}
                          </div>
                        )}

                                                {/* zrc-v523-block-calendarview-ay */}
                        <TakvimTabPanelCalendarViewAyBlock
                          calendarView={typeof calendarView !== 'undefined' ? calendarView : undefined}
                          Ay={typeof Ay !== 'undefined' ? Ay : undefined}
                          grid={typeof grid !== 'undefined' ? grid : undefined}
                          bg={typeof bg !== 'undefined' ? bg : undefined}
                          white={typeof white !== 'undefined' ? white : undefined}
                          calendarGridDays={typeof calendarGridDays !== 'undefined' ? calendarGridDays : undefined}
                          getTasksForCalendarDay={typeof getTasksForCalendarDay !== 'undefined' ? getTasksForCalendarDay : undefined}
                          calendarMonthDate={typeof calendarMonthDate !== 'undefined' ? calendarMonthDate : undefined}
                          isSameCalendarDay={typeof isSameCalendarDay !== 'undefined' ? isSameCalendarDay : undefined}
                          todayStart={typeof todayStart !== 'undefined' ? todayStart : undefined}
                          data={typeof data !== 'undefined' ? data : undefined}
                          calendar={typeof calendar !== 'undefined' ? calendar : undefined}
                          formatDateForTaskModal={typeof formatDateForTaskModal !== 'undefined' ? formatDateForTaskModal : undefined}
                          zrc={typeof zrc !== 'undefined' ? zrc : undefined}
                          group={typeof group !== 'undefined' ? group : undefined}
                          min={typeof min !== 'undefined' ? min : undefined}
                          h={typeof h !== 'undefined' ? h : undefined}
                          border={typeof border !== 'undefined' ? border : undefined}
                          b={typeof b !== 'undefined' ? b : undefined}
                          zinc={typeof zinc !== 'undefined' ? zinc : undefined}
                          px={typeof px !== 'undefined' ? px : undefined}
                          py={typeof py !== 'undefined' ? py : undefined}
                          relative={typeof relative !== 'undefined' ? relative : undefined}
                          canCreateTaskFromCalendar={typeof canCreateTaskFromCalendar !== 'undefined' ? canCreateTaskFromCalendar : undefined}
                          cursor={typeof cursor !== 'undefined' ? cursor : undefined}
                          pointer={typeof pointer !== 'undefined' ? pointer : undefined}
                          transition={typeof transition !== 'undefined' ? transition : undefined}
                          colors={typeof colors !== 'undefined' ? colors : undefined}
                          ekle={typeof ekle !== 'undefined' ? ekle : undefined}
                          openTaskModalForCalendarDay={typeof openTaskModalForCalendarDay !== 'undefined' ? openTaskModalForCalendarDay : undefined}
                          absolute={typeof absolute !== 'undefined' ? absolute : undefined}
                          inset={typeof inset !== 'undefined' ? inset : undefined}
                          z={typeof z !== 'undefined' ? z : undefined}
                          rounded={typeof rounded !== 'undefined' ? rounded : undefined}
                          events={typeof events !== 'undefined' ? events : undefined}
                          none={typeof none !== 'undefined' ? none : undefined}
                          flex={typeof flex !== 'undefined' ? flex : undefined}
                          items={typeof items !== 'undefined' ? items : undefined}
                          center={typeof center !== 'undefined' ? center : undefined}
                          justify={typeof justify !== 'undefined' ? justify : undefined}
                          between={typeof between !== 'undefined' ? between : undefined}
                          mb={typeof mb !== 'undefined' ? mb : undefined}
                          w={typeof w !== 'undefined' ? w : undefined}
                          full={typeof full !== 'undefined' ? full : undefined}
                          text={typeof text !== 'undefined' ? text : undefined}
                          font={typeof font !== 'undefined' ? font : undefined}
                          black={typeof black !== 'undefined' ? black : undefined}
                          blue={typeof blue !== 'undefined' ? blue : undefined}
                          leading={typeof leading !== 'undefined' ? leading : undefined}
                          space={typeof space !== 'undefined' ? space : undefined}
                          onMouseDown={typeof onMouseDown !== 'undefined' ? onMouseDown : undefined}
                          openTaskDetail={typeof openTaskDetail !== 'undefined' ? openTaskDetail : undefined}
                          left={typeof left !== 'undefined' ? left : undefined}
                          truncate={typeof truncate !== 'undefined' ? truncate : undefined}
                          all={typeof all !== 'undefined' ? all : undefined}
                          getCalendarTaskBarStyle={typeof getCalendarTaskBarStyle !== 'undefined' ? getCalendarTaskBarStyle : undefined}
                          getPremiumCalendarTaskStyle={typeof getPremiumCalendarTaskStyle !== 'undefined' ? getPremiumCalendarTaskStyle : undefined}
                        />

                        {calendarView === 'Hafta' && (
                          <div
                            className="grid grid-cols-7 bg-white"
                          >
                            {calendarWeekDays.map((day) => {
                              const dayTasks = getTasksForCalendarDay(day);
                              const isToday = isSameCalendarDay(day, todayStart);

                              return (
                                <div
                                  key={`week-${day.toISOString()}`}
                                  data-calendar-day={formatDateForTaskModal(day)}
                                  data-zrc-calendar-day={formatDateForTaskModal(day)}
                                  className={`group min-h-[310px] border-r border-b border-zinc-100 last:border-r-0 px-2.5 py-2 relative transition-colors ${
                                    canCreateTaskFromCalendar ? 'cursor-pointer hover:bg-zinc-50' : 'cursor-default'
                                  }`}
                                >
                                  {canCreateTaskFromCalendar && (
                                    <button
                                      type="button"
                                      data-zrc-calendar-day={formatDateForTaskModal(day)}
                                      aria-label={`${day.getDate()} için görev ekle`}
                                      onClick={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        openTaskModalForCalendarDay(day);
                                      }}
                                      className="absolute inset-0 z-10 cursor-pointer rounded-[4px]"
                                    />
                                  )}

                                  <div className="relative z-20 pointer-events-none mb-2 flex items-center justify-between">
                                    <div>
                                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black ${
                                        isToday ? 'bg-blue-500 text-white' : 'bg-zinc-100 text-zinc-500'
                                      }`}>
                                        {day.getDate()}
                                      </div>
                                      <div className="mt-1 text-[9.5px] font-black text-zinc-400 uppercase">
                                        {formatCalendarWeekday(day)}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="relative z-30 space-y-1.5">
                                    {dayTasks.map((task) => (
                                      <button
                                        key={`week-task-${day.toISOString()}-${task.id}`}
                                        type="button"
                                        data-calendar-task-button="true"
                                        onMouseDown={(event) => event.stopPropagation()}
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          openTaskDetail(task, task.columnTitle);
                                        }}
                                        className={`relative z-20 w-full min-h-[30px] px-2 py-1 rounded-[8px] border text-left text-[10px] font-black leading-tight transition-all ${getCalendarTaskBarStyle(task.priority, task.isArchivedCalendarTask)}`}
                                        style={getPremiumCalendarTaskStyle(task)}
                                      >
                                        {task.title}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                                                {/* zrc-v523-block-calendarview-gun */}
                        <TakvimTabPanelCalendarViewGunBlock
                          calendarView={typeof calendarView !== 'undefined' ? calendarView : undefined}
                          canCreateTaskFromCalendar={typeof canCreateTaskFromCalendar !== 'undefined' ? canCreateTaskFromCalendar : undefined}
                          handleCalendarDayClick={typeof handleCalendarDayClick !== 'undefined' ? handleCalendarDayClick : undefined}
                          calendarFocusedDate={typeof calendarFocusedDate !== 'undefined' ? calendarFocusedDate : undefined}
                          tabIndex={typeof tabIndex !== 'undefined' ? tabIndex : undefined}
                          min={typeof min !== 'undefined' ? min : undefined}
                          h={typeof h !== 'undefined' ? h : undefined}
                          bg={typeof bg !== 'undefined' ? bg : undefined}
                          white={typeof white !== 'undefined' ? white : undefined}
                          transition={typeof transition !== 'undefined' ? transition : undefined}
                          colors={typeof colors !== 'undefined' ? colors : undefined}
                          cursor={typeof cursor !== 'undefined' ? cursor : undefined}
                          pointer={typeof pointer !== 'undefined' ? pointer : undefined}
                          zinc={typeof zinc !== 'undefined' ? zinc : undefined}
                          flex={typeof flex !== 'undefined' ? flex : undefined}
                          items={typeof items !== 'undefined' ? items : undefined}
                          center={typeof center !== 'undefined' ? center : undefined}
                          justify={typeof justify !== 'undefined' ? justify : undefined}
                          between={typeof between !== 'undefined' ? between : undefined}
                          mb={typeof mb !== 'undefined' ? mb : undefined}
                          text={typeof text !== 'undefined' ? text : undefined}
                          font={typeof font !== 'undefined' ? font : undefined}
                          black={typeof black !== 'undefined' ? black : undefined}
                          capitalize={typeof capitalize !== 'undefined' ? capitalize : undefined}
                          formatCalendarFullDate={typeof formatCalendarFullDate !== 'undefined' ? formatCalendarFullDate : undefined}
                          mt={typeof mt !== 'undefined' ? mt : undefined}
                          bold={typeof bold !== 'undefined' ? bold : undefined}
                          calendarDayHelperText={typeof calendarDayHelperText !== 'undefined' ? calendarDayHelperText : undefined}
                          data={typeof data !== 'undefined' ? data : undefined}
                          calendar={typeof calendar !== 'undefined' ? calendar : undefined}
                          onMouseDown={typeof onMouseDown !== 'undefined' ? onMouseDown : undefined}
                          openTaskModalForCalendarDay={typeof openTaskModalForCalendarDay !== 'undefined' ? openTaskModalForCalendarDay : undefined}
                          px={typeof px !== 'undefined' ? px : undefined}
                          rounded={typeof rounded !== 'undefined' ? rounded : undefined}
                          full={typeof full !== 'undefined' ? full : undefined}
                          all={typeof all !== 'undefined' ? all : undefined}
                          Bu={typeof Bu !== 'undefined' ? Bu : undefined}
                          Ekle={typeof Ekle !== 'undefined' ? Ekle : undefined}
                          space={typeof space !== 'undefined' ? space : undefined}
                          selectedDayCalendarTasks={typeof selectedDayCalendarTasks !== 'undefined' ? selectedDayCalendarTasks : undefined}
                          day={typeof day !== 'undefined' ? day : undefined}
                          openTaskDetail={typeof openTaskDetail !== 'undefined' ? openTaskDetail : undefined}
                          w={typeof w !== 'undefined' ? w : undefined}
                          border={typeof border !== 'undefined' ? border : undefined}
                          l={typeof l !== 'undefined' ? l : undefined}
                          left={typeof left !== 'undefined' ? left : undefined}
                          shadow={typeof shadow !== 'undefined' ? shadow : undefined}
                          getPremiumCalendarTaskStyle={typeof getPremiumCalendarTaskStyle !== 'undefined' ? getPremiumCalendarTaskStyle : undefined}
                          gap={typeof gap !== 'undefined' ? gap : undefined}
                          truncate={typeof truncate !== 'undefined' ? truncate : undefined}
                          getRoleAwareTaskMeta={typeof getRoleAwareTaskMeta !== 'undefined' ? getRoleAwareTaskMeta : undefined}
                          shrink={typeof shrink !== 'undefined' ? shrink : undefined}
                          getCalendarTaskBarStyle={typeof getCalendarTaskBarStyle !== 'undefined' ? getCalendarTaskBarStyle : undefined}
                          Normal={typeof Normal !== 'undefined' ? Normal : undefined}
                          dashed={typeof dashed !== 'undefined' ? dashed : undefined}
                          yok={typeof yok !== 'undefined' ? yok : undefined}
                        />

                        {calendarView === 'Liste' && (
                          <div className="min-h-[430px] bg-[#fbfcfd] p-4">
                            {calendarTasks.length > 0 ? (
                              <div className="space-y-2">
                                {calendarTasks.map((task) => (
                                  <button
                                    key={`list-task-${task.id}`}
                                    type="button"
                                    data-calendar-task-button="true"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      openTaskDetail(task, task.columnTitle);
                                    }}
                                    className="w-full bg-white border border-zinc-200 border-l-[3px] rounded-[10px] p-3 text-left hover:border-zinc-300 hover:shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition-all"
                                    style={getPremiumCalendarTaskStyle(task)}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-12 h-12 rounded-[10px] bg-zinc-50 border border-zinc-100 flex flex-col items-center justify-center text-zinc-500 shrink-0">
                                        <span className="text-[13px] font-black leading-none">{formatCalendarDate(task.calendarEndDate || task.calendarStartDate).split(' ')[0]}</span>
                                        <span className="mt-1 text-[8.5px] font-black uppercase">{formatCalendarWeekday(task.calendarEndDate || task.calendarStartDate)}</span>
                                      </div>

                                      <div className="min-w-0 flex-1">
                                        <div className="text-[12px] font-black text-zinc-800 truncate">{task.title}</div>
                                        <div className="mt-1 text-[10px] font-bold text-zinc-400 truncate">
                                          {getRoleAwareTaskMeta(task)}
                                        </div>
                                      </div>

                                      <span className={`shrink-0 h-5 px-2 rounded-full border text-[9px] font-black ${getCalendarTaskBarStyle(task.priority, task.isArchivedCalendarTask)}`}>
                                        {task.isArchivedCalendarTask ? 'Arşiv' : task.priority || 'Normal'}
                                      </span>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className="h-[260px] bg-white border border-zinc-200 rounded-[12px] flex items-center justify-center text-center">
                                <div>
                                  <div className="text-[13px] font-black text-zinc-700">Takvimde görev yok</div>
                                  <div className="text-[10.5px] font-bold text-zinc-400 mt-1">
                                    Tarihi olan görevler burada listelenir.
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
  );
}
