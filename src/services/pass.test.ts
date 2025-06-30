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
  getDoc: vi.fn(),
  auth: { currentUser: { uid: "u1" } },
  db: {},
}));

import { getDocs, addDoc, setDoc, getDoc } from "../firebase";

// Helper to reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getDoc).mockResolvedValue({
    exists: () => true,
    data: () => ({ role: "staff" }),
  } as unknown as { exists: () => boolean; data: () => { role: string } });
});

// Simplified mock helpers

function createMockQuerySnapshot({
  empty,
  docs = [],
}: {
  empty: boolean;
  docs?: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
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
      vi.mocked(setDoc).mockResolvedValueOnce(undefined as unknown as void);

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
      vi.mocked(setDoc).mockResolvedValueOnce(undefined as unknown as void);

      // Act & Assert
      await expect(passService.out("pass1", "library")).rejects.toThrow(
        "Cannot out to the current location or invalid destination",
      );
    });
  });

  // Scaffold for inAction, closePass, and helpers
  describe("inAction", () => {
    it("closes pass when returning to origin", async () => {
      const passData = {
        id: "p1",
        studentId: "s1",
        status: "open",
        openedAt: Date.now(),
        originLocationId: "101",
        issuedBy: "staff1",
        currentLocationId: "library",
      };
      const mockDocs = [createMockDocumentSnapshot(passData)];
      vi.mocked(getDocs).mockResolvedValueOnce(
        createMockQuerySnapshot({ empty: false, docs: mockDocs }),
      );
      vi.mocked(getDocs).mockResolvedValueOnce(
        createMockQuerySnapshot({ empty: true, docs: [] }),
      );
      vi.mocked(setDoc).mockResolvedValueOnce(undefined as unknown as void);
      const result = await passService.inAction("p1", "101");
      expect(result.status).toBe("closed");
      expect(setDoc).toHaveBeenCalled();
    });

    it("rejects invalid location", async () => {
      const passData = {
        id: "p1",
        studentId: "s1",
        status: "open",
        openedAt: Date.now(),
        originLocationId: "101",
        issuedBy: "staff1",
        currentLocationId: "library",
      };
      const mockDocs = [createMockDocumentSnapshot(passData)];
      vi.mocked(getDocs).mockResolvedValueOnce(
        createMockQuerySnapshot({ empty: false, docs: mockDocs }),
      );
      await expect(passService.inAction("p1", "gym")).rejects.toThrow();
    });
  });

  describe("closePass", () => {
    it("closes pass at origin", async () => {
      const passData = {
        id: "p1",
        studentId: "s1",
        status: "open",
        openedAt: Date.now(),
        originLocationId: "101",
        currentLocationId: "101",
        issuedBy: "staff1",
      };
      const mockDocs = [createMockDocumentSnapshot(passData)];
      vi.mocked(getDocs).mockResolvedValueOnce(
        createMockQuerySnapshot({ empty: false, docs: mockDocs }),
      );
      vi.mocked(setDoc).mockResolvedValueOnce(undefined as unknown as void);
      await passService.closePass("p1");
      expect(setDoc).toHaveBeenCalled();
    });

    it("throws when not at origin", async () => {
      const passData = {
        id: "p1",
        studentId: "s1",
        status: "open",
        openedAt: Date.now(),
        originLocationId: "101",
        currentLocationId: "lib",
        issuedBy: "staff1",
      };
      const mockDocs = [createMockDocumentSnapshot(passData)];
      vi.mocked(getDocs).mockResolvedValueOnce(
        createMockQuerySnapshot({ empty: false, docs: mockDocs }),
      );
      await expect(passService.closePass("p1")).rejects.toThrow();
    });
  });

  describe("validation helpers", () => {
    it("checks staff or admin roles", async () => {
      vi.mocked(getDoc).mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ role: "admin" }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
      const result = await passService.isStaffOrAdmin();
      expect(result).toBe(true);
    });

    it("validates out action", async () => {
      const pass = {
        id: "p1",
        studentId: "s1",
        status: "open",
        openedAt: 1,
        originLocationId: "101",
        currentLocationId: "101",
        issuedBy: "staff1",
      };
      const mockDocs = [createMockDocumentSnapshot(pass)];
      vi.mocked(getDocs).mockResolvedValueOnce(
        createMockQuerySnapshot({ empty: false, docs: mockDocs }),
      );
      const valid = await passService.validateAction("p1", "out", "101");
      expect(valid).toBe(false);
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
      vi.mocked(setDoc).mockResolvedValueOnce(undefined as unknown as void);

      await passService.archivePass("pass1");
      const call = vi.mocked(setDoc).mock.calls[0];
      expect(call[1]).toMatchObject({ archived: true });
    });
  });

  describe("forceClosePass", () => {
    it("sets forceClosed flag", async () => {
      const passData = {
        id: "pass1",
        studentId: "s1",
        status: "open",
        openedAt: Date.now(),
        originLocationId: "101",
        issuedBy: "staff1",
      };
      const mockDocs = [createMockDocumentSnapshot(passData)];
      vi.mocked(getDocs).mockResolvedValueOnce(
        createMockQuerySnapshot({ empty: false, docs: mockDocs }),
      );
      vi.mocked(setDoc).mockResolvedValueOnce(undefined as unknown as void);

      await passService.forceClosePass("pass1");
      const call = vi.mocked(setDoc).mock.calls[0];
      expect(call[1]).toMatchObject({ forceClosed: true });
    });
  });

  describe("autoClosePassesForStudent", () => {
    it("closes all open passes for student", async () => {
      const passData = {
        id: "pass1",
        studentId: "s1",
        status: "open",
        openedAt: Date.now(),
        originLocationId: "101",
        issuedBy: "staff1",
      };
      const mockDocs = [createMockDocumentSnapshot(passData)];
      vi.mocked(getDocs).mockResolvedValueOnce(
        createMockQuerySnapshot({ empty: false, docs: mockDocs }),
      );
      vi.mocked(setDoc).mockResolvedValueOnce(undefined as unknown as void);

      await passService.autoClosePassesForStudent("s1");
      const call = vi.mocked(setDoc).mock.calls[0];
      expect(call[1]).toMatchObject({ autoClosed: true });
    });
  });
});
