/**
 * Admin Authentication Service
 * Manages admin credentials, session tokens, and security settings.
 */

export interface AdminUser {
  username: string;
  role: 'superadmin' | 'editor';
  lastLogin: string | null;
}

export interface AdminSession {
  token: string;
  username: string;
  loginTime: string;
  expiresAt: string;
  rememberMe: boolean;
}

const ADMIN_CREDS_STORAGE_KEY = 'cars_and_coffee_admin_credentials_v1';
const ADMIN_SESSION_STORAGE_KEY = 'cars_and_coffee_admin_session_v1';

// Default credentials provided to user for first login
export const DEFAULT_ADMIN_USERNAME = 'admin';
export const DEFAULT_ADMIN_PASSWORD = 'paddock2026!';

interface StoredCredentials {
  username: string;
  password: string; // Stored in applet storage
  lastUpdated: string;
}

/**
 * Retrieves the configured credentials or initializes with defaults
 */
export function getStoredCredentials(): StoredCredentials {
  try {
    const saved = localStorage.getItem(ADMIN_CREDS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.username && parsed.password) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read admin credentials from storage', e);
  }

  const initial: StoredCredentials = {
    username: DEFAULT_ADMIN_USERNAME,
    password: DEFAULT_ADMIN_PASSWORD,
    lastUpdated: new Date().toISOString(),
  };

  try {
    localStorage.setItem(ADMIN_CREDS_STORAGE_KEY, JSON.stringify(initial));
  } catch (e) {
    // ignore
  }

  return initial;
}

/**
 * Validates login attempt and creates session if successful
 */
export function loginAdmin(
  usernameInput: string,
  passwordInput: string,
  rememberMe: boolean = true
): { success: boolean; error?: string; session?: AdminSession } {
  const creds = getStoredCredentials();

  const cleanUser = usernameInput.trim();
  const cleanPass = passwordInput.trim();

  if (!cleanUser || !cleanPass) {
    return { success: false, error: 'Username and password are required.' };
  }

  if (cleanUser.toLowerCase() !== creds.username.toLowerCase()) {
    return { success: false, error: 'Invalid username. Please verify credentials.' };
  }

  if (cleanPass !== creds.password) {
    return { success: false, error: 'Incorrect password. Please try again.' };
  }

  const now = new Date();
  // 7 days if rememberMe, otherwise 12 hours
  const expiryHours = rememberMe ? 24 * 7 : 12;
  const expiresAt = new Date(now.getTime() + expiryHours * 60 * 60 * 1000).toISOString();

  const session: AdminSession = {
    token: `paddock_adm_${Math.random().toString(36).substring(2)}_${Date.now()}`,
    username: creds.username,
    loginTime: now.toISOString(),
    expiresAt,
    rememberMe,
  };

  try {
    if (rememberMe) {
      localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(session));
    } else {
      sessionStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(session));
    }
  } catch (e) {
    console.error('Failed to store admin session', e);
  }

  return { success: true, session };
}

/**
 * Checks if current user is an authenticated admin with a valid session
 */
export function getActiveAdminSession(): AdminSession | null {
  try {
    let sessionRaw = localStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
    if (!sessionRaw) {
      sessionRaw = sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
    }

    if (!sessionRaw) return null;

    const session: AdminSession = JSON.parse(sessionRaw);
    if (!session.token || !session.expiresAt) return null;

    // Check expiration
    if (new Date(session.expiresAt).getTime() < Date.now()) {
      logoutAdmin();
      return null;
    }

    return session;
  } catch (e) {
    return null;
  }
}

/**
 * Logs out admin by clearing stored session tokens
 */
export function logoutAdmin(): void {
  try {
    localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
    sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
  } catch (e) {
    // ignore
  }
}

/**
 * Updates admin username and/or password
 */
export function updateAdminCredentials(
  newUsername: string,
  newPassword: string
): { success: boolean; error?: string } {
  const cleanUser = newUsername.trim();
  const cleanPass = newPassword.trim();

  if (cleanUser.length < 3) {
    return { success: false, error: 'Username must be at least 3 characters.' };
  }
  if (cleanPass.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  const updated: StoredCredentials = {
    username: cleanUser,
    password: cleanPass,
    lastUpdated: new Date().toISOString(),
  };

  try {
    localStorage.setItem(ADMIN_CREDS_STORAGE_KEY, JSON.stringify(updated));
    // Also update existing active session username
    const activeSession = getActiveAdminSession();
    if (activeSession) {
      activeSession.username = cleanUser;
      localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(activeSession));
    }
    return { success: true };
  } catch (e) {
    return { success: false, error: 'Failed to update credentials in storage.' };
  }
}

/**
 * Resets admin credentials to initial default values
 */
export function resetCredentialsToDefault(): void {
  const initial: StoredCredentials = {
    username: DEFAULT_ADMIN_USERNAME,
    password: DEFAULT_ADMIN_PASSWORD,
    lastUpdated: new Date().toISOString(),
  };
  localStorage.setItem(ADMIN_CREDS_STORAGE_KEY, JSON.stringify(initial));
}
