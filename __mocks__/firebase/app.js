import { vi } from 'vitest';
// __mocks__/firebase/app.js
export const initializeApp = vi.fn();
export default { initializeApp }; 