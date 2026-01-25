import { SPECIALTIES } from "../specialities";

describe("specialties list", () => {
  // make sure we have some specialties defined
  it("should have at least one specialty", () => {
    expect(SPECIALTIES.length).toBeGreaterThan(0);
  });

  // check that each specialty has a name and icon
  it("should have name and icon for each specialty", () => {
    SPECIALTIES.forEach((specialty) => {
      expect(specialty.name).toBeDefined();
      expect(specialty.name.length).toBeGreaterThan(0);
      expect(specialty.icon).toBeDefined();
    });
  });

  // verify that "autre" exists as a fallback option
  it("should include autre as a fallback option", () => {
    const hasAutre = SPECIALTIES.some(
      (s) => s.name.toLowerCase() === "autre"
    );
    expect(hasAutre).toBe(true);
  });

  // check that cardiologie is in the list since it's common
  it("should include cardiologie", () => {
    const hasCardio = SPECIALTIES.some(
      (s) => s.name.toLowerCase() === "cardiologie"
    );
    expect(hasCardio).toBe(true);
  });
});
