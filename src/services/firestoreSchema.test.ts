import { describe, it, expect } from "vitest";
import { passSchema, validate, locationSchema } from "./firestoreSchema";

describe("firestoreSchema", () => {
  it("validates a pass document", () => {
    const pass = {
      id: "1",
      studentId: "s1",
      status: "open",
      openedAt: 1,
      originLocationId: "loc1",
      issuedBy: "staff1",
    };
    expect(validate(passSchema, pass)).toEqual(pass);
  });

  it("rejects invalid location document", () => {
    const bad = { id: "1", name: 2 } as unknown;
    expect(() => validate(locationSchema, bad)).toThrow();
  });
});
