import { createClient } from "@/lib/supabase/server";
import prisma from "./prisma";

// Get the currently logged-in user from Supabase and fetch their profile from the database
export const checkUser= async () => {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

if (error || !user) {
return null;
}
try{
    let LogedInUser = await prisma.profile.findUnique({
        where: {id: user.id},
    });
    
    // If profile doesn't exist, create it
    if(!LogedInUser){
        LogedInUser = await prisma.profile.create({
            data: {
                id: user.id,
                email: user.email,
                full_name: user.user_metadata?.full_name || null,
                role: "unassigned",
            },
        });
    }
    
    return LogedInUser;
}
catch (error) {
    console.error("Error fetching user from database:", error);
    return null;
}
};