import { Prisma, type Profile } from "@prisma/client";
import type { User } from "@supabase/supabase-js";
import prisma from "./prisma";

/**
 * Fetch the profile row for a Supabase user, creating it on first sight.
 *
 * Read-then-create is not atomic: several requests for the same user can run
 * concurrently (parallel RSC renders, a re-fired effect), all miss the row, and
 * all try to insert it. One wins and the rest fail with P2002. Treat that
 * collision as success and read back the row the winner wrote.
 */
export async function ensureProfile(user: User): Promise<Profile | null> {
  const existing = await prisma.profile.findUnique({ where: { id: user.id } });
  if (existing) return existing;

  try {
    return await prisma.profile.create({
      data: {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || null,
        role: "unassigned",
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      // Lost the race — or `email` is already taken by another account.
      const raced = await prisma.profile.findUnique({ where: { id: user.id } });
      if (raced) return raced;
    }
    throw error;
  }
}
