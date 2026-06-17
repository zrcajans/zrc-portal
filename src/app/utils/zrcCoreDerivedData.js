export const buildZrcReportTimelineData = ({
  visibleBoardColumns = [],
  visibleArchivedTasks = [],
  projectFiles = [],
  currentAccountType,
  canCreateTaskInSelectedProject,
  selectedProject,
  todayStart,
  weekEndDate,
  parseTaskDateValue,
  getReportTaskDate,
  getReportPercentage,
  isReportTaskCompleted,
  isSameCalendarDay,
  getProjectNameForTask
}) => {
  const reportTasks = visibleBoardColumns.flatMap((column) =>
    column.tasks.map((task) => ({
      ...task,
      columnTitle: column.title,
      columnColor: column.color
    }))
  );






  const reportTotalTasks = reportTasks.length;
  const reportCompletedTasks = reportTasks.filter(isReportTaskCompleted).length;
  const reportOpenTasks = Math.max(reportTotalTasks - reportCompletedTasks, 0);
  const reportArchivedCount = visibleArchivedTasks.length;
  const reportProgressPercentage = getReportPercentage(reportCompletedTasks, reportTotalTasks);
  const reportOverdueTasks = reportTasks.filter((task) => {
    const taskDate = getReportTaskDate(task);
    return taskDate && taskDate < todayStart && !isReportTaskCompleted(task);
  });
  const reportUrgentTasks = reportTasks.filter((task) => task.priority === 'Acil' || task.priority === 'Yüksek');
  const reportFileCount = projectFiles.length;
  const reportCustomerCount = new Set(reportTasks.map((task) => task.customer).filter(Boolean)).size;

  const getRoleAwareTaskMeta = (task = {}) => {
    const statusText = task.columnTitle || task.status || 'Durum yok';

    if (currentAccountType === 'Patron') {
      return `${task.customer || '-'} · ${statusText}`;
    }

    return `${getProjectNameForTask(task) || selectedProject || 'Proje'} · ${statusText}`;
  };

  const scheduleSearchPlaceholder =
    currentAccountType === 'Patron'
      ? 'Kullanıcı veya görev ara...'
      : 'Görev veya durum ara...';

  const ganttSearchPlaceholder =
    currentAccountType === 'Patron'
      ? 'Görev, müşteri veya kolon ara...'
      : 'Görev veya kolon ara...';

  const reportIntroText =
    currentAccountType === 'Patron'
      ? 'Projenin görev, öncelik, tarih ve kolon durumunu hızlıca incele.'
      : 'Erişimin olan görevlerin tarih, öncelik ve durum özetini incele.';

  const calendarDayHelperText =
    canCreateTaskInSelectedProject
      ? 'Boş alana basınca bu güne görev eklenir.'
      : 'Bu günün görünür görevleri aşağıda listelenir.';

  const reportPriorityTitle =
    currentAccountType === 'Müşteri' ? 'Durum Önceliği' : 'Öncelik Dağılımı';

  const reportPriorityDescription =
    currentAccountType === 'Müşteri'
      ? 'Size açık görevlerin öncelik görünümü.'
      : 'Görevlerin öncelik yoğunluğu.';

  const reportPriorityStats = ['Acil', 'Yüksek', 'Normal', 'Düşük'].map((priority) => {
    const count = reportTasks.filter((task) => task.priority === priority).length;

    return {
      priority,
      count,
      percentage: getReportPercentage(count, reportTotalTasks)
    };
  });

  const reportColumnStats = visibleBoardColumns.map((column) => ({
    id: column.id,
    title: column.title,
    color: column.color,
    count: column.tasks.length,
    percentage: getReportPercentage(column.tasks.length, reportTotalTasks)
  }));

  const reportUpcomingTasks = reportTasks
    .map((task) => ({
      ...task,
      reportDate: getReportTaskDate(task)
    }))
    .filter((task) => task.reportDate && task.reportDate >= todayStart && !isReportTaskCompleted(task))
    .sort((firstTask, secondTask) => firstTask.reportDate.getTime() - secondTask.reportDate.getTime())
    .slice(0, 5);


  const reportSummaryCards = [
    {
      title: 'Toplam Görev',
      value: reportTotalTasks,
      description: 'Aktif görev havuzu',
      tone: 'bg-zinc-100 text-zinc-700'
    },
    {
      title: 'Tamamlanan',
      value: reportCompletedTasks,
      description: `${reportProgressPercentage}% ilerleme`,
      tone: 'bg-emerald-50 text-emerald-600'
    },
    {
      title: 'Geciken',
      value: reportOverdueTasks.length,
      description: 'Bitiş tarihi geçmiş',
      tone: 'bg-red-50 text-red-600'
    },
    {
      title: 'Arşiv',
      value: reportArchivedCount,
      description: 'Arşivlenmiş görev',
      tone: 'bg-zinc-100 text-zinc-600'
    }
  ];

  const timelineTasks = reportTasks
    .map((task) => {
      const startDate = parseTaskDateValue(task.startDate || task.start || task.baslangicTarihi);
      const endDate = parseTaskDateValue(task.endDate || task.dueDate || task.deadline || task.bitisTarihi || task.date);
      const timelineDate = endDate || startDate;

      return {
        ...task,
        timelineStartDate: startDate,
        timelineEndDate: endDate,
        timelineDate
      };
    })
    .filter((task) => task.timelineDate)
    .sort((firstTask, secondTask) => firstTask.timelineDate.getTime() - secondTask.timelineDate.getTime());

  const timelineUndatedTasks = reportTasks.filter((task) => {
    const startDate = parseTaskDateValue(task.startDate || task.start || task.baslangicTarihi);
    const endDate = parseTaskDateValue(task.endDate || task.dueDate || task.deadline || task.bitisTarihi || task.date);

    return !startDate && !endDate;
  });

  const timelineOverdueTasks = timelineTasks.filter(
    (task) => task.timelineEndDate && task.timelineEndDate < todayStart && !isReportTaskCompleted(task)
  );

  const timelineThisWeekTasks = timelineTasks.filter((task) => {
    const date = task.timelineDate;
    return date && date >= todayStart && date <= weekEndDate;
  });

  const timelineGroupedTasks = timelineTasks.reduce((groups, task) => {
    const monthKey = new Intl.DateTimeFormat('tr-TR', {
      month: 'long',
      year: 'numeric'
    }).format(task.timelineDate);

    if (!groups[monthKey]) groups[monthKey] = [];
    groups[monthKey].push(task);

    return groups;
  }, {});

  const timelineSummaryCards = [
    {
      title: 'Tarihli Görev',
      value: timelineTasks.length,
      description: 'Takvime bağlı işler'
    },
    {
      title: 'Bu Hafta',
      value: timelineThisWeekTasks.length,
      description: 'Yaklaşan işler'
    },
    {
      title: 'Geciken',
      value: timelineOverdueTasks.length,
      description: 'Kontrol gerekenler'
    },
    {
      title: 'Tarihsiz',
      value: timelineUndatedTasks.length,
      description: 'Planlanmamış işler'
    }
  ];

  const getTimelineStatusText = (task) => {
    if (isReportTaskCompleted(task)) return 'Tamamlandı';
    if (task.timelineEndDate && task.timelineEndDate < todayStart) return 'Gecikti';
    if (task.timelineDate && isSameCalendarDay(task.timelineDate, todayStart)) return 'Bugün';

    return task.status || 'Aktif';
  };

  const getTimelineStatusStyle = (task) => {
    if (isReportTaskCompleted(task)) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    if (task.timelineEndDate && task.timelineEndDate < todayStart) return 'bg-red-50 text-red-600 border-red-100';
    if (task.timelineDate && isSameCalendarDay(task.timelineDate, todayStart)) return 'bg-zinc-100 text-zinc-700 border-blue-100';

    return 'bg-zinc-50 text-zinc-500 border-zinc-100';
  };

  return {
    reportTasks,
    reportTotalTasks,
    reportCompletedTasks,
    reportOpenTasks,
    reportArchivedCount,
    reportProgressPercentage,
    reportOverdueTasks,
    reportUrgentTasks,
    reportFileCount,
    reportCustomerCount,
    getRoleAwareTaskMeta,
    scheduleSearchPlaceholder,
    ganttSearchPlaceholder,
    reportIntroText,
    calendarDayHelperText,
    reportPriorityTitle,
    reportPriorityDescription,
    reportPriorityStats,
    reportColumnStats,
    reportUpcomingTasks,
    reportSummaryCards,
    timelineTasks,
    timelineUndatedTasks,
    timelineOverdueTasks,
    timelineThisWeekTasks,
    timelineGroupedTasks,
    timelineSummaryCards,
    getTimelineStatusText,
    getTimelineStatusStyle
  };
};

