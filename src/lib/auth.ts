// Auth helper functions for YourPost Webmail

interface TokenPayload {
  email: string;
  role: string;
  [key: string]: unknown;
}

// Get token from cookies
export function getToken(): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/yourpost-token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

// Get email from cookies
export function getEmail(): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/yourpost-email=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

// Get user role from token (simplified - in production, decode JWT)
export function getUserRole(): string {
  const token = getToken();
  if (!token) return 'user';
  
  try {
    const payload = JSON.parse(token);
    return payload.role || 'user';
  } catch {
    return 'user';
  }
}

// Check if user is admin
export function isAdmin(): boolean {
  return getUserRole() === 'admin';
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getToken() !== '';
}
