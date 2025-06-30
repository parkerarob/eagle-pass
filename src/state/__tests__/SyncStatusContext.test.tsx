import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SyncStatusProvider, useSyncStatus } from "../SyncStatusContext";

describe("SyncStatusContext", () => {
  it("updates syncActive via setter", () => {
    const { result } = renderHook(() => useSyncStatus(), {
      wrapper: SyncStatusProvider,
    });
    act(() => {
      result.current.setSyncActive(true);
    });
    expect(result.current.syncActive).toBe(true);
  });
});
