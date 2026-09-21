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

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: AdminUser;
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

/**
 * Authenticates against the server-side admin endpoint. The passphrase lives in
 * `ADMIN_PASSPHRASE` on the server and is never shipped to the client bundle.
 */
export async function loginAdmin(passkey: string, rememberMe: boolean = false): Promise<AuthResult> {
  const cleanPass = (passkey || '').trim();
  if (!cleanPass) {
    return { success: false, error: 'Please enter the admin passphrase.' };
  }

  let res: Response;
  try {
    res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passkey: cleanPass }),
    });
  } catch {
    return { success: false, error: 'Unable to reach the authentication service.' };
  }

  if (!res.ok) {
    let message = 'Authentication rejected. Unauthorized access.';
    try {
      const data = await res.json();
      if (data && data.error) message = data.error;
    } catch {
      // ignore JSON parse failures; use default message
    }
    return { success: false, error: message };
  }

  // Session valid for 4 hours (or 24 hours if rememberMe)
  const durationMs = rememberMe ? 24 * 60 * 60 * 1000 : 4 * 60 * 60 * 1000;
  const user: AdminUser = {
    username: 'admin',
    email: 'admin@anyfilex.local',
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

  return { success: true, user };
}

export function logoutAdmin(): void {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
}