export const buildZrcTimeChartData = ({
  timeChartView,
  timeChartStartDate,
  timeChartSettings,
  projectSettings,
  selectedProject,
  currentProfileAvatar,
  teamMembers = [],
  archivedTasks = [],
  reportTasks = [],
  timeChartFilters,
  timeChartSearch,
  currentAccountType,
  currentRoleMember,
  currentActorId,
  getTimeChartDateKey,
  getStartOfWeekForTimeChart,
  formatCalendarWeekday,
  formatCalendarDate,
  normalizeTeamRole,
  createAvatarFromName,
  isTaskVisibleInCalendarForCurrentUser,
  getTimeChartTaskDate,
  doesTimeChartTaskOverlapPeriod,
  isReportTaskCompleted
}) => {
  const timeChartPeriods = Array.from(
    { length: timeChartView === 'Gün' ? 14 : 8 },
    (_, index) => {
      if (timeChartView === 'Gün') {
        const day = new Date(timeChartStartDate);
        day.setDate(timeChartStartDate.getDate() + index);

        return {
          key: getTimeChartDateKey(day),
          type: 'day',
          start: new Date(day.getFullYear(), day.getMonth(), day.getDate()),
          end: new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59, 999),
          title: String(day.getDate()),
          subtitle: formatCalendarWeekday(day),
          date: day
        };
      }

      const weekStart = getStartOfWeekForTimeChart(timeChartStartDate);
      weekStart.setDate(weekStart.getDate() + index * 7);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      return {
        key: getTimeChartDateKey(weekStart),
        type: 'week',
        start: weekStart,
        end: weekEnd,
        title: `${formatCalendarDate(weekStart)} - ${formatCalendarDate(weekEnd)}`,
        subtitle: 'Hafta',
        date: weekStart
      };
    }
  ).filter((period) => timeChartSettings.showWeekends || period.type === 'week' || (period.date.getDay() !== 0 && period.date.getDay() !== 6));

  const timeChartEndDate = timeChartPeriods[timeChartPeriods.length - 1]?.end || timeChartStartDate;

  const timeChartRangeTitle = timeChartView === 'Gün'
    ? `${formatCalendarDate(timeChartPeriods[0]?.start || timeChartStartDate)} - ${formatCalendarDate(timeChartEndDate)}`
    : `${formatCalendarDate(timeChartPeriods[0]?.start || timeChartStartDate)} - ${formatCalendarDate(timeChartEndDate)}`;

  const timeChartProjectMemberIds = Array.isArray(projectSettings[selectedProject]?.teamMemberIds)
    ? projectSettings[selectedProject].teamMemberIds
    : [];

  const isHiddenTimeChartMember = (member = {}) => {
    const normalize = (value = '') =>
      String(value || '')
        .trim()
        .toLocaleLowerCase('tr-TR')
        .replaceAll('ı', 'i')
        .replaceAll('ğ', 'g')
        .replaceAll('ü', 'u')
        .replaceAll('ş', 's')
        .replaceAll('ö', 'o')
        .replaceAll('ç', 'c')
        .replace(/[^a-z0-9@._-]/g, '');

    const id = String(member.id || '');
    const username = normalize(member.username || '');
    const name = normalize(member.name || '');
    const email = normalize(member.email || '');

    return (
      ['user-2', 'user-3', 'user-4', 'user-5'].includes(id) ||
      ['enes', 'ahmet', 'zeynep', 'can', 'misafir'].includes(username) ||
      ['eneszaric', 'ahmetyilmaz', 'zeynepkaya', 'canoz', 'demomisafir'].includes(name) ||
      ['enes@zrcajans.com', 'enszrc@gmail.com', 'ahmet@zrcajans.com', 'zeynep@zrcajans.com', 'can@zrcajans.com', 'misafir@orneksirket.com'].includes(email)
    );
  };

  const zrcAjansTimelineMember = {
    id: 'user-1',
    name: 'ZRC AJANS',
    username: 'zrcajans',
    email: 'info@zrcajans.com',
    avatar: currentProfileAvatar || 'ZRC',
    role: 'Yönetici',
    status: 'Aktif'
  };

  const timeChartAssignableMembers = Array.from(
    new Map(
      [
        ...teamMembers
          .filter((member) => member.status !== 'Pasif')
          .filter((member) => normalizeTeamRole(member.role) !== 'Müşteri/Misafir')
          .filter((member) => !isHiddenTimeChartMember(member)),
        zrcAjansTimelineMember
      ]
        .filter((member) => member?.id)
        .map((member) => [
          String(member.id),
          {
            id: member.id,
            name: member.name,
            avatar: member.avatar || createAvatarFromName(member.name),
            role: normalizeTeamRole(member.role || 'Yönetici')
          }
        ])
    ).values()
  );

  const timeChartProjectMembers = timeChartProjectMemberIds.length > 0
    ? timeChartAssignableMembers.filter((member) => timeChartProjectMemberIds.includes(member.id))
    : timeChartAssignableMembers;
  const timeChartMembers = timeChartProjectMembers.length > 0 ? timeChartProjectMembers : timeChartAssignableMembers;

  const getTimeChartTaskOwnerId = (task = {}) => {
    const assignedPerson = Array.isArray(task.assignees)
      ? task.assignees.find((person) => person?.id && timeChartMembers.some((member) => member.id === person.id))
      : null;

    return assignedPerson?.id || currentRoleMember?.id || currentActorId;
  };













  const isTimeChartTaskInRange = (task) => {
    return timeChartPeriods.some((period) => doesTimeChartTaskOverlapPeriod(task, period));
  };

  const timeChartAllTasks = [
    ...reportTasks
      .filter((task) => isTaskVisibleInCalendarForCurrentUser(task, selectedProject))
      .map((task) => ({
        ...task,
        isArchivedTimeChartTask: false,
        ownerId: getTimeChartTaskOwnerId(task)
      })),
    ...(timeChartFilters.hideArchived
      ? []
      : archivedTasks
          .filter((task) => isTaskVisibleInCalendarForCurrentUser(task, selectedProject))
          .map((task) => ({
            ...task,
            columnTitle: task.sourceColumnTitle || 'Arşiv',
            columnColor: '#94a3b8',
            isArchivedTimeChartTask: true,
            ownerId: getTimeChartTaskOwnerId(task)
          })))
  ];

  const timeChartFilteredTasks = timeChartAllTasks
    .filter((task) => !timeChartFilters.hideCompleted || !isReportTaskCompleted(task))
    .filter((task) => !timeChartFilters.hideNoDate || Boolean(getTimeChartTaskDate(task)))
    .filter((task) => {
      const searchText = timeChartSearch.trim().toLocaleLowerCase('tr-TR');
      if (!searchText) return true;

      return [
        task.title,
        currentAccountType === 'Patron' ? task.customer : null,
        task.columnTitle,
        task.priority,
        task.status
      ]
        .filter(Boolean)
        .some((value) => String(value).toLocaleLowerCase('tr-TR').includes(searchText));
    })
    .filter(isTimeChartTaskInRange);

  const getTimeChartTasksForMemberAndPeriod = (memberId, period) => {
    return timeChartFilteredTasks.filter((task) => {
      return task.ownerId === memberId && doesTimeChartTaskOverlapPeriod(task, period);
    });
  };

  return {
    timeChartPeriods,
    timeChartEndDate,
    timeChartRangeTitle,
    timeChartProjectMemberIds,
    timeChartAssignableMembers,
    timeChartProjectMembers,
    timeChartMembers,
    getTimeChartTaskOwnerId,
    isTimeChartTaskInRange,
    timeChartAllTasks,
    timeChartFilteredTasks,
    getTimeChartTasksForMemberAndPeriod
  };
};

