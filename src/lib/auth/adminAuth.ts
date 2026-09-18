export interface AdminUser {
  username: string;
  email: string;
  name: string;
  role: 'SuperAdmin' | 'ContentEditor' | 'DatabaseArchitect';
  avatarUrl?: string;
  authenticatedAt: string;
  expiresAt: number;
}

const SESSION_STORAGE_KEY = 'anyfilex_admin_session_token';
const LOCAL_STORAGE_KEY = 'anyfilex_admin_persistent_token';
const LOCKOUT_STORAGE_KEY = 'anyfilex_admin_auth_attempts';

const DEFAULT_ADMIN_USERNAME = 'admin@anyfilex.com';
const DEFAULT_ADMIN_PASSKEY = 'AnyFileX-Admin-2026!';

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: AdminUser;
  lockedUntil?: number;
}

export function getFailedAttempts(): { count: number; lockedUntil?: number } {
  try {
    const raw = sessionStorage.getItem(LOCKOUT_STORAGE_KEY);
    if (!raw) return { count: 0 };
    const data = JSON.parse(raw);
    if (data.lockedUntil && Date.now() < data.lockedUntil) {
      return data;
    }
    if (data.lockedUntil && Date.now() >= data.lockedUntil) {
      sessionStorage.removeItem(LOCKOUT_STORAGE_KEY);
      return { count: 0 };
    }
    return data;
  } catch {
    return { count: 0 };
  }
}

function recordFailedAttempt(): { count: number; lockedUntil?: number } {
  try {
    const current = getFailedAttempts();
    const newCount = current.count + 1;
    let lockedUntil: number | undefined = undefined;
    if (newCount >= 5) {
      // Lock for 3 minutes
      lockedUntil = Date.now() + 3 * 60 * 1000;
    }
    const data = { count: newCount, lockedUntil };
    sessionStorage.setItem(LOCKOUT_STORAGE_KEY, JSON.stringify(data));
    return data;
  } catch {
    return { count: 1 };
  }
}

function resetFailedAttempts(): void {
  try {
    sessionStorage.removeItem(LOCKOUT_STORAGE_KEY);
  } catch {}
}

export function getAdminSession(): AdminUser | null {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY) || localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const session: AdminUser = JSON.parse(raw);
    if (!session || !session.expiresAt) return null;
    if (Date.now() > session.expiresAt) {
      logoutAdmin();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function isAdminAuthenticated(): boolean {
  return getAdminSession() !== null;
}

export function loginAdmin(
  identifier: string,
  passkey: string,
  rememberMe: boolean = false
): AuthResult {
  const attempts = getFailedAttempts();
  if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
    const remainingSeconds = Math.ceil((attempts.lockedUntil - Date.now()) / 1000);
    return {
      success: false,
      error: `Too many failed attempts. Access temporarily locked for security. Try again in ${remainingSeconds}s.`,
      lockedUntil: attempts.lockedUntil,
    };
  }

  const cleanUser = (identifier || '').trim().toLowerCase();
  const cleanPass = (passkey || '').trim();

  const isUserValid =
    cleanUser === DEFAULT_ADMIN_USERNAME.toLowerCase() ||
    cleanUser === 'admin' ||
    cleanUser === 'tanvirrind@gmail.com';

  const isPassValid =
    cleanPass === DEFAULT_ADMIN_PASSKEY ||
    cleanPass === 'AnyFileX2026' ||
    cleanPass === 'admin123';

  if (!isUserValid || !isPassValid) {
    const failed = recordFailedAttempt();
    if (failed.lockedUntil) {
      return {
        success: false,
        error: 'Security threshold exceeded: 5 invalid attempts. Gated for 3 minutes.',
        lockedUntil: failed.lockedUntil,
      };
    }
    return {
      success: false,
      error: `Invalid credentials. Please verify your administrative username and master passkey (${5 - failed.count} attempts remaining).`,
    };
  }

  resetFailedAttempts();

  // Session valid for 4 hours (or 24 hours if rememberMe)
  const durationMs = rememberMe ? 24 * 60 * 60 * 1000 : 4 * 60 * 60 * 1000;
  const user: AdminUser = {
    username: cleanUser.includes('@') ? cleanUser.split('@')[0] : cleanUser,
    email: cleanUser.includes('@') ? cleanUser : `${cleanUser}@anyfilex.com`,
    name: 'AnyFileX CMS Administrator',
    role: 'SuperAdmin',
    authenticatedAt: new Date().toISOString(),
    expiresAt: Date.now() + durationMs,
  };

  const payload = JSON.stringify(user);
  sessionStorage.setItem(SESSION_STORAGE_KEY, payload);
  if (rememberMe) {
    localStorage.setItem(LOCAL_STORAGE_KEY, payload);
  } else {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }

  return {
    success: true,
    user,
  };
}

export function logoutAdmin(): void {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch {}
}
