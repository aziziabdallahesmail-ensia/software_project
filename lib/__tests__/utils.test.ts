import { cn } from "../utils";

describe("cn utility function", () => {
  // check if it merges multiple class names into one string
  it("should merge multiple class names", () => {
    const result = cn("px-4", "py-2");
    expect(result).toBe("px-4 py-2");
  });

  // check if tailwind classes get merged properly without duplicates
  it("should handle conflicting tailwind classes", () => {
    const result = cn("px-4", "px-6");
    expect(result).toBe("px-6");
  });

  // check if conditional classes work like we use them in components
  it("should handle conditional classes", () => {
    const isActive = true;
    const result = cn("base-class", isActive && "active-class");
    expect(result).toBe("base-class active-class");
  });

  // make sure it doesn't break when we pass undefined or null
  it("should handle undefined and null values", () => {
    const result = cn("base", undefined, null, "end");
    expect(result).toBe("base end");
  });

  // test empty input doesn't crash
  it("should return empty string for no arguments", () => {
    const result = cn();
    expect(result).toBe("");
  });
});
