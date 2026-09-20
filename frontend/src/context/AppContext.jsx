import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/api';
import { getSafeAvatar } from '../utils/avatar';
import {
  initialUsers,
  initialSchemes,
  initialApplications,
  initialNotifications,
  initialAuditLogs as defaultAuditLogs
} from '../mockData/initialData';
import {
  initialGrievances,
  initialSchemeBudgets,
  initialAuditLogs
} from '../mockData/systemData';

/**
 * Strict account-specific notification validator.
 * Ensures notifications are strictly isolated by unique user account (id, backendId, or email),
 * preventing cross-account data leakage even between users sharing the exact same role.
 */
export const isNotificationForUser = (notification, user) => {
  if (!notification || !user) return false;
  // Genuine global broadcasts are visible to all authenticated accounts
  if (notification.isGlobal) return true;

  const currentUserId = String(user.id || '');
  const currentUserEmail = (user.email || '').trim().toLowerCase();
  const currentBackendId = user.backendId ? String(user.backendId) : (user.id ? String(user.id).replace(/\D/g, '') : '');

  // 1. Direct userId match
  if (notification.userId !== undefined && notification.userId !== null) {
    const notifUserId = String(notification.userId);
    if (notifUserId === currentUserId) return true;
    if (currentBackendId && (notifUserId === currentBackendId || notifUserId === `usr-${currentBackendId}`)) return true;
  }

  // 2. Direct recipientId match
  if (notification.recipientId !== undefined && notification.recipientId !== null) {
    const notifRecipId = String(notification.recipientId);
    if (notifRecipId === currentUserId) return true;
    if (currentBackendId && (notifRecipId === currentBackendId || notifRecipId === `usr-${currentBackendId}`)) return true;
  }

  // 3. User email match
  if (notification.userEmail && currentUserEmail) {
    if (notification.userEmail.trim().toLowerCase() === currentUserEmail) return true;
  }

  return false;
};

/**
 * Checks whether a notification has been read by the specific user.
 * For personal notifications, checks the notification's read state.
 * For global broadcast notifications, verifies user's unique identifier in the readBy register
 * so reading a broadcast on User A never changes the status for User B!
 */
export const isNotificationReadForUser = (notification, user) => {
  if (!notification) return true;
  if (notification.isGlobal) {
    if (Array.isArray(notification.readBy)) {
      const currentUserId = String(user?.id || '');
      const currentUserEmail = (user?.email || '').trim().toLowerCase();
      const currentBackendId = user?.backendId ? String(user.backendId) : '';
      return notification.readBy.some(id => {
        const s = String(id).toLowerCase();
        return s === currentUserId.toLowerCase() ||
               (currentUserEmail && s === currentUserEmail) ||
               (currentBackendId && (s === currentBackendId || s === `usr-${currentBackendId}`));
      });
    }
    return Boolean(notification.read);
  }
  return Boolean(notification.read);
};

/**
 * Deduplicates user lists by unique email, unique ID, and role-identity,
 * preventing duplicate accounts from ever appearing in the User & RBAC directory.
 */
