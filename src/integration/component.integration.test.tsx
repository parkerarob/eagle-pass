import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AuthProvider } from "../state/AuthContext";
import { PassProvider, usePasses } from "../state/PassContext";
import { SyncStatusProvider } from "../state/SyncStatusContext";
import { onSnapshot } from "../firebase";

/* eslint-disable @typescript-eslint/no-explicit-any */
vi.mock("../firebase", () => ({
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  onSnapshot: vi.fn(),
  db: {},
}));

describe("component integration", () => {
  it("updates pass state from realtime listener", () => {
    const pass = {
      id: "p1",
      studentId: "test-user",
      status: "open",
      openedAt: 1,
      originLocationId: "101",
      issuedBy: "staff1",
    };
    vi.mocked(onSnapshot).mockImplementation((_q, cb) => {
      cb({ docs: [{ data: () => pass }] } as any);
      return vi.fn();
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>
        <SyncStatusProvider>
          <PassProvider>{children}</PassProvider>
        </SyncStatusProvider>
      </AuthProvider>
    );

    const { result } = renderHook(() => usePasses(), { wrapper });
    expect(result.current.loading).toBe(false);
    expect(result.current.passes[0].id).toBe("p1");
  });
});
