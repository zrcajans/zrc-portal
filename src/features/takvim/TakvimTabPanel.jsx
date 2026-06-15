import React from 'react';

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

                        {calendarView === 'Ay' && (
                          <div
                            className="grid grid-cols-7 bg-white"
                          >
                            {calendarGridDays.map((day) => {
                              const dayTasks = getTasksForCalendarDay(day);
                              const isCurrentMonth = day.getMonth() === calendarMonthDate.getMonth();
                              const isToday = isSameCalendarDay(day, todayStart);

                              return (
                                <div
                                  key={day.toISOString()}
                                  data-calendar-day={formatDateForTaskModal(day)}
                                  data-zrc-calendar-day={formatDateForTaskModal(day)}
                                  className={`group min-h-[86px] border-r border-b border-zinc-100 last:border-r-0 px-2 py-1.5 relative ${
                                    canCreateTaskFromCalendar ? 'cursor-pointer hover:bg-zinc-50' : 'cursor-default'
                                  } transition-colors ${
                                    isCurrentMonth ? 'bg-white' : 'bg-zinc-50/60'
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

                                  <div className="relative z-20 pointer-events-none flex items-center justify-between mb-1">
                                    <span
                                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                                        isToday
                                          ? 'bg-blue-500 text-white'
                                          : isCurrentMonth
                                            ? 'text-zinc-500'
                                            : 'text-zinc-300'
                                      }`}
                                    >
                                      {day.getDate()}
                                    </span>

                                    {dayTasks.length > 3 ? (
                                      <span className="text-[9px] font-black text-zinc-300">
                                        +{dayTasks.length - 3}
                                      </span>
                                    ) : (
                                      canCreateTaskFromCalendar ? (
                                        <span className="opacity-0 group-hover:opacity-100 text-[13px] leading-none font-black text-blue-400 transition-opacity">
                                          +
                                        </span>
                                      ) : null
                                    )}
                                  </div>

                                  <div className="relative z-30 space-y-1">
                                    {dayTasks.slice(0, 3).map((task) => (
                                      <button
                                        key={`${day.toISOString()}-${task.id}`}
                                        type="button"
                                        data-calendar-task-button="true"
                                        onMouseDown={(event) => event.stopPropagation()}
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          openTaskDetail(task, task.columnTitle);
                                        }}
                                        className={`relative z-40 w-full h-[21px] px-1.5 rounded-[7px] border text-left text-[9px] font-black truncate transition-all ${getCalendarTaskBarStyle(task.priority, task.isArchivedCalendarTask)}`}
                                        style={getPremiumCalendarTaskStyle(task)}
                                        title={task.title}
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

                        {calendarView === 'Gün' && (
                          <div
                            onClick={(event) => {
                              if (!canCreateTaskFromCalendar) return;
                              handleCalendarDayClick(event, calendarFocusedDate);
                            }}
                            role="button"
                            tabIndex={0}
                            className={`min-h-[430px] bg-white p-5 transition-colors ${
                              canCreateTaskFromCalendar ? 'cursor-pointer hover:bg-zinc-50' : 'cursor-default'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <div className="text-[13px] font-black text-zinc-800 capitalize">{formatCalendarFullDate(calendarFocusedDate)}</div>
                                <div className="mt-1 text-[10.5px] font-bold text-zinc-400">{calendarDayHelperText}</div>
                              </div>

                              {canCreateTaskFromCalendar && (
                                <button
                                  type="button"
                                  data-calendar-task-button="true"
                                  onMouseDown={(event) => event.stopPropagation()}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    openTaskModalForCalendarDay(calendarFocusedDate);
                                  }}
                                  className="h-8 px-3.5 rounded-full bg-[#2563eb] text-white text-[10.5px] font-black hover:bg-[#1d4ed8] transition-all"
                                >
                                  Bu Güne Görev Ekle
                                </button>
                              )}
                            </div>

                            <div className="space-y-2">
                              {selectedDayCalendarTasks.map((task) => (
                                <button
                                  key={`day-task-${task.id}`}
                                  type="button"
                                  onMouseDown={(event) => event.stopPropagation()}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    openTaskDetail(task, task.columnTitle);
                                  }}
                                  className="w-full bg-white border border-zinc-200 border-l-[3px] rounded-[10px] p-3 text-left hover:border-zinc-300 hover:shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition-all"
                                  style={getPremiumCalendarTaskStyle(task)}
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                      <div className="text-[12px] font-black text-zinc-800 truncate">{task.title}</div>
                                      <div className="mt-1 text-[10px] font-bold text-zinc-400 truncate">
                                        {getRoleAwareTaskMeta(task)}
                                      </div>
                                    </div>

                                    <span className={`shrink-0 h-5 px-2 rounded-full border text-[9px] font-black ${getCalendarTaskBarStyle(task.priority, task.isArchivedCalendarTask)}`}>
                                      {task.priority || 'Normal'}
                                    </span>
                                  </div>
                                </button>
                              ))}

                              {selectedDayCalendarTasks.length === 0 && (
                                <div className="h-[180px] rounded-[12px] border border-dashed border-zinc-200 bg-zinc-50/60 flex items-center justify-center text-[11px] font-bold text-zinc-400">
                                  Bu gün için görev yok.
                                </div>
                              )}
                            </div>
                          </div>
                        )}

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
