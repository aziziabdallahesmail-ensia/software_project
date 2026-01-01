"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";


/**
 * Sets the user's role and updates their profile in the database.
 */
export async function setUserRole(formData: FormData) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const USer = await prisma.profile.findUnique({
    where: { id: user.id },
  });

  if (!USer) throw new Error("User not found in database");

  const role = formData.get("role") as string;

  if (!role || !["patient", "doctor"].includes(role)) {
    throw new Error("Invalid role selection");
  }

  try {
    if (role === "patient") {
      await prisma.profile.update({
        where: {
          id: user.id,
        },
        data: {
          role: "patient",
        },
      });

      revalidatePath("/");
      return { success: true, redirect: "/doctors" };
    }

    if (role === "doctor") {
      const specialty = formData.get("specialty") as string;
      const experience = parseInt(formData.get("experience") as string, 10);
      const credentialUrl = formData.get("credentialUrl") as string;
      const description = formData.get("description") as string;

      // Validate inputs
      if (!specialty || !experience || !credentialUrl || !description) {
        throw new Error("All fields are required");
      }

      await prisma.profile.update({
        where: {
          id: user.id,
        },
        data: {
          role: "doctor",
          specialty,
          experience,
          credentialUrl,
          description,
          verificationStatus: "pending",
        },
      });

      revalidatePath("/");
      return { success: true, redirect: "/doctor/still-in-verification" };
    }
  } catch (error) {
    console.error("Failed to set user role:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to update user profile: ${errorMessage}`);
  }
}


export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  if (!userId) {
    return null;
  }

  try {
    const user = await prisma.profile.findUnique({
      where: {
        id: userId,
      },
    });

    return user;
  } catch (error) {
    console.error("Failed to get user information:", error);
    return null;
  }
}