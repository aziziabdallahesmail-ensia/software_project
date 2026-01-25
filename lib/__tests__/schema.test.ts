import { docformschema } from "../schema";

describe("doctor form schema validation", () => {
  // check that a valid doctor form passes validation
  it("should validate a correct doctor form", () => {
    const validData = {
      specialty: "Cardiologie",
      experience: 5,
      credentialUrl: "https://example.com/credentials",
      description: "this is a valid description for a doctor profile",
    };

    const result = docformschema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  // make sure we reject doctors with less than 3 years experience
  it("should reject experience less than 3 years", () => {
    const invalidData = {
      specialty: "Cardiologie",
      experience: 2,
      credentialUrl: "https://example.com/credentials",
      description: "this is a valid description for a doctor profile",
    };

    const result = docformschema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  // check that empty specialty gets rejected
  it("should reject empty specialty", () => {
    const invalidData = {
      specialty: "",
      experience: 5,
      credentialUrl: "https://example.com/credentials",
      description: "this is a valid description",
    };

    const result = docformschema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  // test that invalid url format is rejected
  it("should reject invalid credential url", () => {
    const invalidData = {
      specialty: "Cardiologie",
      experience: 5,
      credentialUrl: "not-a-valid-url",
      description: "this is a valid description",
    };

    const result = docformschema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  // description too short should fail
  it("should reject description shorter than 10 characters", () => {
    const invalidData = {
      specialty: "Cardiologie",
      experience: 5,
      credentialUrl: "https://example.com/credentials",
      description: "short",
    };

    const result = docformschema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
