import { vi } from 'vitest';

export const onAuthStateChanged = vi.fn();
export const GoogleAuthProvider = vi.fn();
export const signInWithPopup = vi.fn();

export default {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
}; 