export const buildZrcGanttData = ({
  ganttView,
  ganttStartDate,
  ganttShowCompleted,
  ganttSearch,
  currentAccountType,
  selectedProject,
  todayStart,
  reportTasks = [],
  formatDateForTaskModal,
  formatCalendarDate,
  formatCalendarWeekday,
  getGanttTaskStartDate,
  getGanttTaskEndDate,
  isTaskVisibleInCalendarForCurrentUser,
  isReportTaskCompleted
}) => {
  const getGanttPeriodConfig = () => {
    if (ganttView === 'Ay') return { count: 6, width: 170 };
    if (ganttView === 'Hafta') return { count: 10, width: 180 };

    return { count: 21, width: 126 };
  };

  const getGanttPeriodStart = (date) => {
    if (ganttView === 'Ay') {
      return new Date(date.getFullYear(), date.getMonth(), 1);
    }

    if (ganttView === 'Hafta') {
      const weekStart = new Date(date);
      const offset = (weekStart.getDay() + 6) % 7;
      weekStart.setDate(weekStart.getDate() - offset);
      weekStart.setHours(0, 0, 0, 0);
      return weekStart;
    }

    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const getGanttPeriods = () => {
    const { count } = getGanttPeriodConfig();
    const startDate = getGanttPeriodStart(ganttStartDate);

    return Array.from({ length: count }, (_, index) => {
      const periodStart = new Date(startDate);

      if (ganttView === 'Ay') {
        periodStart.setMonth(startDate.getMonth() + index);
        const periodEnd = new Date(periodStart.getFullYear(), periodStart.getMonth() + 1, 0, 23, 59, 59, 999);

        return {
          key: formatDateForTaskModal(periodStart),
          start: periodStart,
          end: periodEnd,
          title: new Intl.DateTimeFormat('tr-TR', { month: 'short' }).format(periodStart),
          subtitle: String(periodStart.getFullYear())
        };
      }

      if (ganttView === 'Hafta') {
        periodStart.setDate(startDate.getDate() + index * 7);
        const periodEnd = new Date(periodStart);
        periodEnd.setDate(periodStart.getDate() + 6);
        periodEnd.setHours(23, 59, 59, 999);

        return {
          key: formatDateForTaskModal(periodStart),
          start: periodStart,
          end: periodEnd,
          title: `${formatCalendarDate(periodStart)} - ${formatCalendarDate(periodEnd)}`,
          subtitle: 'Hafta'
        };
      }

      periodStart.setDate(startDate.getDate() + index);
      const periodEnd = new Date(periodStart.getFullYear(), periodStart.getMonth(), periodStart.getDate(), 23, 59, 59, 999);

      return {
        key: formatDateForTaskModal(periodStart),
        start: periodStart,
        end: periodEnd,
        title: String(periodStart.getDate()),
        subtitle: formatCalendarWeekday(periodStart)
      };
    });
  };

  const ganttPeriods = getGanttPeriods();
  const ganttPeriodConfig = getGanttPeriodConfig();
  const ganttRangeStart = ganttPeriods[0]?.start || ganttStartDate;
  const ganttRangeEnd = ganttPeriods[ganttPeriods.length - 1]?.end || ganttStartDate;
  const ganttRangeTitle = `${formatCalendarDate(ganttRangeStart)} - ${formatCalendarDate(ganttRangeEnd)}`;





  const doesGanttTaskOverlapRange = (task) => {
    const startDate = task.ganttStartDate;
    const endDate = task.ganttEndDate;

    if (!startDate || !endDate) return false;

    return startDate <= ganttRangeEnd && endDate >= ganttRangeStart;
  };

  const ganttAllTasks = reportTasks
    .filter((task) => isTaskVisibleInCalendarForCurrentUser(task, selectedProject))
    .map((task) => {
      const startDate = getGanttTaskStartDate(task);
      const endDate = getGanttTaskEndDate(task);

      return {
        ...task,
        ganttStartDate: startDate,
        ganttEndDate: endDate
      };
    });

  const ganttTasks = ganttAllTasks
    .filter((task) => task.ganttStartDate || task.ganttEndDate)
    .filter((task) => ganttShowCompleted || !isReportTaskCompleted(task))
    .filter((task) => {
      const searchText = ganttSearch.trim().toLocaleLowerCase('tr-TR');
      if (!searchText) return true;

      return [task.title, currentAccountType === 'Patron' ? task.customer : null, task.columnTitle, task.priority, task.status]
        .filter(Boolean)
        .some((value) => String(value).toLocaleLowerCase('tr-TR').includes(searchText));
    })
    .filter(doesGanttTaskOverlapRange)
    .sort((firstTask, secondTask) => {
      const firstTime = firstTask.ganttStartDate?.getTime() || Number.MAX_SAFE_INTEGER;
      const secondTime = secondTask.ganttStartDate?.getTime() || Number.MAX_SAFE_INTEGER;

      return firstTime - secondTime;
    });

  const ganttUndatedTasks = ganttAllTasks
    .filter((task) => !task.ganttStartDate && !task.ganttEndDate)
    .filter((task) => {
      const searchText = ganttSearch.trim().toLocaleLowerCase('tr-TR');
      if (!searchText) return true;

      return [task.title, currentAccountType === 'Patron' ? task.customer : null, task.columnTitle, task.priority, task.status]
        .filter(Boolean)
        .some((value) => String(value).toLocaleLowerCase('tr-TR').includes(searchText));
    });

  const getGanttTaskPlacement = (task) => {
    const firstIndex = ganttPeriods.findIndex((period) => task.ganttEndDate >= period.start && task.ganttStartDate <= period.end);
    const reversedIndex = [...ganttPeriods]
      .reverse()
      .findIndex((period) => task.ganttEndDate >= period.start && task.ganttStartDate <= period.end);

    if (firstIndex < 0 || reversedIndex < 0) {
      return { columnStart: 1, span: 1 };
    }

    const lastIndex = ganttPeriods.length - 1 - reversedIndex;

    return {
      columnStart: firstIndex + 1,
      span: Math.max(lastIndex - firstIndex + 1, 1)
    };
  };

  const getGanttBarClassName = (task) => {
    if (isReportTaskCompleted(task)) return 'bg-emerald-100 text-emerald-700 border-emerald-200 opacity-70';
    if (task.ganttEndDate && task.ganttEndDate < todayStart) return 'bg-red-100 text-red-700 border-red-200';
    if (task.priority === 'Acil') return 'bg-red-100 text-red-700 border-red-200';
    if (task.priority === 'Yüksek') return 'bg-zinc-900 text-white border-zinc-900';
    if (task.priority === 'Düşük') return 'bg-emerald-100 text-emerald-700 border-emerald-200';

    return 'bg-zinc-900 text-white border-zinc-900';
  };

  return {
    ganttPeriods,
    ganttPeriodConfig,
    ganttRangeStart,
    ganttRangeEnd,
    ganttRangeTitle,
    ganttAllTasks,
    ganttTasks,
    ganttUndatedTasks,
    getGanttTaskPlacement,
    getGanttBarClassName
  };
};

export const buildZrcNotificationData = ({
  activityNotifications = [],
  reportTasks = [],
  readNotificationIds = [],
  currentAccountType,
  selectedProject,
  todayStart,
  weekEndDate,
  getActivityDateLabel,
  getNotificationTaskDate,
  getNotificationDateLabel,
  getProjectNameForNotification,
  isProjectVisibleForCurrentUser,
  isTaskAccessibleForCurrentUser,
  isChatGroupIdVisibleForCurrentUser,
  isRecordLinkedToCurrentUser,
  isReportTaskCompleted,
  isSameCalendarDay
}) => {
  const isNotificationVisibleForCurrentUser = (notification = {}) => {
    if (currentAccountType === 'Patron') return true;

    const notificationProjectName = getProjectNameForNotification(notification);

    if (notificationProjectName && !isProjectVisibleForCurrentUser(notificationProjectName)) return false;
    if (notification.task && !isTaskAccessibleForCurrentUser(notification.task)) return false;
    if (notification.chatGroupId && !isChatGroupIdVisibleForCurrentUser(notification.chatGroupId)) return false;

    if (
      notification.source === 'activity' &&
      !notification.task &&
      !notification.projectName &&
      !notification.chatGroupId
    ) {
      return isRecordLinkedToCurrentUser(notification);
    }

    return true;
  };

  const notificationItems = [
    ...activityNotifications.map((notification) => ({
      ...notification,
      task: notification.task || null,
      dateLabel: notification.dateLabel || getActivityDateLabel(notification.createdAt),
      sortWeight: notification.sortWeight || 720
    })),
    ...reportTasks.flatMap((task) => {
      const taskDate = getNotificationTaskDate(task);
      const items = [];

      if (taskDate && taskDate < todayStart && !isReportTaskCompleted(task)) {
        items.push({
          id: `overdue-${task.id}`,
          source: 'calendar',
          type: 'overdue',
          title: 'Geciken görev',
          text: task.title,
          meta: `${task.columnTitle} · ${getNotificationDateLabel(taskDate)}`,
          dateLabel: getNotificationDateLabel(taskDate),
          sortWeight: 500,
          task,
          projectName: selectedProject,
          columnTitle: task.columnTitle
        });
      }

      if (taskDate && isSameCalendarDay(taskDate, todayStart)) {
        items.push({
          id: `today-${task.id}`,
          source: 'calendar',
          type: 'today',
          title: 'Bugünün görevi',
          text: task.title,
          meta: `${task.columnTitle} · Bugün`,
          dateLabel: 'Bugün',
          sortWeight: 420,
          task,
          projectName: selectedProject,
          columnTitle: task.columnTitle
        });
      }

      if (taskDate && taskDate > todayStart && taskDate <= weekEndDate && !isReportTaskCompleted(task)) {
        items.push({
          id: `soon-${task.id}`,
          source: 'calendar',
          type: 'soon',
          title: 'Yaklaşan görev',
          text: task.title,
          meta: `${task.columnTitle} · ${getNotificationDateLabel(taskDate)}`,
          dateLabel: getNotificationDateLabel(taskDate),
          sortWeight: 360,
          task,
          projectName: selectedProject,
          columnTitle: task.columnTitle
        });
      }

      return items;
    })
  ]
    .filter(isNotificationVisibleForCurrentUser)
    .filter((item, index, self) => self.findIndex((existingItem) => existingItem.id === item.id) === index)
    .sort((firstItem, secondItem) => {
      const firstDate = firstItem.createdAt ? new Date(firstItem.createdAt).getTime() : 0;
      const secondDate = secondItem.createdAt ? new Date(secondItem.createdAt).getTime() : 0;

      if (firstDate !== secondDate) return secondDate - firstDate;

      return (secondItem.sortWeight || 0) - (firstItem.sortWeight || 0);
    })
    .slice(0, 32);

  const unreadNotificationCount = notificationItems.filter((item) => !readNotificationIds.includes(item.id)).length;

  const notificationEmptyDescription =
    currentAccountType === 'Patron'
      ? 'Yeni görev, ekip, müşteri ve proje hareketleri burada görünür.'
      : currentAccountType === 'Müşteri'
        ? 'Size açık projelerdeki yeni yorum, dosya ve durum hareketleri burada görünür.'
        : 'Dahil olduğun projelerdeki yeni görev, yorum ve mesaj hareketleri burada görünür.';

  const notificationPanelSummary =
    unreadNotificationCount > 0
      ? `${unreadNotificationCount} okunmamış bildirim`
      : currentAccountType === 'Patron'
        ? 'Tüm bildirimler okundu'
        : 'Size ait yeni bildirim yok';

  return {
    isNotificationVisibleForCurrentUser,
    notificationItems,
    unreadNotificationCount,
    notificationEmptyDescription,
    notificationPanelSummary
  };
};

export const buildZrcMessageData = ({
  reportTasks = [],
  projectMessages = [],
  readMessageIds = [],
  messageLinkedTaskId,
  currentAccountType,
  selectedProject,
  currentActorName,
  currentProfileInitials,
  getProjectNameForMessage,
  getProjectNameForTask,
  isProjectVisibleForCurrentUser,
  isTaskAccessibleForCurrentUser,
  isChatGroupIdVisibleForCurrentUser,
  isRecordLinkedToCurrentUser,
  getProfileNameForRecord,
  getProfileAvatarForRecord,
  isReportTaskCompleted
}) => {
  const getProjectMessageDateLabel = (createdAt) => {
    if (!createdAt) return 'Şimdi';

    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return createdAt;

    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getMessageLinkedTask = (taskId) => {
    if (!taskId) return null;
    return reportTasks.find((task) => task.id === taskId) || null;
  };

  const isProjectMessageVisibleForCurrentUser = (message = {}) => {
    if (currentAccountType === 'Patron') return true;

    const messageProjectName = getProjectNameForMessage(message);

    if (messageProjectName && !isProjectVisibleForCurrentUser(messageProjectName)) return false;

    if (message.taskId) {
      const linkedTask = getMessageLinkedTask(message.taskId);
      return Boolean(linkedTask && isTaskAccessibleForCurrentUser(linkedTask));
    }

    if (message.chatGroupId) {
      return isChatGroupIdVisibleForCurrentUser(message.chatGroupId);
    }

    return isRecordLinkedToCurrentUser(message);
  };

  const messageTaskOptions = reportTasks
    .filter((task) => !isReportTaskCompleted(task))
    .filter(isTaskAccessibleForCurrentUser)
    .slice(0, 24);

  const selectedMessageTask = getMessageLinkedTask(messageLinkedTaskId);

  const messageItems = [
    ...projectMessages.filter(isProjectMessageVisibleForCurrentUser).map((message) => {
      const linkedTask = getMessageLinkedTask(message.taskId);

      return {
        ...message,
        source: 'message',
        sender: getProfileNameForRecord(message, message.sender || currentActorName),
        avatar: getProfileAvatarForRecord(message, message.avatar || currentProfileInitials),
        title: getProfileNameForRecord(message, message.sender || currentActorName),
        text: message.text || '',
        meta: linkedTask ? linkedTask.title : 'Genel proje mesajı',
        task: linkedTask,
        projectName: getProjectNameForMessage(message) || getProjectNameForTask(linkedTask),
        columnTitle: linkedTask?.columnTitle,
        createdAt: message.createdAt || '',
        sortDate: message.createdAt ? new Date(message.createdAt).getTime() : 0
      };
    }),
    ...reportTasks.flatMap((task) =>
      (task.comments || []).slice(-2).map((comment) => ({
        id: `task-comment-message-${task.id}-${comment.id || comment.date || comment.text}`,
        source: 'comment',
        sender: getProfileNameForRecord(comment, 'Ekip'),
        avatar: getProfileAvatarForRecord(comment, 'EK'),
        title: getProfileNameForRecord(comment, 'Ekip'),
        text: comment.text || comment.message || 'Yorum eklendi',
        meta: task.title,
        task,
        projectName: selectedProject,
        columnTitle: task.columnTitle,
        createdAt: comment.createdAt || comment.date || '',
        sortDate: comment.createdAt ? new Date(comment.createdAt).getTime() : 0
      }))
    )
  ]
    .filter((message, index, self) => self.findIndex((item) => item.id === message.id) === index)
    .sort((firstMessage, secondMessage) => secondMessage.sortDate - firstMessage.sortDate)
    .slice(0, 28);

  const unreadMessageCount = messageItems.filter((message) => !readMessageIds.includes(message.id)).length;

  return {
    getProjectMessageDateLabel,
    getMessageLinkedTask,
    isProjectMessageVisibleForCurrentUser,
    messageTaskOptions,
    selectedMessageTask,
    messageItems,
    unreadMessageCount
  };
};

export const buildZrcGlobalSearchData = ({
  currentAccountType,
  selectedProject,
  reportTasks = [],
  projectFiles = [],
  globalSearchFilter,
  globalSearchQuery,
  formatProjectFileSize,
  getProjectNameForTask,
  getPlainTaskDescription,
  isReportTaskCompleted,
  getNotificationTaskDate,
  normalizeSearchText
}) => {
  const globalSearchPlaceholder =
    currentAccountType === 'Patron'
      ? 'Görev, dosya, müşteri, yorum veya kolon ara...'
      : currentAccountType === 'Müşteri'
        ? 'Projenizdeki görev, dosya veya yorumlarda ara...'
        : 'Dahil olduğun projelerde görev, dosya veya yorum ara...';

  const getGlobalSearchTaskSubtitle = (task = {}) =>
    currentAccountType === 'Patron'
      ? `${task.columnTitle || task.status || 'Durum yok'} · ${task.customer || 'Müşteri yok'}`
      : `${task.columnTitle || task.status || 'Durum yok'} · ${getProjectNameForTask(task) || selectedProject || 'Proje'}`;

  const getGlobalSearchFileMeta = (file = {}) =>
    currentAccountType === 'Patron'
      ? `${file.customer || '-'} · ${formatProjectFileSize(file.size)}`
      : `${file.projectName || selectedProject || 'Proje'} · ${formatProjectFileSize(file.size)}`;

  const globalSearchItems = [
    ...reportTasks.map((task) => ({
      id: `task-${task.id}`,
      type: 'Görev',
      title: task.title || 'Adsız görev',
      subtitle: getGlobalSearchTaskSubtitle(task),
      meta: `${task.priority || 'Normal'} · ${task.endDate || task.date || task.startDate || 'Tarih yok'}`,
      searchText: [
        task.title,
        task.customer,
        task.columnTitle,
        task.status,
        task.priority,
        getPlainTaskDescription(task.description),
        getPlainTaskDescription(task.richDescription),
        task.tags
      ].join(' '),
      task,
      projectName: selectedProject,
      columnTitle: task.columnTitle,
      sortWeight: isReportTaskCompleted(task) ? 120 : 260
    })),
    ...projectFiles.map((file) => ({
      id: `file-${file.fileKey}`,
      type: 'Dosya',
      title: file.name || 'Adsız dosya',
      subtitle: `${file.taskTitle || 'Görev yok'} · ${file.type || 'Dosya'}`,
      meta: getGlobalSearchFileMeta(file),
      searchText: [file.name, file.type, file.taskTitle, file.columnTitle, file.customer, file.uploader].join(' '),
      file,
      task: file.task,
      projectName: file.projectName || selectedProject,
      columnTitle: file.columnTitle,
      sortWeight: 220
    })),
    ...reportTasks.flatMap((task) =>
      (task.comments || []).map((comment) => ({
        id: `comment-${task.id}-${comment.id || comment.date || comment.text}`,
        type: 'Yorum',
        title: comment.text || comment.message || 'Yorum',
        subtitle: task.title || 'Görev',
        meta: `${comment.author || comment.user || 'Kullanıcı'} · ${comment.date || 'Tarih yok'}`,
        searchText: [comment.text, comment.message, comment.author, comment.user, task.title, task.customer, task.columnTitle].join(' '),
        task,
        projectName: selectedProject,
        columnTitle: task.columnTitle,
        sortWeight: 190
      }))
    ),
    ...reportTasks.flatMap((task) =>
      (task.files || []).flatMap((file) =>
        file.notes
          ? [
              {
                id: `file-note-${task.id}-${file.id || file.name}`,
                type: 'Not',
                title: file.notes,
                subtitle: file.name || task.title,
                meta: `${task.columnTitle || 'Kolon yok'} · Dosya notu`,
                searchText: [file.notes, file.name, task.title, task.customer, task.columnTitle].join(' '),
                task,
                projectName: selectedProject,
                columnTitle: task.columnTitle,
                sortWeight: 150
              }
            ]
          : []
      )
    )
  ];

  const globalSearchFilterOptions =
    currentAccountType === 'Müşteri'
      ? ['Tümü', 'Görev', 'Dosya', 'Yorum']
      : ['Tümü', 'Görev', 'Dosya', 'Yorum', 'Not'];

  useEffect(() => {
    if (!globalSearchFilterOptions.includes(globalSearchFilter)) {
      setGlobalSearchFilter('Tümü');
    }
  }, [globalSearchFilter, globalSearchFilterOptions.join('|')]);

  const filteredGlobalSearchItems = globalSearchItems
    .filter((item, index, self) => self.findIndex((existingItem) => existingItem.id === item.id) === index)
    .filter((item) => currentAccountType !== 'Müşteri' || item.type !== 'Not')
    .filter((item) => globalSearchFilter === 'Tümü' || item.type === globalSearchFilter)
    .filter((item) => {
      const query = normalizeSearchText(globalSearchQuery.trim());
      if (!query) return item.type === 'Görev';

      return normalizeSearchText(`${item.title} ${item.subtitle} ${item.meta} ${item.searchText}`).includes(query);
    })
    .sort((firstItem, secondItem) => {
      if (!globalSearchQuery.trim()) {
        const firstDate = getNotificationTaskDate(firstItem.task)?.getTime() || 0;
        const secondDate = getNotificationTaskDate(secondItem.task)?.getTime() || 0;

        return secondDate - firstDate;
      }

      return secondItem.sortWeight - firstItem.sortWeight;
    })
    .slice(0, globalSearchQuery.trim() ? 30 : 10);

  return {
    globalSearchPlaceholder,
    getGlobalSearchTaskSubtitle,
    getGlobalSearchFileMeta,
    globalSearchItems,
    globalSearchFilterOptions,
    filteredGlobalSearchItems
  };
};
