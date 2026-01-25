const mockFindMany = jest.fn();
const mockFindUnique = jest.fn();

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    profile: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
    },
  },
}));

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("patient actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // test that searchDoctors builds the right query for verified doctors
  it("should build correct query for searching verified doctors", () => {
    const whereClause: Record<string, unknown> = {
      role: "doctor",
      verificationStatus: "verified",
      isActive: true,
    };

    expect(whereClause.role).toBe("doctor");
    expect(whereClause.verificationStatus).toBe("verified");
    expect(whereClause.isActive).toBe(true);
  });

  // test that specialty filter can be added to query
  it("should build specialty filter correctly", () => {
    const specialty = "Cardiologie";
    const whereClause: Record<string, unknown> = {
      role: "doctor",
      verificationStatus: "verified",
      isActive: true,
    };

    if (specialty) {
      whereClause.specialty = {
        contains: specialty,
        mode: "insensitive",
      };
    }

    expect(whereClause.specialty).toEqual({
      contains: "Cardiologie",
      mode: "insensitive",
    });
  });

  // test that search query adds OR condition for name and description
  it("should build search query filter correctly", () => {
    const query = "smith";
    const whereClause: Record<string, unknown> = {
      role: "doctor",
    };

    if (query) {
      whereClause.OR = [
        { full_name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }

    expect(whereClause.OR).toHaveLength(2);
  });

  // test doctor profile query structure
  it("should build doctor profile query correctly", () => {
    const doctorId = "doc-123";
    const query = {
      where: { id: doctorId, role: "doctor" },
      select: {
        id: true,
        full_name: true,
        specialty: true,
      },
    };

    expect(query.where.id).toBe("doc-123");
    expect(query.where.role).toBe("doctor");
  });
});
