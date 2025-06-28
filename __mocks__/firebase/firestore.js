import { vi } from 'vitest';

export const collection = vi.fn();
export const doc = vi.fn();
export const getDocs = vi.fn();
export const getDoc = vi.fn();
export const setDoc = vi.fn();
export const addDoc = vi.fn();
export const query = vi.fn();
export const where = vi.fn();
export const updateDoc = vi.fn();
export const getFirestore = vi.fn();

export default {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  query,
  where,
  updateDoc,
  getFirestore,
}; 