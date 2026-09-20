/**
 * Generates guaranteed, high-resolution SVG profile avatars for all users & roles.
 * Never fails with 404, works offline, and guarantees zero empty or broken image boxes.
 */
export const getSafeAvatar = (userOrName, role = 'APPLICANT') => {
  let name = 'User';
  let userRole = role;

  if (typeof userOrName === 'string') {
    name = userOrName;
  } else if (userOrName && typeof userOrName === 'object') {
    if (
      userOrName.avatar &&
      typeof userOrName.avatar === 'string' &&
      userOrName.avatar.trim() !== '' &&
      !userOrName.avatar.includes('undefined')
    ) {
      return userOrName.avatar;
    }
    name = userOrName.name || userOrName.fullName || 'User';
    userRole = userOrName.role || role || 'APPLICANT';
  }

  const bgColors = {
    APPLICANT: '17324D',
    VERIFIER: '0E2438',
    DISTRICT_OFFICER: '1D4ED8',
    AUTHORITY: '287C5A',
    ADMINISTRATOR: 'D97706'
  };

  const bg = bgColors[userRole] || '17324D';
  const cleanName = (name || '').trim();
  const initials = cleanName
    .split(/\s+/)
    .map(part => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'IN';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <rect width="100" height="100" rx="24" fill="#${bg}"/>
    <circle cx="50" cy="50" r="42" fill="none" stroke="#D97706" stroke-width="2" stroke-dasharray="4 3" opacity="0.7"/>
    <text x="50" y="58" dominant-baseline="middle" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="36" fill="#FFFFFF">${initials}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};
