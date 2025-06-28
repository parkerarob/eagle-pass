import { vi } from 'vitest';

export const initializeApp = vi.fn(() => ({}));
export const getApp = vi.fn(() => ({}));
export const _registerComponent = vi.fn();
export const registerVersion = vi.fn();
export const _isFirebaseServerApp = vi.fn();
export const _getProvider = vi.fn();
export const _removeServiceInstance = vi.fn();
export const SDK_VERSION = 'test-version';