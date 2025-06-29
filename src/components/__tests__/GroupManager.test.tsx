import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { GroupManager } from "../GroupManager";
import type { Group } from "../../services/group.types";

vi.mock("../../services/group", () => ({
  createGroup: vi.fn(),
  listGroups: vi.fn(),
  deleteGroup: vi.fn(),
}));

import { createGroup, listGroups, deleteGroup } from "../../services/group";

describe("GroupManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders list and adds group", async () => {
    vi.mocked(listGroups)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        { id: "1", name: "A", type: "positive", studentIds: [] } as Group,
      ]);
    vi.mocked(createGroup).mockResolvedValueOnce({
      id: "1",
      name: "A",
      type: "positive",
      studentIds: [],
    } as Group);

    render(<GroupManager />);

    fireEvent.change(screen.getByPlaceholderText("Group name"), {
      target: { value: "A" },
    });
    fireEvent.change(screen.getByDisplayValue("Positive"), {
      target: { value: "positive" },
    });
    fireEvent.change(screen.getByPlaceholderText("Student IDs"), {
      target: { value: "s1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add group/i }));

    await waitFor(() => {
      expect(createGroup).toHaveBeenCalled();
      expect(screen.getByText(/A/)).toBeInTheDocument();
    });
  });

  it("deletes group", async () => {
    vi.mocked(listGroups)
      .mockResolvedValueOnce([
        { id: "1", name: "A", type: "positive", studentIds: [] } as Group,
      ])
      .mockResolvedValueOnce([]);
    vi.mocked(deleteGroup).mockResolvedValueOnce(undefined as unknown as void);

    render(<GroupManager />);

    await waitFor(() => screen.getByText(/A/));
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(deleteGroup).toHaveBeenCalled();
    });
  });
});
