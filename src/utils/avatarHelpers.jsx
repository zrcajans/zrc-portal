import React from 'react';

export const createAvatarFromName = (name) => {
  const cleanName = String(name || '').trim();

  if (!cleanName) return 'K';

  return cleanName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase('tr-TR'))
    .join('');
};

export const renderProfileAvatar = (avatar, fallback = currentProfileInitials) => {
    const cleanAvatar = String(avatar || '').trim();
    const cleanFallback = String(fallback || currentProfileInitials || 'ZRC').trim();
    const isImageAvatar =
      cleanAvatar.startsWith('data:image') ||
      cleanAvatar.startsWith('http://') ||
      cleanAvatar.startsWith('https://') ||
      cleanAvatar.startsWith('blob:');

    if (isImageAvatar) {
      return <img src={cleanAvatar} alt="Profil" className="w-full h-full object-cover" />;
    }

    const safeTextAvatar =
      cleanAvatar && cleanAvatar.length <= 4 && !cleanAvatar.includes('/')
        ? cleanAvatar
        : cleanFallback;

    return <span>{safeTextAvatar || 'ZRC'}</span>;
  };
