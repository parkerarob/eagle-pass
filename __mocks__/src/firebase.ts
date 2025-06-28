import { vi } from 'vitest';

export const app = {};
export const auth = { signOut: vi.fn() };
export const db = {};
export const getAuth = vi.fn();
export const onAuthStateChanged = vi.fn((auth, callback) => {
  if (typeof callback === 'function') {
    callback({ uid: '123', email: 'test@example.com', displayName: 'Test User' });
  }
  return () => {};
});
export const GoogleAuthProvider = vi.fn().mockImplementation(() => ({}));
export type User = { uid: string; email: string; displayName: string };
export const signInWithPopup = vi.fn().mockResolvedValue({ user: { uid: '123', email: 'test@example.com', displayName: 'Test User' } });
export const getFirestore = vi.fn();
export const collection = vi.fn();
export const doc = vi.fn();
export const getDocs = vi.fn();
export const getDoc = vi.fn();
export const setDoc = vi.fn();
export const addDoc = vi.fn();
export const query = vi.fn();
export const where = vi.fn();
export const updateDoc = vi.fn(); 