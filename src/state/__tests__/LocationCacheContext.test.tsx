import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import {
  LocationCacheProvider,
  useLocationCache,
} from "../LocationCacheContext";

vi.mock("../../firebase", () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
  db: {},
}));
import { getDocs } from "../../firebase";

interface SnapDoc {
  data: () => { id: string; name: string };
}
function mockSnapshot() {
  return {
    forEach: (cb: (d: SnapDoc) => void) =>
      cb({ data: () => ({ id: "l1", name: "Loc" }) }),
  } as { forEach: (cb: (d: SnapDoc) => void) => void };
}

function TestComponent() {
  const { locations } = useLocationCache();
  return <div>{Object.keys(locations).join(",")}</div>;
}

describe("LocationCacheContext", () => {
  it("loads locations on mount", async () => {
    vi.mocked(getDocs).mockResolvedValueOnce(mockSnapshot());
    render(
      <LocationCacheProvider>
        <TestComponent />
      </LocationCacheProvider>,
    );
    await waitFor(() => {
      expect(screen.getByText("l1")).toBeInTheDocument();
    });
  });
});
