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
    const LogedInUser = await prisma.profile.findUnique({
        where: {id: user.id},
    });
    if(LogedInUser){
        return LogedInUser;
    }
}
catch (error) {
    console.error("Error fetching user from database:", error);
    return null;
}
};