export const deduplicateUsers = (userList) => {
  if (!Array.isArray(userList)) return [];

  const legacyEmailMap = {
    'verifier@gov.in': 'sahana@gmail.com',
    'authority@gov.in': 'mayur@gmail.com',
    'admin@gov.in': 'sachin@gmail.com'
  };

  // Sort so canonical accounts take precedence over legacy aliases
  const sorted = [...userList].sort((a, b) => {
    const aIsLegacy = a?.id?.includes('legacy') || Boolean(legacyEmailMap[a?.email?.toLowerCase()]);
    const bIsLegacy = b?.id?.includes('legacy') || Boolean(legacyEmailMap[b?.email?.toLowerCase()]);
    if (aIsLegacy && !bIsLegacy) return 1;
    if (!aIsLegacy && bIsLegacy) return -1;
    return 0;
  });

  const seenEmails = new Set();
  const seenIds = new Set();
  const seenNameRoles = new Set();
  const result = [];

  for (const u of sorted) {
    if (!u) continue;
    const cleanEmail = (u.email || '').trim().toLowerCase();
    const cleanId = String(u.id || '').trim();
    const cleanName = (u.name || '').trim().toLowerCase();
    const cleanRole = (u.role || '').trim().toUpperCase();
    const nameRoleKey = `${cleanName}::${cleanRole}`;

    // If this is a legacy duplicate email and canonical counterpart exists in list or was seen, skip
    if (legacyEmailMap[cleanEmail]) {
      const canonical = legacyEmailMap[cleanEmail];
      const hasCanonical = sorted.some(s => (s?.email || '').trim().toLowerCase() === canonical);
      if (hasCanonical || seenEmails.has(canonical)) {
        continue;
      }
    }

    if (cleanEmail && seenEmails.has(cleanEmail)) continue;
    if (cleanId && seenIds.has(cleanId)) continue;
    if (cleanName && cleanRole && seenNameRoles.has(nameRoleKey)) continue;

    if (cleanEmail) seenEmails.add(cleanEmail);
    if (cleanId) seenIds.add(cleanId);
    if (cleanName && cleanRole) seenNameRoles.add(nameRoleKey);

    result.push(u);
  }

  return result;
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Connection status with Spring Boot backend
  const [backendConnected, setBackendConnected] = useState(false);

  // Load initial state from localStorage or seed data, ensuring strict deduplication
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('gov_users');
    let loaded = initialUsers;
    if (saved) {
      try {
        loaded = JSON.parse(saved);
      } catch (e) {
        loaded = initialUsers;
      }
    }
    const sanitized = deduplicateUsers(loaded);
    try {
      localStorage.setItem('gov_users', JSON.stringify(sanitized));
    } catch {}
    return sanitized.map(u => ({
      ...u,
      avatar: u.avatar && !u.avatar.includes('undefined') ? u.avatar : getSafeAvatar(u.name, u.role)
    }));
  });

  const [currentRole, setCurrentRole] = useState(() => {
    const savedRole = localStorage.getItem('gov_role');
    const savedAuthUser = localStorage.getItem('dsga_auth_user');
    if (savedAuthUser) {
      try {
        const parsed = JSON.parse(savedAuthUser);
        if (parsed?.role) return parsed.role;
      } catch (e) {
        console.warn('Auth user parse notice:', e);
      }
    }
    return savedRole || 'APPLICANT';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    // 1. Check if an authenticated user session is saved in localStorage
    const savedAuthUser = localStorage.getItem('dsga_auth_user');
    if (savedAuthUser) {
      try {
        const parsed = JSON.parse(savedAuthUser);
        if (parsed && (parsed.email || parsed.name)) {
          return {
            ...parsed,
            avatar: parsed.avatar && !parsed.avatar.includes('undefined')
              ? parsed.avatar
              : getSafeAvatar(parsed.name, parsed.role || 'APPLICANT')
          };
        }
      } catch (e) {
        console.warn('Failed to parse saved auth user:', e);
      }
    }
    const role = localStorage.getItem('gov_role') || 'APPLICANT';
    const savedUsers = localStorage.getItem('gov_users');
    const pool = savedUsers ? JSON.parse(savedUsers) : initialUsers;
    const user = pool.find(u => u.role === role) || pool[0];
    return {
      ...user,
      avatar: user?.avatar && !user.avatar.includes('undefined') ? user.avatar : getSafeAvatar(user?.name, user?.role || role)
    };
  });

  const [schemes, setSchemes] = useState(() => {
    const saved = localStorage.getItem('gov_schemes');
    const loaded = saved ? JSON.parse(saved) : initialSchemes;
    return loaded.map((s, idx) => ({
      ...s,
      processingDays: s.processingDays || initialSchemes[idx % initialSchemes.length]?.processingDays || '5–8 Working Days',
      lastUpdated: s.lastUpdated || initialSchemes[idx % initialSchemes.length]?.lastUpdated || '2026-09-12'
    }));
  });

  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('gov_applications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= initialApplications.length) {
          return parsed;
        }
      } catch (e) {
        console.warn("Failed to parse saved applications, using seed data", e);
      }
    }
    return initialApplications;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('gov_notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some(n => n.userId || n.userEmail || n.isGlobal)) {
          return parsed;
        }
      } catch (e) {
        console.warn('Failed to parse saved notifications:', e);
      }
    }
    return initialNotifications;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('gov_audit_logs');
    return saved ? JSON.parse(saved) : (initialAuditLogs || defaultAuditLogs);
  });

  const [grievances, setGrievances] = useState(() => {
    const saved = localStorage.getItem('gov_grievances');
    return saved ? JSON.parse(saved) : initialGrievances;
  });

  const [schemeBudgets, setSchemeBudgets] = useState(() => {
    const saved = localStorage.getItem('gov_scheme_budgets');
    return saved ? JSON.parse(saved) : initialSchemeBudgets;
  });

  // Saved Schemes State (account-isolated by user ID/email)
  const [savedSchemesMap, setSavedSchemesMap] = useState(() => {
    const saved = localStorage.getItem('gov_saved_schemes');
    if (saved) {
      try {
        return JSON.parse(saved) || {};
      } catch (e) {
        console.warn('Failed to parse saved schemes:', e);
      }
    }
    return {};
  });

  // Scheme Comparison State (selected scheme IDs, up to 4)
  const [comparedSchemeIds, setComparedSchemeIds] = useState(() => {
    try {
      const saved = localStorage.getItem('dsga_compared_schemes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  // Toast message state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('gov_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('dsga_auth_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('gov_schemes', JSON.stringify(schemes));
  }, [schemes]);

  useEffect(() => {
    localStorage.setItem('gov_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('gov_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('gov_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('gov_grievances', JSON.stringify(grievances));
  }, [grievances]);

  useEffect(() => {
    localStorage.setItem('gov_scheme_budgets', JSON.stringify(schemeBudgets));
  }, [schemeBudgets]);

  useEffect(() => {
    localStorage.setItem('gov_saved_schemes', JSON.stringify(savedSchemesMap));
  }, [savedSchemesMap]);

  useEffect(() => {
    localStorage.setItem('gov_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('dsga_compared_schemes', JSON.stringify(comparedSchemeIds));
  }, [comparedSchemeIds]);

  // Synchronize with Spring Boot Backend on mount
  useEffect(() => {
    async function syncBackend() {
      try {
        const isUp = await ApiService.checkBackendHealth();
        setBackendConnected(isUp);
        if (!isUp) return;

        // 0. Sync Authenticated User Profile from Spring Boot if token exists
        if (ApiService.getToken()) {
          try {
            const profile = await ApiService.getProfile();
            if (profile && (profile.email || profile.userId)) {
              const liveRole = profile.role ? profile.role.replace('ROLE_', '') : 'APPLICANT';
              const liveUser = {
                id: `usr-${profile.userId}`,
                backendId: profile.userId,
                name: profile.name,
                email: profile.email,
                role: liveRole,
                phone: profile.phone || '',
                district: profile.address || '',
                avatar: getSafeAvatar(profile.name, liveRole),
                token: ApiService.getToken()
              };
              setCurrentUser(liveUser);
              setCurrentRole(liveRole);
              localStorage.setItem('dsga_auth_user', JSON.stringify(liveUser));
            }
          } catch (profileErr) {
            console.warn('[AppContext] Profile fetch notice:', profileErr.message);
          }
        }

        // 1. Sync Schemes from Spring Boot
        try {
          const liveSchemes = await ApiService.getSchemes(0, 50);
          if (Array.isArray(liveSchemes) && liveSchemes.length > 0) {
            setSchemes(prevSchemes => {
              const processingTimeOptions = [
                '4–7 Working Days',
                '12–18 Working Days',
                '3–5 Working Days',
                '5–8 Working Days',
                '8–14 Working Days',
                '6–10 Working Days',
                '7–12 Working Days',
                '5–7 Working Days',
                '10–15 Working Days'
              ];
              const lastUpdatedOptions = [
                '2026-09-12',
                '2026-09-08',
                '2026-09-14',
                '2026-09-16',
                '2026-09-10',
                '2026-09-15',
                '2026-09-11',
                '2026-09-07',
                '2026-09-13'
              ];

              const mapped = liveSchemes.map((s, idx) => {
                const existing = prevSchemes.find(p => p.backendId === s.schemeId || p.title === s.schemeName || p.id === `SCH-${s.schemeId}`);
                const assignedProcessingDays = existing?.processingDays || processingTimeOptions[idx % processingTimeOptions.length];
                const assignedLastUpdated = existing?.lastUpdated || s.updatedAt || lastUpdatedOptions[idx % lastUpdatedOptions.length];

                return {
                  id: `SCH-${s.schemeId}`,
                  backendId: s.schemeId,
                  code: existing?.code || `SCH-2026-${String(s.schemeId).padStart(2, '0')}`,
                  title: s.schemeName,
                  category: s.schemeType || 'AGRICULTURE',
                  department: existing?.department || 'Department of Welfare & Benefit Administration',
                  shortDesc: s.description && s.description.length > 120 ? s.description.slice(0, 120) + '...' : (s.description || 'Government Assistance Scheme'),
                  description: s.description || 'Government assistance scheme',
                  maxAmount: Number(s.maximumAmount) || 50000,
                  totalFund: Number(s.totalFund) || 50000000,
                  distributedFund: existing?.distributedFund || 0,
                  deadline: s.deadline || '2026-12-31',
                  status: s.status || 'ACTIVE',
                  minAge: existing?.minAge || 18,
                  maxAge: existing?.maxAge || 65,
                  maxIncome: existing?.maxIncome || 500000,
                  allowedStates: existing?.allowedStates || ['All India'],
                  requiredDocs: existing?.requiredDocs || [
                    { id: 'doc-aadhaar', name: 'Aadhaar Card Verification', type: 'IDENTITY' },
                    { id: 'doc-income', name: 'Annual Income Certificate', type: 'INCOME' }
                  ],
                  applicantsCount: existing?.applicantsCount || 0,
                  approvedCount: existing?.approvedCount || 0,
                  processingDays: assignedProcessingDays,
                  lastUpdated: assignedLastUpdated
                };
              });

              // Merge mapped with any local schemes that have not yet synced
              const map = new Map();
              prevSchemes.forEach(s => map.set(s.id, s));
              mapped.forEach(s => map.set(s.id, { ...map.get(s.id), ...s }));
              return Array.from(map.values());
            });
          }
        } catch (schemeErr) {
          console.warn('[AppContext] Scheme sync notice:', schemeErr.message);
        }

        // 2. Sync Applications from Spring Boot
        try {
          const liveApps = await ApiService.getApplications('', 0, 100);
          if (Array.isArray(liveApps) && liveApps.length > 0) {
            setApplications(prevApps => {
              const mappedApps = liveApps.map(a => {
                const appId = a.applicationNumber || `APP-2026-${a.applicationId}`;
                const existing = prevApps.find(p => p.id === appId || p.backendId === a.applicationId);
                return {
                  id: appId,
                  backendId: a.applicationId,
                  applicantId: a.applicantId ? `usr-${a.applicantId}` : (existing?.applicantId || 'usr-1'),
                  applicantBackendId: a.applicantId,
                  applicantName: a.applicantName || existing?.applicantName || 'Citizen Applicant',
                  applicantEmail: a.applicantEmail || existing?.applicantEmail || '',
                  applicantPhone: existing?.applicantPhone || '+91 98765 43210',
                  applicantState: existing?.applicantState || 'Telangana',
                  applicantDistrict: existing?.applicantDistrict || 'Medak',
                  schemeId: a.schemeId ? `SCH-${a.schemeId}` : (existing?.schemeId || 'SCH-1'),
                  schemeTitle: a.schemeName || existing?.schemeTitle || 'Government Assistance Scheme',
                  requestedAmount: Number(a.requestedAmount) || existing?.requestedAmount || 10000,
                  approvedAmount: a.status === 'APPROVED' ? (existing?.approvedAmount || Number(a.requestedAmount)) : null,
                  submittedDate: a.submittedAt || a.submittedDate || existing?.submittedDate || new Date().toISOString(),
                  status: a.status || a.applicationStatus || existing?.status || 'SUBMITTED',
                  verifierRemarks: existing?.verifierRemarks || 'Initial scrutiny logged in portal.',
                  authorityRemarks: existing?.authorityRemarks || null,
                  bankDetails: existing?.bankDetails || {
                    accountName: a.applicantName || 'Authorized Beneficiary',
                    accountNumber: '918200391024',
                    bankName: 'State Bank of India',
                    ifsc: 'SBIN0001024',
                    branch: 'Central Treasury'
                  },
                  documents: existing?.documents || [
                    { id: `doc-${Date.now()}-1`, name: 'Aadhaar_Card_Verified.pdf', type: 'Aadhaar Card', status: 'VERIFIED', size: '1.2 MB', uploadedAt: 'Verified', ocrConfidence: '99%' }
                  ],
                  timeline: existing?.timeline || [
                    { status: 'SUBMITTED', title: 'Application Submitted', date: new Date().toLocaleString(), by: a.applicantName || 'Citizen' },
                    { status: 'UNDER_VERIFICATION', title: 'Assigned to Field Verifier Queue', date: new Date().toLocaleString(), by: 'System Router' }
                  ]
                };
              });

              const map = new Map();
              prevApps.forEach(a => map.set(a.id, a));
              mappedApps.forEach(a => map.set(a.id, { ...map.get(a.id), ...a }));
              return Array.from(map.values());
            });
          }
        } catch (appErr) {
          console.warn('[AppContext] Application sync notice:', appErr.message);
        }

        // 3. Sync Audit Logs
        try {
          const liveLogs = await ApiService.getAuditLogs(0, 50);
          if (Array.isArray(liveLogs) && liveLogs.length > 0) {
            const mappedLogs = liveLogs.map(l => ({
              id: `log-${l.logId}`,
              timestamp: l.performedAt || new Date().toLocaleString(),
              actor: l.performedBy ? `User #${l.performedBy}` : 'System Security',
              action: l.action,
              details: l.details || `${l.entityType} #${l.entityId}`,
              ip: '127.0.0.1 (Authenticated)'
            }));
            setAuditLogs(prev => {
              const ids = new Set(prev.map(p => p.id));
              const newUnique = mappedLogs.filter(m => !ids.has(m.id));
              return [...newUnique, ...prev];
            });
          }
        } catch (logErr) {
          console.warn('[AppContext] Audit log sync notice:', logErr.message);
        }
        // 4. Sync Account Notifications from Spring Boot if authenticated
        if (ApiService.getToken()) {
          try {
            const liveNotifs = await ApiService.getNotifications();
            if (Array.isArray(liveNotifs) && liveNotifs.length > 0) {
              setNotifications(prev => {
                const mapped = liveNotifs.map(ln => ({
                  id: `notif-backend-${ln.notificationId}`,
                  backendId: ln.notificationId,
                  userId: `usr-${ln.userId}`,
                  userEmail: ln.userEmail,
                  title: ln.title,
                  message: ln.message,
                  timestamp: ln.createdAt ? new Date(ln.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
                  read: Boolean(ln.isRead),
                  isGlobal: Boolean(ln.isGlobal),
                  type: ln.notificationType || 'INFO'
                }));
                const map = new Map();
                prev.forEach(n => map.set(n.id, n));
                mapped.forEach(n => map.set(n.id, { ...map.get(n.id), ...n }));
                return Array.from(map.values());
              });
            }
          } catch (notifErr) {
            console.warn('[AppContext] Notification sync notice:', notifErr.message);
          }
        }
      } catch (err) {
        console.warn('[AppContext] Background sync notice:', err.message);
      }
    }

    syncBackend();
  }, []);

  // Log system activity
  const addAuditLog = (action, details) => {
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actor: `${currentUser.name} (${currentUser.role})`,
      action,
      details,
      ip: '127.0.0.1 (Session)'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Send Notification helper - strictly enforces account-specific isolation
  const notify = (target, title, message, type = 'INFO') => {
    let notifObj;
    if (typeof target === 'object' && target !== null && !title) {
      // Called with notify({ userId, userEmail, title, message, type, isGlobal })
      notifObj = target;
    } else if (typeof target === 'object' && target !== null && title) {
      // Called with notify(userObj, title, message, type)
      notifObj = {
        userId: target.id || (target.backendId ? `usr-${target.backendId}` : undefined),
        userEmail: target.email,
        title,
        message,
        type: type || 'INFO'
      };
    } else if (typeof target === 'string' && (target.startsWith('usr-') || target.includes('@'))) {
      // Target is explicit user ID or email
      notifObj = {
        userId: target.startsWith('usr-') ? target : undefined,
        userEmail: target.includes('@') ? target : undefined,
        title,
        message,
        type: type || 'INFO'
      };
    } else if (target === 'ALL') {
      // Explicit global announcement
      notifObj = {
        isGlobal: true,
        userRole: 'ALL',
        title,
        message,
        type: type || 'INFO'
      };
    } else {
      // Role targeted or fallback: map to the specific account belonging to that role
      const matchingUser = users.find(u => u.role === target) || currentUser;
      notifObj = {
        userId: matchingUser?.id,
        userEmail: matchingUser?.email,
        userRole: target,
        title,
        message,
        type: type || 'INFO'
      };
    }

    const newNotif = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: notifObj.userId,
      userEmail: notifObj.userEmail,
      userRole: notifObj.userRole,
      isGlobal: Boolean(notifObj.isGlobal),
      title: notifObj.title,
      message: notifObj.message,
      timestamp: 'Just now',
      read: false,
      type: notifObj.type || 'INFO'
    };

    setNotifications(prev => [newNotif, ...prev]);

    // If connected to backend, propagate to Spring Boot REST endpoint
    if (backendConnected && notifObj.userId) {
      const numId = Number(String(notifObj.userId).replace(/\D/g, ''));
      if (numId) {
        ApiService.sendNotification(numId, notifObj.title, notifObj.message, notifObj.type || 'INFO')
          .catch(e => console.warn('Async backend sendNotification notice:', e.message));
      }
    }
  };

  // Role switching
  const switchRole = async (role) => {
    setCurrentRole(role);
    const userMatch = users.find(u => u.role === role);
    if (userMatch) {
      setCurrentUser(userMatch);
      localStorage.setItem('dsga_auth_user', JSON.stringify(userMatch));
    }

    // If connected to backend, automatically obtain real JWT for that role persona
    if (backendConnected && userMatch?.email) {
      try {
        await ApiService.login(userMatch.email, 'password123');
      } catch (e) {
        console.warn('Backend persona switch notice:', e.message);
      }
    }

    showToast(`Switched active workspace to ${role}`, 'info');
    addAuditLog('ROLE_SWITCH', `Switched active role view to ${role}`);
  };

  const logoutUser = async () => {
    try {
      await ApiService.logout();
    } catch (e) {
      console.warn('Logout error:', e);
    }
    localStorage.removeItem('dsga_auth_user');
    localStorage.removeItem('dsga_jwt_token');
    localStorage.removeItem('dsga_refresh_token');
    setCurrentUser(null);
    showToast('Signed out successfully.', 'info');
  };

  // Login handler with Spring Boot Backend integration & Seamless Offline Fallback
  const loginUser = async (email, password, role) => {
    const cleanEmail = String(email || '').trim().toLowerCase();

    // 1. Try Spring Boot REST API First if reachable
    try {
      const res = await ApiService.login(cleanEmail, password);
      if (res && res.accessToken) {
        setBackendConnected(true);
        const targetRole = res.role ? res.role.replace('ROLE_', '') : (role || 'APPLICANT');
        setCurrentRole(targetRole);

        const existingUser = users.find(u => u.email?.toLowerCase() === cleanEmail);
        const userName = res.name || existingUser?.name || 'Authenticated User';
        const loggedInUser = {
          id: res.userId ? `usr-${res.userId}` : (existingUser?.id || `usr-${Date.now()}`),
          backendId: res.userId,
          name: userName,
          email: res.email || cleanEmail,
          role: targetRole,
          avatar: res.avatar || existingUser?.avatar || getSafeAvatar(userName, targetRole),
          token: res.accessToken
        };

        setCurrentUser(loggedInUser);
        localStorage.setItem('dsga_auth_user', JSON.stringify(loggedInUser));
        setUsers(prev => {
          const exists = prev.find(u => u.email?.toLowerCase() === cleanEmail);
          if (exists) return prev.map(u => u.email?.toLowerCase() === cleanEmail ? { ...u, ...loggedInUser } : u);
          return [loggedInUser, ...prev];
        });

        // Also refresh live applications from backend immediately for this user
        try {
          const liveApps = await ApiService.getApplications('', 0, 100);
          if (Array.isArray(liveApps) && liveApps.length > 0) {
            setApplications(prevApps => {
              const mappedApps = liveApps.map(a => {
                const appId = a.applicationNumber || `APP-2026-${a.applicationId}`;
                const existing = prevApps.find(p => p.id === appId || p.backendId === a.applicationId);
                return {
                  id: appId,
                  backendId: a.applicationId,
                  applicantId: a.applicantId ? `usr-${a.applicantId}` : (existing?.applicantId || 'usr-1'),
                  applicantBackendId: a.applicantId,
                  applicantName: a.applicantName || existing?.applicantName || 'Citizen Applicant',
                  applicantEmail: a.applicantEmail || existing?.applicantEmail || '',
                  applicantPhone: existing?.applicantPhone || '+91 98765 43210',
                  applicantState: existing?.applicantState || 'Telangana',
                  applicantDistrict: existing?.applicantDistrict || 'Medak',
                  schemeId: a.schemeId ? `SCH-${a.schemeId}` : (existing?.schemeId || 'SCH-1'),
                  schemeTitle: a.schemeName || existing?.schemeTitle || 'Government Assistance Scheme',
                  requestedAmount: Number(a.requestedAmount) || existing?.requestedAmount || 10000,
                  approvedAmount: a.status === 'APPROVED' ? (existing?.approvedAmount || Number(a.requestedAmount)) : null,
                  submittedDate: a.submittedAt || a.submittedDate || existing?.submittedDate || new Date().toISOString(),
                  status: a.status || a.applicationStatus || existing?.status || 'SUBMITTED',
                  verifierRemarks: existing?.verifierRemarks || 'Initial scrutiny logged in portal.',
                  authorityRemarks: existing?.authorityRemarks || null,
                  bankDetails: existing?.bankDetails || {
                    accountName: a.applicantName || 'Authorized Beneficiary',
                    accountNumber: '918200391024',
                    bankName: 'State Bank of India',
                    ifsc: 'SBIN0001024',
                    branch: 'Central Treasury'
                  },
                  documents: existing?.documents || [
                    { id: `doc-${Date.now()}-1`, name: 'Aadhaar_Card_Verified.pdf', type: 'Aadhaar Card', status: 'VERIFIED', size: '1.2 MB', uploadedAt: 'Verified', ocrConfidence: '99%' }
                  ],
                  timeline: existing?.timeline || [
                    { status: 'SUBMITTED', title: 'Application Submitted', date: new Date().toLocaleString(), by: a.applicantName || 'Citizen' },
                    { status: 'UNDER_VERIFICATION', title: 'Assigned to Field Verifier Queue', date: new Date().toLocaleString(), by: 'System Router' }
                  ]
                };
              });
              const map = new Map();
              prevApps.forEach(a => map.set(a.id, a));
              mappedApps.forEach(a => map.set(a.id, { ...map.get(a.id), ...a }));
              return Array.from(map.values());
            });
          }
        } catch (appErr) {
          console.warn('[AppContext] Live apps refresh notice:', appErr.message);
        }

        showToast(`Welcome back, ${loggedInUser.name}!`, 'success');
        addAuditLog('USER_LOGIN', `Authenticated via Spring Boot as ${targetRole}`);
        return true;
      }
    } catch (backendErr) {
      console.warn('[AppContext] Backend unavailable or auth failed, checking local credentials:', backendErr.message);
    }

    // 1b. Check local password overrides from password reset
    let resetPasswords = {};
    try {
      resetPasswords = JSON.parse(localStorage.getItem('dsga_password_overrides') || '{}');
    } catch {}

    const customResetPass = resetPasswords[cleanEmail];
    if (customResetPass) {
      if (customResetPass !== password) {
        throw new Error('Invalid email address or password');
      }
      const existingUser = users.find(u => u.email?.toLowerCase() === cleanEmail);
      const preset = {
        'sahana@gmail.com': { name: 'Sahana', role: 'VERIFIER' },
        'mayur@gmail.com': { name: 'Mayur', role: 'AUTHORITY' },
        'sachin@gmail.com': { name: 'Sachin', role: 'ADMINISTRATOR' },
        'kavitha@gmail.com': { name: 'Kavitha Rao, IAS', role: 'DISTRICT_OFFICER' },
        'district@gov.in': { name: 'Kavitha Rao, IAS', role: 'DISTRICT_OFFICER' },
        'applicant@gov.in': { name: 'Rahul Kumar', role: 'APPLICANT' },
        'verifier@gov.in': { name: 'Sahana', role: 'VERIFIER' },
        'authority@gov.in': { name: 'Mayur', role: 'AUTHORITY' },
        'admin@gov.in': { name: 'Sachin', role: 'ADMINISTRATOR' }
      }[cleanEmail];

      const targetRole = existingUser?.role || preset?.role || role || 'APPLICANT';
      const userName = existingUser?.name || preset?.name || 'Citizen User';
      setCurrentRole(targetRole);
      const loggedInUser = {
        id: existingUser?.id || `usr-${Date.now()}`,
        name: userName,
        email: cleanEmail,
        role: targetRole,
        avatar: existingUser?.avatar || getSafeAvatar(userName, targetRole),
        token: `local-jwt-${Date.now()}`
      };
      setCurrentUser(loggedInUser);
      localStorage.setItem('dsga_auth_user', JSON.stringify(loggedInUser));
      showToast(`Welcome back, ${userName}!`, 'success');
      addAuditLog('USER_LOGIN', `Authenticated via reset credentials as ${targetRole} (${cleanEmail})`);
      return true;
    }

    // 2. Local / Seeded User Authentication Fallback
    const existingUser = users.find(u => u.email?.toLowerCase() === cleanEmail);
    if (existingUser) {
      if (existingUser.password && existingUser.password !== password) {
        throw new Error('Invalid email address or password');
      }
      const targetRole = existingUser.role || role || 'APPLICANT';
      setCurrentRole(targetRole);
      const loggedInUser = {
        ...existingUser,
        role: targetRole,
        token: `local-jwt-${Date.now()}`
      };
      setCurrentUser(loggedInUser);
      localStorage.setItem('dsga_auth_user', JSON.stringify(loggedInUser));
      showToast(`Welcome back, ${loggedInUser.name}!`, 'success');
      addAuditLog('USER_LOGIN', `Authenticated locally as ${targetRole} (${cleanEmail})`);
      return true;
    }

    // 3. Demo Preset Role Check with strict credentials
    const rolePresets = {
      'sahana@gmail.com': { name: 'Sahana', role: 'VERIFIER', password: 'sahana$45' },
      'shama@gmail.com': { name: 'Shama', role: 'APPLICANT', password: 'password123' },
      'kavitha@gmail.com': { name: 'Kavitha Rao, IAS', role: 'DISTRICT_OFFICER', password: 'kavitha$123' },
      'district@gov.in': { name: 'Kavitha Rao, IAS', role: 'DISTRICT_OFFICER', password: 'kavitha$123' },
      'mayur@gmail.com': { name: 'Mayur', role: 'AUTHORITY', password: 'mayur%34' },
      'sachin@gmail.com': { name: 'Sachin', role: 'ADMINISTRATOR', password: 'sachin' },
      'applicant@gov.in': { name: 'Rahul Kumar', role: 'APPLICANT', password: 'password123' },
      'verifier@gov.in': { name: 'Sahana', role: 'VERIFIER', password: 'sahana$45' },
      'authority@gov.in': { name: 'Mayur', role: 'AUTHORITY', password: 'mayur%34' },
      'admin@gov.in': { name: 'Sachin', role: 'ADMINISTRATOR', password: 'sachin' }
    };

    if (rolePresets[cleanEmail]) {
      const preset = rolePresets[cleanEmail];
      if (preset.password !== password) {
        throw new Error('Invalid email address or password');
      }
      const targetRole = preset.role;
      setCurrentRole(targetRole);
      const loggedInUser = {
        id: `usr-${Date.now()}`,
        name: preset.name,
        email: cleanEmail,
        role: targetRole,
        avatar: getSafeAvatar(preset.name, targetRole),
        token: `local-jwt-${Date.now()}`
      };
      setCurrentUser(loggedInUser);
      localStorage.setItem('dsga_auth_user', JSON.stringify(loggedInUser));
      showToast(`Welcome back, ${loggedInUser.name}!`, 'success');
      addAuditLog('USER_LOGIN', `Authenticated as ${targetRole} (${cleanEmail})`);
      return true;
    }

    // 4. Check localStorage for registered citizen
    try {
      const savedUserStr = localStorage.getItem('dsga_registered_citizen');
      if (savedUserStr) {
        const saved = JSON.parse(savedUserStr);
        if (saved.email?.toLowerCase() === cleanEmail) {
          if (saved.password && saved.password !== password) {
            throw new Error('Invalid email address or password');
          }
          setCurrentRole('APPLICANT');
          setCurrentUser(saved);
          localStorage.setItem('dsga_auth_user', JSON.stringify(saved));
          showToast(`Welcome back, ${saved.name}!`, 'success');
          return true;
        }
      }
    } catch (err) {
      if (err.message === 'Invalid email address or password') throw err;
    }

    throw new Error('Invalid email address or password');
  };

  // Citizen Registration handler with Backend + Offline Fallback
  const registerUser = async (citizenData) => {
    const cleanEmail = String(citizenData.email || '').trim().toLowerCase();

    // 1. Try Backend Registration First
    try {
      const res = await ApiService.register(citizenData);
      if (res && res.accessToken) {
        setBackendConnected(true);
        const userName = res.name || citizenData.fullName || citizenData.name;
        const newUser = {
          id: res.userId ? `usr-${res.userId}` : `usr-${Date.now()}`,
          backendId: res.userId,
          name: userName,
          email: res.email || cleanEmail,
          role: 'APPLICANT',
          phone: citizenData.mobile || citizenData.phone,
          district: citizenData.district || 'General',
          avatar: res.avatar || getSafeAvatar(userName, 'APPLICANT'),
          token: res.accessToken
        };
        setCurrentRole('APPLICANT');
        setCurrentUser(newUser);
        localStorage.setItem('dsga_auth_user', JSON.stringify(newUser));
        setUsers(prev => {
          const exists = prev.find(u => u.email?.toLowerCase() === cleanEmail);
          if (exists) return prev.map(u => u.email?.toLowerCase() === cleanEmail ? newUser : u);
          return [newUser, ...prev];
        });
        showToast(`Citizen Account Registered for ${newUser.name}!`, 'success');
        addAuditLog('USER_REGISTER', `Citizen registered: ${newUser.name} (${newUser.email})`);
        return true;
      }
    } catch (backendErr) {
      console.warn('[AppContext] Backend unavailable, registering citizen locally:', backendErr.message);
    }

    // 2. Offline / Local Registration Fallback
    const userName = citizenData.fullName || citizenData.name || 'Registered Citizen';
    const newUser = {
      id: `usr-${Date.now()}`,
      name: userName,
      email: cleanEmail,
      password: citizenData.password || 'password123',
      role: 'APPLICANT',
      phone: citizenData.mobile || citizenData.phone || '+91 98765 43210',
      district: citizenData.district || 'General',
      aadhaar: citizenData.aadhaar,
      avatar: getSafeAvatar(userName, 'APPLICANT'),
      token: `local-jwt-${Date.now()}`
    };

    setCurrentRole('APPLICANT');
    setCurrentUser(newUser);
    localStorage.setItem('dsga_auth_user', JSON.stringify(newUser));
    localStorage.setItem('dsga_registered_citizen', JSON.stringify(newUser));
    setUsers(prev => {
      const exists = prev.find(u => u.email?.toLowerCase() === cleanEmail);
      const updated = exists ? prev.map(u => u.email?.toLowerCase() === cleanEmail ? newUser : u) : [newUser, ...prev];
      localStorage.setItem('gov_users', JSON.stringify(updated));
      return updated;
    });

    showToast(`Citizen Account Registered for ${newUser.name}!`, 'success');
    addAuditLog('USER_REGISTER', `Citizen registered: ${newUser.name} (${newUser.email})`);
    return true;
  };

  // Password Reset handler
  const resetPassword = async (emailToReset, newPass) => {
    const cleanEmail = String(emailToReset || '').trim().toLowerCase();
    if (!cleanEmail) {
      throw new Error('Please enter your registered email address');
    }
    if (!newPass || newPass.length < 4) {
      throw new Error('Password must be at least 4 characters long');
    }

    // Save in password overrides
    let overrides = {};
    try {
      overrides = JSON.parse(localStorage.getItem('dsga_password_overrides') || '{}');
    } catch {}
    overrides[cleanEmail] = newPass;
    localStorage.setItem('dsga_password_overrides', JSON.stringify(overrides));

    // Update users list in state and localStorage
    setUsers(prev => {
      const updated = prev.map(u => {
        if (u.email?.toLowerCase() === cleanEmail) {
          return { ...u, password: newPass };
        }
        return u;
      });
      localStorage.setItem('gov_users', JSON.stringify(updated));
      return updated;
    });

    // Update registered citizen if match
    try {
      const savedUserStr = localStorage.getItem('dsga_registered_citizen');
      if (savedUserStr) {
        const saved = JSON.parse(savedUserStr);
        if (saved.email?.toLowerCase() === cleanEmail) {
          saved.password = newPass;
          localStorage.setItem('dsga_registered_citizen', JSON.stringify(saved));
        }
      }
    } catch {}

    addAuditLog('PASSWORD_RESET', `Password successfully reset for ${cleanEmail}`);
    showToast('Password reset successfully! You can now log in with your new password.', 'success');
    return true;
  };

  // 1. Applicant Action: Submit New Application
  const submitApplication = async (formData) => {
    const newAppId = `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const scheme = schemes.find(s => s.id === formData.schemeId);
    let backendAppId = null;

    // Call Spring Boot API if backend is connected
    if (backendConnected) {
      try {
        const numApplicantId = currentUser?.backendId || (currentUser?.id ? Number(String(currentUser.id).replace(/\D/g, '')) : null) || 1;
        const numSchemeId = scheme?.backendId || (formData.schemeId ? Number(String(formData.schemeId).replace(/\D/g, '')) || 1 : 1);
        const requestedAmt = Number(formData.requestedAmount) || (scheme ? scheme.maxAmount : 10000);

        const apiRes = await ApiService.submitApplication({
          applicantId: numApplicantId,
          schemeId: numSchemeId,
          requestedAmount: requestedAmt
        });

        if (apiRes && apiRes.applicationId) {
          backendAppId = apiRes.applicationId;
          // Upload documents to backend
          if (formData.uploadedDocuments && formData.uploadedDocuments.length > 0) {
            for (const doc of formData.uploadedDocuments) {
              try {
                await ApiService.uploadDocument({
                  applicationId: apiRes.applicationId,
                  documentType: doc.type || 'IDENTITY',
                  documentPath: `/docs/${doc.name || 'document.pdf'}`
                });
              } catch (e) {
                console.warn('Doc upload notice:', e);
              }
            }
          }
        }
      } catch (apiErr) {
        console.warn('[AppContext] Spring Boot application submission notice:', apiErr.message);
      }
    }

    const numApplicantId = currentUser?.backendId || (currentUser?.id ? Number(String(currentUser.id).replace(/\D/g, '')) : null) || 1;
    const isRenewal = Boolean(formData.isRenewal);
    const prevAppId = formData.previousApplicationId || null;

    const newApp = {
      id: newAppId,
      backendId: backendAppId,
      isRenewal,
      previousApplicationId: prevAppId,
      applicantId: currentUser?.id || `usr-${numApplicantId}`,
      applicantBackendId: numApplicantId,
      applicantName: currentUser?.name || 'Citizen Applicant',
      applicantEmail: currentUser?.email || '',
      applicantPhone: currentUser?.phone,
      applicantAge: currentUser?.age || 30,
      applicantIncome: currentUser?.income || 300000,
      applicantState: currentUser?.state || 'Telangana',
      applicantDistrict: currentUser?.district || 'Medak',
      schemeId: formData.schemeId,
      schemeTitle: scheme ? scheme.title : 'Government Assistance Scheme',
      requestedAmount: Number(formData.requestedAmount) || (scheme ? scheme.maxAmount : 100000),
      approvedAmount: null,
      submittedDate: new Date().toISOString(),
      status: 'UNDER_VERIFICATION',
      verifierId: 'usr-2',
      verifierName: 'Anil Sharma',
      verifierRemarks: isRenewal
        ? `Renewal submission (Ref: ${prevAppId}). Prior records available for accelerated verification.`
        : 'Pending initial field document scrutiny.',
      verificationDate: null,
      authorityId: null,
      authorityRemarks: null,
      approvalDate: null,
      paymentStatus: 'NOT_INITIATED',
      transactionId: null,
      paymentDate: null,
      bankDetails: {
        accountName: formData.accountName || currentUser?.name || 'Authorized Beneficiary',
        accountNumber: formData.accountNumber || '918200391024',
        bankName: formData.bankName || 'State Bank of India',
        ifsc: formData.ifsc || 'SBIN0001024',
        branch: formData.branch || 'Central Branch'
      },
      documents: formData.uploadedDocuments || [
        { id: `doc-${Date.now()}-1`, name: 'Aadhaar_Card_Verified.pdf', type: 'Aadhaar Card', status: 'VERIFIED', size: '1.2 MB', uploadedAt: 'Just now', ocrConfidence: '99%' },
        { id: `doc-${Date.now()}-2`, name: 'Income_Certificate_2026.pdf', type: 'Income Certificate', status: 'PENDING', size: '940 KB', uploadedAt: 'Just now', ocrConfidence: '95%' }
      ],
      timeline: [
        {
          status: 'SUBMITTED',
          title: isRenewal ? `Renewal Application Submitted (Ref: ${prevAppId})` : 'Application Submitted',
          date: new Date().toLocaleString(),
          by: `${currentUser?.name || 'Citizen'} (Citizen)`
        },
        { status: 'UNDER_VERIFICATION', title: 'Routing to Field Verifier Queue', date: new Date().toLocaleString(), by: 'System Router' }
      ]
    };

    setApplications(prev => [newApp, ...prev]);

    // Update scheme metrics
    setSchemes(prev => prev.map(s => s.id === formData.schemeId ? { ...s, applicantsCount: s.applicantsCount + 1 } : s));

    // Audit & Notification
    if (isRenewal) {
      addAuditLog('APPLICATION_RENEWED', `Submitted renewal application ${newAppId} referencing ${prevAppId} for ${scheme?.title}`);
      notify({
        userId: currentUser?.id,
        userEmail: currentUser?.email,
        title: 'Renewal Application Submitted',
        message: `Your renewal application ${newAppId} (ref: ${prevAppId}) is now under field verification.`,
        type: 'SUCCESS'
      });
    } else {
      addAuditLog('APPLICATION_SUBMITTED', `Created application ${newAppId} for scheme ${scheme?.title}`);
      notify({
        userId: currentUser?.id,
        userEmail: currentUser?.email,
        title: 'Application Submitted Successfully',
        message: `Your application ${newAppId} is now under field verification.`,
        type: 'SUCCESS'
      });
    }
    notify({
      userId: newApp.verifierId || 'usr-2',
      userEmail: 'verifier@gov.in',
      title: isRenewal ? 'Renewal Application in Queue' : 'New Application in Queue',
      message: `Application ${newAppId} ${isRenewal ? `(Renewal of ${prevAppId})` : ''} assigned for document scrutiny.`,
      type: 'WARNING'
    });

    showToast(isRenewal ? `Renewal application ${newAppId} submitted successfully!` : `Application ${newAppId} submitted successfully!`, 'success');
    return newAppId;
  };

  // 2. Verifier Action: Verify / Reject Application
  const verifyApplication = async (appId, isApproved, remarks, updatedDocs) => {
    const nextStatus = isApproved ? 'VERIFIED' : 'REJECTED';
    const app = (applications || []).find(a => a.id === appId);

    if (backendConnected && app) {
      try {
        const numId = app.backendId || Number(String(appId).replace(/\D/g, '')) || 1;
        await ApiService.verifyApplication({
          applicationId: numId,
          verifierId: currentUser.backendId || 2,
          remarks: remarks || 'Field verification completed',
          verificationStatus: nextStatus,
          verificationScore: isApproved ? 95.0 : 35.0
        });
      } catch (err) {
        console.warn('[AppContext] Backend verifyApplication notice:', err.message);
      }
    }

    setApplications(prev => prev.map(a => {
      if (a.id === appId) {
        return {
          ...a,
          status: nextStatus,
          verifierRemarks: remarks,
          verificationDate: new Date().toISOString(),
          documents: updatedDocs || a.documents,
          timeline: [
            ...(a.timeline || []),
            {
              status: nextStatus,
              title: isApproved ? 'Documents & Eligibility Verified' : 'Application Flagged / Ineligible',
              date: new Date().toLocaleString(),
              by: `${currentUser?.name || 'Field Verifier'} (Verifier)`
            }
          ]
        };
      }
      return a;
    }));

    addAuditLog(isApproved ? 'VERIFICATION_APPROVED' : 'VERIFICATION_REJECTED', `Application ${appId} marked as ${nextStatus}`);

    if (isApproved) {
      notify({
        userId: app?.applicantId,
        userEmail: app?.applicantEmail,
        title: 'Documents Verified',
        message: `Your application ${appId} passed field verification and is sent to Authority for sanction.`,
        type: 'SUCCESS'
      });
      notify({
        userId: 'usr-3',
        userEmail: 'authority@gov.in',
        title: 'Sanction Review Required',
        message: `Application ${appId} is verified and ready for funding decision.`,
        type: 'WARNING'
      });
      showToast(`Application ${appId} verified and forwarded to Authority!`, 'success');
    } else {
      notify({
        userId: app?.applicantId,
        userEmail: app?.applicantEmail,
        title: 'Application Action Required',
        message: `Verification update for ${appId}: ${remarks}`,
        type: 'DANGER'
      });
      showToast(`Application ${appId} marked as Ineligible.`, 'warning');
    }
  };

  // 3. Authority Action: Approve / Reject Sanction & Set Amount
  const approveSanction = async (appId, isApproved, sanctionedAmount, remarks) => {
    const nextStatus = isApproved ? 'PAID' : 'REJECTED';
    const txnId = isApproved ? `TXN-DBT-2026-${Math.floor(10000000 + Math.random() * 90000000)}` : null;
    const app = applications.find(a => a.id === appId);

    if (backendConnected && app) {
      try {
        const numId = app.backendId || Number(String(appId).replace(/\D/g, '')) || 1;
        if (isApproved) {
          await ApiService.approveSanction({
            applicationId: numId,
            authorityId: currentUser.backendId || 3,
            approvedAmount: Number(sanctionedAmount),
            remarks: remarks || 'Grant approved by Sanction Authority'
          });
          // Process payment record in backend
          await ApiService.processPayment({
            applicationId: numId,
            amount: Number(sanctionedAmount),
            transactionId: txnId
          });
        } else {
          await ApiService.rejectSanction(numId, remarks || 'Sanction declined');
        }
      } catch (err) {
        console.warn('[AppContext] Backend sanction notice:', err.message);
      }
    }

    setApplications(prev => prev.map(a => {
      if (a.id === appId) {
        return {
          ...a,
          status: nextStatus,
          approvedAmount: isApproved ? Number(sanctionedAmount) : 0,
          authorityId: currentUser?.id || 'usr-3',
          authorityName: currentUser?.name || 'Sanction Officer',
          authorityRemarks: remarks,
          approvalDate: new Date().toISOString(),
          paymentStatus: isApproved ? 'PAID' : 'NOT_INITIATED',
          transactionId: txnId,
          paymentDate: isApproved ? new Date().toISOString() : null,
          timeline: [
            ...(a.timeline || []),
            {
              status: isApproved ? 'APPROVED' : 'REJECTED',
              title: isApproved ? `Sanction Approved (₹${Number(sanctionedAmount).toLocaleString('en-IN')})` : 'Sanction Declined',
              date: new Date().toLocaleString(),
              by: `${currentUser?.name || 'Sanction Officer'} (Authority)`
            },
            ...(isApproved ? [{
              status: 'PAID',
              title: `Direct Bank Transfer Disbursed (Txn: ${txnId})`,
              date: new Date().toLocaleString(),
              by: 'Public Finance Management Gateway (PFMS)'
            }] : [])
          ]
        };
      }
      return a;
    }));

    if (isApproved && app) {
      setSchemes(prev => prev.map(s => {
        if (s.id === app.schemeId) {
          return {
            ...s,
            distributedFund: s.distributedFund + Number(sanctionedAmount),
            approvedCount: s.approvedCount + 1
          };
        }
        return s;
      }));
    }

    addAuditLog(isApproved ? 'SANCTION_APPROVED' : 'SANCTION_REJECTED', `Application ${appId} ${isApproved ? `sanctioned for ₹${sanctionedAmount}` : 'rejected'}`);

    if (isApproved) {
      notify({
        userId: app?.applicantId,
        userEmail: app?.applicantEmail,
        title: '🎉 Grant Approved & Disbursed!',
        message: `₹${Number(sanctionedAmount).toLocaleString('en-IN')} approved and disbursed for ${appId}. Transaction ID: ${txnId}`,
        type: 'SUCCESS'
      });
      notify({
        userId: 'usr-4',
        userEmail: 'admin@gov.in',
        title: 'Fund Disbursement Alert',
        message: `Disbursed ₹${Number(sanctionedAmount).toLocaleString('en-IN')} for application ${appId}.`,
        type: 'INFO'
      });
      showToast(`Application ${appId} Sanctioned & Disbursed (100%)!`, 'success');
    } else {
      notify({
        userId: app?.applicantId,
        userEmail: app?.applicantEmail,
        title: 'Sanction Decision',
        message: `Application ${appId} sanction was not approved: ${remarks}`,
        type: 'DANGER'
      });
      showToast(`Application ${appId} Sanction Rejected.`, 'warning');
    }
  };

  // 4. District Officer Action: Endorse verified application to State Directorate or return for re-scrutiny
  const endorseDistrictApplication = (appId, remarks, actionType = 'ENDORSE') => {
    const isEndorsed = actionType === 'ENDORSE';
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          districtEndorsed: isEndorsed,
          districtEndorsementDate: new Date().toISOString(),
          districtRemarks: remarks || (isEndorsed ? 'Officially endorsed by District Nodal Officer.' : 'Returned for field re-inspection.'),
          status: isEndorsed ? (app.status === 'UNDER_VERIFICATION' ? 'VERIFIED' : app.status) : 'UNDER_VERIFICATION',
          timeline: [
            ...(app.timeline || []),
            {
              status: isEndorsed ? 'DISTRICT_ENDORSED' : 'UNDER_VERIFICATION',
              title: isEndorsed ? 'District Collectorate Endorsement Signed' : 'Returned for Field Scrutiny by District Officer',
              date: new Date().toLocaleString('en-IN'),
              by: `${currentUser?.name || 'Kavitha Rao, IAS'} (District Nodal Officer)`
            }
          ]
        };
      }
      return app;
    }));

    addAuditLog(
      isEndorsed ? 'DISTRICT_ENDORSEMENT' : 'DISTRICT_REVIEW_REJECT',
      `Application ${appId} ${isEndorsed ? 'endorsed to State Sanctioning Authority' : 'returned for re-inspection'}. Remarks: ${remarks || 'None'}`
    );

    if (isEndorsed) {
      notify({
        userId: 'usr-3',
        userEmail: 'authority@gov.in',
        title: 'District Endorsed Application',
        message: `Application ${appId} has been endorsed by District Collectorate and is pending sanction decision.`,
        type: 'INFO'
      });
      showToast(`Application ${appId} successfully endorsed to State Directorate!`, 'success');
    } else {
      notify({
        userId: 'usr-2',
        userEmail: 'verifier@gov.in',
        title: 'Re-Scrutiny Requested',
        message: `District Officer requested re-inspection for ${appId}: ${remarks}`,
        type: 'WARNING'
      });
      showToast(`Application ${appId} returned to Field Inspector for re-scrutiny.`, 'warning');
    }
  };

  // Disburse Application: Transition application to 100% DISBURSED (PAID) via PFMS DBT
  const disburseApplication = async (appId) => {
    const txnId = `TXN-DBT-2026-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const app = applications.find(a => a.id === appId);

    if (backendConnected && app) {
      try {
        const numId = app.backendId || Number(String(appId).replace(/\D/g, '')) || 1;
        await ApiService.processPayment({
          applicationId: numId,
          amount: Number(app.approvedAmount || app.requestedAmount || 50000),
          transactionId: txnId
        });
      } catch (err) {
        console.warn('[AppContext] Backend disburseApplication notice:', err.message);
      }
    }

    setApplications(prev => prev.map(a => {
      if (a.id === appId) {
        const approvedAmt = a.approvedAmount || a.requestedAmount || 50000;
        return {
          ...a,
          status: 'PAID',
          paymentStatus: 'PAID',
          transactionId: a.transactionId || txnId,
          paymentDate: a.paymentDate || new Date().toISOString(),
          approvedAmount: approvedAmt,
          timeline: [
            ...(a.timeline || []),
            {
              status: 'PAID',
              title: `Direct Bank Transfer (DBT) Disbursed (Txn: ${a.transactionId || txnId})`,
              date: new Date().toLocaleString(),
              by: 'Public Financial Management System (PFMS Treasury)'
            }
          ]
        };
      }
      return a;
    }));

    if (app) {
      setSchemes(prev => prev.map(s => {
        if (s.id === app.schemeId) {
          const amt = Number(app.approvedAmount || app.requestedAmount || 0);
          return {
            ...s,
            distributedFund: (s.distributedFund || 0) + amt,
            approvedCount: (s.approvedCount || 0) + 1
          };
        }
        return s;
      }));
    }

    const amt = app?.approvedAmount || app?.requestedAmount || 50000;
    addAuditLog('GRANT_DISBURSED', `Grant of ₹${Number(amt).toLocaleString('en-IN')} disbursed for application ${appId} (Txn: ${txnId})`);
    notify({
      userId: app?.applicantId,
      userEmail: app?.applicantEmail,
      title: '🎉 Direct Bank Transfer Disbursed! (100% Complete)',
      message: `₹${Number(amt).toLocaleString('en-IN')} successfully credited to your bank account for ${appId}. Ref: ${txnId}`,
      type: 'SUCCESS'
    });
    notify({
      userId: 'usr-4',
      userEmail: 'admin@gov.in',
      title: 'DBT Transfer Executed',
      message: `Disbursed ₹${Number(amt).toLocaleString('en-IN')} for application ${appId}.`,
      type: 'INFO'
    });
    showToast(`Application ${appId} Disbursed via PFMS DBT! 100% Completed.`, 'success');
  };

  // 4. Admin Action: Create New Scheme
  const createScheme = async (schemeData) => {
    const newSchemeId = `SCH-2026-0${schemes.length + 1}`;
    const desc = schemeData.description || 'Comprehensive financial subsidy and grant assistance scheme.';
    let backendSchemeId = null;

    if (backendConnected) {
      try {
        const res = await ApiService.createScheme({
          schemeName: schemeData.title || 'New Welfare Grant Scheme',
          description: desc,
          maximumAmount: Number(schemeData.maxAmount) || 100000,
          totalFund: Number(schemeData.totalFund) || 50000000,
          schemeType: schemeData.category || 'AGRICULTURE',
          startDate: '2026-01-01',
          deadline: schemeData.deadline || '2026-12-31'
        });
        if (res && res.schemeId) {
          backendSchemeId = res.schemeId;
        }
      } catch (err) {
        console.warn('[AppContext] Backend createScheme notice:', err.message);
      }
    }

    const newScheme = {
      id: newSchemeId,
      backendId: backendSchemeId,
      code: schemeData.code || `SCH-${Date.now().toString().slice(-4)}`,
      title: schemeData.title || 'New Welfare Grant Scheme',
      category: schemeData.category || 'AGRICULTURE',
      department: schemeData.department || 'Department of State Infrastructure',
      shortDesc: schemeData.shortDesc || (desc.length > 120 ? desc.slice(0, 120) + '...' : desc),
      description: desc,
      maxAmount: Number(schemeData.maxAmount) || 100000,
      totalFund: Number(schemeData.totalFund) || 50000000,
      distributedFund: 0,
      deadline: schemeData.deadline || '2026-12-31',
      status: 'ACTIVE',
      minAge: Number(schemeData.minAge) || 18,
      maxAge: Number(schemeData.maxAge) || 65,
      maxIncome: Number(schemeData.maxIncome) || 500000,
      allowedStates: schemeData.allowedStates || ['All India'],
      requiredDocs: schemeData.requiredDocs || [
        { id: 'doc-aadhaar', name: 'Aadhaar Card Verification', type: 'IDENTITY' },
        { id: 'doc-income', name: 'Annual Income Certificate', type: 'INCOME' }
      ],
      applicantsCount: 0,
      approvedCount: 0
    };

    setSchemes(prev => [newScheme, ...prev]);
    addAuditLog('SCHEME_CREATED', `Executive Admin published new scheme: ${newScheme.title} (${newScheme.code})`);
    notify('ALL', 'New Scheme Launched', `New government scheme "${newScheme.title}" is now open for applications!`, 'SUCCESS');
    showToast(`Scheme "${newScheme.title}" published successfully!`, 'success');
  };

  // Admin Action: Toggle Scheme Active / Suspended status
  const toggleSchemeStatus = async (schemeId) => {
    const s = schemes.find(item => item.id === schemeId);
    if (backendConnected && s) {
      try {
        const numId = s.backendId || Number(String(schemeId).replace(/\D/g, '')) || 1;
        await ApiService.deactivateScheme(numId);
      } catch (err) {
        console.warn('[AppContext] Backend toggleSchemeStatus notice:', err.message);
      }
    }

    setSchemes(prev => prev.map(item => {
      if (item.id === schemeId) {
        const newStatus = item.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        addAuditLog('SCHEME_STATUS_CHANGED', `Scheme ${item.code} status changed to ${newStatus}`);
        showToast(`Scheme ${item.code} is now ${newStatus}`, 'info');
        return { ...item, status: newStatus };
      }
      return item;
    }));
  };

  // Admin Action: Permanently Remove Scheme from Registry
  const deleteScheme = async (schemeId) => {
    const s = schemes.find(item => item.id === schemeId);
    const schemeTitle = s ? s.title : schemeId;
    const schemeCode = s ? s.code : '';

    if (backendConnected && s) {
      try {
        const numId = s.backendId || Number(String(schemeId).replace(/\D/g, '')) || 1;
        await ApiService.deleteScheme(numId);
      } catch (err) {
        console.warn('[AppContext] Backend deleteScheme notice:', err.message);
      }
    }

    setSchemes(prev => {
      const updated = prev.filter(item => item.id !== schemeId);
      localStorage.setItem('gov_schemes', JSON.stringify(updated));
      return updated;
    });

    addAuditLog('SCHEME_REMOVED', `Chief Administrator removed scheme from registry: "${schemeTitle}" (${schemeCode})`);
    showToast(`Scheme "${schemeTitle}" removed from registry.`, 'info');
  };

  // Chief Admin Action: Add User or Officer
  const addUser = async (userData) => {
    const cleanEmail = String(userData.email || '').trim().toLowerCase();
    const existing = users.find(u => (u.email || '').toLowerCase() === cleanEmail);
    if (existing) {
      showToast(`User with email "${cleanEmail}" already exists.`, 'error');
      return false;
    }

    let backendUserId = null;
    if (backendConnected) {
      try {
        const res = await ApiService.createUser({
          name: userData.name,
          email: cleanEmail,
          role: userData.role,
          password: userData.password || 'Welcome@2026',
          phone: userData.phone || '+91 98765 00000',
          department: userData.department || userData.district || 'National Platform',
          address: userData.department || userData.district || 'National Platform'
        });
        if (res && res.userId) {
          backendUserId = res.userId;
        }
      } catch (err) {
        console.warn('[AppContext] Backend createUser notice:', err.message);
      }
    }

    const newId = backendUserId ? `usr-${backendUserId}` : `usr-${Date.now().toString().slice(-4)}`;
    const newUser = {
      id: newId,
      backendId: backendUserId,
      name: userData.name,
      email: cleanEmail,
      role: userData.role || 'APPLICANT',
      phone: userData.phone || '+91 98765 00000',
      department: userData.department || userData.district || 'National Platform',
      district: userData.district || userData.department || 'National Platform',
      address: userData.address || userData.department || 'National Platform',
      status: 'ACTIVE',
      avatar: getSafeAvatar(userData.name, userData.role),
      createdAt: new Date().toISOString()
    };

    setUsers(prev => {
      const updated = deduplicateUsers([newUser, ...prev]);
      localStorage.setItem('gov_users', JSON.stringify(updated));
      return updated;
    });

    addAuditLog('USER_CREATED', `Chief Administrator onboarded ${newUser.name} with role ${newUser.role} (${newUser.department})`);
    showToast(`User ${newUser.name} (${newUser.role}) successfully onboarded!`, 'success');
    return true;
  };

  // Chief Admin Action: Remove User or Officer
  const removeUser = async (userId) => {
    const targetUser = users.find(u => u.id === userId || String(u.backendId) === String(userId));
    if (!targetUser) return;

    if (backendConnected) {
      try {
        const numId = targetUser.backendId || Number(String(userId).replace(/\D/g, ''));
        if (numId) {
          await ApiService.deleteUser(numId);
        }
      } catch (err) {
        console.warn('[AppContext] Backend deleteUser notice:', err.message);
      }
    }

    setUsers(prev => {
      const updated = prev.filter(u => u.id !== userId && String(u.backendId) !== String(userId) && (!targetUser?.email || u.email?.toLowerCase() !== targetUser.email.toLowerCase()));
      const deduped = deduplicateUsers(updated);
      localStorage.setItem('gov_users', JSON.stringify(deduped));
      return deduped;
    });

    addAuditLog('USER_REMOVED', `Chief Administrator removed user: ${targetUser.name} (${targetUser.role} - ${targetUser.email})`);
    showToast(`User ${targetUser.name} removed from system directory.`, 'info');
  };

  // 5. Citizen Action: File Grievance
  const fileGrievance = (formData) => {
    const newGrvId = `GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newGrievance = {
      id: newGrvId,
      ticketNo: `GRV/2026/09/${Math.floor(1000 + Math.random() * 9000)}`,
      citizenId: currentUser.id,
      citizenName: currentUser.name,
      citizenPhone: currentUser.phone || '+91 98765 43210',
      citizenEmail: currentUser.email,
      schemeId: formData.schemeId || 'GENERAL',
      schemeTitle: formData.schemeTitle || 'General Platform Service',
      category: formData.category || 'Application Status',
      subject: formData.subject || 'Platform Query',
      description: formData.description,
      priority: formData.priority || 'MEDIUM',
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedOfficer: 'District Grievance Officer',
      officerRemarks: 'Grievance ticket registered. Assigned to relevant desk for investigation.'
    };

    setGrievances(prev => [newGrievance, ...prev]);
    addAuditLog('GRIEVANCE_FILED', `Citizen ${currentUser.name} registered ticket ${newGrvId}`);
    notify({
      userId: currentUser?.id,
      userEmail: currentUser?.email,
      title: 'Grievance Registered',
      message: `Ticket ${newGrvId} is logged. Resolution expected in 2 working days.`,
      type: 'SUCCESS'
    });
    notify({
      userId: 'usr-4',
      userEmail: 'admin@gov.in',
      title: 'New Grievance Ticket',
      message: `Grievance ${newGrvId} filed under category ${newGrievance.category}.`,
      type: 'WARNING'
    });
    showToast(`Grievance ${newGrvId} filed successfully!`, 'success');
    return newGrvId;
  };

  // 6. Officer/Admin Action: Resolve Grievance
  const resolveGrievance = (grievanceId, status, officerRemarks) => {
    let resolvedGrievance = null;
    setGrievances(prev => prev.map(g => {
      if (g.id === grievanceId) {
        resolvedGrievance = { ...g, status, officerRemarks, updatedAt: new Date().toISOString() };
        return resolvedGrievance;
      }
      return g;
    }));

    addAuditLog('GRIEVANCE_RESOLVED', `Grievance ${grievanceId} updated to status ${status}`);
    notify({
      userId: resolvedGrievance?.citizenId,
      userEmail: resolvedGrievance?.citizenEmail,
      title: 'Grievance Update',
      message: `Your grievance ${grievanceId} status changed to ${status}.`,
      type: 'INFO'
    });
    showToast(`Grievance ${grievanceId} updated to ${status}.`, 'success');
  };

  // 7. Authority Action: Disburse Scheme Tranche
  const disburseTranche = async (schemeId, amount, beneficiaries) => {
    const trancheAmt = Number(amount);
    const utrBatch = `UTR202609${Math.floor(100000 + Math.random() * 900000)}`;

    if (backendConnected) {
      try {
        const numSchemeId = Number(String(schemeId).replace(/\D/g, '')) || 1;
        await ApiService.allocateFund(numSchemeId, trancheAmt);
      } catch (err) {
        console.warn('[AppContext] Backend fund allocation notice:', err.message);
      }
    }

    setSchemeBudgets(prev => prev.map(sb => {
      if (sb.schemeId === schemeId) {
        const newReleased = sb.releasedBudget + trancheAmt;
        const newAvail = Math.max(0, sb.totalBudget - newReleased - sb.committedBudget);
        const newRate = Number(((newReleased / sb.totalBudget) * 100).toFixed(1));
        return {
          ...sb,
          releasedBudget: newReleased,
          availableBalance: newAvail,
          beneficiariesCovered: sb.beneficiariesCovered + Number(beneficiaries),
          utilizationRate: newRate,
          tranches: [
            {
              trancheNo: `TR-${sb.tranches.length + 1}`,
              date: new Date().toISOString().split('T')[0],
              amount: trancheAmt,
              beneficiaries: Number(beneficiaries),
              utrBatch
            },
            ...sb.tranches
          ]
        };
      }
      return sb;
    }));

    addAuditLog('TRANCHE_DISBURSED', `Disbursed tranche ₹${trancheAmt.toLocaleString('en-IN')} for scheme ${schemeId}. Batch: ${utrBatch}`);
    notify({
      userId: 'usr-4',
      userEmail: 'admin@gov.in',
      title: 'DBT Tranche Disbursed',
      message: `Disbursed ₹${trancheAmt.toLocaleString('en-IN')} via PFMS. UTR: ${utrBatch}`,
      type: 'SUCCESS'
    });
    showToast(`Tranche of ₹${trancheAmt.toLocaleString('en-IN')} disbursed! UTR: ${utrBatch}`, 'success');
  };

  // Notification read toggle - Strictly account-isolated
  const markNotificationsRead = async () => {
    if (backendConnected && ApiService.getToken()) {
      try {
        await ApiService.markAllNotificationsRead();
      } catch (e) {
        console.warn('Backend markAllNotificationsRead notice:', e.message);
      }
    }
    const currentUserId = currentUser?.id || (currentUser?.backendId ? `usr-${currentUser.backendId}` : (currentUser?.email || 'user'));
    setNotifications(prev => prev.map(n => {
      if (isNotificationForUser(n, currentUser)) {
        if (n.isGlobal) {
          const readBy = Array.isArray(n.readBy) ? [...n.readBy] : [];
          if (!readBy.includes(currentUserId)) readBy.push(currentUserId);
          return { ...n, readBy, read: true };
        }
        return { ...n, read: true };
      }
      return n;
    }));
  };

  // Mark single notification as read - Strictly account-isolated
  const markNotificationRead = async (notifId) => {
    if (backendConnected && ApiService.getToken()) {
      try {
        const numId = typeof notifId === 'number' ? notifId : Number(String(notifId).replace(/\D/g, ''));
        if (numId) await ApiService.markNotificationRead(numId);
      } catch (e) {
        console.warn('Backend markNotificationRead notice:', e.message);
      }
    }
    const currentUserId = currentUser?.id || (currentUser?.backendId ? `usr-${currentUser.backendId}` : (currentUser?.email || 'user'));
    setNotifications(prev => prev.map(n => {
      if (n.id === notifId) {
        if (n.isGlobal) {
          const readBy = Array.isArray(n.readBy) ? [...n.readBy] : [];
          if (!readBy.includes(currentUserId)) readBy.push(currentUserId);
          return { ...n, readBy, read: true };
        }
        return { ...n, read: true };
      }
      return n;
    }));
  };

  // Update User Profile & KYC preferences
  const updateUserProfile = (updatedFields) => {
    setUsers(prevUsers => {
      const newUsers = prevUsers.map(u => {
        if (u.id === currentUser?.id || u.role === currentRole) {
          return { ...u, ...updatedFields };
        }
        return u;
      });
      localStorage.setItem('gov_users', JSON.stringify(newUsers));
      return newUsers;
    });

    setCurrentUser(prev => {
      const updated = { ...prev, ...updatedFields };
      return updated;
    });

    addAuditLog('PROFILE_UPDATED', `Profile and KYC details updated for ${updatedFields.name || currentUser?.name}`);
    showToast('Profile credentials and preferences updated successfully!', 'success');
  };

  // Helper to obtain user isolation key
  const getUserStorageKey = () => {
    if (!currentUser) return null;
    return String(currentUser.id || currentUser.email || '');
  };

  // Saved Schemes methods (Strict Citizen Account Isolation)
  const isSchemeSaved = (schemeId) => {
    if (!currentUser) return false;
    const key = getUserStorageKey();
    if (!key) return false;
    const userSaved = savedSchemesMap[key] || [];
    return userSaved.some(item => item.schemeId === schemeId);
  };

  const toggleSaveScheme = (schemeId) => {
    if (!currentUser) {
      showToast('Please log in to save schemes.', 'info');
      return false;
    }
    const key = getUserStorageKey();
    if (!key) return false;
    const userSaved = savedSchemesMap[key] || [];
    const exists = userSaved.some(item => item.schemeId === schemeId);
    let updated;
    if (exists) {
      updated = userSaved.filter(item => item.schemeId !== schemeId);
      showToast('Removed scheme from Saved Schemes.', 'info');
      addAuditLog('SCHEME_UNSAVED', `Removed scheme ${schemeId} from saved list`);
    } else {
      updated = [{ schemeId, savedAt: new Date().toISOString() }, ...userSaved];
      showToast('Scheme saved to your saved schemes!', 'success');
      addAuditLog('SCHEME_SAVED', `Saved scheme ${schemeId} to wishlist`);
    }
    setSavedSchemesMap(prev => ({ ...prev, [key]: updated }));
    return !exists;
  };

  const unsaveScheme = (schemeId) => {
    const key = getUserStorageKey();
    const userSaved = savedSchemesMap[key] || [];
    const updated = userSaved.filter(item => item.schemeId !== schemeId);
    setSavedSchemesMap(prev => ({ ...prev, [key]: updated }));
    showToast('Removed scheme from Saved Schemes.', 'info');
  };

  const getSavedSchemes = () => {
    const key = getUserStorageKey();
    const userSaved = savedSchemesMap[key] || [];
    return userSaved
      .map(entry => {
        const sch = schemes.find(s => s.id === entry.schemeId);
        return sch ? { ...sch, savedAt: entry.savedAt } : null;
      })
      .filter(Boolean);
  };

  // Scheme Comparison methods (up to 4 schemes)
  const toggleCompareScheme = (schemeId) => {
    setComparedSchemeIds(prev => {
      const exists = prev.some(id => String(id) === String(schemeId));
      if (exists) {
        showToast('Removed scheme from comparison list.', 'info');
        return prev.filter(id => String(id) !== String(schemeId));
      }
      if (prev.length >= 4) {
        showToast('You can compare a maximum of 4 schemes at once.', 'warning');
        return prev;
      }
      showToast('Scheme added to comparison list.', 'success');
      return [...prev, schemeId];
    });
  };

  const removeCompareScheme = (schemeId) => {
    setComparedSchemeIds(prev => prev.filter(id => String(id) !== String(schemeId)));
  };

  const clearComparedSchemes = () => {
    setComparedSchemeIds([]);
  };

  const isSchemeCompared = (schemeId) => {
    return comparedSchemeIds.some(id => String(id) === String(schemeId));
  };

  return (
    <AppContext.Provider value={{
      currentRole,
      currentUser,
      users,
      schemes,
      applications,
      notifications,
      auditLogs,
      grievances,
      schemeBudgets,
      toast,
      backendConnected,
      switchRole,
      loginUser,
      logoutUser,
      registerUser,
      resetPassword,
      submitApplication,
      verifyApplication,
      approveSanction,
      endorseDistrictApplication,
      createScheme,
      toggleSchemeStatus,
      deleteScheme,
      addUser,
      removeUser,
      deduplicateUsers,
      fileGrievance,
      resolveGrievance,
      disburseTranche,
      disburseApplication,
      addAuditLog,
      markNotificationsRead,
      markNotificationRead,
      isNotificationForUser,
      isNotificationReadForUser,
      updateUserProfile,
      showToast,
      // 5 New Features Context Additions
      savedSchemesMap,
      isSchemeSaved,
      toggleSaveScheme,
      unsaveScheme,
      getSavedSchemes,
      comparedSchemeIds,
      toggleCompareScheme,
      removeCompareScheme,
      clearComparedSchemes,
      isSchemeCompared
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
