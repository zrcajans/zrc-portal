import { formatCalendarDate, formatCalendarWeekday, formatDateForTaskModal } from '../../utils/dashboardHelpers';
import ZRCAppShellAutoUiBlock02 from '../blocks/ZRCAppShellAutoUiBlock02';
import ZRCAppShellAutoUiBlock05 from '../blocks/ZRCAppShellAutoUiBlock05';
import ZRCAppShellCalendarViewAyBlock from '../blocks/ZRCAppShellCalendarViewAyBlock';
import ZRCAppShellCalendarViewHaftaBlock from '../blocks/ZRCAppShellCalendarViewHaftaBlock';

export default function ZRCAppMenuCalendarSection({
  Ay,
  Cmt,
  Cum,
  Durumlar,
  Filtreler,
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
  between,
  bg,
  black,
  bold,
  border,
  c5cad3,
  calendar,
  calendarDisplayOptions,
  calendarFocusedDate,
  calendarGridDays,
  calendarHeaderTitle,
  calendarMonthDate,
  calendarView,
  calendarWeekDays,
  center,
  current,
  cursor,
  custom,
  d,
  data,
  e4e9f1,
  edf0f4,
  event,
  f6f6f6_12px,
  f6f6f6_6px,
  f8fbff,
  fafafa_0,
  fafafa_6px,
  fbfbfb_16px,
  fbfbfb_8px,
  fbfcfe,
  fff_0,
  fff_8px,
  fill,
  filterEvent,
  flex,
  font,
  formatMenuCalendarTaskTime,
  formatMenuCalendarWeekHeader,
  full,
  gap,
  getMenuCalendarAllDayTasks,
  getMenuCalendarHolidayLabel,
  getMenuCalendarTasksForDay,
  getMenuCalendarTasksForHour,
  getPremiumCalendarDotStyle,
  getPremiumCalendarTaskStyle,
  goToNextCalendarPeriod,
  goToPreviousCalendarPeriod,
  gradient,
  grid,
  h,
  handleCalendarDayClick,
  head,
  hidden,
  hour,
  hourTasks,
  isMenuCalendarFilterOpen,
  isMenuCalendarStatusOpen,
  isSameCalendarDay,
  items,
  justify,
  l,
  leading,
  left,
  linear,
  max,
  menu,
  menuCalendarHours,
  menuCalendarListGroups,
  menuCalendarStatusFilter,
  menuCalendarStatusOptions,
  min,
  month,
  mt,
  onClick,
  openHomeCalendarQuickTaskForDate,
  openMenuCalendarQuickTask,
  openMenuCalendarTask,
  overflow,
  pointer,
  prev,
  projectName,
  projects,
  pt,
  px,
  py,
  relative,
  repeat,
  repeating,
  right,
  rounded,
  scrollbar,
  semibold,
  setCalendarDisplayOptions,
  setCalendarFocusedDate,
  setCalendarMonthDate,
  setCalendarView,
  setIsMenuCalendarFilterOpen,
  setIsMenuCalendarStatusOpen,
  setMenuCalendarStatusFilter,
  shadow,
  shrink,
  space,
  start,
  status,
  stroke,
  strokeLinecap,
  strokeLinejoin,
  strokeWidth,
  task,
  text,
  todayStart,
  top,
  transition,
  translate,
  truncate,
  viewBox,
  w,
  week,
  white,
  zrc,
}) {
  return (
          <div className="w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(47,102,207,0.05),transparent_34%),linear-gradient(180deg,#f7f8fb_0%,#eef1f5_100%)] overflow-hidden animate-fade-in">
            <div className="h-full pl-5 pr-[76px] pt-4 pb-6 overflow-y-auto custom-scrollbar">
              <div className="h-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={openMenuCalendarQuickTask}
                  className="h-8 px-4 rounded-full bg-[#1f9d61] text-white text-[10.5px] font-black hover:bg-[#188b55] transition-all flex items-center gap-2 shadow-[0_10px_24px_rgba(31,157,97,0.18)]"
                >
                  Görev Oluştur
                  <span className="text-[13px] leading-none">+</span>
                </button>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsMenuCalendarFilterOpen((prev) => !prev);
                    setIsMenuCalendarStatusOpen(false);
                  }}
                  className="relative h-8 px-4 rounded-full bg-[#2563eb] text-white text-[10.5px] font-black hover:bg-[#1d56d6] transition-all flex items-center gap-2 shadow-[0_10px_24px_rgba(37,99,235,0.18)]"
                >
                  Filtreler
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M6 12h12M10 20h4" />
                  </svg>

                  <ZRCAppShellAutoUiBlock02
        Durumlar={typeof Durumlar !== 'undefined' ? Durumlar : undefined}
        Filtreler={typeof Filtreler !== 'undefined' ? Filtreler : undefined}
        calendarDisplayOptions={typeof calendarDisplayOptions !== 'undefined' ? calendarDisplayOptions : undefined}
        d={typeof d !== 'undefined' ? d : undefined}
        fill={typeof fill !== 'undefined' ? fill : undefined}
        filterEvent={typeof filterEvent !== 'undefined' ? filterEvent : undefined}
        isMenuCalendarFilterOpen={typeof isMenuCalendarFilterOpen !== 'undefined' ? isMenuCalendarFilterOpen : undefined}
        isMenuCalendarStatusOpen={typeof isMenuCalendarStatusOpen !== 'undefined' ? isMenuCalendarStatusOpen : undefined}
        menuCalendarStatusFilter={typeof menuCalendarStatusFilter !== 'undefined' ? menuCalendarStatusFilter : undefined}
        menuCalendarStatusOptions={typeof menuCalendarStatusOptions !== 'undefined' ? menuCalendarStatusOptions : undefined}
        onClick={typeof onClick !== 'undefined' ? onClick : undefined}
        prev={typeof prev !== 'undefined' ? prev : undefined}
        projectName={typeof projectName !== 'undefined' ? projectName : undefined}
        projects={typeof projects !== 'undefined' ? projects : undefined}
        setCalendarDisplayOptions={typeof setCalendarDisplayOptions !== 'undefined' ? setCalendarDisplayOptions : undefined}
        setIsMenuCalendarStatusOpen={typeof setIsMenuCalendarStatusOpen !== 'undefined' ? setIsMenuCalendarStatusOpen : undefined}
        setMenuCalendarStatusFilter={typeof setMenuCalendarStatusFilter !== 'undefined' ? setMenuCalendarStatusFilter : undefined}
        status={typeof status !== 'undefined' ? status : undefined}
        stroke={typeof stroke !== 'undefined' ? stroke : undefined}
        strokeLinecap={typeof strokeLinecap !== 'undefined' ? strokeLinecap : undefined}
        strokeLinejoin={typeof strokeLinejoin !== 'undefined' ? strokeLinejoin : undefined}
        strokeWidth={typeof strokeWidth !== 'undefined' ? strokeWidth : undefined}
        viewBox={typeof viewBox !== 'undefined' ? viewBox : undefined}
      />
                </button>
              </div>

              <div className="mt-3 bg-white border border-white/80 rounded-[18px] shadow-[0_24px_60px_rgba(15,23,42,0.08)] overflow-hidden ring-1 ring-slate-200/70">
                <div className="h-[56px] px-5 flex items-center justify-between border-b border-[#edf0f4] bg-white/95">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={goToPreviousCalendarPeriod}
                      className="w-8 h-8 rounded-full text-[#3b4452] hover:bg-[#f4f6f8] transition-all flex items-center justify-center text-[20px] leading-none"
                    >
                      ‹
                    </button>

                    <div className="text-[15px] font-black text-[#303949] min-w-[160px] capitalize">
                      {calendarHeaderTitle}
                    </div>

                    <button
                      type="button"
                      onClick={goToNextCalendarPeriod}
                      className="w-8 h-8 rounded-full text-[#3b4452] hover:bg-[#f4f6f8] transition-all flex items-center justify-center text-[20px] leading-none"
                    >
                      ›
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const now = new Date();
                        setCalendarMonthDate(new Date(now.getFullYear(), now.getMonth(), 1));
                        setCalendarFocusedDate(now);
                      }}
                      className="h-6 px-3 rounded-full bg-[#f1f2f4] text-[9px] font-black text-[#b4bbc7] hover:text-[#6b7280] transition-all"
                    >
                      Bugün
                    </button>
                  </div>

                  <div className="h-7 p-0.5 rounded-full bg-[#eef0f4] flex items-center gap-0.5">
                    {['Ay', 'Hafta', 'Gün', 'Liste'].map((view) => (
                      <button
                        key={`menu-calendar-view-${view}`}
                        type="button"
                        onClick={() => setCalendarView(view)}
                        className={`h-6 px-3 rounded-full text-[9px] font-black transition-all ${
                          calendarView === view
                            ? 'bg-[#55ace8] text-white shadow-sm'
                            : 'text-[#8f98a6] hover:bg-white hover:text-[#4b5563]'
                        }`}
                      >
                        {view}
                      </button>
                    ))}
                  </div>
                </div>

                                {/* zrc-v523-block-calendarview-ay */}
                <ZRCAppShellCalendarViewAyBlock
                  calendarView={typeof calendarView !== 'undefined' ? calendarView : undefined}
                  Ay={typeof Ay !== 'undefined' ? Ay : undefined}
                  grid={typeof grid !== 'undefined' ? grid : undefined}
                  h={typeof h !== 'undefined' ? h : undefined}
                  bg={typeof bg !== 'undefined' ? bg : undefined}
                  white={typeof white !== 'undefined' ? white : undefined}
                  border={typeof border !== 'undefined' ? border : undefined}
                  b={typeof b !== 'undefined' ? b : undefined}
                  edf0f4={typeof edf0f4 !== 'undefined' ? edf0f4 : undefined}
                  Pzt={typeof Pzt !== 'undefined' ? Pzt : undefined}
                  Sal={typeof Sal !== 'undefined' ? Sal : undefined}
                  Per={typeof Per !== 'undefined' ? Per : undefined}
                  Cum={typeof Cum !== 'undefined' ? Cum : undefined}
                  Cmt={typeof Cmt !== 'undefined' ? Cmt : undefined}
                  Paz={typeof Paz !== 'undefined' ? Paz : undefined}
                  px={typeof px !== 'undefined' ? px : undefined}
                  flex={typeof flex !== 'undefined' ? flex : undefined}
                  items={typeof items !== 'undefined' ? items : undefined}
                  center={typeof center !== 'undefined' ? center : undefined}
                  justify={typeof justify !== 'undefined' ? justify : undefined}
                  text={typeof text !== 'undefined' ? text : undefined}
                  font={typeof font !== 'undefined' ? font : undefined}
                  black={typeof black !== 'undefined' ? black : undefined}
                  repeat={typeof repeat !== 'undefined' ? repeat : undefined}
                  calendarGridDays={typeof calendarGridDays !== 'undefined' ? calendarGridDays : undefined}
                  getMenuCalendarTasksForDay={typeof getMenuCalendarTasksForDay !== 'undefined' ? getMenuCalendarTasksForDay : undefined}
                  getMenuCalendarHolidayLabel={typeof getMenuCalendarHolidayLabel !== 'undefined' ? getMenuCalendarHolidayLabel : undefined}
                  calendarMonthDate={typeof calendarMonthDate !== 'undefined' ? calendarMonthDate : undefined}
                  isSameCalendarDay={typeof isSameCalendarDay !== 'undefined' ? isSameCalendarDay : undefined}
                  todayStart={typeof todayStart !== 'undefined' ? todayStart : undefined}
                  menu={typeof menu !== 'undefined' ? menu : undefined}
                  calendar={typeof calendar !== 'undefined' ? calendar : undefined}
                  month={typeof month !== 'undefined' ? month : undefined}
                  handleCalendarDayClick={typeof handleCalendarDayClick !== 'undefined' ? handleCalendarDayClick : undefined}
                  data={typeof data !== 'undefined' ? data : undefined}
                  zrc={typeof zrc !== 'undefined' ? zrc : undefined}
                  formatDateForTaskModal={typeof formatDateForTaskModal !== 'undefined' ? formatDateForTaskModal : undefined}
                  relative={typeof relative !== 'undefined' ? relative : undefined}
                  left={typeof left !== 'undefined' ? left : undefined}
                  overflow={typeof overflow !== 'undefined' ? overflow : undefined}
                  hidden={typeof hidden !== 'undefined' ? hidden : undefined}
                  f8fbff={typeof f8fbff !== 'undefined' ? f8fbff : undefined}
                  transition={typeof transition !== 'undefined' ? transition : undefined}
                  all={typeof all !== 'undefined' ? all : undefined}
                  cursor={typeof cursor !== 'undefined' ? cursor : undefined}
                  pointer={typeof pointer !== 'undefined' ? pointer : undefined}
                  fbfcfe={typeof fbfcfe !== 'undefined' ? fbfcfe : undefined}
                  repeating={typeof repeating !== 'undefined' ? repeating : undefined}
                  linear={typeof linear !== 'undefined' ? linear : undefined}
                  gradient={typeof gradient !== 'undefined' ? gradient : undefined}
                  fafafa_0={typeof fafafa_0 !== 'undefined' ? fafafa_0 : undefined}
                  fafafa_6px={typeof fafafa_6px !== 'undefined' ? fafafa_6px : undefined}
                  f6f6f6_6px={typeof f6f6f6_6px !== 'undefined' ? f6f6f6_6px : undefined}
                  f6f6f6_12px={typeof f6f6f6_12px !== 'undefined' ? f6f6f6_12px : undefined}
                  start={typeof start !== 'undefined' ? start : undefined}
                  between={typeof between !== 'undefined' ? between : undefined}
                  w={typeof w !== 'undefined' ? w : undefined}
                  rounded={typeof rounded !== 'undefined' ? rounded : undefined}
                  c5cad3={typeof c5cad3 !== 'undefined' ? c5cad3 : undefined}
                  mt={typeof mt !== 'undefined' ? mt : undefined}
                  leading={typeof leading !== 'undefined' ? leading : undefined}
                  space={typeof space !== 'undefined' ? space : undefined}
                  openMenuCalendarTask={typeof openMenuCalendarTask !== 'undefined' ? openMenuCalendarTask : undefined}
                  full={typeof full !== 'undefined' ? full : undefined}
                  gap={typeof gap !== 'undefined' ? gap : undefined}
                  e4e9f1={typeof e4e9f1 !== 'undefined' ? e4e9f1 : undefined}
                  l={typeof l !== 'undefined' ? l : undefined}
                  shadow={typeof shadow !== 'undefined' ? shadow : undefined}
                  translate={typeof translate !== 'undefined' ? translate : undefined}
                  getPremiumCalendarTaskStyle={typeof getPremiumCalendarTaskStyle !== 'undefined' ? getPremiumCalendarTaskStyle : undefined}
                  shrink={typeof shrink !== 'undefined' ? shrink : undefined}
                  getPremiumCalendarDotStyle={typeof getPremiumCalendarDotStyle !== 'undefined' ? getPremiumCalendarDotStyle : undefined}
                  current={typeof current !== 'undefined' ? current : undefined}
                  formatMenuCalendarTaskTime={typeof formatMenuCalendarTaskTime !== 'undefined' ? formatMenuCalendarTaskTime : undefined}
                  min={typeof min !== 'undefined' ? min : undefined}
                  truncate={typeof truncate !== 'undefined' ? truncate : undefined}
                />

                                {/* zrc-v523-block-calendarview-hafta */}
                <ZRCAppShellCalendarViewHaftaBlock
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
                  week={typeof week !== 'undefined' ? week : undefined}
                  head={typeof head !== 'undefined' ? head : undefined}
                  setCalendarFocusedDate={typeof setCalendarFocusedDate !== 'undefined' ? setCalendarFocusedDate : undefined}
                  text={typeof text !== 'undefined' ? text : undefined}
                  center={typeof center !== 'undefined' ? center : undefined}
                  font={typeof font !== 'undefined' ? font : undefined}
                  black={typeof black !== 'undefined' ? black : undefined}
                  formatCalendarDate={typeof formatCalendarDate !== 'undefined' ? formatCalendarDate : undefined}
                  formatCalendarWeekday={typeof formatCalendarWeekday !== 'undefined' ? formatCalendarWeekday : undefined}
                  px={typeof px !== 'undefined' ? px : undefined}
                  flex={typeof flex !== 'undefined' ? flex : undefined}
                  items={typeof items !== 'undefined' ? items : undefined}
                  bold={typeof bold !== 'undefined' ? bold : undefined}
                  getMenuCalendarAllDayTasks={typeof getMenuCalendarAllDayTasks !== 'undefined' ? getMenuCalendarAllDayTasks : undefined}
                  getMenuCalendarHolidayLabel={typeof getMenuCalendarHolidayLabel !== 'undefined' ? getMenuCalendarHolidayLabel : undefined}
                  allday={typeof allday !== 'undefined' ? allday : undefined}
                  data={typeof data !== 'undefined' ? data : undefined}
                  zrc={typeof zrc !== 'undefined' ? zrc : undefined}
                  calendar={typeof calendar !== 'undefined' ? calendar : undefined}
                  formatDateForTaskModal={typeof formatDateForTaskModal !== 'undefined' ? formatDateForTaskModal : undefined}
                  openHomeCalendarQuickTaskForDate={typeof openHomeCalendarQuickTaskForDate !== 'undefined' ? openHomeCalendarQuickTaskForDate : undefined}
                  gap={typeof gap !== 'undefined' ? gap : undefined}
                  overflow={typeof overflow !== 'undefined' ? overflow : undefined}
                  hidden={typeof hidden !== 'undefined' ? hidden : undefined}
                  cursor={typeof cursor !== 'undefined' ? cursor : undefined}
                  pointer={typeof pointer !== 'undefined' ? pointer : undefined}
                  f8fbff={typeof f8fbff !== 'undefined' ? f8fbff : undefined}
                  repeating={typeof repeating !== 'undefined' ? repeating : undefined}
                  linear={typeof linear !== 'undefined' ? linear : undefined}
                  gradient={typeof gradient !== 'undefined' ? gradient : undefined}
                  fafafa_0={typeof fafafa_0 !== 'undefined' ? fafafa_0 : undefined}
                  fafafa_6px={typeof fafafa_6px !== 'undefined' ? fafafa_6px : undefined}
                  f6f6f6_6px={typeof f6f6f6_6px !== 'undefined' ? f6f6f6_6px : undefined}
                  f6f6f6_12px={typeof f6f6f6_12px !== 'undefined' ? f6f6f6_12px : undefined}
                  truncate={typeof truncate !== 'undefined' ? truncate : undefined}
                  openMenuCalendarTask={typeof openMenuCalendarTask !== 'undefined' ? openMenuCalendarTask : undefined}
                  w={typeof w !== 'undefined' ? w : undefined}
                  full={typeof full !== 'undefined' ? full : undefined}
                  rounded={typeof rounded !== 'undefined' ? rounded : undefined}
                  e4e9f1={typeof e4e9f1 !== 'undefined' ? e4e9f1 : undefined}
                  l={typeof l !== 'undefined' ? l : undefined}
                  left={typeof left !== 'undefined' ? left : undefined}
                  current={typeof current !== 'undefined' ? current : undefined}
                  shadow={typeof shadow !== 'undefined' ? shadow : undefined}
                  getPremiumCalendarTaskStyle={typeof getPremiumCalendarTaskStyle !== 'undefined' ? getPremiumCalendarTaskStyle : undefined}
                  max={typeof max !== 'undefined' ? max : undefined}
                  auto={typeof auto !== 'undefined' ? auto : undefined}
                  custom={typeof custom !== 'undefined' ? custom : undefined}
                  scrollbar={typeof scrollbar !== 'undefined' ? scrollbar : undefined}
                  menuCalendarHours={typeof menuCalendarHours !== 'undefined' ? menuCalendarHours : undefined}
                  pt={typeof pt !== 'undefined' ? pt : undefined}
                  semibold={typeof semibold !== 'undefined' ? semibold : undefined}
                  getMenuCalendarTasksForHour={typeof getMenuCalendarTasksForHour !== 'undefined' ? getMenuCalendarTasksForHour : undefined}
                  relative={typeof relative !== 'undefined' ? relative : undefined}
                  fff_0={typeof fff_0 !== 'undefined' ? fff_0 : undefined}
                  fff_8px={typeof fff_8px !== 'undefined' ? fff_8px : undefined}
                  fbfbfb_8px={typeof fbfbfb_8px !== 'undefined' ? fbfbfb_8px : undefined}
                  fbfbfb_16px={typeof fbfbfb_16px !== 'undefined' ? fbfbfb_16px : undefined}
                  absolute={typeof absolute !== 'undefined' ? absolute : undefined}
                  right={typeof right !== 'undefined' ? right : undefined}
                  top={typeof top !== 'undefined' ? top : undefined}
                  min={typeof min !== 'undefined' ? min : undefined}
                  py={typeof py !== 'undefined' ? py : undefined}
                  transition={typeof transition !== 'undefined' ? transition : undefined}
                  all={typeof all !== 'undefined' ? all : undefined}
                  formatMenuCalendarTaskTime={typeof formatMenuCalendarTaskTime !== 'undefined' ? formatMenuCalendarTaskTime : undefined}
                />

                <ZRCAppShellAutoUiBlock05
        calendar={typeof calendar !== 'undefined' ? calendar : undefined}
        calendarFocusedDate={typeof calendarFocusedDate !== 'undefined' ? calendarFocusedDate : undefined}
        calendarView={typeof calendarView !== 'undefined' ? calendarView : undefined}
        data={typeof data !== 'undefined' ? data : undefined}
        event={typeof event !== 'undefined' ? event : undefined}
        formatCalendarWeekday={typeof formatCalendarWeekday !== 'undefined' ? formatCalendarWeekday : undefined}
        formatMenuCalendarTaskTime={typeof formatMenuCalendarTaskTime !== 'undefined' ? formatMenuCalendarTaskTime : undefined}
        getMenuCalendarHolidayLabel={typeof getMenuCalendarHolidayLabel !== 'undefined' ? getMenuCalendarHolidayLabel : undefined}
        getMenuCalendarTasksForHour={typeof getMenuCalendarTasksForHour !== 'undefined' ? getMenuCalendarTasksForHour : undefined}
        getPremiumCalendarTaskStyle={typeof getPremiumCalendarTaskStyle !== 'undefined' ? getPremiumCalendarTaskStyle : undefined}
        hour={typeof hour !== 'undefined' ? hour : undefined}
        hourTasks={typeof hourTasks !== 'undefined' ? hourTasks : undefined}
        menuCalendarHours={typeof menuCalendarHours !== 'undefined' ? menuCalendarHours : undefined}
        onClick={typeof onClick !== 'undefined' ? onClick : undefined}
        openMenuCalendarTask={typeof openMenuCalendarTask !== 'undefined' ? openMenuCalendarTask : undefined}
        task={typeof task !== 'undefined' ? task : undefined}
      />

                {calendarView === 'Liste' && (
                  <div className="bg-white min-h-[560px]">
                    {menuCalendarListGroups.length > 0 ? (
                      menuCalendarListGroups.map((group) => (
                        <div key={`list-group-${group.day.toISOString()}`}>
                          <div className="h-[30px] px-3.5 bg-[#f1f3f6] border-b border-[#d6dce5] flex items-center justify-between">
                            <div className="text-[10.5px] font-black text-[#374151] capitalize">
                              {new Intl.DateTimeFormat('tr-TR', { weekday: 'long' }).format(group.day)}
                            </div>
                            <div className="text-[10px] font-black text-[#374151]">
                              {formatMenuCalendarWeekHeader(group.day)}
                            </div>
                          </div>

                          {group.tasks.map((task) => (
                            <button
                              key={`list-task-${group.day.toISOString()}-${task.projectName}-${task.id}`}
                              type="button"
                              onClick={() => openMenuCalendarTask(task)}
                              className="w-full min-h-[38px] grid grid-cols-[64px_1fr] items-center bg-white border-b border-[#edf0f4] border-l-[3px] text-left hover:bg-[#f8fafc] transition-all"
                            >
                              <div className="px-3 text-[10px] font-black text-slate-600">
                                {formatMenuCalendarTaskTime(task) || ' '}
                              </div>
                              <div className="min-w-0 text-[10px] font-black text-current truncate">
                                <span className="inline-block w-2 h-2 rounded-full mr-2 shadow-[0_0_0_2px_rgba(15,23,42,0.04)]" style={getPremiumCalendarDotStyle(task)} />
                                {task.title}
                              </div>
                            </button>
                          ))}
                        </div>
                      ))
                    ) : (
                      <div className="h-[240px] flex items-center justify-center text-[11px] font-bold text-[#9aa3b1]">
                        Bu aralıkta planlı görev yok.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
  );
}
