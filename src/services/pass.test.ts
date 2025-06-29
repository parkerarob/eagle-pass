import { describe, it, expect, beforeEach, vi } from "vitest";
import * as passService from "./pass";

// Mock Firebase functions
vi.mock("../firebase", () => ({
  getDocs: vi.fn(),
  addDoc: vi.fn(),
  setDoc: vi.fn(),
  collection: vi.fn(),
  doc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  db: {},
}));

import { getDocs, addDoc, setDoc } from "../firebase";

// Helper to reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

// Simplified mock helpers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createMockQuerySnapshot({
  empty,
  docs = [],
}: {
  empty: boolean;
  docs?: any[];
}) {
  return {
    empty,
    docs,
    size: docs.length,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    forEach: (cb: (doc: any) => void) => docs.forEach(cb),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

function createMockDocumentSnapshot(data: Record<string, unknown>) {
  return {
    id: data.id as string,
    data: () => data,
    exists: () => true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

function createMockDocumentReference(id = "pass1") {
  return {
    id,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

describe("Pass Service", () => {
  describe("createPass", () => {
    it("should create a new pass if none is open", async () => {
      // Arrange: mock Firestore to return no open passes
      vi.mocked(getDocs).mockResolvedValueOnce(
        createMockQuerySnapshot({ empty: true }),
      );
      vi.mocked(addDoc).mockResolvedValueOnce(
        createMockDocumentReference("pass1"),
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(setDoc).mockResolvedValueOnce(undefined as any);

      // Act
      const pass = await passService.createPass(
        "student1",
        "101",
        "staff1",
        "library",
        "other",
      );

      // Assert
      expect(pass.studentId).toBe("student1");
      expect(pass.originLocationId).toBe("101");
      expect(pass.status).toBe("open");
    });

    it("should throw if student already has an open pass", async () => {
      vi.mocked(getDocs).mockResolvedValueOnce(
        createMockQuerySnapshot({ empty: false }),
      );

      await expect(
        passService.createPass("student1", "101", "staff1", "library", "other"),
      ).rejects.toThrow("Student already has an active pass");
    });
  });

  describe("out", () => {
    it("should throw if trying to out to the current location", async () => {
      // Arrange: mock pass with currentLocationId = 'library'
      const passData = {
        id: "pass1",
        studentId: "student1",
        status: "open",
        openedAt: Date.now(),
        originLocationId: "101",
        issuedBy: "staff1",
        type: "other",
        currentLocationId: "library",
      };

      const mockDocs = [createMockDocumentSnapshot(passData)];
      vi.mocked(getDocs).mockResolvedValueOnce(
        createMockQuerySnapshot({ empty: false, docs: mockDocs }),
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(setDoc).mockResolvedValueOnce(undefined as any);

      // Act & Assert
      await expect(passService.out("pass1", "library")).rejects.toThrow(
        "Cannot out to the current location or invalid destination",
      );
    });
  });

  // Scaffold for inAction, closePass, and helpers
  describe("inAction", () => {
    it("should ...", () => {
      // TODO: Add tests for inAction
    });
  });

  describe("closePass", () => {
    it("should ...", () => {
      // TODO: Add tests for closePass
    });
  });

  describe("validation helpers", () => {
    it("should ...", () => {
      // TODO: Add tests for helpers
    });
  });

  describe("archivePass", () => {
    it("should set archived fields when pass is closed", async () => {
      const passData = {
        id: "pass1",
        studentId: "student1",
        status: "closed",
        openedAt: Date.now(),
        closedAt: Date.now(),
        originLocationId: "101",
        issuedBy: "staff1",
      };
      const mockDocs = [createMockDocumentSnapshot(passData)];
      vi.mocked(getDocs).mockResolvedValueOnce(
        createMockQuerySnapshot({ empty: false, docs: mockDocs }),
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.mocked(setDoc).mockResolvedValueOnce(undefined as any);

      await passService.archivePass("pass1");
      const call = vi.mocked(setDoc).mock.calls[0];
      expect(call[1]).toMatchObject({ archived: true });
    });
  });
});
