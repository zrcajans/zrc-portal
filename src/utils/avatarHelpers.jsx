export const createAvatarFromName = (name) => {
  const cleanName = String(name || '').trim();

  if (!cleanName) return 'K';

  return cleanName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase('tr-TR'))
    .join('');
};

export const isImageAvatar = (avatar = '') => {
  const cleanAvatar = String(avatar || '').trim();
  const lowerAvatar = cleanAvatar.toLocaleLowerCase('tr-TR');

  return (
    lowerAvatar.startsWith('data:image') ||
    lowerAvatar.startsWith('http://') ||
    lowerAvatar.startsWith('https://') ||
    lowerAvatar.startsWith('blob:') ||
    cleanAvatar.startsWith('/')
  );
};

const getAvatarCandidatesFromRecord = (record = {}) => {
  if (!record || typeof record !== 'object') return [];

  const profile = Array.isArray(record.profiles) ? record.profiles[0] : record.profiles;

  return [
    record.avatar,
    record.avatarDataUrl,
    record.avatarUrl,
    record.photoUrl,
    record.imageUrl,
    record.profileImageUrl,
    record.profilePhotoUrl,
    record.avatar_url,
    record.photo_url,
    record.image_url,
    record.profile_image_url,
    record.profile_photo_url,
    record.picture,
    profile?.avatar,
    profile?.avatarDataUrl,
    profile?.avatarUrl,
    profile?.avatar_url,
    profile?.photoUrl,
    profile?.photo_url,
    profile?.imageUrl,
    profile?.image_url,
    profile?.picture
  ];
};

export const getAvatarCandidate = (...sources) => {
  const candidates = sources
    .flatMap((source) => {
      if (Array.isArray(source)) return source;
      if (source && typeof source === 'object') return getAvatarCandidatesFromRecord(source);
      return [source];
    })
    .map((value) => String(value || '').trim())
    .filter(Boolean);

  return (
    candidates.find(isImageAvatar) ||
    candidates.find((value) => value.length <= 4 && !value.includes('/')) ||
    candidates[0] ||
    ''
  );
};

export const renderProfileAvatar = (avatar, fallback = 'ZRC') => {
    const cleanAvatar = getAvatarCandidate(avatar);
    const cleanFallback = String(fallback || 'ZRC').trim();
    const safeTextAvatar =
      cleanAvatar && cleanAvatar.length <= 4 && !cleanAvatar.includes('/')
        ? cleanAvatar
        : cleanFallback;

    if (isImageAvatar(cleanAvatar)) {
      return (
        <>
          <img
            src={cleanAvatar}
            alt="Profil"
            className="w-full h-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
              event.currentTarget.nextElementSibling?.removeAttribute('hidden');
            }}
          />
          <span hidden>{safeTextAvatar || 'ZRC'}</span>
        </>
      );
    }

    return <span>{safeTextAvatar || 'ZRC'}</span>;
  };
