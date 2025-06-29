import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LocationManager } from "../LocationManager";
import type { Location } from "../../services/location.types";

vi.mock("../../services/location", () => ({
  createLocation: vi.fn(),
  listLocations: vi.fn(),
  deleteLocation: vi.fn(),
}));

import {
  createLocation,
  listLocations,
  deleteLocation,
} from "../../services/location";

describe("LocationManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders list and adds location", async () => {
    vi.mocked(listLocations)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ id: "1", name: "A" }]);
    vi.mocked(createLocation).mockResolvedValueOnce({
      id: "1",
      name: "A",
    } as unknown as Location);

    render(<LocationManager />);

    fireEvent.change(screen.getByPlaceholderText("Location name"), {
      target: { value: "A" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add location/i }));

    await waitFor(() => {
      expect(createLocation).toHaveBeenCalled();
      expect(screen.getByText("A")).toBeInTheDocument();
    });
  });

  it("deletes location", async () => {
    vi.mocked(listLocations)
      .mockResolvedValueOnce([{ id: "1", name: "A" }])
      .mockResolvedValueOnce([]);
    vi.mocked(deleteLocation).mockResolvedValueOnce(
      undefined as unknown as void,
    );

    render(<LocationManager />);

    await waitFor(() => screen.getByText("A"));
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(deleteLocation).toHaveBeenCalled();
    });
  });
});
