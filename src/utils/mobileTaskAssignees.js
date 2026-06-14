export function resolveMobileTaskCardAssignees(task = {}, teamMembers = [], createAvatarFromName = (value) => value) {
  const directAssignees = Array.isArray(task.assignees) ? task.assignees : [];
  const directIds = [
    ...(Array.isArray(task.assigneeIds) ? task.assigneeIds : []),
    ...(Array.isArray(task.assignedUserIds) ? task.assignedUserIds : []),
    ...(Array.isArray(task.teamMemberIds) ? task.teamMemberIds : [])
  ];

  const findTeamMemberByKey = (key = '') => {
    const cleanKey = String(key || '').trim();

    if (!cleanKey) return null;

    return teamMembers.find((member) =>
      [
        member.id,
        member.supabaseId,
        member.userId,
        member.authUserId,
        member.profileId,
        member.email,
        member.name,
        member.username
      ]
        .map((value) => String(value || '').trim())
        .filter(Boolean)
        .includes(cleanKey)
    ) || null;
  };

  const resolvedFromIds = directIds.map(findTeamMemberByKey).filter(Boolean);

  const people = [...directAssignees, ...resolvedFromIds]
    .map((person) => {
      if (!person) return null;

      if (typeof person === 'string') {
        return findTeamMemberByKey(person);
      }

      const matchedMember =
        findTeamMemberByKey(person.id) ||
        findTeamMemberByKey(person.userId) ||
        findTeamMemberByKey(person.authUserId) ||
        findTeamMemberByKey(person.supabaseId) ||
        findTeamMemberByKey(person.profileId) ||
        findTeamMemberByKey(person.email) ||
        findTeamMemberByKey(person.name);

      return matchedMember || person;
    })
    .filter(Boolean);

  const uniquePeople = [];
  const seen = new Set();

  people.forEach((person) => {
    const key = String(person.id || person.supabaseId || person.userId || person.authUserId || person.email || person.name || '').trim();

    if (!key || seen.has(key)) return;

    seen.add(key);

    uniquePeople.push({
      ...person,
      name: person.name || person.fullName || person.displayName || person.email || 'Görevli',
      avatar:
        person.avatar ||
        person.photoUrl ||
        person.avatarUrl ||
        person.imageUrl ||
        person.profileImageUrl ||
        person.profilePhotoUrl ||
        person.photo_url ||
        person.avatar_url ||
        person.image_url ||
        person.profile_image_url ||
        person.profile_photo_url ||
        person.picture ||
        createAvatarFromName(person.name || person.fullName || person.displayName || person.email || 'Görevli')
    });
  });

  return uniquePeople;
}
