import { vi } from 'vitest';

export const onAuthStateChanged = vi.fn();
export const GoogleAuthProvider = vi.fn().mockImplementation(() => ({}));
export const signInWithPopup = vi.fn();
export const getAuth = vi.fn();
export const auth = { signOut: vi.fn() };

export default {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
  auth,
}; 