import { describe, it, expect, beforeEach, vi } from "vitest";
import * as passService from "./pass";
// Add Firestore types for proper mocking
import type { QuerySnapshot, DocumentReference } from "firebase/firestore";

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
interface MockDoc {
  data: () => Record<string, unknown>;
}
function createMockQuerySnapshot({
  empty,
  docs = [],
}: {
  empty: boolean;
  docs?: MockDoc[];
}): QuerySnapshot<unknown> {
  return {
    empty,
    docs,
    size: docs.length,
    forEach: (cb: (doc: MockDoc) => void) => docs.forEach(cb),
    // Only the properties used by the service are mocked
  } as unknown as QuerySnapshot<unknown>;
}

function createMockDocumentReference(id = "pass1"): DocumentReference<unknown> {
  return {
    id,
  } as unknown as DocumentReference<unknown>;
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
      vi.mocked(setDoc).mockResolvedValueOnce(undefined);

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
      ).rejects.toThrow("Student student1 already has an active pass");
    });
  });

  describe("out", () => {
    it("should throw if trying to out to the current location", async () => {
      // Arrange
      vi.mocked(getDocs).mockResolvedValueOnce(
        createMockQuerySnapshot({
          empty: false,
          docs: [
            {
              data: () => ({
                id: "pass1",
                studentId: "student1",
                status: "open",
                openedAt: Date.now(),
                originLocationId: "library",
                issuedBy: "staff1",
                type: "other",
                currentLocationId: "library",
              }),
            },
          ],
        }),
      );
      // Act & Assert
      await expect(passService.out("pass1", "library")).rejects.toThrow(
        "Cannot out to the current location",
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
});
