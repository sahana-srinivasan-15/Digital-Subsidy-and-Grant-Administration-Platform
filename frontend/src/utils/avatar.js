/**
 * Utility functions for user initial-based profile display.
 * Generates clean, high-resolution initial avatars using ONLY the first letter
 * of the user's name (strictly NO photos, picture files, or external images).
 */

export const getInitial = (userOrName) => {
  if (!userOrName) return 'U';
  let name = userOrName;
  if (typeof userOrName === 'object') {
    name = userOrName.name || userOrName.fullName || 'User';
  }
  const clean = String(name || '').trim();
  return clean.charAt(0).toUpperCase() || 'U';
};

export const getRoleColorHex = (role = 'APPLICANT') => {
  switch (role) {
    case 'ADMINISTRATOR':
    case 'ADMIN':
      return '7C3AED';
    case 'AUTHORITY':
      return 'D97706';
    case 'DISTRICT_OFFICER':
    case 'DISTRICT':
      return '1D4ED8';
    case 'VERIFIER':
      return '287C5A';
    case 'APPLICANT':
    default:
      return '17324D';
  }
};

/**
 * Returns a guaranteed inline SVG data URI showing ONLY the first letter
 * of the user's name. Never produces photos, pictures, or external network requests.
 */
export const getSafeAvatar = (userOrName, role = 'APPLICANT') => {
  const initial = getInitial(userOrName);
  const userRole = (userOrName && typeof userOrName === 'object' && userOrName.role) ? userOrName.role : role;
  const bg = getRoleColorHex(userRole);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <rect width="100" height="100" rx="24" fill="#${bg}"/>
    <text x="50" y="58" dominant-baseline="middle" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="46" fill="#FFFFFF">${initial}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};
